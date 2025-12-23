(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { SurveyPDF } from '../src/survey';
import { DocController, IPoint } from '../src/doc_controller';
import { AdornersOptions, AdornersPanelOptions, AdornersPageOptions } from '../src/event_handler/adorners';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { IFlatQuestion } from '../src/flat_layout/flat_question';
import { PagePacker } from '../src/page_layout/page_packer';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { CompositeBrick } from '../src/pdf_render/pdf_composite';
import { RowlineBrick } from '../src/pdf_render/pdf_rowline';
import { TestHelper } from '../src/helper_test';
import { TextFieldBrick } from '../src/pdf_render/pdf_textfield';
import { SurveyHelper } from '../src/helper_survey';
import '../src/flat_layout/flat_textbox';
import '../src/flat_layout/flat_checkbox';
import '../src/flat_layout/flat_radiogroup';

test('Event render questions simple textbox same bricks', async () => {
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
    survey.onRenderQuestion.add((_, __) => { });
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    let packs: IPdfBrick[][] = PagePacker.pack(flats, controller);
    expect(packs.length).toBe(1);
    expect(packs[0].length).toBe(1);
    expect(packs[0][0] instanceof TextFieldBrick).toBe(true);
});
test('Event render questions simple textbox add bottom description', async () => {
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
        let point: IPoint = SurveyHelper.createPoint(
            options.bricks[options.bricks.length - 1]);
        let descBrick: IPdfBrick = await SurveyHelper.createTextFlat(point, options.controller, 'Some description', { fontSize: 2.0 / 3.0 * controller.fontSize });
        options.bricks.push(descBrick);
    });
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    let packs: IPdfBrick[][] = PagePacker.pack(flats, controller);
    expect(packs.length).toBe(1);
    expect(packs[0].length).toBe(2);
    expect(packs[0][0] instanceof TextFieldBrick).toBe(true);
    expect(packs[0][1] instanceof CompositeBrick).toBe(true);
});
test('Event render questions checkbox as radiogroup', async () => {
    let json: any = {
        questions: [
            {
                type: 'checkbox',
                name: 'event_questioncheckasradio',
                titleLocation: 'hidden',
                choices: ['A', 'B']
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    survey.onRenderQuestion.add(async (survey: SurveyPDF, options: AdornersOptions) => {
        let flatQuestion: IFlatQuestion = options.repository.create(survey,
            options.question, options.controller, survey.getStylesForElement(options.question), 'radiogroup');
        options.bricks = await flatQuestion.generateFlats(options.point);
    });
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    let packs: IPdfBrick[][] = PagePacker.pack(flats, controller);
    expect(packs.length).toBe(1);
    expect(packs[0].length).toBe(2);
    expect(packs[0][0] instanceof CompositeBrick).toBe(true);
    expect(packs[0][1] instanceof CompositeBrick).toBe(true);
});
test('Event render panel simple panel same bricks', async () => {
    var json = {
        elements: [
            {
                type: 'panel',
                name: 'event_simplepanel',
                titleLocation: 'hidden',
                elements: [
                    {
                        type: 'text',
                        name: 'event_simplepaneltext',
                        titleLocation: 'hidden'
                    }
                ]
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    survey.onRenderPanel.add((_, __) => { });
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    let packs: IPdfBrick[][] = PagePacker.pack(flats, controller);
    expect(packs.length).toBe(1);
    expect(packs[0].length).toBe(1);
});
test('Event render panel simple panel add bottom description', async () => {
    var json = {
        elements: [
            {
                type: 'panel',
                name: 'event_simplepanel',
                titleLocation: 'hidden',
                elements: [
                    {
                        type: 'text',
                        name: 'event_simplepaneltext',
                        titleLocation: 'hidden'
                    }
                ]
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    survey.onRenderPanel.add(async (_, options: AdornersPanelOptions) => {
        let point: IPoint = SurveyHelper.createPoint(
            options.bricks[options.bricks.length - 1]);
        let descBrick: IPdfBrick = await SurveyHelper.createTextFlat(point, options.controller, 'Some description', { fontSize: 2.0 / 3.0 * controller.fontSize, fontStyle: 'bold' });
        options.bricks.push(descBrick);
    });
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    let packs: IPdfBrick[][] = PagePacker.pack(flats, controller);
    expect(packs.length).toBe(1);
    expect(packs[0].length).toBe(3);
    expect(packs[0][0] instanceof TextFieldBrick).toBe(true);
    expect(packs[0][1] instanceof RowlineBrick).toBe(true);
    expect(packs[0][2] instanceof CompositeBrick).toBe(true);
});
test('Event render panel simple panel same bricks', async () => {
    var json = {
        elements: [
            {
                type: 'panel',
                name: 'event_simplepanel',
                titleLocation: 'hidden',
                elements: [
                    {
                        type: 'text',
                        name: 'event_simplepaneltext',
                        titleLocation: 'hidden'
                    }
                ]
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    survey.onRenderPanel.add((_, __) => { });
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    let packs: IPdfBrick[][] = PagePacker.pack(flats, controller);
    expect(packs.length).toBe(1);
    expect(packs[0].length).toBe(1);
});
test('Event render panel simple panel add bottom description', async () => {
    var json = {
        elements: [
            {
                type: 'panel',
                name: 'event_simplepanel',
                titleLocation: 'hidden',
                elements: [
                    {
                        type: 'text',
                        name: 'event_simplepaneltext',
                        titleLocation: 'hidden'
                    }
                ]
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    survey.onRenderPanel.add(async (_, options: AdornersPanelOptions) => {
        let point: IPoint = SurveyHelper.createPoint(
            options.bricks[options.bricks.length - 1]);
        let descBrick: IPdfBrick = await SurveyHelper.createTextFlat(point, options.controller, 'Some description', { fontSize: 2.0 / 3.0 * controller.fontSize, fontStyle: 'bold' });
        options.bricks.push(descBrick);
    });
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    let packs: IPdfBrick[][] = PagePacker.pack(flats, controller);
    expect(packs.length).toBe(1);
    expect(packs[0].length).toBe(3);
    expect(packs[0][0] instanceof TextFieldBrick).toBe(true);
    expect(packs[0][1] instanceof RowlineBrick).toBe(true);
    expect(packs[0][2] instanceof CompositeBrick).toBe(true);
});
test('Event render page simple page same bricks', async () => {
    var json = {
        pages: [
            {
                elements: [
                    {
                        type: 'text',
                        name: 'event_simplepagetext',
                        titleLocation: 'hidden'
                    }
                ]
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    survey.onRenderPage.add((_, __) => { });
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    let packs: IPdfBrick[][] = PagePacker.pack(flats, controller);
    expect(packs.length).toBe(1);
    expect(packs[0].length).toBe(1);
});
test('Event render page simple page add bottom description', async () => {
    var json = {
        pages: [
            {
                elements: [
                    {
                        type: 'text',
                        name: 'event_simplepagetext',
                        titleLocation: 'hidden'
                    }
                ]
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    survey.onRenderPage.add(async (_, options: AdornersPageOptions) => {
        let point: IPoint = SurveyHelper.createPoint(
            options.bricks[options.bricks.length - 1]);
        let descBrick: IPdfBrick = await SurveyHelper.createTextFlat(point, options.controller, 'Some description', { fontSize: 2.0 / 3.0 * controller.fontSize, fontStyle: 'bold' });
        options.bricks.push(descBrick);
    });
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    let packs: IPdfBrick[][] = PagePacker.pack(flats, controller);
    expect(packs.length).toBe(1);
    expect(packs[0].length).toBe(3);
    expect(packs[0][0] instanceof TextFieldBrick).toBe(true);
    expect(packs[0][1] instanceof RowlineBrick).toBe(true);
    expect(packs[0][2] instanceof CompositeBrick).toBe(true);
});
