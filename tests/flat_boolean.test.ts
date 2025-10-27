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