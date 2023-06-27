(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { SurveyPDF } from '../src/survey';
import { IRect, IPoint, DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatRanking } from '../src/flat_layout/flat_ranking';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { TextBrick } from '../src/pdf_render/pdf_text';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
import { RowlineBrick } from '../src/pdf_render/pdf_rowline';
import { ColoredBrick } from '../src/pdf_render/pdf_coloredbrick';
const __dummy_rn: FlatRanking = new FlatRanking(null, null, null);

test('Check ranking ', async () => {
    const json: any = {
        questions: [
            {
                titleLocation: 'hidden',
                name: 'ranking',
                type: 'ranking',
                choices: ['A', 'B']
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    const receivedFirstRowRects: IRect[] = flats[0][0].unfold();
    expect(receivedFirstRowRects.length).toBe(2);
    controller.margins.left += controller.unitWidth;
    let currPoint: IPoint = controller.leftTopPoint;
    const assumeFirstRowRects: IRect[] = [];
    const firstItemRect: IRect = SurveyHelper.moveRect(SurveyHelper.scaleRect(
        SurveyHelper.createRect(currPoint, controller.unitWidth, controller.unitHeight),
        SurveyHelper.SELECT_ITEM_FLAT_SCALE), currPoint.xLeft);
    assumeFirstRowRects.push(firstItemRect);
    currPoint.xLeft = firstItemRect.xRight + controller.unitWidth * SurveyHelper.GAP_BETWEEN_ITEM_TEXT;
    const firstTextFlats: IPdfBrick[] = (await SurveyHelper.createTextFlat(currPoint, survey.getAllQuestions()[0],
        controller, json.questions[0].choices[0], TextBrick)).unfold();
    assumeFirstRowRects.push(...firstTextFlats);

    TestHelper.equalRects(expect, receivedFirstRowRects, assumeFirstRowRects);

    currPoint = SurveyHelper.createPoint(SurveyHelper.mergeRects(firstItemRect, ...firstTextFlats));
    currPoint.yTop += controller.unitHeight * SurveyHelper.GAP_BETWEEN_ROWS;

    const receivedSecondRowRects: IRect[] = flats[0][1].unfold();
    expect(receivedSecondRowRects.length).toBe(2);
    const assumeSecondRowRects: IRect[] = [];
    const secondItemRect: IRect = SurveyHelper.moveRect(SurveyHelper.scaleRect(
        SurveyHelper.createRect(currPoint, controller.unitWidth, controller.unitHeight),
        SurveyHelper.SELECT_ITEM_FLAT_SCALE), currPoint.xLeft);
    assumeSecondRowRects.push(secondItemRect);
    currPoint.xLeft = secondItemRect.xRight + controller.unitWidth * SurveyHelper.GAP_BETWEEN_ITEM_TEXT;
    const secondTextFlats: IPdfBrick[] = (await SurveyHelper.createTextFlat(currPoint, survey.getAllQuestions()[0],
        controller, json.questions[0].choices[1], TextBrick)).unfold();
    currPoint = SurveyHelper.createPoint(SurveyHelper.mergeRects(secondItemRect, ...secondTextFlats));
    assumeSecondRowRects.push(...secondTextFlats);
    TestHelper.equalRects(expect, receivedSecondRowRects, assumeSecondRowRects);
});

test('Check ranking with selectToRank', async () => {
    const json: any = {
        questions: [
            {
                titleLocation: 'hidden',
                name: 'ranking',
                type: 'ranking',
                selectToRankEnabled: true,
                choices: ['A', 'B', 'C']
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    survey.data = {
        ranking: [
            'B', 'A'
        ],
    };
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(3);
    const receivedFirstRowRects: IRect[] = flats[0][0].unfold();
    expect(receivedFirstRowRects.length).toBe(5);
    controller.margins.left += controller.unitWidth;
    let currPoint: IPoint = controller.leftTopPoint;
    const assumeFirstRowRects: IRect[] = [];
    const firstItemRect: IRect = SurveyHelper.moveRect(SurveyHelper.scaleRect(
        SurveyHelper.createRect(currPoint, controller.unitWidth, controller.unitHeight),
        SurveyHelper.SELECT_ITEM_FLAT_SCALE), currPoint.xLeft);
    assumeFirstRowRects.push(firstItemRect);
    currPoint.xLeft = firstItemRect.xRight + controller.unitWidth * SurveyHelper.GAP_BETWEEN_ITEM_TEXT;
    const firstTextFlats: IPdfBrick[] = (await SurveyHelper.createTextFlat(currPoint, survey.getAllQuestions()[0],
        controller, json.questions[0].choices[2], TextBrick)).unfold();
    assumeFirstRowRects.push(...firstTextFlats);

    currPoint.xLeft = controller.leftTopPoint.xLeft + SurveyHelper.getColumnWidth(controller, 2) + controller.unitWidth * SurveyHelper.GAP_BETWEEN_COLUMNS;
    const secondItemRect: IRect = SurveyHelper.moveRect(SurveyHelper.scaleRect(
        SurveyHelper.createRect(currPoint, controller.unitWidth, controller.unitHeight),
        SurveyHelper.SELECT_ITEM_FLAT_SCALE), currPoint.xLeft);
    assumeFirstRowRects.push(secondItemRect);
    currPoint.xLeft = secondItemRect.xRight + controller.unitWidth * SurveyHelper.GAP_BETWEEN_ITEM_TEXT;
    const secondTextFlats: IPdfBrick[] = (await SurveyHelper.createTextFlat(currPoint, survey.getAllQuestions()[0],
        controller, json.questions[0].choices[1], TextBrick)).unfold();
    assumeFirstRowRects.push(...secondTextFlats);
    assumeFirstRowRects.push(SurveyHelper.createRect({ xLeft: secondItemRect.xLeft - 0.5 - SurveyHelper.GAP_BETWEEN_COLUMNS * controller.unitWidth / 2, yTop: secondTextFlats[0].yTop }, 0, 0));

    TestHelper.equalRects(expect, receivedFirstRowRects, assumeFirstRowRects);

    const rowLineFlat: IRect[] = flats[0][1].unfold();
    expect(rowLineFlat.length).toBe(1);
    expect(rowLineFlat[0]).toBeInstanceOf(RowlineBrick);

    currPoint = SurveyHelper.createPoint(SurveyHelper.mergeRects(firstItemRect, secondItemRect, ...secondTextFlats, ...firstTextFlats));
    currPoint.yTop += controller.unitHeight * SurveyHelper.GAP_BETWEEN_ROWS;
    currPoint.xLeft = controller.leftTopPoint.xLeft + SurveyHelper.getColumnWidth(controller, 2) + controller.unitWidth * SurveyHelper.GAP_BETWEEN_COLUMNS;

    const receivedSecondRowRects: IRect[] = flats[0][2].unfold();
    expect(receivedSecondRowRects.length).toBe(3);
    const assumeSecondRowRects: IRect[] = [];
    const thirdItemRect: IRect = SurveyHelper.moveRect(SurveyHelper.scaleRect(
        SurveyHelper.createRect(currPoint, controller.unitWidth, controller.unitHeight),
        SurveyHelper.SELECT_ITEM_FLAT_SCALE), currPoint.xLeft);
    assumeSecondRowRects.push(thirdItemRect);
    currPoint.xLeft = secondItemRect.xRight + controller.unitWidth * SurveyHelper.GAP_BETWEEN_ITEM_TEXT;
    const thirdTextFlats: IPdfBrick[] = (await SurveyHelper.createTextFlat(currPoint, survey.getAllQuestions()[0],
        controller, json.questions[0].choices[0], TextBrick)).unfold();
    assumeSecondRowRects.push(...thirdTextFlats);
    assumeSecondRowRects.push(SurveyHelper.createRect({ xLeft: thirdItemRect.xLeft - 0.5 - SurveyHelper.GAP_BETWEEN_COLUMNS * controller.unitWidth / 2, yTop: thirdTextFlats[0].yTop }, 0, 0));

    TestHelper.equalRects(expect, receivedSecondRowRects, assumeSecondRowRects);
});

test('Check ranking with selectToRank vertical', async () => {
    const json: any = {
        questions: [
            {
                titleLocation: 'hidden',
                name: 'ranking',
                type: 'ranking',
                selectToRankEnabled: true,
                selectToRankAreasLayout: 'vertical',
                choices: ['A', 'B', 'C']
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    survey.data = {
        ranking: [
            'B', 'A'
        ],
    };
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(4);
    const receivedFirstRowRects: IRect[] = flats[0][0].unfold();
    expect(receivedFirstRowRects.length).toBe(2);
    controller.margins.left += controller.unitWidth;
    let currPoint: IPoint = controller.leftTopPoint;
    const assumeFirstRowRects: IRect[] = [];
    const firstItemRect: IRect = SurveyHelper.moveRect(SurveyHelper.scaleRect(
        SurveyHelper.createRect(currPoint, controller.unitWidth, controller.unitHeight),
        SurveyHelper.SELECT_ITEM_FLAT_SCALE), currPoint.xLeft);
    assumeFirstRowRects.push(firstItemRect);
    currPoint.xLeft = firstItemRect.xRight + controller.unitWidth * SurveyHelper.GAP_BETWEEN_ITEM_TEXT;
    const firstTextFlats: IPdfBrick[] = (await SurveyHelper.createTextFlat(currPoint, survey.getAllQuestions()[0],
        controller, json.questions[0].choices[1], TextBrick)).unfold();
    assumeFirstRowRects.push(...firstTextFlats);
    TestHelper.equalRects(expect, receivedFirstRowRects, assumeFirstRowRects);

    currPoint = SurveyHelper.createPoint(SurveyHelper.mergeRects(firstItemRect, ...firstTextFlats));
    currPoint.yTop += controller.unitHeight * SurveyHelper.GAP_BETWEEN_ROWS;

    const receivedSecondRowRects: IRect[] = flats[0][1].unfold();
    expect(receivedSecondRowRects.length).toBe(2);
    const assumeSecondRowRects: IRect[] = [];
    const secondItemRect: IRect = SurveyHelper.moveRect(SurveyHelper.scaleRect(
        SurveyHelper.createRect(currPoint, controller.unitWidth, controller.unitHeight),
        SurveyHelper.SELECT_ITEM_FLAT_SCALE), currPoint.xLeft);
    assumeSecondRowRects.push(secondItemRect);
    currPoint.xLeft = secondItemRect.xRight + controller.unitWidth * SurveyHelper.GAP_BETWEEN_ITEM_TEXT;
    const secondTextFlats: IPdfBrick[] = (await SurveyHelper.createTextFlat(currPoint, survey.getAllQuestions()[0],
        controller, json.questions[0].choices[0], TextBrick)).unfold();
    assumeSecondRowRects.push(...secondTextFlats);
    TestHelper.equalRects(expect, receivedSecondRowRects, assumeSecondRowRects);

    currPoint = SurveyHelper.createPoint(SurveyHelper.mergeRects(secondItemRect, ...secondTextFlats));

    const separator = flats[0][2];
    expect(separator).toBeInstanceOf(ColoredBrick);
    expect(separator.xLeft).toBe(controller.leftTopPoint.xLeft);
    expect(separator.width).toBeCloseTo(SurveyHelper.getPageAvailableWidth(controller));
    expect(separator.height).toBe(1);
    expect(separator.yTop).toBe(currPoint.yTop + controller.unitHeight * SurveyHelper.GAP_BETWEEN_ROWS - 0.5);

    currPoint.yTop += controller.unitHeight * 2 * SurveyHelper.GAP_BETWEEN_ROWS;

    const receivedThirdRowRects: IRect[] = flats[0][3].unfold();
    expect(receivedThirdRowRects.length).toBe(2);
    const assumeThirdRowRects: IRect[] = [];
    const thirdItemRect: IRect = SurveyHelper.moveRect(SurveyHelper.scaleRect(
        SurveyHelper.createRect(currPoint, controller.unitWidth, controller.unitHeight),
        SurveyHelper.SELECT_ITEM_FLAT_SCALE), currPoint.xLeft);
    assumeThirdRowRects.push(thirdItemRect);
    currPoint.xLeft = thirdItemRect.xRight + controller.unitWidth * SurveyHelper.GAP_BETWEEN_ITEM_TEXT;
    const thirdTextFlats: IPdfBrick[] = (await SurveyHelper.createTextFlat(currPoint, survey.getAllQuestions()[0],
        controller, json.questions[0].choices[2], TextBrick)).unfold();
    assumeThirdRowRects.push(...thirdTextFlats);
    TestHelper.equalRects(expect, receivedThirdRowRects, assumeThirdRowRects);
});