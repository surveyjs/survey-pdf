(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
    return {};
};

import { Question } from 'survey-core';
import { SurveyPDF } from '../src/survey';
import { DocController, IDocOptions } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatTextbox } from '../src/flat_layout/flat_textbox';
import { FlatCheckbox } from '../src/flat_layout/flat_checkbox';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { TestHelper } from '../src/helper_test';
let __dummy_tx = new FlatTextbox(null, null, null);
let __dummy_cb = new FlatCheckbox(null, null, null);

async function checkTitleText(questionStartIndex: string, isRequired: boolean = false) {
    let json: any = {
        showQuestionNumbers: questionStartIndex !== null ? 'on' : 'off',
        questions: [
            {
                name: 'textbox_checktitle',
                type: 'text',
                title: 'Check my title',
                isRequired: isRequired
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    if (questionStartIndex !== null) {
        survey.questionStartIndex = questionStartIndex;
    }
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    await survey['renderSurvey'](controller);
    let content: string = '';
    let regex: RegExp = /\((.*)\)/;
    let internalContent: string = controller.doc.internal.pages[1][2];
    expect(internalContent).toBeDefined();
    content += internalContent.match(regex)[1];
    if (questionStartIndex !== null || isRequired) {
        internalContent = controller.doc.internal.pages[1][3];
        expect(internalContent).toBeDefined();
        content += internalContent.match(regex)[1];
    }
    expect(content).toBe(TestHelper.getTitleText(<Question>survey.getAllQuestions()[0]));
}
test('Check title without number', async () => {
    await checkTitleText(null);
});
test('Check title number with custom questionStartIndex', async () => {
    await checkTitleText('7');
});
test('Check title number with alphabetical questionStartIndex', async () => {
    await checkTitleText('A');
});
test('Check title required text', async () => {
    await checkTitleText(null, true);
});
test('Check comment', async () => {
    let json: any = {
        showQuestionNumbers: 'false',
        questions: [
            {
                titleLocation: 'hidden',
                name: 'checkbox',
                type: 'checkbox',
                hasComment: true,
                commentText: 'comment check'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    await survey['renderSurvey'](controller);
    let internal: any = controller.doc.internal;
    let internalContent: string = controller.doc.internal.pages[1][2];
    let textField: any = internal.acroformPlugin.acroFormDictionaryRoot.Fields[0];
    expect(internalContent).toBeDefined();
    let regex: RegExp = /\((.*)\)/;
    let content: string = internalContent.match(regex)[1];
    expect(content).toBe(json.questions[0].commentText);
    expect(textField.FT).toBe('/Tx');
});
test('Check comment readonly', async () => {
    let json: any = {
        questions: [
            {
                titleLocation: 'hidden',
                name: 'checkbox',
                type: 'checkbox',
                hasComment: true,
                commentText: 'comment check',
                readOnly: true
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    await survey['renderSurvey'](controller);
    let internal = controller.doc.internal;
    expect(internal.acroformPlugin).toBe(undefined);
});
test('Check comment is readonly when compress is true', async () => {
    let json: any = {
        questions: [
            {
                titleLocation: 'hidden',
                name: 'checkbox',
                type: 'checkbox',
                hasComment: true,
                commentText: 'comment check',
            }
        ]
    };
    const options: IDocOptions = {};
    for (const key in TestHelper.defaultOptions) {
        (<any>options)[key] = (<any>TestHelper.defaultOptions)[key];
    }
    options.compress = true;
    let survey: SurveyPDF = new SurveyPDF(json, options);
    let controller: DocController = new DocController(options);
    await survey['renderSurvey'](controller);
    let internal = controller.doc.internal;
    expect(internal.acroformPlugin).toBe(undefined);
});
test('Check empty question', async () => {
    let json: any = {
        questions: [
            {
                titleLocation: 'hidden',
                name: 'checkbox',
                type: 'checkbox',
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(typeof flats[0]).not.toBe('undefined');
    expect(flats[0].length).toBe(0);
});
test('Not visible question', async () => {
    let json: any = {
        questions: [
            {
                type: 'checkbox',
                name: 'box',
                visible: false
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(0);
});
test('Check descrition with hidden title', async () => {
    let json: any = {
        showQuestionNumbers: 'false',
        questions: [
            {
                titleLocation: 'top',
                name: 'checkbox',
                type: 'checkbox',
                description: 'test description',
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    await survey['renderSurvey'](controller);
    let internalContent: string = controller.doc.internal.pages[1][3];
    expect(internalContent).toBeDefined();
    let regex: RegExp = /\((.*)\)/;
    let content: string = internalContent.match(regex)[1];
    expect(content).toBe(json.questions[0].description);
});
test('Two pages', async () => {
    let json: any = {
        showQuestionNumbers: 'false',
        pages: [
            {
                name: 'First Page',
                elements: [
                    {
                        type: 'text',
                        name: 'Enter me'
                    }
                ]
            },
            {
                name: 'Second Page',
                elements: [
                    {
                        type: 'text',
                        name: 'Not, me'
                    }
                ]
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(2);
    expect(flats[0].length).toBe(1);
    expect(flats[1].length).toBe(1);
});