(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { SurveyPDF } from '../src/survey';
import { IPoint, IRect, DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatTextbox } from '../src/flat_layout/flat_textbox';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { HTMLBrick } from '../src/pdf_render/pdf_html';
import { RowlineBrick } from '../src/pdf_render/pdf_rowline';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
import { ImageBrick } from '../src/pdf_render/pdf_image';
import { ElementFactory, Question, Serializer } from 'survey-core';
import { FlatRepository } from '../src/flat_layout/flat_repository';
import { FlatQuestionDefault } from '../src/flat_layout/flat_default';
const __dummy_tx = new FlatTextbox(null, null, null);

test('Survey with title', async () => {
    const json: any = {
        title: 'One small step for man',
        elements: [
            {
                type: 'text',
                name: 'MissText',
                titleLocation: 'hidden'
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(3);
    const assumeTitle: IRect = await SurveyHelper.createTitleSurveyFlat(
        controller.leftTopPoint, controller, json.title);
    TestHelper.equalRect(expect, flats[0][0], assumeTitle);
    const rowLinePoint: IPoint = SurveyHelper.createPoint(assumeTitle);
    const assumeRowLine: IRect = SurveyHelper.createRowlineFlat(rowLinePoint, controller);
    TestHelper.equalRect(expect, flats[0][1], assumeRowLine);
    const textBoxPoint: IPoint = rowLinePoint;
    textBoxPoint.yTop += controller.unitHeight * FlatSurvey.PANEL_CONT_GAP_SCALE + SurveyHelper.EPSILON;
    textBoxPoint.xLeft += controller.unitWidth;
    const assumeTextBox: IRect = SurveyHelper.createTextFieldRect(textBoxPoint, controller);
    TestHelper.equalRect(expect, flats[0][2], assumeTextBox);
});
test('Survey with description', async () => {
    const json: any = {
        description: 'One giant leap for mankind',
        elements: [
            {
                type: 'text',
                name: 'MissText',
                titleLocation: 'hidden'
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(3);
    const assumeDescription: IRect = await SurveyHelper.createDescFlat(
        controller.leftTopPoint, null, controller, json.description);
    TestHelper.equalRect(expect, flats[0][0], assumeDescription);
    const rowLinePoint: IPoint = SurveyHelper.createPoint(assumeDescription);
    const assumeRowLine: IRect = SurveyHelper.createRowlineFlat(rowLinePoint, controller);
    TestHelper.equalRect(expect, flats[0][1], assumeRowLine);
    const textBoxPoint: IPoint = rowLinePoint;
    textBoxPoint.yTop += controller.unitHeight * FlatSurvey.PANEL_CONT_GAP_SCALE + SurveyHelper.EPSILON;
    textBoxPoint.xLeft += controller.unitWidth;
    const assumeTextBox: IRect = SurveyHelper.createTextFieldRect(textBoxPoint, controller);
    TestHelper.equalRect(expect, flats[0][2], assumeTextBox);
});
test('Survey with title and description', async () => {
    const json: any = {
        title: 'One small step for man',
        description: 'One giant leap for mankind',
        elements: [
            {
                type: 'text',
                name: 'MissText',
                titleLocation: 'hidden'
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(3);
    const assumeTitle: IRect = await SurveyHelper.createTitleSurveyFlat(
        controller.leftTopPoint, controller, json.title);
    const descriptionPoint: IPoint = SurveyHelper.createPoint(assumeTitle);
    descriptionPoint.yTop += controller.unitHeight * FlatSurvey.PANEL_DESC_GAP_SCALE;
    const assumeDescription: IRect = await SurveyHelper.createDescFlat(
        descriptionPoint, null, controller, json.description);
    const assumeTitleWithDescription: IRect = SurveyHelper.mergeRects(assumeTitle, assumeDescription);
    TestHelper.equalRect(expect, flats[0][0], assumeTitleWithDescription);
    const rowLinePoint: IPoint = SurveyHelper.createPoint(assumeTitleWithDescription);
    const assumeRowLine: IRect = SurveyHelper.createRowlineFlat(rowLinePoint, controller);
    TestHelper.equalRect(expect, flats[0][1], assumeRowLine);
    const textBoxPoint: IPoint = rowLinePoint;
    textBoxPoint.yTop += controller.unitHeight * FlatSurvey.PANEL_CONT_GAP_SCALE + SurveyHelper.EPSILON;
    textBoxPoint.xLeft += controller.unitWidth;
    const assumeTextBox: IRect = SurveyHelper.createTextFieldRect(textBoxPoint, controller);
    TestHelper.equalRect(expect, flats[0][2], assumeTextBox);
});
test('Survey with logo', async () => {
    SurveyHelper.shouldConvertImageToPng = false;
    const json: any = {
        logo: TestHelper.BASE64_IMAGE_16PX,
        pages: []
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    expect(flats[0][0] instanceof HTMLBrick);
    const assumeLogo: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + SurveyHelper.pxToPt(survey.logoWidth),
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + SurveyHelper.pxToPt(survey.logoHeight)
    };
    TestHelper.equalRect(expect, flats[0][0], assumeLogo);
    SurveyHelper.shouldConvertImageToPng = true;
});
test('Survey with left logo and title', async () => {
    SurveyHelper.shouldConvertImageToPng = false;
    const json: any = {
        title: 'TitleLogoLeft',
        logo: TestHelper.BASE64_IMAGE_16PX,
        logoPosition: 'left',
        questions: [
            {
                type: 'text',
                name: 'logoleft',
                titleLocation: 'hidden'
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(4);
    expect(flats[0][0] instanceof HTMLBrick);
    const assumeLogo: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + SurveyHelper.pxToPt(survey.logoWidth),
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + SurveyHelper.pxToPt(survey.logoHeight)
    };
    TestHelper.equalRect(expect, flats[0][0], assumeLogo);
    const titlePoint: IPoint = SurveyHelper.createPoint(assumeLogo, false, true);
    titlePoint.xLeft += controller.unitWidth;
    const assumeTitle: IRect = await SurveyHelper.createTitleSurveyFlat(
        titlePoint, controller, json.title);
    TestHelper.equalRect(expect, flats[0][1], assumeTitle);
    const rowLinePoint: IPoint = SurveyHelper.createPoint(assumeLogo);
    const assumeRowLine: IRect = SurveyHelper.createRowlineFlat(rowLinePoint, controller);
    TestHelper.equalRect(expect, flats[0][2], assumeRowLine);
    const textBoxPoint: IPoint = rowLinePoint;
    textBoxPoint.xLeft += controller.unitWidth;
    textBoxPoint.yTop += controller.unitHeight * FlatSurvey.PANEL_CONT_GAP_SCALE + SurveyHelper.EPSILON;
    const assumeTextBox: IRect = SurveyHelper.createTextFieldRect(textBoxPoint, controller);
    TestHelper.equalRect(expect, flats[0][3], assumeTextBox);
    SurveyHelper.shouldConvertImageToPng = true;
});
test('Survey with left logo and big title', async () => {
    SurveyHelper.shouldConvertImageToPng = false;
    const json: any = {
        title: 'TitleLogoLeftBiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiig',
        logo: TestHelper.BASE64_IMAGE_16PX,
        logoPosition: 'left',
        questions: [
            {
                type: 'text',
                name: 'logoleftbig',
                titleLocation: 'hidden'
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(4);
    expect(flats[0][0] instanceof HTMLBrick);
    const assumeLogo: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + SurveyHelper.pxToPt(survey.logoWidth),
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + SurveyHelper.pxToPt(survey.logoHeight)
    };
    TestHelper.equalRect(expect, flats[0][0], assumeLogo);
    const titlePoint: IPoint = SurveyHelper.createPoint(assumeLogo, false, true);
    titlePoint.xLeft += controller.unitWidth;
    const assumeTitle: IRect = await SurveyHelper.createTitleSurveyFlat(
        titlePoint, controller, json.title);
    TestHelper.equalRect(expect, flats[0][1], assumeTitle);
    const rowLinePoint: IPoint = SurveyHelper.createPoint(SurveyHelper.mergeRects(assumeLogo, assumeTitle));
    const assumeRowLine: IRect = SurveyHelper.createRowlineFlat(rowLinePoint, controller);
    TestHelper.equalRect(expect, flats[0][2], assumeRowLine);
    const textBoxPoint: IPoint = rowLinePoint;
    textBoxPoint.xLeft += controller.unitWidth;
    textBoxPoint.yTop += controller.unitHeight * FlatSurvey.PANEL_CONT_GAP_SCALE + SurveyHelper.EPSILON;
    const assumeTextBox: IRect = SurveyHelper.createTextFieldRect(textBoxPoint, controller);
    TestHelper.equalRect(expect, flats[0][3], assumeTextBox);
    SurveyHelper.shouldConvertImageToPng = true;
});
test('Survey with right logo and title', async () => {
    SurveyHelper.shouldConvertImageToPng = false;
    const json: any = {
        title: 'TitleRight',
        logo: TestHelper.BASE64_IMAGE_16PX,
        logoPosition: 'right',
        questions: [
            {
                type: 'text',
                name: 'logoright',
                titleLocation: 'hidden'
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(4);
    const assumeTitle: IRect = await SurveyHelper.createTitleSurveyFlat(
        controller.leftTopPoint, controller, json.title);
    TestHelper.equalRect(expect, flats[0][0], assumeTitle);
    expect(flats[0][1] instanceof HTMLBrick);
    const assumeLogo: IRect = {
        xLeft: controller.paperWidth - controller.margins.right -
            SurveyHelper.pxToPt(survey.logoWidth),
        xRight: controller.paperWidth - controller.margins.right,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + SurveyHelper.pxToPt(survey.logoHeight)
    };
    TestHelper.equalRect(expect, flats[0][1], assumeLogo);
    const rowLinePoint: IPoint = SurveyHelper.createPoint(SurveyHelper.mergeRects(assumeTitle, assumeLogo));
    const assumeRowLine: IRect = SurveyHelper.createRowlineFlat(rowLinePoint, controller);
    TestHelper.equalRect(expect, flats[0][2], assumeRowLine);
    const textBoxPoint: IPoint = rowLinePoint;
    textBoxPoint.xLeft += controller.unitWidth;
    textBoxPoint.yTop += controller.unitHeight * FlatSurvey.PANEL_CONT_GAP_SCALE + SurveyHelper.EPSILON;
    const assumeTextBox: IRect = SurveyHelper.createTextFieldRect(textBoxPoint, controller);
    TestHelper.equalRect(expect, flats[0][3], assumeTextBox);
    SurveyHelper.shouldConvertImageToPng = true;
});
test('Survey with bottom logo and title', async () => {
    SurveyHelper.shouldConvertImageToPng = false;
    const json: any = {
        title: 'TitleLogoBottom',
        logo: TestHelper.BASE64_IMAGE_16PX,
        logoPosition: 'bottom',
        pages: []
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(3);
    const assumeTitle: IRect = await SurveyHelper.createTitleSurveyFlat(
        controller.leftTopPoint, controller, json.title);
    TestHelper.equalRect(expect, flats[0][0], assumeTitle);
    expect(flats[0][1] instanceof HTMLBrick);
    const assumeLogo: IRect = {
        xLeft: controller.leftTopPoint.xLeft +
            SurveyHelper.getPageAvailableWidth(controller) / 2.0 -
            SurveyHelper.pxToPt(survey.logoWidth) / 2.0,
        xRight: controller.leftTopPoint.xLeft +
            SurveyHelper.getPageAvailableWidth(controller) / 2.0 -
            SurveyHelper.pxToPt(survey.logoWidth) / 2.0 +
            SurveyHelper.pxToPt(survey.logoWidth),
        yTop: assumeTitle.yBot + controller.unitHeight / 2.0,
        yBot: assumeTitle.yBot + controller.unitHeight / 2.0 +
            SurveyHelper.pxToPt(survey.logoHeight)
    };
    TestHelper.equalRect(expect, flats[0][1], assumeLogo);
    expect(flats[0][2] instanceof RowlineBrick);
    SurveyHelper.shouldConvertImageToPng = true;
});
test('Survey with botton logo without title', async () => {
    SurveyHelper.shouldConvertImageToPng = false;
    const json: any = {
        logo: TestHelper.BASE64_IMAGE_16PX,
        logoPosition: 'bottom',
        pages: []
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    expect(flats[0][0] instanceof HTMLBrick);
    const assumeLogo: IRect = {
        xLeft: controller.leftTopPoint.xLeft +
            SurveyHelper.getPageAvailableWidth(controller) / 2.0 -
            SurveyHelper.pxToPt(survey.logoWidth) / 2.0,
        xRight: controller.leftTopPoint.xLeft +
            SurveyHelper.getPageAvailableWidth(controller) / 2.0 -
            SurveyHelper.pxToPt(survey.logoWidth) / 2.0 +
            SurveyHelper.pxToPt(survey.logoWidth),
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop +
            SurveyHelper.pxToPt(survey.logoHeight)
    };
    TestHelper.equalRect(expect, flats[0][0], assumeLogo);
    SurveyHelper.shouldConvertImageToPng = true;
});

test('Survey with logo server-side', async () => {
    SurveyHelper.inBrowser = false;
    const json: any = {
        logo: TestHelper.BASE64_IMAGE_16PX,
        logoWidth: '420px',
        logoHeight: '320px',
        pages: []
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    expect(flats[0][0] instanceof ImageBrick);
    expect(flats[0][0].isPageBreak).toBeFalsy();
    const assumeLogo: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + SurveyHelper.pxToPt(survey.logoWidth),
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + SurveyHelper.pxToPt(survey.logoHeight)
    };
    TestHelper.equalRect(expect, flats[0][0], assumeLogo);
    SurveyHelper.inBrowser = true;
});

test('Survey with logo and pages', async () => {
    const json: any = {
        logo: TestHelper.BASE64_IMAGE_16PX,
        pages: [
            {
                name: 'page1',
                elements: [
                    {
                        type: 'text',
                        name: 'First page qw'
                    }
                ]
            },
            {
                name: 'page2',
                elements: [
                    {
                        type: 'text',
                        name: 'Second page qw'
                    }
                ]
            }
        ]
    };
    SurveyHelper.shouldConvertImageToPng = false;
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(2);
    expect(flats[0].length).toBe(3);

    expect(flats[1].length).toBe(1);
    expect(flats[1][0].yTop).toBe(controller.leftTopPoint.yTop);
    expect(flats[1][0].xLeft).toBe(controller.leftTopPoint.xLeft);
    SurveyHelper.shouldConvertImageToPng = true;
});

test('Check default renderer for custom questions', async () => {
    const CUSTOM_TYPE = 'test';
    const json = {
        elements: [
            {
                type: CUSTOM_TYPE,
                name: 'q1'
            }
        ]
    };
    class CustomQuestionModel extends Question {
        getType() {
            return CUSTOM_TYPE;
        }
    }
    Serializer.addClass(
        CUSTOM_TYPE,
        [],
        function () {
            return new CustomQuestionModel('');
        },
        'question'
    );

    ElementFactory.Instance.registerElement(CUSTOM_TYPE, (name: string) => {
        return new CustomQuestionModel(name);
    });
    const survey = new SurveyPDF(json);
    survey.data = {
        'q1': 'test_value'
    };
    const question = survey.getAllQuestions()[0];
    const controller = new DocController();
    const questionFlat = FlatRepository.getInstance().create(survey, question, controller, 'test');
    expect(questionFlat).toBeInstanceOf(FlatQuestionDefault);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect((<any>flats[0][0].unfold()[3]).text).toBe('test_value');
});