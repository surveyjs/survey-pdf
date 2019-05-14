(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
	return {};
};

import { SurveyPDF } from '../src/survey';
import { FlatCheckbox } from '../src/flat_layout/flat_checkbox';
import { TestHelper } from '../src/helper_test';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { SurveyHelper } from '../src/helper_survey';
import { TextBrick } from '../src/pdf_render/pdf_text';
import { IRect } from '../src/doc_controller';
let __dummy_cb = new FlatCheckbox(null, null);

test('Test has other checkbox', () => {
	let json = {
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
	survey.render();
	let internal: any = survey.controller.doc.internal;
	let internalOtherText: string = internal.pages[1][3];
	expect(internalOtherText).toBeDefined();
	let regex: RegExp = /\((.*)\)/;
	let otherText: string = internalOtherText.match(regex)[1];
	expect(otherText).toBe(json.questions[0].otherText);
	let internalOtherTextField: any = internal.acroformPlugin.acroFormDictionaryRoot.Fields[1];
	expect(internalOtherTextField.FT).toBe('/Tx');
	let internalOtherCheckBox: any = internal.acroformPlugin.acroFormDictionaryRoot.Fields[0];
	expect(internalOtherCheckBox.FT).toBe('/Btn');
});
test('Test duplicate value other', () => {
	let json = {
		questions: [
			{
				name: 'checkbox',
				type: 'checkbox',
				choices: ['other'],
				hasOther: true
			}
		]
	};
	let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
	survey.render();
	let acroFormFields = survey.controller.doc.internal.acroformPlugin.acroFormDictionaryRoot.Fields;
	let internalOtherCheckBoxChoice = acroFormFields[0];
	let internalOtherTextFieldChoice = acroFormFields[1];
	let internalOtherCheckBox = acroFormFields[2];
	let internalOtherTextField = acroFormFields[3];
	expect(internalOtherCheckBoxChoice.FT).toBe('/Btn');
	expect(internalOtherTextFieldChoice.FT).toBe('/Tx');
	expect(internalOtherCheckBox.FT).toBe('/Btn');
	expect(internalOtherTextField.FT).toBe('/Tx');
});

test('Check all items disabled or enabled', () => {
	let json = {
		questions: [
			{
				name: 'checkbox',
				type: 'checkbox',
				choices: ['item1', 'item2', 'item3'],
			}
		]
	};
	[false, true].forEach((readOnly) => {
		(<any>json).questions[0].readOnly = readOnly;
		let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
		survey.render();
		survey.controller.doc.internal.acroformPlugin.
			acroFormDictionaryRoot.Fields.forEach(
				(acroCheckBox: any) => {
					expect(acroCheckBox.readOnly).toBe(readOnly);
				}
			);
	})

});
test('Test enable one item', () => {
	let json = {
		questions: [
			{
				name: 'checkbox',
				type: 'checkbox',
				choices: ['item1', 'item2', 'item3'],
				choicesEnableIf: '{item} == item2'
			}
		]
	};
	const INDEX_OF_ENABLED_ITEM = 1;
	let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
	survey.render();
	survey.controller.doc.internal.acroformPlugin.acroFormDictionaryRoot.Fields.forEach(
		(acroCheckBox: any, index: number) => {
			if (index === INDEX_OF_ENABLED_ITEM)
				expect(acroCheckBox.readOnly).toBe(false);
			else expect(acroCheckBox.readOnly).toBe(true);
		}
	);
});

test('Test two equal values checkbox', () => {
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
	survey.render();
	survey.controller.doc.internal.acroformPlugin.acroFormDictionaryRoot.Fields.forEach(
		(acroCheckBox: any, index: number) => {
			expect(acroCheckBox.readOnly).toBe(false);
		}
	);
});
test('Test has other checkbox', () => {
	let json = {
		questions: [
			{
				titleLocation: 'hidden',
				name: 'checkbox',
				type: 'checkbox',
				hasOther: true,
				otherText: 'Other(describe)'
			}
		]
	};
	let options = TestHelper.defaultOptions;
	options.paperWidth = 40;
	let survey: SurveyPDF = new SurveyPDF(json, options);
	let flats: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
	let receivedRects: IRect[] = flats[0][0].unfold();
	let currPoint = TestHelper.defaultPoint;
	let itemWidth = SurveyHelper.measureText().width;
	let assumeRects: IRect[] = [];
	let itemRect = SurveyHelper.createRect(currPoint, itemWidth, itemWidth);
	assumeRects.push(itemRect);
	currPoint = SurveyHelper.createPoint(itemRect, false, true);
	let textRect =
		SurveyHelper.createTextFlat(currPoint, survey.getAllQuestions()[0], survey.controller, json.questions[0].otherText, TextBrick).unfold();
	currPoint = SurveyHelper.createPoint(SurveyHelper.mergeRects(itemRect, ...textRect));
	assumeRects.push(...textRect);
	let textFieldRect = SurveyHelper.createTextFieldRect(currPoint, survey.controller, 2);
	assumeRects.push(textFieldRect);
	TestHelper.equalRects(expect, receivedRects, assumeRects);
});