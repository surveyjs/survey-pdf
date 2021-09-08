(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { Question } from 'survey-core';
import { SurveyPDF } from '../src/survey';
import { IPoint, IRect, ISize, DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatFile } from '../src/flat_layout/flat_file';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { TextBrick } from '../src/pdf_render/pdf_text';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
let __dummy_fl = new FlatFile(null, null, null);

test('Check no files', async () => {
    let json: any = {
        elements: [
            {
                type: 'file',
                name: 'faque',
                titleLocation: 'hidden'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    controller.margins.left += controller.unitWidth;
    let assumeFile: IRect = await SurveyHelper.createTextFlat(controller.leftTopPoint,
        <Question>survey.getAllQuestions()[0], controller, 'No file chosen', TextBrick);
    TestHelper.equalRect(expect, flats[0][0], assumeFile);
});
test('Check one text file', async () => {
    let json: any = {
        elements: [
            {
                type: 'file',
                name: 'faqueonetxt',
                titleLocation: 'hidden',
                defaultValue: [
                    {
                        name: 'text.txt',
                        type: 'text/plain',
                        content: 'data:text/plain;base64,aGVsbG8='
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
    let assumeFile: IRect = await SurveyHelper.createLinkFlat(controller.leftTopPoint,
        <Question>survey.getAllQuestions()[0], controller,
        json.elements[0].defaultValue[0].name, json.elements[0].defaultValue[0].content);
    TestHelper.equalRect(expect, flats[0][0], assumeFile);
});
test('Check two text files', async () => {
    let json: any = {
        elements: [
            {
                type: 'file',
                name: 'faquetwotxt',
                titleLocation: 'hidden',
                allowMultiple: true,
                defaultValue: [
                    {
                        name: 'text.txt',
                        type: 'text/plain',
                        content: 'data:text/plain;base64,aGVsbG8='
                    },
                    {
                        name: 'letter.txt',
                        type: 'text/plain',
                        content: 'data:text/plain;base64,dG8gaG9tZQ=='
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
    let firstFileFlat: IRect = await SurveyHelper.createLinkFlat(controller.leftTopPoint,
        <Question>survey.getAllQuestions()[0], controller,
        json.elements[0].defaultValue[0].name, json.elements[0].defaultValue[0].content);
    let secondFilePoint: IPoint = SurveyHelper.createPoint(firstFileFlat, false, true);
    secondFilePoint.xLeft += controller.unitWidth;
    let secondFileFlat: IRect = await SurveyHelper.createLinkFlat(secondFilePoint,
        <Question>survey.getAllQuestions()[0], controller,
        json.elements[0].defaultValue[1].name, json.elements[0].defaultValue[1].content);
    let assumeFile: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: secondFileFlat.xRight,
        yTop: controller.leftTopPoint.yTop,
        yBot: Math.max(firstFileFlat.yBot, secondFileFlat.yBot)
    };
    TestHelper.equalRect(expect, flats[0][0], assumeFile);
});
test.skip('Check one image 16x16px file', async () => {
    let imageSize: ISize = { width: 170, height: 50 };
    SurveyHelper.getImageSize = async (url: string) => { return imageSize };
    let json: any = {
        elements: [
            {
                type: 'file',
                name: 'faqueoneimg',
                titleLocation: 'hidden',
                allowImagesPreview: true,
                defaultValue: [
                    {
                        name: 'cat.png',
                        type: 'image/png',
                        content: TestHelper.BASE64_IMAGE_16PX
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
    let assumeFile: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + imageSize.width,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + imageSize.height +
            controller.unitHeight * (1.0 + FlatFile.IMAGE_GAP_SCALE)
    };
    TestHelper.equalRect(expect, flats[0][0], assumeFile);
});
test.skip('Check one image 16x16px file shorter than text', async () => {
    let imageSize: ISize = { width: 50, height: 50 };
    SurveyHelper.getImageSize = async (url: string) => { return imageSize };
    let json: any = {
        elements: [
            {
                type: 'file',
                name: 'faqueoneimgshrt',
                titleLocation: 'hidden',
                allowImagesPreview: true,
                defaultValue: [
                    {
                        name: 'cat.png',
                        type: 'image/png',
                        content: TestHelper.BASE64_IMAGE_16PX
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
    let assumeFile: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + controller.measureText(json.elements[0].defaultValue[0].name).width,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + imageSize.height +
            controller.unitHeight * (1.0 + FlatFile.IMAGE_GAP_SCALE)
    };
    TestHelper.equalRect(expect, flats[0][0], assumeFile);
});
test.skip('Check one image 16x16px with set size', async () => {
    let imageSize: ISize = { width: 50, height: 50 };
    SurveyHelper.getImageSize = async (url: string) => { return imageSize };
    let json: any = {
        elements: [
            {
                type: 'file',
                name: 'faqueoneimgwithsz',
                titleLocation: 'hidden',
                allowImagesPreview: true,
                defaultValue: [
                    {
                        name: 'cat.png',
                        type: 'image/png',
                        content: TestHelper.BASE64_IMAGE_16PX
                    }
                ],
                imageWidth: '160pt',
                imageHeight: '110pt',
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    controller.margins.left += controller.unitWidth;
    let assumeFile: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft +
            SurveyHelper.parseWidth(json.elements[0].imageWidth,
                SurveyHelper.getPageAvailableWidth(controller)),
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + SurveyHelper.parseWidth(json.elements[0].imageHeight,
            SurveyHelper.getPageAvailableWidth(controller)) +
                controller.unitHeight * (1.0 + FlatFile.IMAGE_GAP_SCALE)
    };
    TestHelper.equalRect(expect, flats[0][0], assumeFile);
});