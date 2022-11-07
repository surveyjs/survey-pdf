(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
    return {};
};

import { SurveyPDF } from '../src/survey';
import { IRect, DocController } from '../src/doc_controller';
import { FlatCheckbox } from '../src/flat_layout/flat_checkbox';
import { PdfBrick } from '../src/pdf_render/pdf_brick';
import { CheckItemBrick } from '../src/pdf_render/pdf_checkitem';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
let __dummy_cb = new FlatCheckbox(null, null, null);

test('Check that checkbox has square boundaries', async () => {
    let json: any = {
        questions: [
            {
                type: 'checkbox',
                name: 'checkbox_square_boundaries',
                titleLocation: 'hidden',
                choices: [
                    'S'
                ]
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    await survey['renderSurvey'](controller);
    controller.margins.left += controller.unitWidth;
    let assumeCheckbox: IRect = SurveyHelper.moveRect(SurveyHelper.scaleRect(SurveyHelper.createRect(
        controller.leftTopPoint, controller.unitHeight, controller.unitHeight),
    SurveyHelper.SELECT_ITEM_FLAT_SCALE), controller.leftTopPoint.xLeft);
    let checkboxFlat: PdfBrick = new PdfBrick(null, null, assumeCheckbox);
    assumeCheckbox = SurveyHelper.scaleRect(assumeCheckbox, SurveyHelper.formScale(controller, checkboxFlat));
    let acroFormFields: any = controller.doc.internal.acroformPlugin.acroFormDictionaryRoot.Fields;
    let internalRect: any = acroFormFields[0].Rect;
    TestHelper.equalRect(expect, SurveyHelper.createRect(
        { xLeft: internalRect[0], yTop: internalRect[1] },
        internalRect[2], internalRect[3]), assumeCheckbox);
});
test('Check has other checkbox', async () => {
    let json: any = {
        showQuestionNumbers: 'false',
        questions: [
            {
                name: 'checkbox_hasother',
                type: 'checkbox',
                hasOther: true,
                otherText: 'Other test'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    survey.data = {
        checkbox_hasother: 'other'
    };
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    await survey['renderSurvey'](controller);
    let internal: any = controller.doc.internal;
    let internalOtherText: string = internal.pages[1][21];
    expect(internalOtherText).toBeDefined();
    let regex: RegExp = /\((.*)\)/;
    let otherText: string = internalOtherText.match(regex)[1];
    expect(otherText).toBe(json.questions[0].otherText);
    let internalOtherTextField: any = internal.acroformPlugin.acroFormDictionaryRoot.Fields[1];
    expect(internalOtherTextField.FT).toBe('/Tx');
    let internalOtherCheckBox: any = internal.acroformPlugin.acroFormDictionaryRoot.Fields[0];
    expect(internalOtherCheckBox.FT).toBe('/Btn');
});
test('Check all acroform checkbox items disabled or enabled', async () => {
    let json: any = {
        questions: [
            {
                name: 'checkbox_disabled_enabled',
                type: 'checkbox',
                choices: ['item1', 'item2', 'item3'],
                readonlyRenderAs: 'acroform'
            }
        ]
    };
    for (let readOnly of [false, true]) {
        (<any>json).questions[0].readOnly = readOnly;
        let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
        let controller: DocController = new DocController(TestHelper.defaultOptions);
        await survey['renderSurvey'](controller);
        controller.doc.internal.acroformPlugin.acroFormDictionaryRoot.Fields.
            forEach((acroCheckBox: any) => {
                expect(acroCheckBox.readOnly).toBe(readOnly);
            }
            );
    }
});
test('Check enable one item', async () => {
    let json: any = {
        questions: [
            {
                name: 'checkbox_enable_one',
                type: 'checkbox',
                choices: ['item1', 'item2', 'item3'],
                choicesEnableIf: '{item} == item2'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    await survey['renderSurvey'](controller);
    expect(controller.doc.internal.acroformPlugin.
        acroFormDictionaryRoot.Fields.length).toBe(1);
    expect(controller.doc.internal.acroformPlugin.
        acroFormDictionaryRoot.Fields[0].readOnly).toBe(false);
});
test('Check two equal values checkbox', async () => {
    let json: any = {
        questions: [
            {
                name: 'checkbox_two_equal',
                type: 'checkbox',
                choices: ['item', 'item'],
                choicesEnableIf: '{item} == item'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    await survey['renderSurvey'](controller);
    controller.doc.internal.acroformPlugin.acroFormDictionaryRoot.Fields.forEach(
        (acroCheckBox: any) => {
            expect(acroCheckBox.readOnly).toBe(false);
        }
    );
});
test('Check readonly checkbox symbol', async () => {
    let json: any = {
        questions: [
            {
                name: 'checkbox_readonly_symbol',
                type: 'checkbox',
                readOnly: true,
                choices: ['item'],
                defaultValue: ['item']
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    await survey['renderSurvey'](controller);
    expect(controller.doc.internal.pages[1][22]).toContain(
        '(' + CheckItemBrick['CHECKMARK_READONLY_SYMBOL'] + ')');
});

test('Check onRenderCheck event', async () => {
    let json: any = {
        questions: [
            {
                name: 'checkbox',
                type: 'checkbox',
                choices: ['item', 'item2'],
                defaultValue: ['item']
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    survey.onRenderCheckItemAcroform.add((_, opt) => {
        opt.fieldName = opt.context.question.name + '_value_' + opt.context.item.value;
        opt.value = opt.context.item.value;
    });
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    await survey['renderSurvey'](controller);
    const fields: any = controller.doc.internal.acroformPlugin.acroFormDictionaryRoot.Fields;
    expect(fields[0].V).toBe('/item');
    expect(fields[0].fieldName).toBe('checkbox_value_item');
    expect(fields[0].AS).toBe('/On');
    expect(fields[1].V).toBe('/item2');
    expect(fields[1].fieldName).toBe('checkbox_value_item2');
    expect(fields[1].AS).toBe('/Off');
});