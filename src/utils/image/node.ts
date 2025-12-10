import { IImageInfo, IImageUtils, BaseImageUtils } from '.';
import fetch from 'node-fetch';
import { imageSize } from 'image-size';
export class ImageUtils extends BaseImageUtils implements IImageUtils {
    protected async _getImageInfo(url: string): Promise<IImageInfo> {
        const res = await fetch(url);
        const pxToPt: number = 72.0 / 96.0;
        const imageData = new Uint8Array(await res.arrayBuffer());
        const size = imageSize(imageData);
        return { imageData, width: size.width * pxToPt, height: size.height * pxToPt, imageId: this.getImageId() };
    }
}