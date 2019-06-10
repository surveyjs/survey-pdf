(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { SurveyPDF } from '../src/survey';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatTextbox } from '../src/flat_layout/flat_textbox';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { TestHelper } from '../src/helper_test';
let __dummy_tx = new FlatTextbox(null, null);

test('Check no invisible page', async () => {
    let json = {
        pages: [
        {
            name: 'VisiblePage',
            elements: [
                {
                    type: 'text',
                    name: 'VisibleQuestion'
                }
            ]
        },
        {
            name: 'InvisiblePage',
            elements: [
                {
                    type: 'text',
                    name: 'InvisibleQuestion'
                }
            ],
            visibleIf: 'false'
         }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
});