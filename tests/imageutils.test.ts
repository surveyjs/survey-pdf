import { BaseImageUtils } from '../src/utils/image/index';
import { ImageUtils } from '../src/utils/image/browser';
test('check hash is working correctly', async () => {
    const imageUtils = new BaseImageUtils();
    const testImageInfo = { width: 30, height: 30, imageData: 'base64' };
    imageUtils['hash']['some_url'] = testImageInfo;
    expect(await imageUtils.getImageInfo('some_url')).toBe(testImageInfo);
    const anotherImage = await imageUtils.getImageInfo('another_url');
    expect(anotherImage).toEqual({ imageData: 'another_url', width: 0, height: 0, imageId: 'image_1' });
    expect(await imageUtils.getImageInfo('another_url')).toBe(anotherImage);
    imageUtils.clear();
    expect(await imageUtils.getImageInfo('some_url')).toEqual({ imageData: 'some_url', width: 0, height: 0, imageId: 'image_1' });
    expect(await imageUtils.getImageInfo('another_url')).toEqual({ imageData: 'another_url', width: 0, height: 0, imageId: 'image_2' });
});

test('check aplyImageFit', async () => {
    const imageUtils = new BaseImageUtils();
    const testImageInfo = { width: 30, height: 30, imageData: 'base64' };
    expect(await imageUtils.applyImageFit(testImageInfo, 'fill', 30, 30)).toEqual({ width: 30, height: 30, imageData: 'base64' });
    expect(await imageUtils.applyImageFit(testImageInfo, 'contain', 30, 30)).toEqual({ width: 30, height: 30, imageData: 'base64' });

    testImageInfo.width = 10;
    testImageInfo.height = 20;
    expect(await imageUtils.applyImageFit(testImageInfo, 'fill', 40, 40)).toEqual({ width: 40, height: 40, imageData: 'base64' });
    expect(await imageUtils.applyImageFit(testImageInfo, 'contain', 40, 40)).toEqual({ width: 20, height: 40, imageData: 'base64' });

    expect(await imageUtils.applyImageFit(testImageInfo, 'fill', 20, 40)).toEqual({ width: 20, height: 40, imageData: 'base64' });
    expect(await imageUtils.applyImageFit(testImageInfo, 'contain', 20, 40)).toEqual({ width: 20, height: 40, imageData: 'base64' });

    expect(await imageUtils.applyImageFit(testImageInfo, 'fill', 20, 60)).toEqual({ width: 20, height: 60, imageData: 'base64' });
    expect(await imageUtils.applyImageFit(testImageInfo, 'contain', 20, 60)).toEqual({ width: 20, height: 40, imageData: 'base64' });

    expect(await imageUtils.applyImageFit(testImageInfo, 'fill', 5, 60)).toEqual({ width: 5, height: 60, imageData: 'base64' });
    expect(await imageUtils.applyImageFit(testImageInfo, 'contain', 5, 60)).toEqual({ width: 5, height: 10, imageData: 'base64' });

    expect(await imageUtils.applyImageFit(testImageInfo, 'fill', 5, 10)).toEqual({ width: 5, height: 10, imageData: 'base64' });
    expect(await imageUtils.applyImageFit(testImageInfo, 'contain', 5, 10)).toEqual({ width: 5, height: 10, imageData: 'base64' });

    testImageInfo.width = 100;
    testImageInfo.height = 50;

    expect(await imageUtils.applyImageFit(testImageInfo, 'fill', 100, 100)).toEqual({ width: 100, height: 100, imageData: 'base64' });
    expect(await imageUtils.applyImageFit(testImageInfo, 'contain', 100, 100)).toEqual({ width: 100, height: 50, imageData: 'base64' });

    expect(await imageUtils.applyImageFit(testImageInfo, 'fill', 200, 100)).toEqual({ width: 200, height: 100, imageData: 'base64' });
    expect(await imageUtils.applyImageFit(testImageInfo, 'contain', 200, 100)).toEqual({ width: 200, height: 100, imageData: 'base64' });

    expect(await imageUtils.applyImageFit(testImageInfo, 'fill', 300, 100)).toEqual({ width: 300, height: 100, imageData: 'base64' });
    expect(await imageUtils.applyImageFit(testImageInfo, 'contain', 300, 100)).toEqual({ width: 200, height: 100, imageData: 'base64' });

    expect(await imageUtils.applyImageFit(testImageInfo, 'fill', 300, 25)).toEqual({ width: 300, height: 25, imageData: 'base64' });
    expect(await imageUtils.applyImageFit(testImageInfo, 'contain', 300, 25)).toEqual({ width: 50, height: 25, imageData: 'base64' });

    expect(await imageUtils.applyImageFit(testImageInfo, 'fill', 10, 5)).toEqual({ width: 10, height: 5, imageData: 'base64' });
    expect(await imageUtils.applyImageFit(testImageInfo, 'contain', 10, 5)).toEqual({ width: 10, height: 5, imageData: 'base64' });
});

test('check getCoverCanvasOptions', () => {
    const imageUtils = new ImageUtils();
    expect((imageUtils as any)['getCoverCanvasOptions'](100, 100, 200, 200)).toEqual({
        canvasWidth: 200,
        canvasHeight: 200,
        imageX: 0,
        imageY: 0,
        imageWidth: 200,
        imageHeight: 200
    });
    expect((imageUtils as any)['getCoverCanvasOptions'](200, 100, 100, 100)).toEqual({
        canvasWidth: 100,
        canvasHeight: 100,
        imageX: -50,
        imageY: 0,
        imageWidth: 200,
        imageHeight: 100
    });
    expect((imageUtils as any)['getCoverCanvasOptions'](100, 200, 200, 100)).toEqual({
        canvasWidth: 200,
        canvasHeight: 100,
        imageX: 0,
        imageY: -150,
        imageWidth: 200,
        imageHeight: 400
    });
});