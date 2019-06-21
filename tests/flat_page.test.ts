(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { SurveyPDF } from '../src/survey';
import { IRect, IPoint } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatTextbox } from '../src/flat_layout/flat_textbox';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
let __dummy_tx = new FlatTextbox(null, null);

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
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
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
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    let assumeTitle: IRect = await SurveyHelper.createTitlePanelFlat(
        survey.controller.leftTopPoint, null, survey.controller, json.pages[0].title);
    TestHelper.equalRect(expect, flats[0][0], assumeTitle);
    let textBoxPoint: IPoint = SurveyHelper.createPoint(assumeTitle);
    textBoxPoint.yTop += survey.controller.unitHeight * FlatSurvey.PANEL_CONT_GAP_SCALE;
    textBoxPoint.xLeft += survey.controller.unitWidth;
    let assumeTextBox: IRect = SurveyHelper.createTextFieldRect(textBoxPoint, survey.controller);
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
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    let assumeDescription: IRect = await SurveyHelper.createDescFlat(
        survey.controller.leftTopPoint, null, survey.controller, json.pages[0].description);
    TestHelper.equalRect(expect, flats[0][0], assumeDescription);
    let textBoxPoint: IPoint = SurveyHelper.createPoint(assumeDescription);
    textBoxPoint.yTop += survey.controller.unitHeight * FlatSurvey.PANEL_CONT_GAP_SCALE;
    textBoxPoint.xLeft += survey.controller.unitWidth;
    let assumeTextBox: IRect = SurveyHelper.createTextFieldRect(textBoxPoint, survey.controller);
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
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    let assumeTitle: IRect = await SurveyHelper.createTitlePanelFlat(
        survey.controller.leftTopPoint, null, survey.controller, json.pages[0].title);
    let descriptionPoint: IPoint = SurveyHelper.createPoint(assumeTitle);
    descriptionPoint.yTop += survey.controller.unitHeight * FlatSurvey.PANEL_DESC_GAP_SCALE;
    let assumeDescription: IRect = await SurveyHelper.createDescFlat(
        descriptionPoint, null, survey.controller, json.pages[0].description);
    TestHelper.equalRect(expect, flats[0][0], SurveyHelper.mergeRects(assumeTitle, assumeDescription));
    let textBoxPoint: IPoint = SurveyHelper.createPoint(assumeDescription);
    textBoxPoint.yTop += survey.controller.unitHeight * FlatSurvey.PANEL_CONT_GAP_SCALE;
    textBoxPoint.xLeft += survey.controller.unitWidth;
    let assumeTextBox: IRect = SurveyHelper.createTextFieldRect(textBoxPoint, survey.controller);
    TestHelper.equalRect(expect, flats[0][1], assumeTextBox);    
});