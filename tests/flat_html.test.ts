(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { Question, QuestionHtmlModel } from 'survey-core';
import { SurveyPDF } from '../src/survey';
import { IPoint, IRect, DocController, IDocOptions } from '../src/doc_controller';
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
    SurveyHelper.shouldConvertImageToPng = false;
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(3);
    expect(flats[0][0].unfold()[0] instanceof HTMLBrick).toBe(true);
    expect((<any>flats[0][0].unfold())[0]['html'].startsWith('<img')).toBe(false);
    expect(flats[0][2].unfold()[0] instanceof HTMLBrick).toBe(true);
    expect((<any>flats[0][2])['html'].startsWith('<img')).toBe(true);
    SurveyHelper.shouldConvertImageToPng = true;
});

test('Check createHTMLRect method with long html', async () => {
    const options: IDocOptions = TestHelper.defaultOptions;
    options.htmlRenderAs = 'standard';
    options.format = [150, 100];
    const controller: DocController = new DocController(options);
    const descPoint: IPoint = controller.leftTopPoint;
    const margins: any = { top: controller.margins.top, bottom: controller.margins.bot, width: controller.unitWidth };
    const result: number = descPoint.yTop;

    let actualRect: IRect = SurveyHelper.createHTMLRect(descPoint, controller, margins, result);
    expect(actualRect.yBot - actualRect.yTop).toBeCloseTo(7.2, 8);

    controller.helperDoc.addPage();
    actualRect = SurveyHelper.createHTMLRect(descPoint, controller, margins, result);
    expect(actualRect.yBot - actualRect.yTop).toBeCloseTo(217.2, 8);

    controller.helperDoc.addPage();
    controller.helperDoc.addPage();
    actualRect = SurveyHelper.createHTMLRect(descPoint, controller, margins, result);
    expect(actualRect.yBot - actualRect.yTop).toBeCloseTo(427.2, 8);
});

test('Check correctHtml method with multiple br tags', async () => {
    let survey: SurveyPDF = new SurveyPDF({}, TestHelper.defaultOptions);
    SurveyHelper.shouldConvertImageToPng = false;
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    const htmlFlat = new FlatHTML(survey, new QuestionHtmlModel('q1'), controller);
    expect(htmlFlat['correctHtml']('<span>Test</span><br>')).toEqual('<span>Test</span><br>');
    expect(htmlFlat['correctHtml']('<span>Test</span><br><br>')).toEqual('<span>Test</span><br>');
    expect(htmlFlat['correctHtml']('<span>Test</span><br>  <br>')).toEqual('<span>Test</span><br>');
    expect(htmlFlat['correctHtml']('<br><span>Test</span><br>')).toEqual('<br><span>Test</span><br>');
    expect(htmlFlat['correctHtml']('<br><br/>')).toEqual('<br>');
    expect(htmlFlat['correctHtml']('<br / ><br>')).toEqual('<br>');
    expect(htmlFlat['correctHtml']('<br></br>')).toEqual('<br>');
});