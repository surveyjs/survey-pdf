export interface IImageInfo {
    imageData: string | Uint8Array<ArrayBuffer>;
    width: number;
    imageId?: string;
    height: number;
}
export interface IImageUtils {
    getImageInfo(url: string): Promise<IImageInfo>;
    applyImageFit(imageInfo: IImageInfo, imageFit: 'cover' | 'fill' | 'contain', targetWidth: number, targetHeight: number): Promise<IImageInfo>;
    clear(): void;
}

export class BaseImageUtils implements IImageUtils {
    private hash: {[index: string]: IImageInfo} = {}
    private imageId: number = 1;
    protected getImageId(): string {
        return `image_${this.imageId++}`;
    }
    protected async _getImageInfo(url: string): Promise<IImageInfo> {
        return { imageData: url, width: 0, height: 0, imageId: this.getImageId() };
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
            return { imageData: imageInfo.imageData, imageId: imageInfo.imageId, width: targetWidth, height: targetHeight };
        }
        if((imageFit == 'contain' || imageFit == 'cover') && !!imageInfo.width && !!imageInfo.height && !!targetWidth && !!targetWidth) {
            const scale = Math.min(targetWidth / imageInfo.width, targetHeight / imageInfo.height);
            return { imageData: imageInfo.imageData, imageId: imageInfo.imageId, width: imageInfo.width * scale, height: imageInfo.height * scale };
        } else {
            return imageInfo;
        }
    }
    protected get emptyImage(): IImageInfo {
        return { imageData: '', width: 0, height: 0, imageId: 'image_0' };
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