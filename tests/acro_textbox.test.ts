(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
    return {};
};

import { SurveyPDF } from '../src/survey';
import { DocController } from '../src/doc_controller';
import { FlatTextbox } from '../src/flat_layout/flat_textbox';
import { FlatComment } from '../src/flat_layout/flat_comment';
import { TestHelper } from '../src/helper_test';
import { CommentBrick } from '../src/pdf_render/pdf_comment';
import { QuestionCommentModel, QuestionDropdownModel, QuestionTextModel } from 'survey-core';
import { settings } from 'survey-core';
let __dummy_tx = new FlatTextbox(null, null, null);
let __dummy_cm = new FlatComment(null, null, null);

async function checkTextboxValue(json: any, tobe: string,
    data: any = null, tobeDef: string = null, readOnly: boolean = false) {
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);

    if (data !== null) {
        survey.data = data;
    }
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    await survey['renderSurvey'](controller);
    if (readOnly) {
        expect(controller.doc.internal.acroformPlugin).toBe(undefined);
    }
    else {
        expect(controller.doc.internal.acroformPlugin.acroFormDictionaryRoot.Fields[0].value)
            .toBe(tobe);
        if (tobeDef != null) {
            expect(controller.doc.internal.acroformPlugin.acroFormDictionaryRoot.Fields[0].defaultValue)
                .toBe(tobeDef);
        }
        expect(controller.doc.internal.acroformPlugin.acroFormDictionaryRoot.Fields[0].readOnly)
            .toBe(readOnly);
    }
}
test('Set textbox no value', async () => {
    let json: any = {
        questions: [
            {
                name: 'textbox',
                type: 'text',
                title: 'NoValue:'
            }
        ]
    };
    await checkTextboxValue(json, ' ');
});
test('Set textbox default value', async () => {
    let json: any = {
        questions: [
            {
                name: 'textbox',
                type: 'text',
                title: 'NeedDefValue:',
                defaultValue: 'OhYes'
            }
        ]
    };
    await checkTextboxValue(json, ' ' + json.questions[0].defaultValue);
});
test('Set textbox data value', async () => {
    let json: any = {
        questions: [
            {
                name: 'textbox',
                type: 'text',
                title: 'NeedValue:'
            }
        ]
    };
    let data: any = {
        textbox: 'Spider pig'
    };
    await checkTextboxValue(json, ' ' + data.textbox, data);
});
test('Set textbox data value with default value', async () => {
    let json: any = {
        questions: [
            {
                name: 'textbox',
                type: 'text',
                title: 'NeedValue:',
                defaultValue: 'Only not me'
            }
        ]
    };
    let data: any = {
        textbox: 'Invisible black'
    };
    await checkTextboxValue(json, ' ' + data.textbox, data);
});
test('Check textbox password value is empty string', async () => {
    let json: any = {
        questions: [
            {
                name: 'pass',
                type: 'text',
                title: 'I am clean',
                inputType: 'password'
            }
        ]
    };
    await checkTextboxValue(json, '');
});
test('Check textbox password with data value is empty str', async () => {
    let json: any = {
        questions: [
            {
                name: 'pass',
                type: 'text',
                title: 'I am clean',
                inputType: 'password'
            }
        ]
    };
    let data: any = {
        pass: 'Garbage'
    };
    await checkTextboxValue(json, '', data);
});
test('Check textbox password with default value is empty str', async () => {
    let json: any = {
        questions: [
            {
                name: 'pass',
                type: 'text',
                title: 'I am clean',
                defaultValue: 'qwerty',
                inputType: 'password'
            }
        ]
    };
    await checkTextboxValue(json, '');
});
test('Check textbox password with data and default value is empty str', async () => {
    let json: any = {
        questions: [
            {
                name: 'pass',
                type: 'text',
                title: 'I am clean',
                defaultValue: 'qwerty',
                inputType: 'password'
            }
        ]
    };
    let data: any = {
        pass: 'Ignore'
    };
    await checkTextboxValue(json, '', data);
});
test('Check textbox placeHolder', async () => {
    let json: any = {
        questions: [
            {
                name: 'holder',
                type: 'text',
                title: 'Hearth',
                placeHolder: 'keeper'
            }
        ]
    };
    await checkTextboxValue(json, ' ', null, ' ' + json.questions[0].placeHolder);
});
test('Check textbox defaultValue with placeHolder', async () => {
    let json: any = {
        questions: [
            {
                name: 'textbox_default_placeholder',
                type: 'text',
                title: 'Birds',
                defaultValue: 'griffin',
                placeHolder: 'gull'
            }
        ]
    };
    await checkTextboxValue(json, ' ' + json.questions[0].defaultValue,
        null, ' ' + json.questions[0].placeHolder);
});
test('Check textbox data with defaultValue and placeHolder', async () => {
    let json: any = {
        questions: [
            {
                name: 'textbox_data_default_placeholder',
                type: 'text',
                title: 'Birds',
                defaultValue: 'griffin',
                placeHolder: 'gull'
            }
        ]
    };
    let data: any = {
        textbox_data_default_placeholder: 'phoenix'
    };
    await checkTextboxValue(json, ' ' + data.textbox_data_default_placeholder,
        data, ' ' + json.questions[0].placeHolder);
});
test('Check not readOnly textbox', async () => {
    let json: any = {
        questions: [
            {
                name: 'readnottext',
                type: 'text',
                title: 'Write also'
            }
        ]
    };
    await checkTextboxValue(json, ' ', null, ' ', false);
});
test('Check readOnly textbox', async () => {
    let json: any = {
        questions: [
            {
                name: 'readtext',
                type: 'text',
                title: 'Read only',
                readOnly: true
            }
        ]
    };
    await checkTextboxValue(json, ' ', null, ' ', true);
});
test('Set comment no value', async () => {
    let json: any = {
        questions: [
            {
                name: 'comment_novalue',
                type: 'comment',
                title: 'NoValue:'
            }
        ]
    };
    await checkTextboxValue(json, ' ');
});
test('Check comment shouldRenderBoders method', async () => {
    const commentQuestion = new QuestionCommentModel('');
    const textQuestion = new QuestionTextModel('');
    const dropdownQuestion = new QuestionDropdownModel('');
    const controller = new DocController();
    expect(new CommentBrick(commentQuestion, controller, { yTop: 0, xLeft: 0, yBot: 10, xRight: 10 }, true)['shouldRenderFlatBorders']()).toBeTruthy();
    expect(new CommentBrick(textQuestion, controller, { yTop: 0, xLeft: 0, yBot: 10, xRight: 10 }, true)['shouldRenderFlatBorders']()).toBeTruthy();
    expect(new CommentBrick(dropdownQuestion, controller, { yTop: 0, xLeft: 0, yBot: 10, xRight: 10 }, false)['shouldRenderFlatBorders']()).toBeTruthy();
    const oldReadOnlyCommentRenderMode = settings.readOnlyCommentRenderMode;
    const oldReadOnlyTextRenderMode = settings.readOnlyTextRenderMode;

    settings.readOnlyCommentRenderMode = 'div';
    expect(new CommentBrick(commentQuestion, controller, { yTop: 0, xLeft: 0, yBot: 10, xRight: 10 }, true)['shouldRenderFlatBorders']()).toBeFalsy();
    expect(new CommentBrick(textQuestion, controller, { yTop: 0, xLeft: 0, yBot: 10, xRight: 10 }, true)['shouldRenderFlatBorders']()).toBeTruthy();
    expect(new CommentBrick(dropdownQuestion, controller, { yTop: 0, xLeft: 0, yBot: 10, xRight: 10 }, false)['shouldRenderFlatBorders']()).toBeFalsy();

    settings.readOnlyCommentRenderMode = 'textarea';
    settings.readOnlyTextRenderMode = 'div';
    expect(new CommentBrick(commentQuestion, controller, { yTop: 0, xLeft: 0, yBot: 10, xRight: 10 }, true)['shouldRenderFlatBorders']()).toBeTruthy();
    expect(new CommentBrick(textQuestion, controller, { yTop: 0, xLeft: 0, yBot: 10, xRight: 10 }, true)['shouldRenderFlatBorders']()).toBeFalsy();
    expect(new CommentBrick(dropdownQuestion, controller, { yTop: 0, xLeft: 0, yBot: 10, xRight: 10 }, false)['shouldRenderFlatBorders']()).toBeTruthy();

    settings.readOnlyCommentRenderMode = 'div';

    expect(new CommentBrick(commentQuestion, controller, { yTop: 0, xLeft: 0, yBot: 10, xRight: 10 }, true)['shouldRenderFlatBorders']()).toBeFalsy();
    expect(new CommentBrick(textQuestion, controller, { yTop: 0, xLeft: 0, yBot: 10, xRight: 10 }, true)['shouldRenderFlatBorders']()).toBeFalsy();
    expect(new CommentBrick(dropdownQuestion, controller, { yTop: 0, xLeft: 0, yBot: 10, xRight: 10 }, false)['shouldRenderFlatBorders']()).toBeFalsy();

    settings.readOnlyTextRenderMode = oldReadOnlyTextRenderMode;
    settings.readOnlyCommentRenderMode = oldReadOnlyCommentRenderMode;
});
test('Text question display value with rtl', async () => {
    let json: any = {
        questions: [
            {
                name: 'dropdown_displayvalue',
                type: 'text',
                defaultValue: 'Value',
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    controller['_isRTL'] = true;
    await survey['renderSurvey'](controller);
    expect(controller.doc.internal.acroformPlugin.acroFormDictionaryRoot.Fields[0].value).toBe(' ' + 'eulaV');
});