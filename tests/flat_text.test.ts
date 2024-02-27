(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import * as Survey from 'survey-core';
import { SurveyPDF } from '../src/survey';
import { IPoint, IRect, IDocOptions, DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatTextbox } from '../src/flat_layout/flat_textbox';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
import { QuestionTextModel } from 'survey-core';
const __dummy_tb = new FlatTextbox(null, null, null);

test('Check readonly text', async () => {
    const json: any = {
        questions: [
            {
                type: 'text',
                name: 'text_readonly',
                readOnly: true,
                titleLocation: 'hidden'
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const question = survey.getAllQuestions()[0];
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    const textPoint: IPoint = controller.leftTopPoint;
    textPoint.xLeft += controller.unitWidth;
    const assumeText: IRect = await SurveyHelper.createCommentFlat(textPoint, question, controller, true);
    TestHelper.equalRect(expect, flats[0][0], assumeText);
});

test('Check readonly text expends when textRenderAs option set', async () => {
    const json: any = {
        questions: [
            {
                type: 'text',
                name: 'text_textrenderasset',
                readOnly: true,
                titleLocation: 'hidden',
                defaultValue: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ' +
                    'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s'
            }
        ]
    };
    const options: IDocOptions = TestHelper.defaultOptions;
    const survey: SurveyPDF = new SurveyPDF(json, options);
    const controller: DocController = new DocController(options);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    const question = survey.getAllQuestions()[0];
    const textPoint: IPoint = controller.leftTopPoint;
    textPoint.xLeft += controller.unitWidth;
    const assumeBrick: IPdfBrick = await SurveyHelper.createCommentFlat(textPoint, question, controller, true);
    TestHelper.equalRect(expect, flats[0][0], assumeBrick);
});
class SurveyPDFTester extends SurveyPDF {
    public get haveCommercialLicense(): boolean { return true; }
}
test('Check readonly text with readOnlyTextRenderMode set to div', async () => {
    const oldRenderMode = Survey.settings.readOnlyTextRenderMode;
    Survey.settings.readOnlyTextRenderMode = 'div';
    try {
        const json: any = {
            questions: [
                {
                    type: 'text',
                    name: 'text_readonly',
                    readOnly: true,
                    titleLocation: 'hidden'
                }
            ]
        };
        const survey: SurveyPDF = new SurveyPDFTester(json, TestHelper.defaultOptions);
        const pdfAsString = await survey.raw();
        // Stream in result PDF document should be small - in this example 14
        expect(pdfAsString.indexOf('/Length 14\n') > 0).toBeTruthy();

    } finally {
        Survey.settings.readOnlyTextRenderMode = oldRenderMode;
    }
});

test('Check shouldRenderAsComment flag for text flat', async () => {
    const question = new QuestionTextModel('');
    const controller = new DocController({});
    const flat = new FlatTextbox(<any>undefined, question, controller);
    expect(flat['shouldRenderAsComment']).toBeFalsy();
    question.readOnly = true;
    expect(flat['shouldRenderAsComment']).toBeTruthy();
    question.readonlyRenderAs = 'acroform';
    expect(flat['shouldRenderAsComment']).toBeFalsy();
});