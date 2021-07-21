(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { SurveyPDF } from '../src/survey';
import { IRect, IDocOptions, DocOptions, DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatMultipleText } from '../src/flat_layout/flat_multipletext';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
const __dummy_mt = new FlatMultipleText(null, null, null);

test('Check multiple text one item', async () => {
    const json: any = {
        elements: [
            {
                type: 'multipletext',
                name: 'multi one item',
                titleLocation: 'hidden',
                items: [
                    {
                        name: 'Input me'
                    }
                ]
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    controller.margins.left += controller.unitWidth;
    const assumeMultipleText: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.paperWidth - controller.margins.right,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + controller.unitHeight
    };
    TestHelper.equalRect(expect, flats[0][0], assumeMultipleText);
    const assumeText: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft +
            controller.measureText(json.elements[0].items[0].name, 'bold').width,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + controller.unitHeight
    }
    TestHelper.equalRect(expect, flats[0][0].unfold()[0], assumeText);
    const assumeBox: IRect = {
        xLeft: controller.leftTopPoint.xLeft +
            SurveyHelper.getPageAvailableWidth(controller) * SurveyHelper.MULTIPLETEXT_TEXT_PERS,
        xRight: assumeMultipleText.xRight,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + controller.unitHeight
    }
    TestHelper.equalRect(expect, flats[0][0].unfold()[1], assumeBox);
});
test('Check multiple text two items', async () => {
    const json: any = {
        elements: [
            {
                type: 'multipletext',
                name: 'multi',
                titleLocation: 'hidden',
                items: [
                    {
                        name: 'Input me'
                    },
                    {
                        name: 'Oh eee'
                    }
                ]
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    controller.margins.left += controller.unitWidth;
    const assumeMultipleText: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.paperWidth - controller.margins.right,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + controller.unitHeight * 2.0 +
            controller.unitHeight * FlatMultipleText.ROWS_GAP_SCALE
    };
    TestHelper.equalRect(expect, SurveyHelper.mergeRects(flats[0][0], flats[0][1]), assumeMultipleText);
});
test('Check multiple text with colCount and long text', async () => {
    const sign: string = '|';
    const json = {
        elements: [
            {
                type: 'multipletext',
                name: 'multi',
                titleLocation: 'hidden',
                colCount: 2,
                items: [
                    {
                        name: sign
                    },
                    {
                        name: sign + sign
                    },
                    {
                        name: sign
                    }
                ]
            }
        ]
    };
    const options: IDocOptions = TestHelper.defaultOptions;
    const signWidth: number = new DocController(options).measureText(
        sign, 'bold').width / DocOptions.MM_TO_PT;
    options.format = [options.margins.left + options.margins.right +
        2.5 * signWidth / SurveyHelper.MULTIPLETEXT_TEXT_PERS +
        new DocController(options).unitWidth /
            SurveyHelper.MULTIPLETEXT_TEXT_PERS, 297.0];
    const survey: SurveyPDF = new SurveyPDF(json, options);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    controller.margins.left += controller.unitWidth;
    const assumeMultipleText: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.paperWidth - controller.margins.right,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + controller.unitHeight * 2.0 +
            controller.unitHeight * FlatMultipleText.ROWS_GAP_SCALE
    };
    TestHelper.equalRect(expect, SurveyHelper.mergeRects(flats[0][0], flats[0][1]), assumeMultipleText);
});
test('Check multiple text where columns in last row fewer than columns in colCount', async () => {
    const json = {
        questions: [
            {
                type: 'multipletext',
                name: 'question1',
                titleLocation: 'hidden',
                items: [
                    {
                        name: 'text1',
                        title: 'A'
                    },
                    {
                        name: 'text2',
                        title: 'B'
                    },
                    {
                        name: 'text3',
                        title: 'C'
                    }
                ],
                colCount: 2
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    const unfoldRow1Flats: IPdfBrick[] = flats[0][0].unfold();
    controller.margins.left += controller.unitWidth;
    const row1Column1: IRect = {
        xLeft: controller.margins.left,
        xRight: controller.margins.left + SurveyHelper.getPageAvailableWidth(controller) / 2.0 - 
            SurveyHelper.GAP_BETWEEN_COLUMNS * controller.unitWidth / 2.0,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + controller.unitHeight
    };
    const actualRow1Column1: IRect = SurveyHelper.mergeRects(unfoldRow1Flats[0], unfoldRow1Flats[1]);
    TestHelper.equalRect(expect, actualRow1Column1, row1Column1);
    const row1Column2: IRect = {
        xLeft: controller.margins.left + SurveyHelper.getPageAvailableWidth(controller) / 2.0 + 
            SurveyHelper.GAP_BETWEEN_COLUMNS * controller.unitWidth / 2.0,
        xRight: controller.paperWidth - controller.margins.right,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + controller.unitHeight
    };
    const actualRow1Column2: IRect = SurveyHelper.mergeRects(unfoldRow1Flats[2], unfoldRow1Flats[3]);
    TestHelper.equalRect(expect, actualRow1Column2, row1Column2);
    const unfoldRow2Flats: IPdfBrick[] = flats[0][1].unfold();
    const row2Column1: IRect = {
        xLeft: controller.margins.left,
        xRight: controller.margins.left + SurveyHelper.getPageAvailableWidth(controller) / 2.0 - 
            SurveyHelper.GAP_BETWEEN_COLUMNS * controller.unitWidth / 2.0,
        yTop: controller.leftTopPoint.yTop + controller.unitHeight +
            controller.unitHeight * FlatMultipleText.ROWS_GAP_SCALE,
        yBot: controller.leftTopPoint.yTop + controller.unitHeight * 2.0 +
            controller.unitHeight * FlatMultipleText.ROWS_GAP_SCALE
    };
    const actualRow2Column1: IRect = SurveyHelper.mergeRects(unfoldRow2Flats[0], unfoldRow2Flats[1]);
    TestHelper.equalRect(expect, actualRow2Column1, row2Column1);
});