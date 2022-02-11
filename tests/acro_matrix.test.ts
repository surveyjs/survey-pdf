(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
    return {};
};

import { SurveyPDF } from '../src/survey';
import { DocController } from '../src/doc_controller';
import { FlatMatrix } from '../src/flat_layout/flat_matrix';
import { TestHelper } from '../src/helper_test';
const __dummy_mt = new FlatMatrix(null, null, null);

test('Matrix default value', async () => {
    const json: any = {
        questions: [
            {
                titleLocation: 'hidden',
                showHeader: false,
                type: 'matrix',
                name: 'matrix_defaultvalue',
                title: 'Please indicate if you agree or disagree with the following statements',
                defaultValue: 'Column',
                columns: [
                    'Column',
                    'Column2'
                ]
            }]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    await survey['renderSurvey'](controller);
    const acroFormFields = controller.doc.internal.acroformPlugin.acroFormDictionaryRoot.Fields;
    expect(acroFormFields[0].value).toBe('sq_100row0index0');
    expect(acroFormFields[1].AS).toBe('/sq_100row0index0');
    expect(acroFormFields[2].AS).toBe('/Off');
});
test('Matrix dropdown with radiogroup showInMultipleColumns equals true', async () => {
    const json: any = {
        questions: [
            {
                titleLocation: 'hidden',
                type: 'matrixdropdown',
                name: 'matrixdropdown_radiogroup_multiplecolumns',
                columns: [
                    {
                        cellType: 'radiogroup',
                        showInMultipleColumns: true,
                        choices: ['A', 'B']
                    }
                ],
                rows: [' ']
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    await survey['renderSurvey'](controller);
});