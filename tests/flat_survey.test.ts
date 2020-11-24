(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { SurveyPDF } from '../src/survey';
import { IPoint, IRect, DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatTextbox } from '../src/flat_layout/flat_textbox';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { HTMLBrick } from '../src/entries/pdf';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
let __dummy_tx = new FlatTextbox(null, null, null);

test('Survey with title', async () => {
    let json: any = {
        title: 'One small step for man',
        elements: [
            {
                type: 'text',
                name: 'MissText',
                titleLocation: 'hidden'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    let assumeTitle: IRect = await SurveyHelper.createTitleSurveyFlat(
        controller.leftTopPoint, controller, json.title);
    TestHelper.equalRect(expect, flats[0][0], assumeTitle);
    let textBoxPoint: IPoint = SurveyHelper.createPoint(assumeTitle);
    textBoxPoint.yTop += controller.unitHeight * FlatSurvey.PANEL_CONT_GAP_SCALE;
    textBoxPoint.xLeft += controller.unitWidth;
    let assumeTextBox: IRect = SurveyHelper.createTextFieldRect(textBoxPoint, controller);
    TestHelper.equalRect(expect, flats[0][1], assumeTextBox);    
});
test('Survey with description', async () => {
    let json: any = {
        description: 'One giant leap for mankind',
        elements: [
            {
                type: 'text',
                name: 'MissText',
                titleLocation: 'hidden'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    let assumeDescription: IRect = await SurveyHelper.createDescFlat(
        controller.leftTopPoint, null, controller, json.description);
    TestHelper.equalRect(expect, flats[0][0], assumeDescription);
    let textBoxPoint: IPoint = SurveyHelper.createPoint(assumeDescription);
    textBoxPoint.yTop += controller.unitHeight * FlatSurvey.PANEL_CONT_GAP_SCALE;
    textBoxPoint.xLeft += controller.unitWidth;
    let assumeTextBox: IRect = SurveyHelper.createTextFieldRect(textBoxPoint, controller);
    TestHelper.equalRect(expect, flats[0][1], assumeTextBox);    
});
test('Survey with title and description', async () => {
    let json: any = {
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
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    let assumeTitle: IRect = await SurveyHelper.createTitleSurveyFlat(
        controller.leftTopPoint, controller, json.title);
    let descriptionPoint: IPoint = SurveyHelper.createPoint(assumeTitle);
    descriptionPoint.yTop += controller.unitHeight * FlatSurvey.PANEL_DESC_GAP_SCALE;
    let assumeDescription: IRect = await SurveyHelper.createDescFlat(
        descriptionPoint, null, controller, json.description);
    TestHelper.equalRect(expect, flats[0][0], SurveyHelper.mergeRects(assumeTitle, assumeDescription));
    let textBoxPoint: IPoint = SurveyHelper.createPoint(assumeDescription);
    textBoxPoint.yTop += controller.unitHeight * FlatSurvey.PANEL_CONT_GAP_SCALE;
    textBoxPoint.xLeft += controller.unitWidth;
    let assumeTextBox: IRect = SurveyHelper.createTextFieldRect(textBoxPoint, controller);
    TestHelper.equalRect(expect, flats[0][1], assumeTextBox);    
});
test('Survey with logo', async () => {
    let json: any = {
        logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAAt1BMVEVHcExTXGROYmJIT1ZPXmVJV11ES1JYZ24+SE5JU1s+R0xVYmtYZW1ETlRRXWVUYWpKV1xZZ25YZW5YanNrfIdTYWlaZ29nd4JUYmhIU1lHUVtRXWQ+SlA6QkouNzpFT1ZCS1JSXWVxhI98kp53iZZSXmVcaXE5QkdCTFNndn9WY2tZZm5canJfbXVbZ29hcHlXZGxtfYVNWmFRXWVCTFNKVl04QEdoeINnZGxrc3uAk6Fzb3dxg43scHiMAAAAKnRSTlMALwQXZU4MImyJQbCrPOPZRdOHx4X4t2fR0SfsoHhYseyioqbHwOy+59gMe1UiAAAAuElEQVQYlU2P5xKCQAyEI1gABVSKUu3tOgL2938u74Ybx/2xk3yT2SQAPw2Yb8KfRp6VzAxVDDVwYej1ZbHbG9tQTy030sJP+1po4MfSZs+qsrp+KubSg8e7Wq8mk/E44LinwqJr22IskCA4UgBiUqueUUqJ2gLzO0MCC8Ypx1MFXEIEqhFGjB/0zTXNbPvcXOkx7YjFbYDydsq7DIAeKyS9mSYadGBR51A0JVwy/dcyScFxwLAdgC+IFhIbrHyDqAAAAABJRU5ErkJggg==',
        pages: []
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    expect(flats[0][0] instanceof HTMLBrick);
    let assumeLogo: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + SurveyHelper.pxToPt(survey.logoWidth),
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + SurveyHelper.pxToPt(survey.logoHeight)
    };
    TestHelper.equalRect(expect, flats[0][0], assumeLogo);  
});
test('Survey with left logo and title', async () => {
    let json: any = {
        title: 'TitleLogoLeft',
        logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAAt1BMVEVHcExTXGROYmJIT1ZPXmVJV11ES1JYZ24+SE5JU1s+R0xVYmtYZW1ETlRRXWVUYWpKV1xZZ25YZW5YanNrfIdTYWlaZ29nd4JUYmhIU1lHUVtRXWQ+SlA6QkouNzpFT1ZCS1JSXWVxhI98kp53iZZSXmVcaXE5QkdCTFNndn9WY2tZZm5canJfbXVbZ29hcHlXZGxtfYVNWmFRXWVCTFNKVl04QEdoeINnZGxrc3uAk6Fzb3dxg43scHiMAAAAKnRSTlMALwQXZU4MImyJQbCrPOPZRdOHx4X4t2fR0SfsoHhYseyioqbHwOy+59gMe1UiAAAAuElEQVQYlU2P5xKCQAyEI1gABVSKUu3tOgL2938u74Ybx/2xk3yT2SQAPw2Yb8KfRp6VzAxVDDVwYej1ZbHbG9tQTy030sJP+1po4MfSZs+qsrp+KubSg8e7Wq8mk/E44LinwqJr22IskCA4UgBiUqueUUqJ2gLzO0MCC8Ypx1MFXEIEqhFGjB/0zTXNbPvcXOkx7YjFbYDydsq7DIAeKyS9mSYadGBR51A0JVwy/dcyScFxwLAdgC+IFhIbrHyDqAAAAABJRU5ErkJggg==',
        logoPosition: 'left',
        questions: [
            {
               type: 'text',
               name: 'logoleft',
               titleLocation: 'hidden'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(3);
    expect(flats[0][0] instanceof HTMLBrick);
    let assumeLogo: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + SurveyHelper.pxToPt(survey.logoWidth),
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + SurveyHelper.pxToPt(survey.logoHeight)
    };
    TestHelper.equalRect(expect, flats[0][0], assumeLogo);
    let titlePoint: IPoint = SurveyHelper.createPoint(assumeLogo, false, true);
    titlePoint.xLeft += controller.unitWidth;
    let assumeTitle: IRect = await SurveyHelper.createTitleSurveyFlat(
        titlePoint, controller, json.title);
    TestHelper.equalRect(expect, flats[0][1], assumeTitle);
    let textBoxPoint: IPoint = SurveyHelper.createPoint(assumeLogo);
    textBoxPoint.xLeft += controller.unitWidth;
    textBoxPoint.yTop += controller.unitHeight * FlatSurvey.PANEL_CONT_GAP_SCALE;
    let assumeTextBox: IRect = SurveyHelper.createTextFieldRect(textBoxPoint, controller);
    TestHelper.equalRect(expect, flats[0][2], assumeTextBox);
});
test('Survey with left logo and big title', async () => {
    let json: any = {
        title: 'TitleLogoLeftBiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiig',
        logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAAt1BMVEVHcExTXGROYmJIT1ZPXmVJV11ES1JYZ24+SE5JU1s+R0xVYmtYZW1ETlRRXWVUYWpKV1xZZ25YZW5YanNrfIdTYWlaZ29nd4JUYmhIU1lHUVtRXWQ+SlA6QkouNzpFT1ZCS1JSXWVxhI98kp53iZZSXmVcaXE5QkdCTFNndn9WY2tZZm5canJfbXVbZ29hcHlXZGxtfYVNWmFRXWVCTFNKVl04QEdoeINnZGxrc3uAk6Fzb3dxg43scHiMAAAAKnRSTlMALwQXZU4MImyJQbCrPOPZRdOHx4X4t2fR0SfsoHhYseyioqbHwOy+59gMe1UiAAAAuElEQVQYlU2P5xKCQAyEI1gABVSKUu3tOgL2938u74Ybx/2xk3yT2SQAPw2Yb8KfRp6VzAxVDDVwYej1ZbHbG9tQTy030sJP+1po4MfSZs+qsrp+KubSg8e7Wq8mk/E44LinwqJr22IskCA4UgBiUqueUUqJ2gLzO0MCC8Ypx1MFXEIEqhFGjB/0zTXNbPvcXOkx7YjFbYDydsq7DIAeKyS9mSYadGBR51A0JVwy/dcyScFxwLAdgC+IFhIbrHyDqAAAAABJRU5ErkJggg==',
        logoPosition: 'left',
        questions: [
            {
               type: 'text',
               name: 'logoleftbig',
               titleLocation: 'hidden'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(3);
    expect(flats[0][0] instanceof HTMLBrick);
    let assumeLogo: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + SurveyHelper.pxToPt(survey.logoWidth),
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + SurveyHelper.pxToPt(survey.logoHeight)
    };
    TestHelper.equalRect(expect, flats[0][0], assumeLogo);
    let titlePoint: IPoint = SurveyHelper.createPoint(assumeLogo, false, true);
    titlePoint.xLeft += controller.unitWidth;
    let assumeTitle: IRect = await SurveyHelper.createTitleSurveyFlat(
        titlePoint, controller, json.title);
    TestHelper.equalRect(expect, flats[0][1], assumeTitle);
    let textBoxPoint: IPoint = SurveyHelper.createPoint(assumeTitle);
    textBoxPoint.xLeft = controller.leftTopPoint.xLeft + controller.unitWidth;
    textBoxPoint.yTop += controller.unitHeight * FlatSurvey.PANEL_CONT_GAP_SCALE;
    let assumeTextBox: IRect = SurveyHelper.createTextFieldRect(textBoxPoint, controller);
    TestHelper.equalRect(expect, flats[0][2], assumeTextBox);
});
test('Survey with right logo and title', async () => {
    let json: any = {
        title: 'TitleRight',
        logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAAt1BMVEVHcExTXGROYmJIT1ZPXmVJV11ES1JYZ24+SE5JU1s+R0xVYmtYZW1ETlRRXWVUYWpKV1xZZ25YZW5YanNrfIdTYWlaZ29nd4JUYmhIU1lHUVtRXWQ+SlA6QkouNzpFT1ZCS1JSXWVxhI98kp53iZZSXmVcaXE5QkdCTFNndn9WY2tZZm5canJfbXVbZ29hcHlXZGxtfYVNWmFRXWVCTFNKVl04QEdoeINnZGxrc3uAk6Fzb3dxg43scHiMAAAAKnRSTlMALwQXZU4MImyJQbCrPOPZRdOHx4X4t2fR0SfsoHhYseyioqbHwOy+59gMe1UiAAAAuElEQVQYlU2P5xKCQAyEI1gABVSKUu3tOgL2938u74Ybx/2xk3yT2SQAPw2Yb8KfRp6VzAxVDDVwYej1ZbHbG9tQTy030sJP+1po4MfSZs+qsrp+KubSg8e7Wq8mk/E44LinwqJr22IskCA4UgBiUqueUUqJ2gLzO0MCC8Ypx1MFXEIEqhFGjB/0zTXNbPvcXOkx7YjFbYDydsq7DIAeKyS9mSYadGBR51A0JVwy/dcyScFxwLAdgC+IFhIbrHyDqAAAAABJRU5ErkJggg==',
        logoPosition: 'right',
        questions: [
            {
               type: 'text',
               name: 'logoright',
               titleLocation: 'hidden'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(3);
    let assumeTitle: IRect = await SurveyHelper.createTitleSurveyFlat(
        controller.leftTopPoint, controller, json.title);
    TestHelper.equalRect(expect, flats[0][0], assumeTitle);
    expect(flats[0][1] instanceof HTMLBrick);
    let assumeLogo: IRect = {
        xLeft: controller.paperWidth - controller.margins.right -
            SurveyHelper.pxToPt(survey.logoWidth),
        xRight: controller.paperWidth - controller.margins.right,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + SurveyHelper.pxToPt(survey.logoHeight)
    };
    TestHelper.equalRect(expect, flats[0][1], assumeLogo);
    let textBoxPoint: IPoint = SurveyHelper.createPoint(assumeLogo);
    textBoxPoint.xLeft = controller.leftTopPoint.xLeft + controller.unitWidth;
    textBoxPoint.yTop += controller.unitHeight * FlatSurvey.PANEL_CONT_GAP_SCALE;
    let assumeTextBox: IRect = SurveyHelper.createTextFieldRect(textBoxPoint, controller);
    TestHelper.equalRect(expect, flats[0][2], assumeTextBox);
});
test('Survey with bottom logo and title', async () => {
    let json: any = {
        title: 'TitleLogoBottom',
        logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAAt1BMVEVHcExTXGROYmJIT1ZPXmVJV11ES1JYZ24+SE5JU1s+R0xVYmtYZW1ETlRRXWVUYWpKV1xZZ25YZW5YanNrfIdTYWlaZ29nd4JUYmhIU1lHUVtRXWQ+SlA6QkouNzpFT1ZCS1JSXWVxhI98kp53iZZSXmVcaXE5QkdCTFNndn9WY2tZZm5canJfbXVbZ29hcHlXZGxtfYVNWmFRXWVCTFNKVl04QEdoeINnZGxrc3uAk6Fzb3dxg43scHiMAAAAKnRSTlMALwQXZU4MImyJQbCrPOPZRdOHx4X4t2fR0SfsoHhYseyioqbHwOy+59gMe1UiAAAAuElEQVQYlU2P5xKCQAyEI1gABVSKUu3tOgL2938u74Ybx/2xk3yT2SQAPw2Yb8KfRp6VzAxVDDVwYej1ZbHbG9tQTy030sJP+1po4MfSZs+qsrp+KubSg8e7Wq8mk/E44LinwqJr22IskCA4UgBiUqueUUqJ2gLzO0MCC8Ypx1MFXEIEqhFGjB/0zTXNbPvcXOkx7YjFbYDydsq7DIAeKyS9mSYadGBR51A0JVwy/dcyScFxwLAdgC+IFhIbrHyDqAAAAABJRU5ErkJggg==',
        logoPosition: 'bottom',
        pages: []
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    let assumeTitle: IRect = await SurveyHelper.createTitleSurveyFlat(
        controller.leftTopPoint, controller, json.title);
    TestHelper.equalRect(expect, flats[0][0], assumeTitle);
    expect(flats[0][1] instanceof HTMLBrick);
    let assumeLogo: IRect = {
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
    let json: any = {
        logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAAt1BMVEVHcExTXGROYmJIT1ZPXmVJV11ES1JYZ24+SE5JU1s+R0xVYmtYZW1ETlRRXWVUYWpKV1xZZ25YZW5YanNrfIdTYWlaZ29nd4JUYmhIU1lHUVtRXWQ+SlA6QkouNzpFT1ZCS1JSXWVxhI98kp53iZZSXmVcaXE5QkdCTFNndn9WY2tZZm5canJfbXVbZ29hcHlXZGxtfYVNWmFRXWVCTFNKVl04QEdoeINnZGxrc3uAk6Fzb3dxg43scHiMAAAAKnRSTlMALwQXZU4MImyJQbCrPOPZRdOHx4X4t2fR0SfsoHhYseyioqbHwOy+59gMe1UiAAAAuElEQVQYlU2P5xKCQAyEI1gABVSKUu3tOgL2938u74Ybx/2xk3yT2SQAPw2Yb8KfRp6VzAxVDDVwYej1ZbHbG9tQTy030sJP+1po4MfSZs+qsrp+KubSg8e7Wq8mk/E44LinwqJr22IskCA4UgBiUqueUUqJ2gLzO0MCC8Ypx1MFXEIEqhFGjB/0zTXNbPvcXOkx7YjFbYDydsq7DIAeKyS9mSYadGBR51A0JVwy/dcyScFxwLAdgC+IFhIbrHyDqAAAAABJRU5ErkJggg==',
        logoPosition: 'bottom',
        pages: []
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    expect(flats[0][0] instanceof HTMLBrick);
    let assumeLogo: IRect = {
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