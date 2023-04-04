(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
    return {};
};

import { SurveyPDF } from '../src/survey';
import { DocController } from '../src/doc_controller';
import { FlatDropdown } from '../src/flat_layout/flat_dropdown';
import { TestHelper } from '../src/helper_test';
import { QuestionDropdownModel } from 'survey-core';
import { DropdownBrick } from '../src/pdf_render/pdf_dropdown';
let __dummy_dd = new FlatDropdown(null, null, null);

test('Check dropdown readonly', async () => {
    let json: any = {
        questions: [
            {
                name: 'dropdown_readonly',
                type: 'dropdown',
                choices: ['item'],
                readOnly: true
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let data: any = {};
    data[json.questions[0].name] = json.questions[0].choices[0];
    survey.data = data;
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    await survey['renderSurvey'](controller);
    expect(typeof controller.doc.internal.acroformPlugin).toBe('undefined');
    let lastPage: any = controller.doc.internal.pages[
        controller.doc.internal.pages.length -1];
    expect(lastPage[4].includes(json.questions[0].choices[0])).toBe(true);
});
test('Dropdown MK appearence fix', async () => {
    let json: any = {
        questions: [
            {
                name: 'dropdown_mkfix',
                type: 'dropdown',
                choices: ['item']
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    await survey['renderSurvey'](controller);
    expect(controller.doc.internal.acroformPlugin.
	    acroFormDictionaryRoot.Fields[0].MK).toBe('<< /BG [ 0.975 0.975 0.975 ]  >>');
});
test('Dropdown display value', async () => {
    let json: any = {
        questions: [
            {
                name: 'dropdown_displayvalue',
                type: 'dropdown',
                choices: [{
                    value: 1,
                    text: 'Value 1'
                }]
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    survey.data = {
        dropdown_displayvalue: json.questions[0].choices[0].value
    };
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    await survey['renderSurvey'](controller);
    expect(controller.doc.internal.acroformPlugin.
	    acroFormDictionaryRoot.Fields[0].value).toBe(json.questions[0].choices[0].text);
});
test('Dropdown display value with rtl', async () => {
    let json: any = {
        questions: [
            {
                name: 'dropdown_displayvalue',
                type: 'dropdown',
                defaultValue: 1,
                choices: [{
                    value: 1,
                    text: 'Value 1'
                }]
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    controller['_isRTL'] = true;
    await survey['renderSurvey'](controller);
    expect(controller.doc.internal.acroformPlugin.acroFormDictionaryRoot.Fields[0].value).toBe('1 eulaV');
});