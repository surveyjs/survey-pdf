(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { SurveyPDF } from '../src/survey';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatTextbox } from '../src/flat_layout/flat_textbox';
import { PagePacker } from '../src/page_layout/page_packer';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { EventHandler } from '../src/event_handler/event_handler';
import { DrawCanvas } from '../src/event_handler/draw_canvas';
import { TitleBrick } from '../src/pdf_render/pdf_title';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
let __dummy_tx = new FlatTextbox(null, null);

test('Event render header simple text', async () => {
    let json: any = {
        questions: [
            {
                type: 'text',
                name: 'event_simpletext',
                titleLocation: 'hidden'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    survey.onRenderHeader.add((_, canvas: DrawCanvas) => {
        canvas.drawText({
            text: 'SimpleHeaderText',
            rect: canvas.rect
        })
    });
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    let packs: IPdfBrick[][] = PagePacker.pack(flats, survey.controller);
    expect(packs.length).toBe(1);
    expect(packs[0].length).toBe(1);
    EventHandler.process_events(survey, packs);
    expect(packs.length).toBe(1);
    expect(packs[0].length).toBe(2);
    TestHelper.equalRect(expect, packs[0][1], SurveyHelper.createHeaderRect(survey.controller));
});
test('Event render header bold text', async () => {
    let json: any = {
        questions: [
            {
                type: 'text',
                name: 'event_boldtext',
                titleLocation: 'hidden'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    survey.onRenderHeader.add((_, canvas: DrawCanvas) => {
        canvas.drawText({
            text: 'Doing sports',
            isBold: true,
            rect: canvas.rect
        })
    });
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    let packs: IPdfBrick[][] = PagePacker.pack(flats, survey.controller);
    expect(packs.length).toBe(1);
    expect(packs[0].length).toBe(1);
    EventHandler.process_events(survey, packs);
    expect(packs.length).toBe(1);
    expect(packs[0].length).toBe(2);
    TestHelper.equalRect(expect, packs[0][1], SurveyHelper.createHeaderRect(survey.controller));
    expect(packs[0][1] instanceof TitleBrick).toBe(true);
});