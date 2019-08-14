(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
	return {};
};

import { SurveyPDF } from '../src/survey';
import { IRect, DocController } from '../src/doc_controller';
import { FlatCheckbox } from '../src/flat_layout/flat_checkbox';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
import { IPdfBrick, PdfBrick } from '../src/pdf_render/pdf_brick';
let __dummy_cb = new FlatCheckbox(null, null, null);

test('Check that checkbox has square boundaries', async () => {
	let json: any = {
		questions: [
			{
				type: 'checkbox',
				name: 'box',
				titleLocation: 'hidden',
				title: 'Square Pants',
				choices: [
					'S'
				]
			}
		]
	};
	let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
	let controller: DocController = new DocController(TestHelper.defaultOptions);
	await survey['render'](controller);
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

test('Test has other checkbox', async () => {
	let json: any = {
		showQuestionNumbers: 'false',
		questions: [
			{
				name: 'checkbox',
				type: 'checkbox',
				hasOther: true,
				otherText: 'Other test'
			}
		]
	};
	let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
	let controller: DocController = new DocController(TestHelper.defaultOptions);
	await survey['render'](controller);
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
test('Check all items disabled or enabled', async () => {
	let json: any = {
		questions: [
			{
				name: 'checkbox',
				type: 'checkbox',
				choices: ['item1', 'item2', 'item3'],
			}
		]
	};
	for (let readOnly of [false, true]) {
		(<any>json).questions[0].readOnly = readOnly;
		let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
		let controller: DocController = new DocController(TestHelper.defaultOptions);
		await survey['render'](controller);
		controller.doc.internal.acroformPlugin.
			acroFormDictionaryRoot.Fields.forEach(
				(acroCheckBox: any) => {
					expect(acroCheckBox.readOnly).toBe(readOnly);
				}
			);
	}
});
test('Test enable one item', async () => {
	let json: any = {
		questions: [
			{
				name: 'checkbox',
				type: 'checkbox',
				choices: ['item1', 'item2', 'item3'],
				choicesEnableIf: '{item} == item2'
			}
		]
	};
	const INDEX_OF_ENABLED_ITEM: number = 1;
	let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
	let controller: DocController = new DocController(TestHelper.defaultOptions);
	await survey['render'](controller);
	controller.doc.internal.acroformPlugin.acroFormDictionaryRoot.Fields.forEach(
		(acroCheckBox: any, index: number) => {
			if (index === INDEX_OF_ENABLED_ITEM)
				expect(acroCheckBox.readOnly).toBe(false);
			else expect(acroCheckBox.readOnly).toBe(true);
		}
	);
});

test('Test two equal values checkbox', async () => {
	let json = {
		questions: [
			{
				name: 'checkbox',
				type: 'checkbox',
				choices: ['item', 'item'],
				choicesEnableIf: '{item} == item'
			}
		]
	};
	let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
	let controller: DocController = new DocController(TestHelper.defaultOptions);
	await survey['render'](controller);
	controller.doc.internal.acroformPlugin.acroFormDictionaryRoot.Fields.forEach(
		(acroCheckBox: any) => {
			expect(acroCheckBox.readOnly).toBe(false);
		}
	);
});