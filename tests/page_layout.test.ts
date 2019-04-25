(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
    return {};
};

import { Question } from 'survey-core';
import { PagePacker } from '../src/page_layout/page_packer';
import { PdfSurvey } from '../src/survey';
import { IPoint, IRect, IDocOptions, DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatCheckbox } from '../src/flat_layout/flat_checkbox';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { TitleBrick } from '../src/pdf_render/pdf_title';
import { TextFieldBrick } from '../src/pdf_render/pdf_textfield';
import { TestHelper } from '../src/helper_test';
import { SurveyHelper } from '../src/helper_survey';
let __dummy_cb = new FlatCheckbox(null, null);

test('Pack one flat', () => {
    let flats: IRect[] = [TestHelper.defaultRect];
    let packs: IPdfBrick[][] = PagePacker.pack(TestHelper.wrapRects(flats),
        new DocController(TestHelper.defaultOptions));
    TestHelper.equalRect(expect, packs[0][0], TestHelper.defaultRect);
});
test('Pack two flats on two pages', () => {
    let flats: IRect[] = [TestHelper.defaultRect, TestHelper.defaultRect];
    flats[1].yTop += 10; flats[1].yBot += 10;
    let options: IDocOptions = TestHelper.defaultOptions;
    options.paperHeight = flats[0].yBot + options.margins.marginBot;
    let packs: IPdfBrick[][] = PagePacker.pack(TestHelper.wrapRects(flats),
        new DocController(options));
    TestHelper.equalRect(expect, packs[0][0], TestHelper.defaultRect);
    TestHelper.equalRect(expect, packs[1][0], TestHelper.defaultRect);
});
test('Long checkbox with indent', () => {
    let json = {
        questions: [
            {
                type: 'checkbox',
                name: 'box',
                title: 'Snake',
                indent: 3,
                choices: [
                    'azu',
                    'buky',
                    'vede',
                    'glagoli',
                    'dobro'
                ]
            }
        ]
    };
    let options: IDocOptions = TestHelper.defaultOptions;
    let controller: DocController = new DocController(options);
    options.paperHeight = options.margins.marginTop +
        controller.measureText().height * 3 + options.margins.marginBot;
    let survey: PdfSurvey = new PdfSurvey(json, options);
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(5);
    let packs: IPdfBrick[][] = PagePacker.pack(flats, survey.controller);
    expect(packs.length).toBe(2);
    expect(packs[0].length).toBe(2);
    expect(packs[1].length).toBe(3);
    let leftTopPoint: IPoint = survey.controller.leftTopPoint;
    leftTopPoint.xLeft += survey.controller.measureText(json.questions[0].indent).width;
    TestHelper.equalPoint(expect, packs[0][0], leftTopPoint);
    leftTopPoint.yTop += survey.controller.measureText().height * 2;
    TestHelper.equalPoint(expect, packs[0][1], leftTopPoint);
    leftTopPoint.yTop = survey.controller.leftTopPoint.yTop;
    for (let i = 0; i < 3; i++) {
        TestHelper.equalPoint(expect, packs[1][i], leftTopPoint);
        leftTopPoint.yTop += survey.controller.measureText().height;
    }
});
test.skip('Check two textbox flats sort order', () => {
    let json = {
        questions: [
            {
                type: 'text',
                name: 'textbox',
                title: 'Sort'
            },
            {
                type: 'text',
                name: 'textbox',
                title: 'This',
                startWithNewLine: false
            }
        ]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    let packs: IPdfBrick[][] = PagePacker.pack(flats, survey.controller);
    expect(flats.length).toBe(4);
    expect(packs[0][0] instanceof TitleBrick).toBe(true);
    expect(packs[0][1] instanceof TitleBrick).toBe(true);
    expect(packs[0][2] instanceof TextFieldBrick).toBe(true);
    expect(packs[0][3] instanceof TextFieldBrick).toBe(true);
});
test('Pack near flats', () => {
    let flats: IRect[] = [
        { xLeft: 10, xRight: 20, yTop: 10, yBot: 20 },
        { xLeft: 20, xRight: 30, yTop: 10, yBot: 20 },
        { xLeft: 10, xRight: 20, yTop: 20, yBot: 30 },
        { xLeft: 20, xRight: 30, yTop: 20, yBot: 30 },
    ];
    let packs: IPdfBrick[][] = PagePacker.pack(TestHelper.wrapRects(flats),
        new DocController(TestHelper.defaultOptions));
    TestHelper.equalRect(expect, packs[0][0],
        { xLeft: 10, xRight: 20, yTop: 10, yBot: 20 });
    TestHelper.equalRect(expect, packs[0][1],
        { xLeft: 20, xRight: 30, yTop: 10, yBot: 20 });
    TestHelper.equalRect(expect, packs[0][2],
        { xLeft: 10, xRight: 20, yTop: 20, yBot: 30 });
    TestHelper.equalRect(expect, packs[0][3],
        { xLeft: 20, xRight: 30, yTop: 20, yBot: 30 });
});
test('Pack near flats new page', () => {
    let flats: IRect[] = [
        { xLeft: 10, xRight: 20, yTop: 10, yBot: 20 },
        { xLeft: 20, xRight: 30, yTop: 10, yBot: 20 },
        { xLeft: 10, xRight: 20, yTop: 20, yBot: 30 },
        { xLeft: 20, xRight: 30, yTop: 20, yBot: 30 },
    ];
    let options: IDocOptions = TestHelper.defaultOptions;
    options.paperHeight = flats[0].yBot + options.margins.marginBot;
    let packs: IPdfBrick[][] = PagePacker.pack(TestHelper.wrapRects(flats),
        new DocController(options));
        TestHelper.equalRect(expect, packs[0][0],
            { xLeft: 10, xRight: 20, yTop: 10, yBot: 20 });
        TestHelper.equalRect(expect, packs[0][1],
            { xLeft: 20, xRight: 30, yTop: 10, yBot: 20 });
        TestHelper.equalRect(expect, packs[1][0],
            { xLeft: 10, xRight: 20, yTop: 10, yBot: 20 });
        TestHelper.equalRect(expect, packs[1][1],
            { xLeft: 20, xRight: 30, yTop: 10, yBot: 20 });
});