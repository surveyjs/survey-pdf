(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
    return {};
};
import { SurveyPDF } from '../src/survey';
import { DocController } from '../src/doc_controller';
import { FlatRadiogroup } from '../src/flat_layout/flat_radiogroup';
import { TestHelper } from '../src/helper_test';
let __dummy_rg = new FlatRadiogroup(null, null, null);

test('Has other radiogroup', async () => {
    const json: any = {
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
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    survey.data = {
        radiogroup_hasother: 'other'
    };
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    await survey['renderSurvey'](controller);
    const internal: any = controller.doc.internal;
    const internalOtherText: string = internal.pages[1][21];
    expect(internalOtherText).toBeDefined();
    const regex: RegExp = /\((.*)\)/;
    const otherText: string = internalOtherText.match(regex)[1];
    expect(otherText).toBe(json.questions[0].otherText);
    const internalOtherTextField: any = internal.acroformPlugin.acroFormDictionaryRoot.Fields[2];
    expect(internalOtherTextField.FT).toBe('/Tx');
    const internalRadioGroup: any = internal.acroformPlugin.acroFormDictionaryRoot.Fields[0];
    expect(internalRadioGroup.FT).toBe('/Btn');
});
test('Other selected with value radiogroup', async () => {
    const json: any = {
        showQuestionNumbers: 'false',
        questions: [
            {
                type: 'radiogroup',
                name: 'radiogroup_otherselected',
                defaultValue: 'Value',
                hasOther: true
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    await survey['renderSurvey'](controller);
    const fields: any = controller.doc.internal.acroformPlugin.acroFormDictionaryRoot.Fields;
    expect(fields[1].AS).toBe('/' + survey.getAllQuestions()[0].id + 'index0');
    expect(fields[2].V).toBe('( ' + json.questions[0].defaultValue + ')');
});
test('Check all items disabled or enabled', async () => {
    const json: any = {
        questions: [
            {
                name: 'radiogroup',
                type: 'radiogroup',
                choices: ['item1', 'item2', 'item3'],
            }
        ]
    };
    for (const readOnly of [false, true]) {
        (<any>json).questions[0].readOnly = readOnly;
        const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
        const controller: DocController = new DocController(TestHelper.defaultOptions);
        await survey['renderSurvey'](controller);
        if (!readOnly) {
            expect(controller.doc.internal.acroformPlugin.
                acroFormDictionaryRoot.Fields[0].readOnly).toBe(readOnly);
        }
        else expect(controller.doc.internal.acroformPlugin).toBe(undefined);
    }
});
test('Check onRenderRadio* events', async () => {
    const json: any = {
        questions: [
            {
                name: 'radiogroup',
                type: 'radiogroup',
                choices: ['item1', 'item2', 'item3'],
                defaultValue: 'item2'
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    survey.getAllQuestions()[0].id = 'questionId';
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    survey.onRenderRadioGroupWrapAcroform.add((_, opt) => {
        opt.fieldName = opt.context.question.name;
    });

    survey.onRenderRadioItemAcroform.add((_, opt) => {
        opt.fieldName = opt.context.item.value;
    });
    await survey['renderSurvey'](controller);
    const fields: any = controller.doc.internal.acroformPlugin.acroFormDictionaryRoot.Fields;
    expect(fields[0].V).toBe('/item2');
    expect(fields[0].fieldName).toBe('radiogroup');
    expect(fields[1].AS).toBe('/Off');
    expect(fields[2].AS).toBe('/item2');
    expect(fields[3].AS).toBe('/Off');
});