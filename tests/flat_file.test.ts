(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { Question, QuestionFileModel } from 'survey-core';
import { SurveyPDF } from '../src/survey';
import { IPoint, IRect, ISize, DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatFile } from '../src/flat_layout/flat_file';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { TextBrick } from '../src/pdf_render/pdf_text';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
import { ImageBrick } from '../src/pdf_render/pdf_image';
import { CompositeBrick } from '../src/pdf_render/pdf_composite';
import { LinkBrick } from '../src/pdf_render/pdf_link';
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
        <Question>survey.getAllQuestions()[0], controller, 'No file selected', TextBrick);
    TestHelper.equalRect(expect, flats[0][0], assumeFile);
});
test('Check noFileChosen locale', async () => {
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
    survey.getAllQuestions()[0].noFileChosenCaption = 'test';
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    controller.margins.left += controller.unitWidth;
    let assumeFile: IRect = await SurveyHelper.createTextFlat(controller.leftTopPoint,
        <Question>survey.getAllQuestions()[0], controller, 'test', TextBrick);
    TestHelper.equalRect(expect, flats[0][0], assumeFile);
    expect((<TextBrick>(<CompositeBrick>flats[0][0])['bricks'][0])['text']).toEqual('test');
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
test('Check one image 16x16px file', async () => {
    const imageSize: ISize = { width: 170, height: 50 };
    const oldGetImageSize = SurveyHelper.getImageSize;
    SurveyHelper.shouldConvertImageToPng = false;
    SurveyHelper.getImageSize = async (url: string) => { return imageSize; };
    const json: any = {
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
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    controller.margins.left += controller.unitWidth;
    const assumeFile: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + SurveyHelper.pxToPt(imageSize.width),
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + SurveyHelper.pxToPt(imageSize.height) +
            controller.unitHeight * (1.0 + FlatFile.IMAGE_GAP_SCALE)
    };
    TestHelper.equalRect(expect, flats[0][0], assumeFile);
    SurveyHelper.getImageSize = oldGetImageSize;
    SurveyHelper.shouldConvertImageToPng = true;
});
test('Check one image 16x16px file shorter than text', async () => {
    const imageSize: ISize = { width: 50, height: 50 };
    const oldGetImageSize = SurveyHelper.getImageSize;
    SurveyHelper.shouldConvertImageToPng = false;
    SurveyHelper.getImageSize = async (url: string) => { return imageSize; };
    const json: any = {
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
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    controller.margins.left += controller.unitWidth;
    const assumeFile: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + controller.measureText(json.elements[0].defaultValue[0].name).width,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + SurveyHelper.pxToPt(imageSize.height) +
            controller.unitHeight * (1.0 + FlatFile.IMAGE_GAP_SCALE)
    };
    TestHelper.equalRect(expect, flats[0][0], assumeFile);
    SurveyHelper.getImageSize = oldGetImageSize;
    SurveyHelper.shouldConvertImageToPng = true;
});
test('Check one image 16x16px with set size', async () => {
    const imageSize: ISize = { width: 50, height: 50 };
    const oldGetImageSize = SurveyHelper.getImageSize;
    SurveyHelper.shouldConvertImageToPng = false;
    SurveyHelper.getImageSize = async (url: string) => { return imageSize; };
    const json: any = {
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
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    controller.margins.left += controller.unitWidth;
    const assumeFile: IRect = {
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
    SurveyHelper.getImageSize = oldGetImageSize;
    SurveyHelper.shouldConvertImageToPng = true;
});

test('Check one image 16x16px file server-side', async () => {
    SurveyHelper.inBrowser = false;
    const json: any = {
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
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);

    const imageBrick: IPdfBrick = (<any>flats[0][0]).bricks[0].bricks[1];
    expect(imageBrick instanceof ImageBrick).toBeTruthy();

    controller.margins.left += controller.unitWidth;

    const assumeFile: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + controller.measureText(json.elements[0].defaultValue[0].name).width,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + controller.unitHeight * (1.0 + FlatFile.IMAGE_GAP_SCALE)
    };
    TestHelper.equalRect(expect, flats[0][0], assumeFile);
    SurveyHelper.inBrowser = true;
});

test('Check one image 16x16px with set size server-side', async () => {
    const json: any = {
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
    SurveyHelper.inBrowser = false;
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    expect((<any>flats[0][0]).bricks[0].bricks[1] instanceof ImageBrick).toBeTruthy();
    expect((<any>flats[0][0]).bricks[0].bricks[1].isPageBreak).toBeFalsy();
    controller.margins.left += controller.unitWidth;
    const questionWidthPt = SurveyHelper.parseWidth(json.elements[0].imageWidth, SurveyHelper.getPageAvailableWidth(controller));
    const questionHeightPt = SurveyHelper.parseWidth(json.elements[0].imageHeight, SurveyHelper.getPageAvailableWidth(controller));
    const assumeFile: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + questionWidthPt,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + questionHeightPt + controller.unitHeight * (1.0 + FlatFile.IMAGE_GAP_SCALE)
    };
    TestHelper.equalRect(expect, flats[0][0], assumeFile);
    SurveyHelper.inBrowser = true;
});

test('Test file question getImagePreviewContentWidth ', async () => {
    const json: any = {
        elements: [
            {
                type: 'file',
                name: 'faqueoneimgwithsz',
                titleLocation: 'hidden',
                allowImagesPreview: true,
            }
        ]
    };
    SurveyHelper.inBrowser = false;
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const question = <QuestionFileModel>survey.getAllQuestions()[0];
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flatFile = new FlatFile(survey, question, controller);

    let width = await flatFile['getImagePreviewContentWidth']({ content: '', type: 'image', name: 'file', imageSize: { width: 150, height: 50 } });
    expect(width).toBe(FlatFile.TEXT_MIN_SCALE * controller.unitWidth);

    width = await flatFile['getImagePreviewContentWidth']({ content: '', type: 'image', name: 'file', imageSize: { width: 300, height: 50 } });
    expect(width).toBe(300);
});

test('Test file question doesnt throw exception if could not load image preview', async () => {
    SurveyHelper.getImageSize = async (url: string) => { return null as any; };
    const json: any = {
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
                        content: 'some url'
                    }
                ],
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);

    const imageBrick: IPdfBrick = (<any>flats[0][0]).bricks[0].bricks[1];
    expect(imageBrick instanceof ImageBrick).toBeTruthy();

    controller.margins.left += controller.unitWidth;

    const assumeFile: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + controller.measureText(json.elements[0].defaultValue[0].name).width,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + controller.unitHeight * (1.0 + FlatFile.IMAGE_GAP_SCALE)
    };
    TestHelper.equalRect(expect, flats[0][0], assumeFile);
});

