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
const __dummy_rn: FlatRanking = new FlatRanking(null, null, null);

test('Check ranking ', async () => {
    const json: any = {
        questions: [
            {
                titleLocation: 'hidden',
                name: 'ranking',
                type: 'ranking',
                choices: [ "A", "B" ]
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
    currPoint = SurveyHelper.createPoint(SurveyHelper.mergeRects(firstItemRect, ...firstTextFlats));
    assumeFirstRowRects.push(...firstTextFlats);
    currPoint.yTop += controller.unitHeight * SurveyHelper.GAP_BETWEEN_ROWS;
    TestHelper.equalRects(expect, receivedFirstRowRects, assumeFirstRowRects);
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