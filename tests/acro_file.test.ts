(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
	return {};
};

import { SurveyPDF } from '../src/survey';
import { DocController } from '../src/doc_controller';
import { FlatFile } from '../src/flat_layout/flat_file';
import { TestHelper } from '../src/helper_test';
let __dummy_fl = new FlatFile(null, null, null);

test('Check file readonly with link', async () => {
	let json: any = {
		questions: [
			{
				type: 'file',
				name: 'file_readonly_withlink',
				titleLocation: 'hidden',
				readOnly: true,
				defaultValue: [
                    {
                        name: 'text.txt',
                        type: 'text/plain',
                        content: 'data:text/plain;base64,aGVsbG8='
                    }
                ]
			}
		]
	};
	let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
	let controller: DocController = new DocController(TestHelper.defaultOptions);
	await survey['render'](controller);
	expect(controller.doc.internal.pages[1].join('').split('text.txt')).toHaveLength(3);
});
test('Check file readonly without link', async () => {
	let json: any = {
		questions: [
			{
				type: 'file',
				name: 'file_readonly_withlink',
				titleLocation: 'hidden',
				readOnly: true,
				readonlyRenderAs: 'text',
				defaultValue: [
                    {
                        name: 'text.txt',
                        type: 'text/plain',
                        content: 'data:text/plain;base64,aGVsbG8='
                    }
                ]
			}
		]
	};
	let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
	let controller: DocController = new DocController(TestHelper.defaultOptions);
	await survey['render'](controller);
	expect(controller.doc.internal.pages[1].join('').split('text.txt')).toHaveLength(2);
});