(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import * as Survey from 'survey-core';
import { SurveyPDF } from '../src/survey';
import { IPoint, IDocOptions, DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatTextbox } from '../src/flat_layout/flat_textbox';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
import { QuestionTextModel } from 'survey-core';
import { TextFieldBrick } from '../src/pdf_render/pdf_textfield';
import { checkFlatSnapshot } from './snapshot_helper';
import '../src/flat_layout/flat_textbox';

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
    await checkFlatSnapshot(json, {
        snapshotName: 'text_readonly',
    });
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
    await checkFlatSnapshot(json, {
        snapshotName: 'text_readonly_big_text'
    });
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
        expect(pdfAsString.indexOf('/Length 252\n') > 0).toBeTruthy();

    } finally {
        Survey.settings.readOnlyTextRenderMode = oldRenderMode;
    }
});

test('Check shouldRenderAsComment flag for text flat', async () => {
    const question = new QuestionTextModel('');
    const controller = new DocController({});
    const flat = new FlatTextbox(<any>undefined, question, controller, {});
    expect(flat['shouldRenderAsComment']).toBeFalsy();
    question.readOnly = true;
    expect(flat['shouldRenderAsComment']).toBeTruthy();
    question.readonlyRenderAs = 'acroform';
    expect(flat['shouldRenderAsComment']).toBeFalsy();
});

test('Check text field value when mask is applied', async () => {
    let question = new QuestionTextModel('');
    const controller = new DocController({});
    question.value = 39.015;
    let brick = (await (new FlatTextbox(<any>undefined, question, controller, {})).generateFlatsContent({ xLeft: 0, yTop: 0 }))[0].unfold()[0] as TextFieldBrick;
    expect(brick['options'].value).toBe(39.015);
    question = new QuestionTextModel('');
    question.fromJSON({
        maskType: 'numeric',
        maskSettings: {
            'saveMaskedValue': true,
            'decimalSeparator': ',',
            'thousandsSeparator': '.'
        }
    });
    question.value = 39.015;
    brick = (await (new FlatTextbox(<any>undefined, question, controller, {})).generateFlatsContent({ xLeft: 0, yTop: 0 }))[0].unfold()[0] as TextFieldBrick;
    expect(brick['options'].value).toBe('39,01');

});