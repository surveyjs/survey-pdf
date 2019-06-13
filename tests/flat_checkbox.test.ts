(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { SurveyPDF } from '../src/survey';
import { IRect, IDocOptions } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatTextbox } from '../src/flat_layout/flat_textbox';
import { FlatCheckbox } from '../src/flat_layout/flat_checkbox';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { TextBrick } from '../src/pdf_render/pdf_text';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
let __dummy_tx = new FlatTextbox(null, null);
let __dummy_cb = new FlatCheckbox(null, null);

test('Check other checkbox place ', async () => {
    let json = {
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
    let options: IDocOptions = TestHelper.defaultOptions;
    options.format = [40.0, 297.0];
    let survey: SurveyPDF = new SurveyPDF(json, options);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    let receivedRects: IRect[] = flats[0][0].unfold();
    let currPoint = TestHelper.defaultPoint;
    let minHeight: number = survey.controller.unitWidth;
    let assumeRects: IRect[] = [];
    let itemRect: IRect = SurveyHelper.moveRect(SurveyHelper.scaleRect(
        SurveyHelper.createRect(currPoint, minHeight, minHeight),
        SurveyHelper.SELECT_ITEM_FLAT_SCALE), currPoint.xLeft);
    assumeRects.push(itemRect);
    currPoint.xLeft = 2 * itemRect.xRight - itemRect.xLeft;
    let textRect =
        (await SurveyHelper.createTextFlat(currPoint, survey.getAllQuestions()[0], survey.controller, json.questions[0].otherText, TextBrick)).unfold();
    currPoint = SurveyHelper.createPoint(SurveyHelper.mergeRects(itemRect, ...textRect));
    assumeRects.push(...textRect);
    let textFieldRect = SurveyHelper.createTextFieldRect(currPoint, survey.controller, 2);
    assumeRects.push(textFieldRect);
    TestHelper.equalRects(expect, receivedRects, assumeRects);
});
test('Check checkbox with colCount 4 with small font size 12', async () => {
    let json = {
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
    let options = TestHelper.defaultOptions;
    options.fontSize = 12;
    let survey: SurveyPDF = new SurveyPDF(json, options);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    let receivedFlats: IRect[] = [];;
    receivedFlats.push(...flats[0][0].unfold(), ...flats[0][1].unfold());
    let minHeight = survey.controller.unitHeight;
    let assumetFlats: IRect[] = [];
    let currPoint = TestHelper.defaultPoint;
    for (let i: number = 0; i < 4; i++) {
        let itemRect = SurveyHelper.moveRect(SurveyHelper.scaleRect(
            SurveyHelper.createRect(currPoint, minHeight, minHeight),
            SurveyHelper.SELECT_ITEM_FLAT_SCALE), currPoint.xLeft);
        let textPoint = SurveyHelper.clone(currPoint);
        textPoint.xLeft = 2 * itemRect.xRight - itemRect.xLeft;
        let text = survey.controller.measureText(json.questions[0].choices[i]);
        let textRect = SurveyHelper.createRect(textPoint, text.width, text.height)
        assumetFlats.push(itemRect, textRect);
        currPoint.xLeft += SurveyHelper.getColumnWidth(survey.controller, 4) +
            survey.controller.measureText().width * SurveyHelper.GAP_BETWEEN_COLUMNS;;
    }
    currPoint = TestHelper.defaultPoint;
    currPoint.yTop += minHeight;
    let rowLineRect = SurveyHelper.createRowlineFlat(currPoint, survey.controller);
    currPoint.yTop += rowLineRect.yBot + minHeight;
    let itemRect = SurveyHelper.moveRect(SurveyHelper.scaleRect(
        SurveyHelper.createRect(currPoint, minHeight, minHeight),
        SurveyHelper.SELECT_ITEM_FLAT_SCALE), currPoint.xLeft);
    let textPoint = SurveyHelper.clone(currPoint);
    textPoint.xLeft = 2 * itemRect.xRight - itemRect.xLeft;
    let text = survey.controller.measureText(json.questions[0].choices[5]);
    let textRect = SurveyHelper.createRect(textPoint, text.width, text.height)
    assumetFlats.push(rowLineRect, itemRect, textRect);
    TestHelper.equalRects(expect, receivedFlats, assumetFlats);
});
test('Check checkbox with colCount 4 with big font size 30', async () => {
    let json = {
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
    let options = TestHelper.defaultOptions;
    let survey: SurveyPDF = new SurveyPDF(json, options);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    let receivedFlats: IRect[] = [];;
    for (let i: number = 0; i < 5; i++) {
        receivedFlats.push(...flats[0][i].unfold());
    }
    let minHeight = survey.controller.unitHeight;
    let assumetFlats: IRect[] = [];
    let currPoint = TestHelper.defaultPoint;
    for (let i: number = 0; i < 5; i++) {
        let itemRect = SurveyHelper.moveRect(SurveyHelper.scaleRect(
            SurveyHelper.createRect(currPoint, minHeight, minHeight),
            SurveyHelper.SELECT_ITEM_FLAT_SCALE), currPoint.xLeft);
        let textPoint = SurveyHelper.clone(currPoint);
        textPoint.xLeft = 2 * itemRect.xRight - itemRect.xLeft;
        let text = survey.controller.measureText(json.questions[0].choices[i]);
        let textRect = SurveyHelper.createRect(textPoint, text.width, text.height)
        assumetFlats.push(itemRect, textRect);
        currPoint.yTop += minHeight + SurveyHelper.GAP_BETWEEN_ROWS * minHeight;
    }
    TestHelper.equalRects(expect, receivedFlats, assumetFlats);
});
test('Check checkbox with colCount 0 with big font size 30', async () => {
    let json = {
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
    let options = TestHelper.defaultOptions;
    let survey: SurveyPDF = new SurveyPDF(json, options);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    let receivedFlats: IRect[] = [];;
    receivedFlats.push(...flats[0][0].unfold(), ...flats[0][1].unfold(), ...flats[0][2].unfold());
    let minHeight = survey.controller.unitHeight;
    let assumetFlats: IRect[] = [];
    let currPoint = TestHelper.defaultPoint;
    for (let i: number = 0; i < 3; i++) {
        let itemRect = SurveyHelper.moveRect(SurveyHelper.scaleRect(
            SurveyHelper.createRect(currPoint, minHeight, minHeight),
            SurveyHelper.SELECT_ITEM_FLAT_SCALE), currPoint.xLeft);
        let textPoint = SurveyHelper.clone(currPoint);
        textPoint.xLeft = 2 * itemRect.xRight - itemRect.xLeft;
        let text = survey.controller.measureText(json.questions[0].choices[i]);
        let textRect = SurveyHelper.createRect(textPoint, text.width, text.height)
        assumetFlats.push(itemRect, textRect);
        currPoint.xLeft += SurveyHelper.getColumnWidth(survey.controller, 3) +
            survey.controller.measureText().width * SurveyHelper.GAP_BETWEEN_COLUMNS;
    }
    currPoint = TestHelper.defaultPoint;
    currPoint.yTop += minHeight;
    let rowLineRect = SurveyHelper.createRowlineFlat(currPoint, survey.controller);
    currPoint.yTop = rowLineRect.yBot;
    currPoint.yTop += SurveyHelper.GAP_BETWEEN_ROWS * minHeight;
    let itemRect = SurveyHelper.moveRect(SurveyHelper.scaleRect(
        SurveyHelper.createRect(currPoint, minHeight, minHeight),
        SurveyHelper.SELECT_ITEM_FLAT_SCALE), currPoint.xLeft);
    let textPoint = SurveyHelper.clone(currPoint);
    textPoint.xLeft = 2 * itemRect.xRight - itemRect.xLeft;
    let text = survey.controller.measureText(json.questions[0].choices[3]);
    let textRect = SurveyHelper.createRect(textPoint, text.width, text.height)
    assumetFlats.push(rowLineRect, itemRect, textRect);
    TestHelper.equalRects(expect, receivedFlats, assumetFlats);
});
test('Check checkbox with colCount 0 with small font size 12', async () => {
    let json = {
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
    let options = TestHelper.defaultOptions;
    options.fontSize = 12;
    let survey: SurveyPDF = new SurveyPDF(json, options);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    let receivedFlats: IRect[] = [];;
    receivedFlats.push(...flats[0][0].unfold());
    let minHeight = survey.controller.unitHeight;
    let assumetFlats: IRect[] = [];
    let currPoint = TestHelper.defaultPoint;
    for (let i: number = 0; i < 4; i++) {
        let itemRect = SurveyHelper.moveRect(SurveyHelper.scaleRect(
            SurveyHelper.createRect(currPoint, minHeight, minHeight),
            SurveyHelper.SELECT_ITEM_FLAT_SCALE), currPoint.xLeft);
        let text = survey.controller.measureText(json.questions[0].choices[i]);
        let textPoint = SurveyHelper.clone(currPoint);
        textPoint.xLeft = 2 * itemRect.xRight - itemRect.xLeft;
        let textRect = SurveyHelper.createRect(textPoint, text.width, text.height)
        assumetFlats.push(itemRect, textRect);
        currPoint.xLeft += SurveyHelper.getColumnWidth(survey.controller, 4) +
            survey.controller.measureText().width * SurveyHelper.GAP_BETWEEN_COLUMNS;
    }
    TestHelper.equalRects(expect, receivedFlats, assumetFlats);
});