import { IImageInfo, IImageUtils, BaseImageUtils } from '.';
import fetch from 'node-fetch';
import { imageSize } from 'image-size';
export class ImageUtils extends BaseImageUtils implements IImageUtils {
    protected async _getImageInfo(url: string): Promise<IImageInfo> {
        const pxToPt: number = 72.0 / 96.0;
        let data: Uint8Array;
        if (typeof url === 'string' && url.startsWith('data:')) {
            data = Buffer.from(url.split(',')[1] || '', 'base64');
        } else {
            const res = await fetch(url);
            data = new Uint8Array(await res.arrayBuffer());
        }
        const size = imageSize(data);
        return { data, width: size.width * pxToPt, height: size.height * pxToPt, id: this.getImageId() };
    }
}