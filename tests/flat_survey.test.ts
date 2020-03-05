(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { SurveyPDF } from '../src/survey';
import { IRect, IPoint, DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatTextbox } from '../src/flat_layout/flat_textbox';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
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