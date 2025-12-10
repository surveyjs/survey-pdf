import { BaseImageUtils, IImageInfo, IImageUtils } from '.';
export class ImageUtils extends BaseImageUtils implements IImageUtils {
    protected async _getImageInfo(url: string): Promise<IImageInfo> {
        const pxToPt: number = 72.0 / 96.0;
        const image = new Image();
        image.crossOrigin='anonymous';
        const response = await new Promise<IImageInfo>((resolve, reject) => {
            image.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.height = image.naturalHeight;
                canvas.width = image.naturalWidth;
                ctx?.drawImage(image, 0, 0);
                const dataUrl = canvas.toDataURL();
                resolve({ imageData: dataUrl, width: image.naturalWidth * pxToPt, height: image.naturalHeight * pxToPt, imageId: this.getImageId() });
            };
            image.onerror = () => {
                reject();
            };
            image.src = url;
        });
        return response;
    }
    private getCoverCanvasOptions(imageWidth: number, imageHeight: number, targetWidth: number, targetHeight: number) {
        const aspectRatio = imageWidth / imageHeight;
        const targetAspectRatio = targetWidth / targetHeight;
        let drawWidth, drawHeight;
        if (targetAspectRatio > aspectRatio) {
            drawWidth = targetWidth;
            drawHeight = targetWidth / aspectRatio;
        } else {
            drawHeight = targetHeight;
            drawWidth = targetHeight * aspectRatio;
        }
        return { canvasWidth: targetWidth, canvasHeight: targetHeight, imageX: (targetWidth - drawWidth) / 2, imageY: (targetHeight - drawHeight) / 2, imageWidth: drawWidth, imageHeight: drawHeight };
    }
    public async applyImageFit(imageInfo: IImageInfo, imageFit: 'cover' | 'fill' | 'contain', targetWidth: number, targetHeight: number): Promise<IImageInfo> {
        if(imageFit == 'cover') {
            try {
                const image = new Image();
                if(!imageInfo.width || !imageInfo.height || !imageInfo.imageData || !targetWidth || !targetHeight) return imageInfo;
                image.src = imageInfo.imageData instanceof Uint8Array ? URL.createObjectURL(new Blob([imageInfo.imageData])): imageInfo.imageData;
                await image.decode();
                const canvasOptions = this.getCoverCanvasOptions(imageInfo.width, imageInfo.height, targetWidth, targetHeight);
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = canvasOptions.canvasWidth;
                canvas.height = canvasOptions.canvasHeight;
                ctx?.drawImage(image, canvasOptions.imageX, canvasOptions.imageY, canvasOptions.imageWidth, canvasOptions.imageHeight);
                return { imageData: canvas.toDataURL(), width: targetWidth, height: targetHeight };
            } catch {
                return imageInfo;
            }
        } else {
            return super.applyImageFit(imageInfo, imageFit, targetWidth, targetHeight);
        }

    }
}