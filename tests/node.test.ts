
/**
 * @jest-environment node
 */
import { SurveyPDF } from '../src/survey';
import { DocController, IRect } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { IPdfBrick, PdfBrick } from '../src/pdf_render/pdf_brick';
import { TestHelper } from '../src/helper_test';
import { EmptyBrick } from '../src/pdf_render/pdf_empty';
import { SurveyHelper } from '../src/helper_survey';
import { CompositeBrick } from '../src/pdf_render/pdf_composite';
import { ImageBrick } from '../src/pdf_render/pdf_image';
import '../src/entries/pdf-base';
import { HTMLBrick } from '../src/entries/pdf-base';

test('Check html brick is empty when document is not defined', async () => {
    let json: any = {
        elements: [
            {
                type: 'html',
                name: 'html_chooserender_standard',
                html: '<b>STRONG POWER</b>'
            },
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    const emptyBrick = flats[0][0].unfold()[0] as PdfBrick;
    expect(emptyBrick instanceof EmptyBrick).toBe(true);
    expect(emptyBrick.contentRect.height).toBeCloseTo(0);
    expect(emptyBrick.contentRect.width).toBeCloseTo(0);
});

test('Check signaturepad with empty value', async () => {
    let json: any = {
        questions: [
            {
                type: 'signaturepad',
                name: 'sigpadque',
                titleLocation: 'hidden',
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    expect(flats[0][0] instanceof CompositeBrick).toBeTruthy();
    expect((<CompositeBrick>flats[0][0])['bricks'].length).toBe(1);
    const htmlBrick = (<CompositeBrick>flats[0][0])['bricks'][0] as HTMLBrick;
    expect(htmlBrick instanceof EmptyBrick).toBeTruthy();
    expect(htmlBrick.contentRect.width).toBeCloseTo(
        SurveyHelper.pxToPt((<any>survey.getAllQuestions()[0]).signatureWidth));
    expect(htmlBrick.contentRect.height).toBeCloseTo(
        SurveyHelper.pxToPt((<any>survey.getAllQuestions()[0]).signatureHeight));
});

test('Check image with non base64 link', async () => {
    const json: any = {
        elements: [
            {
                type: 'image',
                name: 'image_question',
                titleLocation: 'hidden',
                imageLink: 'https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg'
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    try {
        await survey.raw();
    } catch {
        throw(new Error('Could not export pdf'));
    }
});