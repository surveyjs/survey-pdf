(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
	return {};
};

import { SurveyPDF } from '../src/survey';
import { DocController } from '../src/doc_controller';
import { FlatDropdown } from '../src/flat_layout/flat_dropdown';
import { TestHelper } from '../src/helper_test';
let __dummy_dd = new FlatDropdown(null, null, null);

test('Check dropdown readonly', async () => {
	let json = {
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
	let controller: DocController = new DocController(TestHelper.defaultOptions);
	await survey['render'](controller);
    expect(controller.doc.internal.acroformPlugin.
        acroFormDictionaryRoot.Fields[0].readOnly).toBe(true);
});
