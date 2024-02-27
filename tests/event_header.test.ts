(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { SurveyPDF } from '../src/survey';
import { IRect, ISize, DocOptions, DocController } from '../src/doc_controller';
import { EventHandler } from '../src/event_handler/event_handler';
import { DrawCanvas, HorizontalAlign, VerticalAlign } from '../src/event_handler/draw_canvas';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatTextbox } from '../src/flat_layout/flat_textbox';
import { PagePacker } from '../src/page_layout/page_packer';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { TextBoldBrick } from '../src/pdf_render/pdf_textbold';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
let __dummy_tx = new FlatTextbox(null, null, null);

test('Event render header simple text', async () => {
    let json: any = {
        questions: [
            {
                type: 'text',
                name: 'event_headersimpletext',
                titleLocation: 'hidden'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    survey.onRenderHeader.add((_, canvas: DrawCanvas) => {
        canvas.drawText({
            text: 'SimpleHeaderText',
            rect: canvas.rect
        });
    });
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    let packs: IPdfBrick[][] = PagePacker.pack(flats, controller);
    expect(packs.length).toBe(1);
    expect(packs[0].length).toBe(1);
    EventHandler.process_header_events(survey, controller, packs);
    expect(packs.length).toBe(1);
    expect(packs[0].length).toBe(2);
    TestHelper.equalRect(expect, packs[0][1], SurveyHelper.createHeaderRect(controller));
});
test('Event render header bold text', async () => {
    let json: any = {
        questions: [
            {
                type: 'text',
                name: 'event_headerboldtext',
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
        });
    });
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    let packs: IPdfBrick[][] = PagePacker.pack(flats, controller);
    expect(packs.length).toBe(1);
    expect(packs[0].length).toBe(1);
    EventHandler.process_header_events(survey, controller, packs);
    expect(packs.length).toBe(1);
    expect(packs[0].length).toBe(2);
    TestHelper.equalRect(expect, packs[0][1], SurveyHelper.createHeaderRect(controller));
    expect(packs[0][1] instanceof TextBoldBrick).toBe(true);
});
test('Event render header left top text', async () => {
    let json: any = {
        questions: [
            {
                type: 'text',
                name: 'event_headerlefttoptext',
                titleLocation: 'hidden'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let text: string = 'First on page';
    survey.onRenderHeader.add((_, canvas: DrawCanvas) => {
        canvas.drawText({
            text: text,
            horizontalAlign: HorizontalAlign.Left,
            verticalAlign: VerticalAlign.Top
        });
    });
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    let packs: IPdfBrick[][] = PagePacker.pack(flats, controller);
    expect(packs.length).toBe(1);
    expect(packs[0].length).toBe(1);
    EventHandler.process_header_events(survey, controller, packs);
    expect(packs.length).toBe(1);
    expect(packs[0].length).toBe(2);
    let textSize: ISize = controller.measureText(text, 'normal', DocOptions.FONT_SIZE);
    TestHelper.equalRect(expect, packs[0][1], SurveyHelper.createRect(
        { xLeft: 0, yTop: 0 }, textSize.width, textSize.height));
});
test('Event render header center middle text', async () => {
    let json: any = {
        questions: [
            {
                type: 'text',
                name: 'event_headercentermiddleext',
                titleLocation: 'hidden'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let text: string = 'In the spotlight';
    survey.onRenderHeader.add((_, canvas: DrawCanvas) => {
        canvas.drawText({
            text: text,
            horizontalAlign: HorizontalAlign.Center,
            verticalAlign: VerticalAlign.Middle
        });
    });
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    let packs: IPdfBrick[][] = PagePacker.pack(flats, controller);
    expect(packs.length).toBe(1);
    expect(packs[0].length).toBe(1);
    EventHandler.process_header_events(survey, controller, packs);
    expect(packs.length).toBe(1);
    expect(packs[0].length).toBe(2);
    let textSize: ISize = controller.measureText(text, 'normal', DocOptions.FONT_SIZE);
    let headerRect: IRect = SurveyHelper.createHeaderRect(controller);
    let assumeText: IRect = {
        xLeft: (headerRect.xRight - headerRect.xLeft - textSize.width) / 2.0,
        xRight: (headerRect.xRight - headerRect.xLeft + textSize.width) / 2.0,
        yTop: (headerRect.yBot - headerRect.yTop - textSize.height) / 2.0,
        yBot: (headerRect.yBot - headerRect.yTop + textSize.height) / 2.0
    };
    TestHelper.equalRect(expect, packs[0][1], assumeText);
});
test('Event render footer center middle text', async () => {
    let json: any = {
        questions: [
            {
                type: 'text',
                name: 'event_footercentermiddletext',
                titleLocation: 'hidden'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDFTester(json, TestHelper.defaultOptions);
    let text: string = 'Exactly in the cendle';
    survey.onRenderFooter.add((_, canvas: DrawCanvas) => {
        canvas.drawText({
            text: text,
            horizontalAlign: HorizontalAlign.Center,
            verticalAlign: VerticalAlign.Middle
        });
    });
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    let packs: IPdfBrick[][] = PagePacker.pack(flats, controller);
    expect(packs.length).toBe(1);
    expect(packs[0].length).toBe(1);
    await EventHandler.process_header_events(survey, controller, packs);
    expect(packs.length).toBe(1);
    expect(packs[0].length).toBe(2);
    let textSize: ISize = controller.measureText(text, 'normal', DocOptions.FONT_SIZE);
    let footerRect: IRect = SurveyHelper.createFooterRect(controller);
    let assumeText: IRect = {
        xLeft: (footerRect.xLeft + footerRect.xRight - textSize.width) / 2.0,
        xRight: (footerRect.xLeft + footerRect.xRight + textSize.width) / 2.0,
        yTop: (footerRect.yTop + footerRect.yBot - textSize.height) / 2.0,
        yBot: (footerRect.yTop + footerRect.yBot + textSize.height) / 2.0
    };
    TestHelper.equalRect(expect, packs[0][1], assumeText);
});
class SurveyPDFTester extends SurveyPDF {
    public get haveCommercialLicense(): boolean { return true; }
}
test('Have commercial license: true', async () => {
    let json: any = {
        questions: [
            {
                type: 'text',
                name: 'event_commercialtrue',
                titleLocation: 'hidden'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDFTester(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    let packs: IPdfBrick[][] = PagePacker.pack(flats, controller);
    expect(packs.length).toBe(1);
    expect(packs[0].length).toBe(1);
    EventHandler.process_header_events(survey, controller, packs);
    expect(packs.length).toBe(1);
    expect(packs[0].length).toBe(1);
});
test('Have commercial license: false', async () => {
    let json: any = {
        questions: [
            {
                type: 'text',
                name: 'event_commercialfalse',
                titleLocation: 'hidden'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    let packs: IPdfBrick[][] = PagePacker.pack(flats, controller);
    expect(packs.length).toBe(1);
    expect(packs[0].length).toBe(1);
    EventHandler.process_header_events(survey, controller, packs);
    expect(packs.length).toBe(1);
    expect(packs[0].length).toBe(2);
});