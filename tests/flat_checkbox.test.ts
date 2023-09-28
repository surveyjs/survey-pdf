(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { SurveyPDF } from '../src/survey';
import { IPoint, IRect, ISize, IDocOptions, DocOptions, DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatTextbox } from '../src/flat_layout/flat_textbox';
import { FlatCheckbox } from '../src/flat_layout/flat_checkbox';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { TextBrick } from '../src/pdf_render/pdf_text';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
const __dummy_tx: FlatTextbox = new FlatTextbox(null, null, null);
const __dummy_cb: FlatCheckbox = new FlatCheckbox(null, null, null);

test('Check other checkbox place ', async () => {
    const json: any = {
        questions: [
            {
                titleLocation: 'hidden',
                name: 'checkbox',
                type: 'checkbox',
                hasOther: true,
                otherText: 'Other(describe)'
            }
        ]
    };
    const options: IDocOptions = TestHelper.defaultOptions;
    options.format = [40.0, 297.0];
    const survey: SurveyPDF = new SurveyPDF(json, options);
    const controller: DocController = new DocController(options);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    const receivedRects: IRect[] = flats[0][0].unfold();
    controller.margins.left += controller.unitWidth;
    let currPoint: IPoint = controller.leftTopPoint;
    const assumeRects: IRect[] = [];
    const itemRect: IRect = SurveyHelper.moveRect(SurveyHelper.scaleRect(
        SurveyHelper.createRect(currPoint, controller.unitWidth, controller.unitHeight),
        SurveyHelper.SELECT_ITEM_FLAT_SCALE), currPoint.xLeft);
    assumeRects.push(itemRect);
    currPoint.xLeft = itemRect.xRight + controller.unitWidth * SurveyHelper.GAP_BETWEEN_ITEM_TEXT;
    const textFlats: IPdfBrick[] = (await SurveyHelper.createTextFlat(currPoint, survey.getAllQuestions()[0],
        controller, json.questions[0].otherText, TextBrick)).unfold();
    currPoint = SurveyHelper.createPoint(SurveyHelper.mergeRects(itemRect, ...textFlats));
    assumeRects.push(...textFlats);
    currPoint.yTop += controller.unitHeight * SurveyHelper.GAP_BETWEEN_ROWS;
    const textFieldRect: IRect = SurveyHelper.createTextFieldRect(currPoint, controller, 2);
    assumeRects.push(textFieldRect);
    TestHelper.equalRects(expect, receivedRects, assumeRects);
});
test('Check checkbox with colCount 4 with small font size 12', async () => {
    const json: any = {
        questions: [
            {
                titleLocation: 'hidden',
                name: 'checkbox',
                type: 'checkbox',
                choices: ['item1', 'item2', 'item3', 'item4', 'item5'],
                colCount: 4
            }
        ]
    };
    const options: IDocOptions = TestHelper.defaultOptions;
    options.fontSize = 12;
    const survey: SurveyPDF = new SurveyPDF(json, options);
    const controller: DocController = new DocController(options);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    controller.margins.left += controller.unitWidth;
    const receivedFlats: IRect[] = [];
    receivedFlats.push(...flats[0][0].unfold(), ...flats[0][1].unfold());
    const assumetFlats: IRect[] = [];
    let currPoint: IPoint = controller.leftTopPoint;
    for (let i: number = 0; i < 4; i++) {
        const itemRect: IRect = SurveyHelper.moveRect(SurveyHelper.scaleRect(
            SurveyHelper.createRect(currPoint, controller.unitWidth, controller.unitHeight),
            SurveyHelper.SELECT_ITEM_FLAT_SCALE), currPoint.xLeft);
        const textPoint: IPoint = SurveyHelper.clone(currPoint);
        textPoint.xLeft = itemRect.xRight + controller.unitWidth * SurveyHelper.GAP_BETWEEN_ITEM_TEXT;
        const textSize: ISize = controller.measureText(json.questions[0].choices[i]);
        const textRect: IRect = SurveyHelper.createRect(textPoint, textSize.width, textSize.height);
        assumetFlats.push(itemRect, textRect);
        currPoint.xLeft += SurveyHelper.getColumnWidth(controller, 4) +
            controller.unitWidth * SurveyHelper.GAP_BETWEEN_COLUMNS;
    }
    currPoint = controller.leftTopPoint;
    currPoint.yTop += controller.unitHeight;
    const rowLineFlat: IPdfBrick = SurveyHelper.createRowlineFlat(currPoint, controller);
    currPoint.yTop += rowLineFlat.yBot + controller.unitHeight;
    const itemRect: IRect = SurveyHelper.moveRect(SurveyHelper.scaleRect(
        SurveyHelper.createRect(currPoint, controller.unitWidth, controller.unitHeight),
        SurveyHelper.SELECT_ITEM_FLAT_SCALE), currPoint.xLeft);
    const textPoint: IPoint = SurveyHelper.clone(currPoint);
    textPoint.xLeft = 2 * itemRect.xRight - itemRect.xLeft;
    const textSize: ISize = controller.measureText(json.questions[0].choices[5]);
    const textRect: IRect = SurveyHelper.createRect(textPoint, textSize.width, textSize.height);
    assumetFlats.push(rowLineFlat, itemRect, textRect);
    TestHelper.equalRects(expect, receivedFlats, assumetFlats);
});
test('Check checkbox with colCount 4 with big font size 30', async () => {
    const json: any = {
        questions: [
            {
                titleLocation: 'hidden',
                name: 'checkbox',
                type: 'checkbox',
                choices: ['item1', 'item2', 'item3', 'item4', 'item5'],
                colCount: 4
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    const unfoldFlats: IRect[] = [];
    for (let i: number = 0; i < 5; i++) {
        unfoldFlats.push(...flats[0][i].unfold());
    }
    controller.margins.left += controller.unitWidth;
    const assumetFlats: IRect[] = [];
    const currPoint: IPoint = controller.leftTopPoint;
    for (let i: number = 0; i < 5; i++) {
        const itemRect: IRect = SurveyHelper.moveRect(SurveyHelper.scaleRect(
            SurveyHelper.createRect(currPoint, controller.unitWidth, controller.unitHeight),
            SurveyHelper.SELECT_ITEM_FLAT_SCALE), currPoint.xLeft);
        const textPoint: IPoint = SurveyHelper.clone(currPoint);
        textPoint.xLeft = itemRect.xRight + controller.unitWidth * SurveyHelper.GAP_BETWEEN_ITEM_TEXT;
        const textSize: ISize = controller.measureText(json.questions[0].choices[i]);
        const textRect: IRect = SurveyHelper.createRect(textPoint, textSize.width, textSize.height);
        assumetFlats.push(itemRect, textRect);
        currPoint.yTop += controller.unitHeight + SurveyHelper.GAP_BETWEEN_ROWS * controller.unitHeight;
    }
    TestHelper.equalRects(expect, unfoldFlats, assumetFlats);
});
test('Check checkbox with colCount 0 with big font size 30', async () => {
    const json: any = {
        questions: [
            {
                titleLocation: 'hidden',
                name: 'checkbox',
                type: 'checkbox',
                choices: ['item1', 'item2', 'item3', 'item4'],
                colCount: 0
            }
        ]
    };
    const options = TestHelper.defaultOptions;
    options.format = [210.0 + new DocController(options).unitWidth / DocOptions.MM_TO_PT, 297.0];
    const survey: SurveyPDF = new SurveyPDF(json, options);
    const controller: DocController = new DocController(options);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    const unfoldFlats: IRect[] = [];
    unfoldFlats.push(...flats[0][0].unfold(), ...flats[0][1].unfold(), ...flats[0][2].unfold());
    controller.margins.left += controller.unitWidth;
    const assumetFlats: IRect[] = [];
    let currPoint: IPoint = controller.leftTopPoint;
    for (let i: number = 0; i < 3; i++) {
        const itemRect: IRect = SurveyHelper.moveRect(SurveyHelper.scaleRect(
            SurveyHelper.createRect(currPoint, controller.unitWidth, controller.unitHeight),
            SurveyHelper.SELECT_ITEM_FLAT_SCALE), currPoint.xLeft);
        const textPoint: IPoint = SurveyHelper.clone(currPoint);
        textPoint.xLeft = itemRect.xRight + controller.unitWidth * SurveyHelper.GAP_BETWEEN_ITEM_TEXT;
        const textSize: ISize = controller.measureText(json.questions[0].choices[i]);
        const textRect: IRect = SurveyHelper.createRect(textPoint, textSize.width, textSize.height);
        assumetFlats.push(itemRect, textRect);
        currPoint.xLeft += SurveyHelper.getColumnWidth(controller, 3) +
            controller.unitWidth * SurveyHelper.GAP_BETWEEN_COLUMNS;
    }
    currPoint = controller.leftTopPoint;
    currPoint.yTop += controller.unitHeight;
    const rowLineRect: IPdfBrick = SurveyHelper.createRowlineFlat(currPoint, controller);
    currPoint.yTop = rowLineRect.yBot;
    currPoint.yTop += SurveyHelper.GAP_BETWEEN_ROWS * controller.unitHeight;
    const itemRect: IRect = SurveyHelper.moveRect(SurveyHelper.scaleRect(
        SurveyHelper.createRect(currPoint, controller.unitWidth, controller.unitHeight),
        SurveyHelper.SELECT_ITEM_FLAT_SCALE), currPoint.xLeft);
    const textPoint: IPoint = SurveyHelper.clone(currPoint);
    textPoint.xLeft = itemRect.xRight + controller.unitWidth * SurveyHelper.GAP_BETWEEN_ITEM_TEXT;
    const textSize: ISize = controller.measureText(json.questions[0].choices[3]);
    const textRect: IRect = SurveyHelper.createRect(textPoint, textSize.width, textSize.height);
    assumetFlats.push(rowLineRect, itemRect, textRect);
    TestHelper.equalRects(expect, unfoldFlats, assumetFlats);
});
test('Check checkbox with colCount 0 with small font size 12', async () => {
    const json: any = {
        questions: [
            {
                titleLocation: 'hidden',
                name: 'checkbox',
                type: 'checkbox',
                choices: ['item1', 'item2', 'item3', 'item4'],
                colCount: 0
            }
        ]
    };
    const options: IDocOptions = TestHelper.defaultOptions;
    options.fontSize = 12;
    const survey: SurveyPDF = new SurveyPDF(json, options);
    const controller: DocController = new DocController(options);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    const unfoldFlats: IRect[] = flats[0][0].unfold();
    controller.margins.left += controller.unitWidth;
    const assumetFlats: IRect[] = [];
    const currPoint = controller.leftTopPoint;
    for (let i: number = 0; i < 4; i++) {
        const itemRect: IRect = SurveyHelper.moveRect(SurveyHelper.scaleRect(
            SurveyHelper.createRect(currPoint, controller.unitWidth, controller.unitHeight),
            SurveyHelper.SELECT_ITEM_FLAT_SCALE), currPoint.xLeft);
        const text: ISize = controller.measureText(json.questions[0].choices[i]);
        const textPoint: IPoint = SurveyHelper.clone(currPoint);
        textPoint.xLeft = itemRect.xRight + controller.unitWidth * SurveyHelper.GAP_BETWEEN_ITEM_TEXT;
        const textRect: IRect = SurveyHelper.createRect(textPoint, text.width, text.height);
        assumetFlats.push(itemRect, textRect);
        currPoint.xLeft += SurveyHelper.getColumnWidth(controller, 4) +
            controller.unitWidth * SurveyHelper.GAP_BETWEEN_COLUMNS;
    }
    TestHelper.equalRects(expect, unfoldFlats, assumetFlats);
});
test('Check tagbox', async () => {
    const json: any = {
        questions: [
            {
                titleLocation: 'hidden',
                name: 'tagbox',
                type: 'tagbox',
                choices: ['item1', 'item2', 'item3', 'item4'],
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    const unfoldFlats: IRect[] = [];
    flats[0].forEach(brick => unfoldFlats.push(...brick.unfold()));
    controller.margins.left += controller.unitWidth;
    const assumetFlats: IRect[] = [];
    const currPoint: IPoint = controller.leftTopPoint;
    for (let i: number = 0; i < 4; i++) {
        const itemRect: IRect = SurveyHelper.moveRect(SurveyHelper.scaleRect(
            SurveyHelper.createRect(currPoint, controller.unitWidth, controller.unitHeight),
            SurveyHelper.SELECT_ITEM_FLAT_SCALE), currPoint.xLeft);
        const textPoint: IPoint = SurveyHelper.clone(currPoint);
        textPoint.xLeft = itemRect.xRight + controller.unitWidth * SurveyHelper.GAP_BETWEEN_ITEM_TEXT;
        const textSize: ISize = controller.measureText(json.questions[0].choices[i]);
        const textRect: IRect = SurveyHelper.createRect(textPoint, textSize.width, textSize.height);
        assumetFlats.push(itemRect, textRect);
        currPoint.yTop += controller.unitHeight + SurveyHelper.GAP_BETWEEN_ROWS * controller.unitHeight;
    }
    TestHelper.equalRects(expect, unfoldFlats, assumetFlats, true);
});

test('Tagbox: print selected choices', async () => {
    const json: any = {
        questions: [
            {
                titleLocation: 'hidden',
                name: 'tagbox',
                type: 'tagbox',
                defaultValue: ['item2', 'item3'],
                choices: ['item1', 'item2', 'item3', 'item4'],
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    controller['_tagboxSelectedChoicesOnly'] = true;
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    const unfoldFlats: IRect[] = [];
    flats[0].forEach(brick => unfoldFlats.push(...brick.unfold()));
    controller.margins.left += controller.unitWidth;
    const assumetFlats: IRect[] = [];
    const currPoint: IPoint = controller.leftTopPoint;
    for (let i: number = 1; i < 3; i++) {
        const itemRect: IRect = SurveyHelper.moveRect(SurveyHelper.scaleRect(
            SurveyHelper.createRect(currPoint, controller.unitWidth, controller.unitHeight),
            SurveyHelper.SELECT_ITEM_FLAT_SCALE), currPoint.xLeft);
        const textPoint: IPoint = SurveyHelper.clone(currPoint);
        textPoint.xLeft = itemRect.xRight + controller.unitWidth * SurveyHelper.GAP_BETWEEN_ITEM_TEXT;
        const textSize: ISize = controller.measureText(json.questions[0].choices[i]);
        const textRect: IRect = SurveyHelper.createRect(textPoint, textSize.width, textSize.height);
        assumetFlats.push(itemRect, textRect);
        currPoint.yTop += controller.unitHeight + SurveyHelper.GAP_BETWEEN_ROWS * controller.unitHeight;
    }
    TestHelper.equalRects(expect, unfoldFlats, assumetFlats, true);
    expect(unfoldFlats.length).toBe(4);
    expect((unfoldFlats[1] as TextBrick)['text']).toBe('item2');
    expect((unfoldFlats[3]as TextBrick)['text']).toBe('item3');
});