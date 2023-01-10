(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { SurveyPDF } from '../src/survey';
import { DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatBooleanCheckbox, FlatBoolean } from '../src/flat_layout/flat_boolean';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { TextBrick } from '../src/pdf_render/pdf_text';
import { BooleanItemBrick } from '../src/pdf_render/pdf_booleanitem';
import { SurveyHelper } from '../src/helper_survey';
import { Model, QuestionBooleanModel } from 'survey-core';
let __dummy_bl = new FlatBooleanCheckbox(null, null, null);

test('Check boolean undefined', async () => {
    let json: any = {
        questions: [
            {
                type: 'boolean',
                name: 'bool_undefined',
                titleLocation: 'hidden',
                labelTrue: 'Y',
                labelFalse: 'N'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, { useLegacyBooleanRendering: true });
    let controller: DocController = new DocController({ useLegacyBooleanRendering: true });
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let unfoldFlats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldFlats.length).toBe(1);
    expect(unfoldFlats[0] instanceof BooleanItemBrick);
});
test('Check boolean true', async () => {
    let json: any = {
        questions: [
            {
                type: 'boolean',
                name: 'bool_undefined',
                titleLocation: 'hidden',
                labelTrue: 'Y',
                labelFalse: 'N',
                defaultValue: true
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, { useLegacyBooleanRendering: true });
    let controller: DocController = new DocController({ useLegacyBooleanRendering: true });
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let unfoldFlats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldFlats.length).toBe(2);
    expect(unfoldFlats[0] instanceof BooleanItemBrick);
    expect(unfoldFlats[1] instanceof TextBrick);
    expect(unfoldFlats[1].xLeft).toBe(unfoldFlats[0].xRight +
        controller.unitWidth * SurveyHelper.GAP_BETWEEN_ITEM_TEXT);
    expect((<TextBrick>unfoldFlats[1])['text']).toBe(json.questions[0].labelTrue);
});
test('Check boolean false', async () => {
    let json: any = {
        questions: [
            {
                type: 'boolean',
                name: 'bool_undefined',
                titleLocation: 'hidden',
                labelTrue: 'Y',
                labelFalse: 'N',
                defaultValue: false
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, { useLegacyBooleanRendering: true });
    let controller: DocController = new DocController({ useLegacyBooleanRendering: true });
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let unfoldFlats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldFlats.length).toBe(2);
    expect(unfoldFlats[0] instanceof BooleanItemBrick);
    expect(unfoldFlats[1] instanceof TextBrick);
    expect(unfoldFlats[1].xLeft).toBe(unfoldFlats[0].xRight +
        controller.unitWidth * SurveyHelper.GAP_BETWEEN_ITEM_TEXT);
    expect((<TextBrick>unfoldFlats[1])['text']).toBe(json.questions[0].labelFalse);
});

test('Check boolean renderAs: radiogroup question', async () => {
    const question = new QuestionBooleanModel('q1');
    question.title = 'q1_title';
    question.description = 'q1_description';
    question.valueFalse = 'q1_value_false';
    question.labelTrue = 'q1_label_true';
    question.labelFalse = 'q1_label_false';
    question.value = true;
    let flat = new FlatBoolean(null, question, null);
    expect(flat['question'].title).toEqual('q1_title');
    expect(flat['question'].description).toEqual('q1_description');
    expect(flat['question'].value).toEqual(true);
    expect((<any>flat).getVisibleChoices()[0].value).toEqual('q1_value_false');
    expect((<any>flat).getVisibleChoices()[1].value).toEqual(true);
    expect((<any>flat).getVisibleChoices()[0].locText.text).toEqual('q1_label_false');
    expect((<any>flat).getVisibleChoices()[1].locText.text).toEqual('q1_label_true');
    expect((<any>flat).isItemSelected((<any>flat).getVisibleChoices()[1])).toEqual(true);

    question.valueTrue = 'q1_value_true';
    question.value = 'q1_value_true';
    flat = new FlatBoolean(null, question, null);
    expect(flat['question'].value).toEqual('q1_value_true');
    expect((<any>flat).getVisibleChoices()[1].value).toEqual('q1_value_true');
    expect((<any>flat).isItemSelected((<any>flat).getVisibleChoices()[1])).toEqual(true);
});

test('Check boolean renderAs: radiogroup default Yes/No labels', async () => {
    const question = new QuestionBooleanModel('q1');
    let flat = new FlatBoolean(null, question, null);
    expect((<any>flat).getVisibleChoices()[0].text).toBe('No');
    expect((<any>flat).getVisibleChoices()[1].text).toBe('Yes');
});

test('Check boolean renderAs: radiogroup locales', async () => {
    const question = new QuestionBooleanModel('q1');
    question.fromJSON({
        title: {
            'en': 'Title_en',
            'fr': 'Title_fr',
        },
        description: {
            'en': 'Description_en',
            'fr': 'Description_fr',
        },
        labelTrue: {
            'en': 'yes',
            'fr': 'oui'
        }
    });
    let flat = new FlatBoolean(null, question, null);
    expect((<any>flat).getVisibleChoices()[1].text).toBe('yes');
    expect(flat['question'].title).toBe('Title_en');
    expect(flat['question'].description).toBe('Description_en');
    question.setSurveyImpl(new SurveyPDF({
        locale: 'fr'
    }));
    flat = new FlatBoolean(null, question, null);
    expect(flat['question'].title).toBe('Title_fr');
    expect(flat['question'].description).toBe('Description_fr');
    expect((<any>flat).getVisibleChoices()[1].text).toBe('oui');
});
test('Check boolean renderAs: radiogroup question number', async () => {
    const survey = new Model({
        elements: [
            {
                type: 'boolean',
                name: 'q1'
            },
            {
                type: 'boolean',
                name: 'q2'
            }
        ]
    });
    let flat = new FlatBoolean(null, survey.getQuestionByName('q1'), null);
    let flat2 = new FlatBoolean(null, survey.getQuestionByName('q2'), null);
    expect(flat['question'].no).toBe('1.');
    expect(flat2['question'].no).toBe('2.');
});

test('Check boolean with display mode', async () => {
    const question = new QuestionBooleanModel('q1');
    question.fromJSON({
        labelTrue: {
            'en': 'yes',
            'fr': 'oui'
        }
    });
    let survey = new SurveyPDF({});
    survey.mode = 'display';
    question.setSurveyImpl(survey);
    let flat = new FlatBoolean(null, question, null);
    expect(flat['question'].isInputReadOnly).toBe(true);
});