test('Test file question getImagePreviewContentWidth always return correct image width', async () => {
    const json: any = {
        elements: [
            {
                type: 'file',
                name: 'faqueoneimgwithsz',
                titleLocation: 'hidden',
                allowImagesPreview: true,
                imageWidth: '250px',
                defaultValue: [
                    {
                        name: 'cat.png',
                        type: 'image/png',
                        content: TestHelper.BASE64_IMAGE_16PX
                    },
                    {
                        name: 'cat.png',
                        type: 'image/png',
                        content: TestHelper.BASE64_IMAGE_16PX
                    },
                    {
                        name: 'cat.png',
                        type: 'image/png',
                        content: TestHelper.BASE64_IMAGE_16PX
                    },
                    {
                        name: 'cat.png',
                        type: 'image/png',
                        content: TestHelper.BASE64_IMAGE_16PX
                    },
                    {
                        name: 'cat.png',
                        type: 'image/png',
                        content: TestHelper.BASE64_IMAGE_16PX
                    },
                    {
                        name: 'cat.png',
                        type: 'image/png',
                        content: TestHelper.BASE64_IMAGE_16PX
                    }, {
                        name: 'cat.png',
                        type: 'image/png',
                        content: TestHelper.BASE64_IMAGE_16PX
                    }
                ],
            }
        ]
    };
    SurveyHelper.inBrowser = false;
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const question = <QuestionFileModel>survey.getAllQuestions()[0];
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flatFile = new FlatFile(survey, question, controller);
    const questionBricks = await flatFile.generateFlatsContent({ xLeft: controller.margins.left || 10, yTop: controller.margins.top || 10 });
    expect(questionBricks.length).toBe(3);
    //check all item bricks have the same width
    questionBricks.forEach((rowBrick: IPdfBrick) => {
        (<CompositeBrick>rowBrick)['bricks'].forEach((itemBrick: IPdfBrick) =>{
            if(itemBrick instanceof CompositeBrick) {
                expect(itemBrick.width).toBeCloseTo(187.5);
            }
        });
    });
});

test('Test file question inside paneldynamic waits preview loading', async () => {
    const json: any = {
        'logoPosition': 'right',
        'pages': [
            {
                'name': 'page1',
                'elements': [
                    {
                        'type': 'text',
                        'name': 'question1'
                    }
                ]
            },
            {
                'name': 'page2',
                'elements': [
                    {
                        'type': 'paneldynamic',
                        'name': 'pd',
                        'templateElements': [
                            {
                                'type': 'file',
                                'storeDataAsText': false,
                                'name': 'file'
                            }
                        ]
                    }
                ]
            }
        ]
    };
    SurveyHelper.inBrowser = false;
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    survey.onDownloadFile.add((_, options) => {
        setTimeout(() => {
            options.callback('success', 'data:image/jpeg;base64,FILECONTENT1');
        });
    });
    let fileBricks: IPdfBrick[];
    survey.onRenderQuestion.add((_, options) => {
        fileBricks = options.bricks;
    });
    survey.data = { 'pd': [{ 'file': {
        'name': 'name.jpeg',
        'type': 'image/jpeg',
        'content': 'url'
    } }] };
    await survey.raw();
    const unFoldedBricks = fileBricks[0].unfold();
    expect(unFoldedBricks.length).toBe(8);
    expect(unFoldedBricks[5]).toBeInstanceOf(LinkBrick);
    expect((<LinkBrick>unFoldedBricks[5])['link']).toBe('data:image/jpeg;base64,FILECONTENT1');

});
