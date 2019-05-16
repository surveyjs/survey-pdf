(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
    return {};
};
import { PdfSurvey } from '../src/survey';
import { FlatRadiogroup } from '../src/flat_layout/flat_radiogroup';
import { TestHelper } from '../src/helper_test';
let __dummy_rg = new FlatRadiogroup(null, null);

test('check has other radiogroup', () => {
    let json = {
        questions: [
            {
                titleLocation: "hidden",
                readOnly: true,
                name: 'radiogroup',
                type: 'radiogroup',
                hasOther: true,
                otherText: 'Other test'
            }
        ]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    survey.render();
    let internal: any = survey.controller.doc.internal;
    let internalOtherText: string = internal.pages[1][6];
    expect(internalOtherText).toBeDefined();
    let regex: RegExp = /\((.*)\)/;
    let otherText: string = internalOtherText.match(regex)[1];
    expect(otherText).toBe(json.questions[0].otherText);
    let internalOtherTextField: any = internal.acroformPlugin.acroFormDictionaryRoot.Fields[2];
    expect(internalOtherTextField.FT).toBe('/Tx');
    let internalRadioGroup: any = internal.acroformPlugin.acroFormDictionaryRoot.Fields[0];
    expect(internalRadioGroup.FT).toBe('/Btn');
});

test('Test duplicate value other', () => {
    let json = {
        questions: [
            {
                name: 'radiogroup',
                type: 'radiogroup',
                choices: ['other'],
                hasOther: true
            }
        ]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    survey.render();
    let acroFormFields = survey.controller.doc.internal.acroformPlugin.acroFormDictionaryRoot.Fields;
    let internalRadioGroup = acroFormFields[0];
    let internalOtherTextFieldChoice = acroFormFields[2];
    let internalOtherTextField = acroFormFields[4];
    expect(internalRadioGroup.FT).toBe('/Btn');
    expect(internalOtherTextFieldChoice.FT).toBe('/Tx');
    expect(internalOtherTextField.FT).toBe('/Tx');
});
test('Test all items disabled or enabled', () => {
    let json = {
        questions: [
            {
                name: 'radiogroup',
                type: 'radiogroup',
                choices: ['item1', 'item2', 'item3'],
            }
        ]
    };
    [false, true].forEach((readOnly) => {
        (<any>json).questions[0].readOnly = readOnly;
        let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
        survey.render();
        expect(survey.controller.doc.internal.acroformPlugin.
            acroFormDictionaryRoot.Fields[0].readOnly).toBe(readOnly);
    })

});
