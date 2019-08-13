(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { SurveyPDF } from '../src/survey';
import { DocController, IPoint } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatTextbox } from '../src/flat_layout/flat_textbox';
import { PagePacker } from '../src/page_layout/page_packer';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { DescriptionBrick } from '../src/pdf_render/pdf_description';
import { TextBoxBrick } from '../src/pdf_render/pdf_textbox';
import { AdornersOptions } from '../src/event_handler/adorners';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
let __dummy_tx = new FlatTextbox(null, null);

test.skip('Event render questions simple textbox same bricks', async () => {
    let json: any = {
        questions: [
            {
                type: 'text',
                name: 'event_questionsimpletext',
                titleLocation: 'hidden'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    survey.onRenderQuestion.add((_, options: AdornersOptions) => { });
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    let packs: IPdfBrick[][] = PagePacker.pack(flats, controller);
    expect(packs.length).toBe(1);
    expect(packs[0].length).toBe(1);
    expect(packs[0] instanceof TextBoxBrick).toBe(true);
});
test.skip('Event render questions simple textbox add bottom description', async () => {
    let json: any = {
        questions: [
            {
                type: 'text',
                name: 'event_questionsimpletext',
                titleLocation: 'hidden'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    survey.onRenderQuestion.add(async (_, options: AdornersOptions) => {
        let point: IPoint = SurveyHelper.createPoint(options.rect);
        let descBrick: IPdfBrick = await SurveyHelper.createDescFlat(point,
            options.question, options.controller, 'Some description');
        options.bricks.push(descBrick);
     });
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    let packs: IPdfBrick[][] = PagePacker.pack(flats, controller);
    expect(packs.length).toBe(1);
    expect(packs[0].length).toBe(2);
    expect(packs[0] instanceof TextBoxBrick).toBe(true);
    expect(packs[1] instanceof DescriptionBrick).toBe(true);
});