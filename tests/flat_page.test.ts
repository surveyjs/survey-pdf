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

test('Check no invisible page', async () => {
    let json: any = {
        pages: [
            {
                name: 'VisiblePage',
                elements: [
                    {
                        type: 'text',
                        name: 'VisibleQuestion'
                    }
                ]
            },
            {
                name: 'InvisiblePage',
                elements: [
                    {
                        type: 'text',
                        name: 'InvisibleQuestion'
                    }
                ],
                visibleIf: 'false'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
});
test('Page with title', async () => {
    let json: any = {
        pages: [
            {
                name: 'namedpage',
                elements: [
                    {
                        type: 'text',
                        name: 'HiddenText',
                        titleLocation: 'hidden'
                    }
                ],
                title: 'So Page'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    let assumeTitle: IRect = await SurveyHelper.createTitlePanelFlat(
        controller.leftTopPoint, controller, json.pages[0].title, true);
    TestHelper.equalRect(expect, flats[0][0].unfold()[0], assumeTitle);
    const rowLinePoint: IPoint = SurveyHelper.createPoint(assumeTitle);
    const assumeRowLine: IRect = SurveyHelper.createRowlineFlat(rowLinePoint, controller);
    TestHelper.equalRect(expect, flats[0][0].unfold()[1], assumeRowLine);
    const textBoxPoint: IPoint = rowLinePoint;
    textBoxPoint.yTop += controller.unitHeight * FlatSurvey.PANEL_CONT_GAP_SCALE + SurveyHelper.EPSILON;
    textBoxPoint.xLeft += controller.unitWidth;
    const assumeTextBox: IRect = SurveyHelper.createTextFieldRect(textBoxPoint, controller);
    TestHelper.equalRect(expect, flats[0][1], assumeTextBox);
});
test('Page with description', async () => {
    let json: any = {
        pages: [
            {
                name: 'describedpage',
                elements: [
                    {
                        type: 'text',
                        name: 'HiddenText',
                        titleLocation: 'hidden'
                    }
                ],
                description: 'So few words'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    let assumeDescription: IRect = await SurveyHelper.createDescFlat(
        controller.leftTopPoint, null, controller, json.pages[0].description);
    TestHelper.equalRect(expect, flats[0][0].unfold()[0], assumeDescription);
    const rowLinePoint: IPoint = SurveyHelper.createPoint(assumeDescription);
    const assumeRowLine: IRect = SurveyHelper.createRowlineFlat(rowLinePoint, controller);
    TestHelper.equalRect(expect, flats[0][0].unfold()[1], assumeRowLine);
    const textBoxPoint: IPoint = rowLinePoint;
    textBoxPoint.yTop += controller.unitHeight * FlatSurvey.PANEL_CONT_GAP_SCALE + SurveyHelper.EPSILON;
    textBoxPoint.xLeft += controller.unitWidth;
    const assumeTextBox: IRect = SurveyHelper.createTextFieldRect(textBoxPoint, controller);
    TestHelper.equalRect(expect, flats[0][1], assumeTextBox);
});
test('Page with title and description', async () => {
    let json: any = {
        pages: [
            {
                name: 'songedpage',
                elements: [
                    {
                        type: 'text',
                        name: 'HiddenText',
                        titleLocation: 'hidden'
                    }
                ],
                title: 'The sun rises',
                description: 'Over the Huanghe river'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    let assumeTitle: IRect = await SurveyHelper.createTitlePanelFlat(
        controller.leftTopPoint, controller, json.pages[0].title, true);
    let descriptionPoint: IPoint = SurveyHelper.createPoint(assumeTitle);
    descriptionPoint.yTop += controller.unitHeight * FlatSurvey.PANEL_DESC_GAP_SCALE;
    let assumeDescription: IRect = await SurveyHelper.createDescFlat(
        descriptionPoint, null, controller, json.pages[0].description);
    const titleUnfoldFlats: IPdfBrick[] = flats[0][0].unfold();
    const actualTitleWithDescription: IRect = SurveyHelper.mergeRects(titleUnfoldFlats[0], titleUnfoldFlats[1]);
    const assumeTitleWithDescription: IRect = SurveyHelper.mergeRects(assumeTitle, assumeDescription);
    TestHelper.equalRect(expect, actualTitleWithDescription, assumeTitleWithDescription);
    const actualRowLine: IRect = titleUnfoldFlats[2];
    const rowLinePoint: IPoint = SurveyHelper.createPoint(assumeTitleWithDescription);
    const assumeRowLine: IRect = SurveyHelper.createRowlineFlat(rowLinePoint, controller);
    TestHelper.equalRect(expect, actualRowLine, assumeRowLine);
    const textBoxPoint: IPoint = rowLinePoint;
    textBoxPoint.yTop += controller.unitHeight * FlatSurvey.PANEL_CONT_GAP_SCALE + SurveyHelper.EPSILON;
    textBoxPoint.xLeft += controller.unitWidth;
    const assumeTextBox: IRect = SurveyHelper.createTextFieldRect(textBoxPoint, controller);
    TestHelper.equalRect(expect, flats[0][1], assumeTextBox);
});