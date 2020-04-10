(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
    return {};
};
import { SurveyPDF } from '../src/survey';
import { DocController } from '../src/doc_controller';
import { FlatRadiogroup } from '../src/flat_layout/flat_radiogroup';
import { TestHelper } from '../src/helper_test';
let __dummy_rg = new FlatRadiogroup(null, null, null);

test('Has other radiogroup', async () => {
    let json: any = {
        showQuestionNumbers: 'false',
        questions: [
            {
                name: 'radiogroup_hasother',
                type: 'radiogroup',
                hasOther: true,
                otherText: 'Other test'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    survey.data = {
        radiogroup_hasother: 'other'
    };
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    await survey['render'](controller);
    let internal: any = controller.doc.internal;
    let internalOtherText: string = internal.pages[1][20];
    expect(internalOtherText).toBeDefined();
    let regex: RegExp = /\((.*)\)/;
    let otherText: string = internalOtherText.match(regex)[1];
    expect(otherText).toBe(json.questions[0].otherText);
    let internalOtherTextField: any = internal.acroformPlugin.acroFormDictionaryRoot.Fields[2];
    expect(internalOtherTextField.FT).toBe('/Tx');
    let internalRadioGroup: any = internal.acroformPlugin.acroFormDictionaryRoot.Fields[0];
    expect(internalRadioGroup.FT).toBe('/Btn');
});
test('Test all items disabled or enabled', async () => {
    let json: any = {
        questions: [
            {
                name: 'radiogroup',
                type: 'radiogroup',
                choices: ['item1', 'item2', 'item3'],
            }
        ]
    };
    for (let readOnly of [false, true]) {
        (<any>json).questions[0].readOnly = readOnly;
        let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
        let controller: DocController = new DocController(TestHelper.defaultOptions);
        await survey['render'](controller);
        expect(controller.doc.internal.acroformPlugin.
            acroFormDictionaryRoot.Fields[0].readOnly).toBe(readOnly);
    }
});
test('Check radiogroup readonly via display mode', async () => {
	let json: any = {
		questions: [
			{
				name: 'readigroup_readonly_display',
				type: 'radiogroup',
                choices: ['item']
			}
		]
	};
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    survey.mode = 'display';
	let controller: DocController = new DocController(TestHelper.defaultOptions);
	await survey['render'](controller);
    expect(controller.doc.internal.acroformPlugin.
        acroFormDictionaryRoot.Fields[0].readOnly).toBe(true);
});
