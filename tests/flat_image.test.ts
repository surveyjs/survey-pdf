(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { SurveyPDF } from '../src/survey';
import { IRect, DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatImage } from '../src/flat_layout/flat_image';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
import { ImageBrick } from '../src/pdf_render/pdf_image';
const __dummy_im: FlatImage = new FlatImage(null, null, null);

test('Check image question 100x100px', async () => {
    SurveyHelper.shouldConvertImageToPng = false;
    const json: any = {
        elements: [
            {
                type: 'image',
                name: 'image_question',
                titleLocation: 'hidden',
                imageLink: TestHelper.BASE64_IMAGE_100PX
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    controller.margins.left += controller.unitWidth;
    const width: number = (<any>survey.getAllQuestions()[0]).imageWidth;
    const height: number = (<any>survey.getAllQuestions()[0]).imageHeight;
    const widthPt: number = SurveyHelper.parseWidth(width + 'px', SurveyHelper.getPageAvailableWidth(controller));
    const heightPt: number = SurveyHelper.parseWidth(height + 'px', SurveyHelper.getPageAvailableWidth(controller));
    const assumeImage: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + widthPt,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + heightPt
    };
    TestHelper.equalRect(expect, flats[0][0], assumeImage);
    SurveyHelper.shouldConvertImageToPng = true;
});

test('Check image question with "auto"', async () => {
    const getOldImageSize = SurveyHelper.getImageSize;
    SurveyHelper.getImageSize = async () => {
        return { width: 100, height: 75 };
    };
    SurveyHelper.shouldConvertImageToPng = false;
    const json: any = {
        elements: [
            {
                type: 'image',
                name: 'image_question',
                titleLocation: 'hidden',
                imageHeight: 'auto',
                imageWidth: 100,
                imageLink: TestHelper.BASE64_IMAGE_100PX
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    controller.margins.left += controller.unitWidth;
    let width: number = (<any>survey.getAllQuestions()[0]).imageWidth;
    let widthPt: number = SurveyHelper.parseWidth(width + 'px', SurveyHelper.getPageAvailableWidth(controller));
    let heightPt: number = 75 * widthPt / 100;
    let assumeImage: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + widthPt,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + heightPt
    };
    TestHelper.equalRect(expect, flats[0][0], assumeImage);

    survey.getAllQuestions()[0].imageWidth = 'auto';
    survey.getAllQuestions()[0].imageHeight = '100';
    flats = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    controller.margins.left += controller.unitWidth;
    let height = (<any>survey.getAllQuestions()[0]).imageHeight;
    heightPt = SurveyHelper.parseWidth(width + 'px', SurveyHelper.getPageAvailableWidth(controller));
    widthPt = 100 * heightPt / 75;

    assumeImage = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + widthPt,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + heightPt
    };
    TestHelper.equalRect(expect, flats[0][0], assumeImage);

    SurveyHelper.shouldConvertImageToPng = true;
    SurveyHelper.getImageSize = getOldImageSize;
});

test('Check image question with "auto" and 100%', async () => {
    const getOldImageSize = SurveyHelper.getImageSize;
    SurveyHelper.getImageSize = async () => {
        return { width: 100, height: 75 };
    };
    SurveyHelper.shouldConvertImageToPng = false;
    const json: any = {
        elements: [
            {
                type: 'image',
                name: 'image_question',
                titleLocation: 'hidden',
                imageHeight: 'auto',
                imageWidth: '100%',
                imageLink: TestHelper.BASE64_IMAGE_100PX
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    controller.margins.left += controller.unitWidth;
    let width: string = (<any>survey.getAllQuestions()[0]).imageWidth;
    let widthPt: number = SurveyHelper.parseWidth('100%', SurveyHelper.getPageAvailableWidth(controller));
    let heightPt: number = 75 * widthPt / 100;
    let assumeImage: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + widthPt,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + heightPt
    };
    TestHelper.equalRect(expect, flats[0][0], assumeImage);
    SurveyHelper.getImageSize = getOldImageSize;
});

test('Check image question 100x100px with set size server-side', async () => {
    SurveyHelper.inBrowser = false;
    const json: any = {
        elements: [
            {
                type: 'image',
                name: 'image_question',
                titleLocation: 'hidden',
                imageLink: TestHelper.BASE64_IMAGE_100PX,
                imageWidth: 160,
                imageHeight: 110,
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    expect(flats[0][0] instanceof ImageBrick).toBeTruthy();
    expect(flats[0][0].isPageBreak).toBeFalsy();
    controller.margins.left += controller.unitWidth;
    const width: number = (<any>survey.getAllQuestions()[0]).imageWidth;
    const height: number = (<any>survey.getAllQuestions()[0]).imageHeight;
    const widthPt: number = SurveyHelper.parseWidth(width + 'px', SurveyHelper.getPageAvailableWidth(controller));
    const heightPt: number = SurveyHelper.parseWidth(height + 'px', SurveyHelper.getPageAvailableWidth(controller));
    const assumeImage: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + widthPt,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + heightPt
    };
    TestHelper.equalRect(expect, flats[0][0], assumeImage);
    SurveyHelper.inBrowser = true;
});