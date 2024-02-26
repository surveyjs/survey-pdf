
/**
 * @jest-environment node
 */
import { SurveyPDF } from '../src/survey';
import { DocController, IRect } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { TestHelper } from '../src/helper_test';
import { EmptyBrick } from '../src/pdf_render/pdf_empty';
import { SurveyHelper } from '../src/helper_survey';
import { CompositeBrick } from '../src/pdf_render/pdf_composite';
import { ImageBrick } from '../src/pdf_render/pdf_image';

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
    const emptyBrick = flats[0][0].unfold()[0];
    expect(emptyBrick instanceof EmptyBrick).toBe(true);
    expect(emptyBrick.height).toEqual(0);
    expect(emptyBrick.width).toEqual(0);
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
    const htmlBrick = (<CompositeBrick>flats[0][0])['bricks'][0];
    expect(htmlBrick instanceof EmptyBrick).toBeTruthy();
    let assumeHTML: IRect = {
        xLeft: controller.leftTopPoint.xLeft + controller.unitWidth,
        xRight: controller.leftTopPoint.xLeft + controller.unitWidth +
            SurveyHelper.pxToPt((<any>survey.getAllQuestions()[0]).signatureWidth),
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop +
            SurveyHelper.pxToPt((<any>survey.getAllQuestions()[0]).signatureHeight)
    };
    TestHelper.equalRect(expect, htmlBrick, assumeHTML);
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