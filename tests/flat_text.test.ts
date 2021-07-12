(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { SurveyPDF } from '../src/survey';
import { IPoint, IRect, IDocOptions, DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatTextbox } from '../src/flat_layout/flat_textbox'
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
const __dummy_cm = new FlatTextbox(null, null, null);

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
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    const textPoint: IPoint = controller.leftTopPoint;
    textPoint.xLeft += controller.unitWidth;
    const assumeText: IRect = SurveyHelper.createTextFieldRect(textPoint, controller);
    TestHelper.equalRect(expect, flats[0][0], assumeText);
});

test('Check readonly text expends when textRenderAs option not set', async () => {
    const json: any = {
        questions: [
            {
                type: 'text',
                name: 'text_textrenderasnotset',
                readOnly: true,
                titleLocation: 'hidden',
                defaultValue: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. '  +
                    'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s'
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    const textPoint: IPoint = controller.leftTopPoint;
    textPoint.xLeft += controller.unitWidth;
    const assumeText: IRect = SurveyHelper.createTextFieldRect(textPoint, controller);
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
                defaultValue: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. '  +
                    'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s'
            }
        ]
    };
    const options: IDocOptions = TestHelper.defaultOptions;
    options.textFieldRenderAs = 'multiLine';
    const survey: SurveyPDF = new SurveyPDF(json, options);
    const controller: DocController = new DocController(options);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    const question = survey.getAllQuestions()[0];
    const textPoint: IPoint = controller.leftTopPoint;
    textPoint.xLeft += controller.unitWidth;
    const assumeBrick: IPdfBrick = await SurveyHelper.createCommentFlat(textPoint, question, controller, 1, true); 
    TestHelper.equalRect(expect, flats[0][0], assumeBrick);
});