(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
	return {};
};

import { SurveyPDF } from '../src/survey';
import { FlatCheckbox } from '../src/flat_layout/flat_checkbox';
import { TestHelper } from '../src/helper_test';
let __dummy_cb = new FlatCheckbox(null, null);

test('Test has other checkbox', async () => {
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
	await survey.render();
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
test('Check all items disabled or enabled', async () => {
	let json = {
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
		await survey.render();
		survey.controller.doc.internal.acroformPlugin.
			acroFormDictionaryRoot.Fields.forEach(
				(acroCheckBox: any) => {
					expect(acroCheckBox.readOnly).toBe(readOnly);
				}
			);
	}
});
test('Test enable one item', async () => {
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
	await survey.render();
	survey.controller.doc.internal.acroformPlugin.acroFormDictionaryRoot.Fields.forEach(
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
	await survey.render();
	survey.controller.doc.internal.acroformPlugin.acroFormDictionaryRoot.Fields.forEach(
		(acroCheckBox: any) => {
			expect(acroCheckBox.readOnly).toBe(false);
		}
	);
});