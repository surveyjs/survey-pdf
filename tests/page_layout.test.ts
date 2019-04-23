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
import { calcIndent } from './flat_layout.test';
import { TestHelper } from '../src/helper_test';
let __dummy_cb = new FlatCheckbox(null, null);

test('Pack one flat', () => {
    let flats: IRect[] = [TestHelper.defaultRect];
    let packs: IPdfBrick[][] = PagePacker.pack(TestHelper.wrapRects(flats),
        new DocController(TestHelper.defaultOptions));
    TestHelper.equalRect(expect, packs[0][0], flats[0]);
});
test.skip('Pack two flats on two pages', () => {
    let flats: IRect[] = [TestHelper.defaultRect, TestHelper.defaultRect];
    flats[1].yTop += 10; flats[1].yBot += 10;
    let options: IDocOptions = TestHelper.defaultOptions;
    options.paperHeight = flats[0].yBot;
    let packs: IPdfBrick[][] = PagePacker.pack(TestHelper.wrapRects(flats),
        new DocController(TestHelper.defaultOptions));
    TestHelper.equalRect(expect, packs[0][0], flats[0]);
    TestHelper.equalRect(expect, packs[1][0], flats[0]);
});
test.skip('Long checkbox with indent', () => {
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
    options.paperHeight = options.margins.marginTop + controller.measureText().height * 3;
    let survey: PdfSurvey = new PdfSurvey(json, options);
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(11);
    let packs: IPdfBrick[][] = PagePacker.pack(flats, controller);
    expect(packs.length).toBe(2);
    expect(packs[0].length).toBe(5);
    expect(packs[1].length).toBe(6);
    let leftTopPoint: IPoint = survey.controller.leftTopPoint;
    leftTopPoint.xLeft += survey.controller.measureText(json.questions[0].indent).width;
    calcIndent(expect, leftTopPoint, survey.controller, flats[1], flats[2],
        json.questions[0].choices[0], <Question>survey.getAllQuestions()[0], flats[0]);
    leftTopPoint.yTop += survey.controller.measureText().height;
    calcIndent(expect, leftTopPoint, survey.controller,
        packs[0][3], packs[0][4], json.questions[0].choices[1]);
    leftTopPoint.yTop += survey.controller.measureText().height;
    for (let i = 2; i < json.questions[0].choices.length; i++) {
        calcIndent(expect, leftTopPoint, survey.controller, packs[1][(i - 2) * 2],
            packs[1][(i - 2) * 2 + 1], json.questions[0].choices[i]);        
        leftTopPoint.yTop += survey.controller.measureText().height;
    }
});
test('Check two textbox flats sort order', () => {
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