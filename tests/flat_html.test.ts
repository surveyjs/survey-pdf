(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { Question } from 'survey-core';
import { SurveyPDF } from '../src/survey';
import { IPoint, IRect, ISize, DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatHTML } from '../src/flat_layout/flat_html';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { TextBrick } from '../src/pdf_render/pdf_text';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
let __dummy_hl = new FlatHTML(null, null, null);

test.skip('Check choose auto render', async () => {
    let json: any = {
        elements: [
            {
                type: 'html',
                name: 'html_chooserender_standart',
                html: '<b>STRONG POWER</b>'
            },
            {
                type: 'html',
                name: 'html_chooserender_image',
                html: '<div style="color:pink">Cool Girl</div>'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    // mock createHTMLFlat and htmlToImage methods
    // expect(flats.length).toBe(1);
});