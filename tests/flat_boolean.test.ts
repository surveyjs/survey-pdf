(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { SurveyPDF } from '../src/survey';
import { FlatBoolean } from '../src/flat_layout/flat_boolean';
import { Model, QuestionBooleanModel } from 'survey-core';
import '../src/flat_layout/flat_boolean';
import { checkFlatSnapshot } from './snapshot_helper';

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
    await checkFlatSnapshot(json, {
        snapshotName: 'boolean_legacy_undefined',
        controllerOptions: {
            useLegacyBooleanRendering: true
        }
    });
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
    await checkFlatSnapshot(json, {
        snapshotName: 'boolean_legacy_true',
        controllerOptions: {
            useLegacyBooleanRendering: true
        }
    });
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
    await checkFlatSnapshot(json, {
        snapshotName: 'boolean_legacy_false',
        controllerOptions: {
            useLegacyBooleanRendering: true
        }
    });
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
    flat = new FlatBoolean(null, question, null, {});
    expect(flat['question'].value).toEqual('q1_value_true');
    expect((<any>flat).getVisibleChoices()[1].value).toEqual('q1_value_true');
    expect((<any>flat).isItemSelected((<any>flat).getVisibleChoices()[1])).toEqual(true);
});

test('Check boolean renderAs: radiogroup default Yes/No labels', async () => {
    const question = new QuestionBooleanModel('q1');
    let flat = new FlatBoolean(null, question, null, {});
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
    let flat = new FlatBoolean(null, question, null, {});
    expect((<any>flat).getVisibleChoices()[1].text).toBe('yes');
    expect(flat['question'].title).toBe('Title_en');
    expect(flat['question'].description).toBe('Description_en');
    question.setSurveyImpl(new SurveyPDF({
        locale: 'fr'
    }));
    flat = new FlatBoolean(null, question, null, {});
    expect(flat['question'].title).toBe('Title_fr');
    expect(flat['question'].description).toBe('Description_fr');
    expect((<any>flat).getVisibleChoices()[1].text).toBe('oui');
});
test('Check boolean renderAs: radiogroup question number', async () => {
    const survey = new Model({
        showQuestionNumbers: 'on',
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
    let flat = new FlatBoolean(null, survey.getQuestionByName('q1'), null, {});
    let flat2 = new FlatBoolean(null, survey.getQuestionByName('q2'), null, {});
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
    let flat = new FlatBoolean(null, question, null, {});
    expect(flat['question'].isInputReadOnly).toBe(true);
});