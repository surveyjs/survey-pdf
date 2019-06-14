(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
    return {};
};
import { SurveyPDF } from '../src/survey';
import { FlatRadiogroup } from '../src/flat_layout/flat_radiogroup';
import { TestHelper } from '../src/helper_test';
let __dummy_rg = new FlatRadiogroup(null, null);

test('Test has other radiogroup', async () => {
    let json = {
        questions: [
            {
                readOnly: true,
                name: 'radiogroup',
                type: 'radiogroup',
                hasOther: true,
                otherText: 'Other test'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    await survey.render();
    let internal: any = survey.controller.doc.internal;
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
    let json = {
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
        await survey.render();
        expect(survey.controller.doc.internal.acroformPlugin.
            acroFormDictionaryRoot.Fields[0].readOnly).toBe(readOnly);
    }
});
