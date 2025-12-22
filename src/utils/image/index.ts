export interface IImageInfo {
    data: string | Uint8Array<ArrayBuffer>;
    width: number;
    id?: string;
    height: number;
}
export interface IImageUtils {
    getImageInfo(url: string): Promise<IImageInfo>;
    applyImageFit(imageInfo: IImageInfo, imageFit: 'cover' | 'fill' | 'contain', targetWidth: number, targetHeight: number): Promise<IImageInfo>;
    clear(): void;
}

export class BaseImageUtils implements IImageUtils {
    private hash: {[index: string]: IImageInfo} = {};
    private imageId: number = 1;
    protected getImageId(): string {
        return `image_${this.imageId++}`;
    }
    protected async _getImageInfo(url: string): Promise<IImageInfo> {
        return { data: url, width: 0, height: 0, id: this.getImageId() };
    }
    async getImageInfo(url: string): Promise<IImageInfo> {
        if(!this.hash[url]) {
            try {
                this.hash[url] = await this._getImageInfo(url);
            } catch {
                this.hash[url] = this.emptyImage;
            }
        }
        return this.hash[url];
    }
    async applyImageFit(imageInfo: IImageInfo, imageFit: 'cover' | 'fill' | 'contain', targetWidth: number, targetHeight: number): Promise<IImageInfo> {
        if(imageFit == 'fill') {
            return { data: imageInfo.data, id: imageInfo.id, width: targetWidth, height: targetHeight };
        }
        if((imageFit == 'contain' || imageFit == 'cover') && !!imageInfo.width && !!imageInfo.height && !!targetWidth && !!targetWidth) {
            const scale = Math.min(targetWidth / imageInfo.width, targetHeight / imageInfo.height);
            return { data: imageInfo.data, id: imageInfo.id, width: imageInfo.width * scale, height: imageInfo.height * scale };
        } else {
            return imageInfo;
        }
    }
    protected get emptyImage(): IImageInfo {
        return { data: '', width: 0, height: 0, id: 'image_0' };
    }
    clear() {
        this.hash = {};
        this.imageId = 1;
    }
}

let imageUtils: IImageUtils = new BaseImageUtils();
export function getImageUtils(): IImageUtils {
    return imageUtils;
}
export function registerImageUtils(val: IImageUtils) {
    imageUtils = val;
}