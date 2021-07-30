(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { SurveyPDF } from '../src/survey';
import { IPoint, IRect, DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatTextbox } from '../src/flat_layout/flat_textbox';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { HTMLBrick } from '../src/pdf_render/pdf_html';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
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
    expect(flats[0].length).toBe(2);
    const assumeTitle: IRect = await SurveyHelper.createTitleSurveyFlat(
        controller.leftTopPoint, controller, json.title);
    TestHelper.equalRect(expect, flats[0][0], assumeTitle);
    const textBoxPoint: IPoint = SurveyHelper.createPoint(assumeTitle);
    textBoxPoint.yTop += controller.unitHeight * FlatSurvey.PANEL_CONT_GAP_SCALE;
    textBoxPoint.xLeft += controller.unitWidth;
    const assumeTextBox: IRect = SurveyHelper.createTextFieldRect(textBoxPoint, controller);
    TestHelper.equalRect(expect, flats[0][1], assumeTextBox);    
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
    expect(flats[0].length).toBe(2);
    const assumeDescription: IRect = await SurveyHelper.createDescFlat(
        controller.leftTopPoint, null, controller, json.description);
    TestHelper.equalRect(expect, flats[0][0], assumeDescription);
    const textBoxPoint: IPoint = SurveyHelper.createPoint(assumeDescription);
    textBoxPoint.yTop += controller.unitHeight * FlatSurvey.PANEL_CONT_GAP_SCALE;
    textBoxPoint.xLeft += controller.unitWidth;
    const assumeTextBox: IRect = SurveyHelper.createTextFieldRect(textBoxPoint, controller);
    TestHelper.equalRect(expect, flats[0][1], assumeTextBox);    
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
    expect(flats[0].length).toBe(2);
    const assumeTitle: IRect = await SurveyHelper.createTitleSurveyFlat(
        controller.leftTopPoint, controller, json.title);
    const descriptionPoint: IPoint = SurveyHelper.createPoint(assumeTitle);
    descriptionPoint.yTop += controller.unitHeight * FlatSurvey.PANEL_DESC_GAP_SCALE;
    const assumeDescription: IRect = await SurveyHelper.createDescFlat(
        descriptionPoint, null, controller, json.description);
    TestHelper.equalRect(expect, flats[0][0], SurveyHelper.mergeRects(assumeTitle, assumeDescription));
    const textBoxPoint: IPoint = SurveyHelper.createPoint(assumeDescription);
    textBoxPoint.yTop += controller.unitHeight * FlatSurvey.PANEL_CONT_GAP_SCALE;
    textBoxPoint.xLeft += controller.unitWidth;
    const assumeTextBox: IRect = SurveyHelper.createTextFieldRect(textBoxPoint, controller);
    TestHelper.equalRect(expect, flats[0][1], assumeTextBox);    
});
test('Survey with logo', async () => {
    const json: any = {
        logo: TestHelper.BASE64_IMAGE_16PX,
        pages: []
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    expect(flats[0][0] instanceof HTMLBrick);
    const assumeLogo: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + SurveyHelper.pxToPt(survey.logoWidth),
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + SurveyHelper.pxToPt(survey.logoHeight)
    };
    TestHelper.equalRect(expect, flats[0][0], assumeLogo);  
});
test('Survey with left logo and title', async () => {
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
    expect(flats[0].length).toBe(3);
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
    const textBoxPoint: IPoint = SurveyHelper.createPoint(assumeLogo);
    textBoxPoint.xLeft += controller.unitWidth;
    textBoxPoint.yTop += controller.unitHeight * FlatSurvey.PANEL_CONT_GAP_SCALE;
    const assumeTextBox: IRect = SurveyHelper.createTextFieldRect(textBoxPoint, controller);
    TestHelper.equalRect(expect, flats[0][2], assumeTextBox);
});
test('Survey with left logo and big title', async () => {
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
    expect(flats[0].length).toBe(3);
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
    const textBoxPoint: IPoint = SurveyHelper.createPoint(assumeTitle);
    textBoxPoint.xLeft = controller.leftTopPoint.xLeft + controller.unitWidth;
    textBoxPoint.yTop += controller.unitHeight * FlatSurvey.PANEL_CONT_GAP_SCALE;
    const assumeTextBox: IRect = SurveyHelper.createTextFieldRect(textBoxPoint, controller);
    TestHelper.equalRect(expect, flats[0][2], assumeTextBox);
});
test('Survey with right logo and title', async () => {
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
    expect(flats[0].length).toBe(3);
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
    const textBoxPoint: IPoint = SurveyHelper.createPoint(assumeLogo);
    textBoxPoint.xLeft = controller.leftTopPoint.xLeft + controller.unitWidth;
    textBoxPoint.yTop += controller.unitHeight * FlatSurvey.PANEL_CONT_GAP_SCALE;
    const assumeTextBox: IRect = SurveyHelper.createTextFieldRect(textBoxPoint, controller);
    TestHelper.equalRect(expect, flats[0][2], assumeTextBox);
});
test('Survey with bottom logo and title', async () => {
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
    expect(flats[0].length).toBe(2);
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
});
test('Survey with botton logo without title', async () => {
    const json: any = {
        logo: TestHelper.BASE64_IMAGE_16PX,
        logoPosition: 'bottom',
        pages: []
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
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
});