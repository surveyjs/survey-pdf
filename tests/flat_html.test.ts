(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { Question } from 'survey-core';
import { SurveyPDF } from '../src/survey';
import { IPoint, IRect, DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatHTML } from '../src/flat_layout/flat_html';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { HTMLBrick } from '../src/pdf_render/pdf_html';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
let __dummy_hl = new FlatHTML(null, null, null);

SurveyHelper.createHTMLFlat = async function(
    point: IPoint, question: Question,
    controller: DocController, html: string): Promise<IPdfBrick> {
    return await new Promise((resolve) => {
        let rect: IRect = SurveyHelper.createRect(point,
            SurveyHelper.EPSILON, SurveyHelper.EPSILON);
        resolve(new HTMLBrick(question, controller, rect, html));
    });
};
SurveyHelper.htmlToImage = async function(_: string, width: number):
        Promise<{ url: string, aspect: number }> {
    return await new Promise((resolve) => {
        resolve({ url: 'data:,', aspect: width / SurveyHelper.EPSILON });
    });
};

test('Check choose auto render', async () => {
    let json: any = {
        elements: [
            {
                type: 'html',
                name: 'html_chooserender_standard',
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
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(3);
    expect(flats[0][0].unfold()[0] instanceof HTMLBrick).toBe(true);
    expect((<any>flats[0][0].unfold())[0]['html'].startsWith('<img')).toBe(false);
    expect(flats[0][2].unfold()[0] instanceof HTMLBrick).toBe(true);
    expect((<any>flats[0][2])['html'].startsWith('<img')).toBe(true);
});