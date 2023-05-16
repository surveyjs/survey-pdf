(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { SurveyPDF } from '../src/survey';
import { IRect, DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatImagePicker } from '../src/flat_layout/flat_imagepicker';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
import { ImageBrick } from '../src/pdf_render/pdf_image';
let __dummy_ip = new FlatImagePicker(null, null, null);

test('Check imagepicker one image 100x100px', async () => {
    SurveyHelper.shouldConvertImageToPng = false;
    let json: any = {
        elements: [
            {
                type: 'imagepicker',
                name: 'imaque',
                titleLocation: 'hidden',
                choices: [
                    {
                        value: 'fox',
                        imageLink: TestHelper.BASE64_IMAGE_100PX
                    }
                ]
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    controller.margins.left += controller.unitWidth;
    let width: number = SurveyHelper.getImagePickerAvailableWidth(controller) / SurveyHelper.IMAGEPICKER_COUNT;
    let height: number = width / SurveyHelper.IMAGEPICKER_RATIO;
    let assumeimagePicker: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + width,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + height + controller.unitHeight
    };
    TestHelper.equalRect(expect, flats[0][0], assumeimagePicker);
    SurveyHelper.shouldConvertImageToPng = true;
});
test('Check imagepicker one image 100x100px with label', async () => {
    SurveyHelper.shouldConvertImageToPng = false;
    let json: any = {
        elements: [
            {
                type: 'imagepicker',
                name: 'imaque',
                titleLocation: 'hidden',
                showLabel: true,
                choices: [
                    {
                        value: 'fox',
                        imageLink: TestHelper.BASE64_IMAGE_100PX
                    }
                ]
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    controller.margins.left += controller.unitWidth;
    let width: number = SurveyHelper.getImagePickerAvailableWidth(controller) / SurveyHelper.IMAGEPICKER_COUNT;
    let height: number = width / SurveyHelper.IMAGEPICKER_RATIO;
    let assumeimagePicker: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + width,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + height + 2.0 * controller.unitHeight
    };
    TestHelper.equalRect(expect, flats[0][0], assumeimagePicker);
    SurveyHelper.shouldConvertImageToPng = true;
});
test('Check imagepicker two images 100x100px', async () => {
    SurveyHelper.shouldConvertImageToPng = false;
    let json: any = {
        elements: [
            {
                type: 'imagepicker',
                name: 'imaque',
                titleLocation: 'hidden',
                choices: [
                    {
                        value: 'fox',
                        imageLink: TestHelper.BASE64_IMAGE_100PX
                    },
                    {
                        value: 'pasta',
                        imageLink: 'data:image/jpeg;base64,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'
                    }
                ]
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    controller.margins.left += controller.unitWidth;
    let width: number = SurveyHelper.getImagePickerAvailableWidth(controller) / SurveyHelper.IMAGEPICKER_COUNT;
    let height: number = width / SurveyHelper.IMAGEPICKER_RATIO;
    let assumeimagePicker: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + 2.0 * width + controller.unitHeight,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + height + controller.unitHeight
    };
    TestHelper.equalRect(expect, flats[0][0], assumeimagePicker);
    SurveyHelper.shouldConvertImageToPng = true;
});

test('Check imagepicker one image 100x100px server-side', async () => {
    SurveyHelper.inBrowser = false;
    let json: any = {
        elements: [
            {
                type: 'imagepicker',
                name: 'imaque',
                titleLocation: 'hidden',
                choices: [
                    {
                        value: 'fox',
                        imageLink: TestHelper.BASE64_IMAGE_100PX
                    }
                ]
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    expect((<any>flats[0][0]).bricks[0].bricks[0] instanceof ImageBrick).toBeTruthy();
    expect((<any>flats[0][0]).bricks[0].bricks[0].isPageBreak).toBeFalsy();
    controller.margins.left += controller.unitWidth;
    let width: number = SurveyHelper.getImagePickerAvailableWidth(controller) / SurveyHelper.IMAGEPICKER_COUNT;
    let height: number = width / SurveyHelper.IMAGEPICKER_RATIO;
    let assumeimagePicker: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + width,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + height + controller.unitHeight
    };
    TestHelper.equalRect(expect, flats[0][0], assumeimagePicker);
    SurveyHelper.inBrowser = true;
});