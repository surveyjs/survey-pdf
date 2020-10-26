(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
    return {};
};

import { SurveyPDF } from '../src/survey';
import { DocController } from '../src/doc_controller';
import { FlatMatrix } from '../src/flat_layout/flat_matrix';
import { TestHelper } from '../src/helper_test';
let __dummy_mt = new FlatMatrix(null, null, null);

test('Matrix default value', async () => {
    let json: any = {
        questions: [
            {
                titleLocation: 'hidden',
                showHeader: false,
                type: 'matrix',
                name: 'matdefval',
                defaultValue: 'Column',
                columns: [
                    'Column',
                    'Column2'
                ]
            }]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    await survey['render'](controller);
    let acroFormFields = controller.doc.internal.acroformPlugin.acroFormDictionaryRoot.Fields;
    expect(acroFormFields[0].value).toBe('matdefvalrow0index0');
    expect(acroFormFields[1].AS).toBe('/matdefvalrow0index0');
    expect(acroFormFields[2].AS).toBe('/Off');
});
