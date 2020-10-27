(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
  return {};
};

import { SurveyPDF } from '../src/survey';
import { DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatBoolean } from '../src/flat_layout/flat_boolean';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { TextBrick } from '../src/pdf_render/pdf_text';
import { BooleanItemBrick } from '../src/entries/pdf';
import { TestHelper } from '../src/helper_test';
import { SurveyHelper } from '../src/helper_survey';
let __dummy_bl = new FlatBoolean(null, null, null);

test('Check boolean undefined', async () => {
    let json: any = {
        questions: [
            {
                type: 'boolean',
                name: 'bool_undefined',
                titleLocation: 'hidden',
                labelTrue: 'Y',
                labelFalse: 'N'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let unfoldFlats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldFlats.length).toBe(1);
    expect(unfoldFlats[0] instanceof BooleanItemBrick);
});
test('Check boolean true', async () => {
    let json: any = {
        questions: [
            {
                type: 'boolean',
                name: 'bool_undefined',
                titleLocation: 'hidden',
                labelTrue: 'Y',
                labelFalse: 'N',
                defaultValue: true
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let unfoldFlats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldFlats.length).toBe(2);
    expect(unfoldFlats[0] instanceof BooleanItemBrick);
    expect(unfoldFlats[1] instanceof TextBrick);
    expect(unfoldFlats[1].xLeft).toBe(unfoldFlats[0].xRight +
        controller.unitWidth * SurveyHelper.GAP_BETWEEN_ITEM_TEXT);
    expect((<TextBrick>unfoldFlats[1])['text']).toBe(json.questions[0].labelTrue);
});
test('Check boolean false', async () => {
    let json: any = {
        questions: [
            {
                type: 'boolean',
                name: 'bool_undefined',
                titleLocation: 'hidden',
                labelTrue: 'Y',
                labelFalse: 'N',
                defaultValue: false
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let unfoldFlats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldFlats.length).toBe(2);
    expect(unfoldFlats[0] instanceof BooleanItemBrick);
    expect(unfoldFlats[1] instanceof TextBrick);
    expect(unfoldFlats[1].xLeft).toBe(unfoldFlats[0].xRight +
        controller.unitWidth * SurveyHelper.GAP_BETWEEN_ITEM_TEXT);
    expect((<TextBrick>unfoldFlats[1])['text']).toBe(json.questions[0].labelFalse);
});