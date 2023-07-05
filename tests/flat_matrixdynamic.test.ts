(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { SurveyPDF } from '../src/survey';
import { IRect, ISize, IDocOptions, DocOptions, DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatDropdown } from '../src/flat_layout/flat_dropdown';
import { FlatMatrixMultiple } from '../src/flat_layout/flat_matrixmultiple';
import { FlatMatrixDynamic } from '../src/flat_layout/flat_matrixdynamic';
import { FlatExpression } from '../src/flat_layout/flat_expression';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { RowlineBrick } from '../src/pdf_render/pdf_rowline';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
import { CompositeBrick } from '../src/pdf_render/pdf_composite';
let __dummy_dd = new FlatDropdown(null, null, null);
let __dummy_md = new FlatMatrixDynamic(null, null, null);
let __dummy_tx = new FlatExpression(null, null, null);

test('Check matrix dynamic one column no rows', async () => {
    let json: any = {
        elements: [
            {
                type: 'matrixdynamic',
                name: 'madin',
                titleLocation: 'hidden',
                columns: [
                    {
                        name: 'Sky'
                    }
                ],
                rowCount: 0
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let unfoldFlats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldFlats.length).toBe(1);
    controller.margins.left += controller.unitWidth;
    let size: ISize = controller.measureText(json.elements[0].columns[0].name, 'bold');
    let assumeMatrix: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + size.width,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + size.height
    };
    TestHelper.equalRect(expect, unfoldFlats[0], assumeMatrix);
});
test('Check matrix dynamic no columns one row', async () => {
    let json: any = {
        elements: [
            {
                type: 'matrixdynamic',
                name: 'madin empty',
                titleLocation: 'hidden',
                rowCount: 1
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let unfoldFlats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldFlats.length).toBe(1);
    expect(unfoldFlats[0] instanceof RowlineBrick).toBe(true);
});
test('Check matrix dynamic one column no rows show header off', async () => {
    let json: any = {
        elements: [
            {
                type: 'matrixdynamic',
                name: 'oh these headers',
                titleLocation: 'hidden',
                showHeader: false,
                columns: [
                    {
                        name: 'Ninja'
                    }
                ],
                rowCount: 0
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let unfoldFlats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldFlats.length).toBe(1);
    expect(unfoldFlats[0] instanceof RowlineBrick).toBe(true);
});
test('Check matrix dynamic one column one row show header off', async () => {
    let json: any = {
        elements: [
            {
                type: 'matrixdynamic',
                name: 'I\'m just a list',
                titleLocation: 'hidden',
                showHeader: false,
                columns: [
                    {
                        name: 'Not forget me'
                    }
                ],
                rowCount: 1
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    controller.margins.left += controller.unitWidth;
    let unfoldRowFlats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldRowFlats.length).toBe(1);
    let assumeQuestion: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.paperWidth - controller.margins.right,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop +
            controller.unitHeight
    };
    TestHelper.equalRect(expect, unfoldRowFlats[0], assumeQuestion);
});
test('Check matrix dynamic one column one row', async () => {
    let json: any = {
        elements: [
            {
                type: 'matrixdynamic',
                name: 'I\'m just a list',
                titleLocation: 'hidden',
                columns: [
                    {
                        name: 'I\'m alive'
                    }
                ],
                rowCount: 1
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    controller.margins.left += controller.unitWidth;
    let unfoldHeaderFlats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldHeaderFlats.length).toBe(2);
    let unfoldRowFlats: IPdfBrick[] = flats[0][1].unfold();
    expect(unfoldRowFlats.length).toBe(1);
    let header: ISize = controller.measureText(json.elements[0].columns[0].name, 'bold');
    let assumeText: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + header.width,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + header.height
    };
    TestHelper.equalRect(expect, unfoldHeaderFlats[0], assumeText);
    expect(unfoldHeaderFlats[1] instanceof RowlineBrick).toBe(true);
    let assumeQuestion: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.paperWidth - controller.margins.right,
        yTop: controller.leftTopPoint.yTop + header.height + SurveyHelper.EPSILON +
            controller.unitHeight * FlatMatrixDynamic.GAP_BETWEEN_ROWS,
        yBot: controller.leftTopPoint.yTop + header.height +
            SurveyHelper.EPSILON + controller.unitHeight * (1 + FlatMatrixDynamic.GAP_BETWEEN_ROWS)
    };
    TestHelper.equalRect(expect, unfoldRowFlats[0], assumeQuestion);
    let assumeMatrix: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.paperWidth - controller.margins.right,
        yTop: controller.leftTopPoint.yTop,
        yBot: assumeQuestion.yBot
    };
    TestHelper.equalRect(expect, SurveyHelper.mergeRects(...flats[0]), assumeMatrix);
});
test('Check matrix dynamic one column one row vertical layout show header off', async () => {
    let json: any = {
        elements: [
            {
                type: 'matrixdynamic',
                name: 'Still the same list',
                titleLocation: 'hidden',
                showHeader: false,
                columns: [
                    {
                        name: 'Not forget me'
                    }
                ],
                columnLayout: 'vertical',
                rowCount: 1
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    controller.margins.left += controller.unitWidth;
    let unfoldRowFlats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldRowFlats.length).toBe(1);
    let assumeQuestion: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.paperWidth - controller.margins.right,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop +
            controller.unitHeight
    };
    TestHelper.equalRect(expect, unfoldRowFlats[0], assumeQuestion);
});
test('Check matrix dynamic one column one row vertical layout', async () => {
    let json: any = {
        elements: [
            {
                type: 'matrixdynamic',
                name: 'Not the same list',
                titleLocation: 'hidden',
                columns: [
                    {
                        name: 'Left front'
                    }
                ],
                columnLayout: 'vertical',
                rowCount: 1
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    controller.margins.left += controller.unitWidth;
    let unfoldRowFlats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldRowFlats.length).toBe(2);
    let header: ISize = controller.measureText(json.elements[0].columns[0].name);
    let assumeText: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + header.width,
        yTop: controller.leftTopPoint.yTop + SurveyHelper.EPSILON,
        yBot: controller.leftTopPoint.yTop +
            SurveyHelper.EPSILON + header.height
    };
    TestHelper.equalRect(expect, unfoldRowFlats[0], assumeText);
    let assumeQuestion: IRect = {
        xLeft: controller.leftTopPoint.xLeft +
            (SurveyHelper.getPageAvailableWidth(controller) +
                controller.unitWidth * SurveyHelper.GAP_BETWEEN_COLUMNS) / 2.0,
        xRight: controller.paperWidth - controller.margins.right,
        yTop: controller.leftTopPoint.yTop + SurveyHelper.EPSILON,
        yBot: controller.leftTopPoint.yTop + SurveyHelper.EPSILON +
            controller.unitHeight
    };
    TestHelper.equalRect(expect, unfoldRowFlats[1], assumeQuestion);
    let assumeMatrix: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.paperWidth - controller.margins.right,
        yTop: controller.leftTopPoint.yTop,
        yBot: assumeQuestion.yBot
    };
    TestHelper.equalRect(expect, SurveyHelper.mergeRects(...flats[0]), assumeMatrix);
});
test('Check matrix dynamic two columns one row vertical layout show header off', async () => {
    let json: any = {
        elements: [
            {
                type: 'matrixdynamic',
                name: 'matrix not multiple text',
                titleLocation: 'hidden',
                showHeader: false,
                columns: [
                    {
                        name: 'First'
                    },
                    {
                        name: 'Second'
                    }
                ],
                columnLayout: 'vertical',
                rowCount: 1
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    controller.margins.left += controller.unitWidth;
    let unfoldRow1Flats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldRow1Flats.length).toBe(2);
    let unfoldRow2Flats: IPdfBrick[] = flats[0][1].unfold();
    expect(unfoldRow2Flats.length).toBe(1);
    let assumeQuestion1: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.paperWidth - controller.margins.right,
        yTop: controller.leftTopPoint.yTop + SurveyHelper.EPSILON,
        yBot: controller.leftTopPoint.yTop + SurveyHelper.EPSILON +
            controller.unitHeight
    };
    expect(unfoldRow1Flats[1] instanceof RowlineBrick).toBe(true);
    TestHelper.equalRect(expect, unfoldRow1Flats[0], assumeQuestion1);
    let assumeQuestion2: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.paperWidth - controller.margins.right,
        yTop: assumeQuestion1.yBot + SurveyHelper.EPSILON + FlatMatrixDynamic.GAP_BETWEEN_ROWS * controller.unitHeight,
        yBot: assumeQuestion1.yBot + SurveyHelper.EPSILON +
            controller.unitHeight * (1 + FlatMatrixDynamic.GAP_BETWEEN_ROWS)
    };
    TestHelper.equalRect(expect, unfoldRow2Flats[0], assumeQuestion2);
    let assumeMatrix: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.paperWidth - controller.margins.right,
        yTop: controller.leftTopPoint.yTop,
        yBot: assumeQuestion2.yBot
    };
    TestHelper.equalRect(expect, SurveyHelper.mergeRects(...flats[0]), assumeMatrix);
});
test('Check matrix dynamic one column no rows narrow width', async () => {
    let json: any = {
        elements: [
            {
                type: 'matrixdynamic',
                name: 'madinar',
                titleLocation: 'hidden',
                columns: [
                    {
                        name: 'Prop'
                    }
                ],
                rowCount: 0
            }
        ]
    };
    let options: IDocOptions = TestHelper.defaultOptions;
    let pageWidth: number = options.margins.left + options.margins.right +
        new DocController(options).measureText(
            SurveyHelper.MATRIX_COLUMN_WIDTH).width / DocOptions.MM_TO_PT;
    options.format = [pageWidth, <number>(options.format[1])];
    let survey: SurveyPDF = new SurveyPDF(json, options);
    let controller: DocController = new DocController(options);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(0);
});
test('Check matrix dynamic one column one row verical layout narrow width', async () => {
    let json: any = {
        elements: [
            {
                type: 'matrixdynamic',
                name: 'madivertnar',
                titleLocation: 'hidden',
                columns: [
                    {
                        name: 'Boop'
                    }
                ],
                columnLayout: 'vertical',
                rowCount: 1
            }
        ]
    };
    let options: IDocOptions = TestHelper.defaultOptions;
    let pageWidth: number = options.margins.left + options.margins.right +
        new DocController(options).measureText(
            SurveyHelper.MATRIX_COLUMN_WIDTH).width / DocOptions.MM_TO_PT +
        new DocController(options).unitWidth / DocOptions.MM_TO_PT;
    options.format = [pageWidth, <number>(options.format[1])];
    let survey: SurveyPDF = new SurveyPDF(json, options);
    let controller: DocController = new DocController(options);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    controller.margins.left += controller.unitWidth;
    let unfoldFlats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldFlats.length).toBe(2);
    let text: ISize = controller.measureText(json.elements[0].columns[0].name);
    let assumeText: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + text.width,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + text.height
    };
    TestHelper.equalRect(expect, unfoldFlats[0], assumeText);
    let assumeQuestion: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.paperWidth - controller.margins.right,
        yTop: assumeText.yBot + controller.unitHeight * FlatMatrixDynamic.GAP_BETWEEN_ROWS,
        yBot: assumeText.yBot + controller.unitHeight * (1 + FlatMatrixDynamic.GAP_BETWEEN_ROWS),
    };
    TestHelper.equalRect(expect, unfoldFlats[1], assumeQuestion);
    let assumeMatrix: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.paperWidth - controller.margins.right,
        yTop: controller.leftTopPoint.yTop,
        yBot: assumeQuestion.yBot
    };
    TestHelper.equalRect(expect, SurveyHelper.mergeRects(...flats[0]), assumeMatrix);
});
test('Check matrix dynamic two columns one row narrow width', async () => {
    let json: any = {
        elements: [
            {
                type: 'matrixdynamic',
                name: 'madinartwocol',
                titleLocation: 'hidden',
                columns: [
                    {
                        name: 'Boop'
                    },
                    {
                        name: 'Moop'
                    }
                ],
                rowCount: 1
            }
        ]
    };
    let options: IDocOptions = TestHelper.defaultOptions;
    let pageWidth: number = options.margins.left + options.margins.right +
        new DocController(options).measureText(
            SurveyHelper.MATRIX_COLUMN_WIDTH).width / DocOptions.MM_TO_PT +
        new DocController(options).unitWidth / DocOptions.MM_TO_PT;
    options.format = [pageWidth, <number>(options.format[1])];
    let survey: SurveyPDF = new SurveyPDF(json, options);
    let controller: DocController = new DocController(options);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    controller.margins.left += controller.unitWidth;
    let unfoldFlats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldFlats.length).toBe(4);
    let text1: ISize = controller.measureText(json.elements[0].columns[0].name);
    let assumeText1: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + text1.width,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + text1.height
    };
    TestHelper.equalRect(expect, unfoldFlats[0], assumeText1);
    let assumeQuestion1: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.paperWidth - controller.margins.right,
        yTop: assumeText1.yBot + controller.unitHeight * FlatMatrixDynamic.GAP_BETWEEN_ROWS,
        yBot: assumeText1.yBot + controller.unitHeight * (1 + FlatMatrixDynamic.GAP_BETWEEN_ROWS)
    };
    TestHelper.equalRect(expect, unfoldFlats[1], assumeQuestion1);
    let text2: ISize = controller.measureText(json.elements[0].columns[1].name);
    let assumeText2: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + text2.width,
        yTop: assumeQuestion1.yBot + SurveyHelper.EPSILON +
            controller.unitHeight * FlatMatrixDynamic.GAP_BETWEEN_ROWS,
        yBot: assumeQuestion1.yBot + SurveyHelper.EPSILON + text2.height +
            controller.unitHeight * FlatMatrixDynamic.GAP_BETWEEN_ROWS
    };
    TestHelper.equalRect(expect, unfoldFlats[2], assumeText2);
    let assumeQuestion2: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.paperWidth - controller.margins.right,
        yTop: assumeText2.yBot + controller.unitHeight * FlatMatrixDynamic.GAP_BETWEEN_ROWS,
        yBot: assumeText2.yBot + controller.unitHeight * (1 + FlatMatrixDynamic.GAP_BETWEEN_ROWS)
    };
    TestHelper.equalRect(expect, unfoldFlats[3], assumeQuestion2);
    let assumeMatrix: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.paperWidth - controller.margins.right,
        yTop: controller.leftTopPoint.yTop,
        yBot: assumeQuestion2.yBot
    };
    TestHelper.equalRect(expect, flats[0][0], assumeMatrix);
});
test('Check matrixdynamic with totals', async () => {
    let json: any = {
        showQuestionNumbers: 'off',
        elements: [
            {

                type: 'matrixdynamic',
                name: 'madintotals',
                showHeader: false,
                rowCount: 1,
                titleLocation: 'hidden',
                columns: [
                    {
                        totalType: 'sum',
                        totalFormat: 'test',
                        name: 'id'
                    }
                ]
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    controller.margins.left += controller.unitWidth;
    let unfoldRow1Flats: IPdfBrick[] = await flats[0][0].unfold();
    expect(unfoldRow1Flats.length).toBe(2);
    let unfolFooterFlats: IPdfBrick[] = flats[0][1].unfold();
    expect(unfolFooterFlats.length).toBe(1);
    let assumeQuestion1: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.paperWidth - controller.margins.right,
        yTop: controller.leftTopPoint.yTop + SurveyHelper.EPSILON,
        yBot: controller.leftTopPoint.yTop + SurveyHelper.EPSILON +
            controller.unitHeight
    };
    expect(unfoldRow1Flats[1] instanceof RowlineBrick).toBe(true);
    TestHelper.equalRect(expect, unfoldRow1Flats[0], assumeQuestion1);
    let assumeFooter: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.paperWidth - controller.margins.right,
        yTop: assumeQuestion1.yBot + SurveyHelper.EPSILON + FlatMatrixDynamic.GAP_BETWEEN_ROWS * controller.unitHeight,
        yBot: assumeQuestion1.yBot + SurveyHelper.EPSILON +
            controller.unitHeight * (1 + FlatMatrixDynamic.GAP_BETWEEN_ROWS + 2 * SurveyHelper.VALUE_READONLY_PADDING_SCALE)
    };
    TestHelper.equalRect(expect, unfolFooterFlats[0], assumeFooter);
    let assumeMatrix: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.paperWidth - controller.margins.right,
        yTop: controller.leftTopPoint.yTop,
        yBot: assumeFooter.yBot
    };
    TestHelper.equalRect(expect, SurveyHelper.mergeRects(...flats[0]), assumeMatrix);
});
test('Check matrix dynamic column width', async () => {
    let json: any = {
        elements: [
            {
                type: 'matrixdynamic',
                name: 'madincolwidth',
                titleLocation: 'hidden',
                columns: [
                    {
                        name: 'One',
                        width: '25%'
                    },
                    {
                        name: 'Two'
                    }
                ],
                rowCount: 1
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    let headerFlats: IPdfBrick[] = flats[0][0].unfold();
    expect(headerFlats.length).toBe(3);
    controller.margins.left += controller.unitWidth;
    let textSize1: ISize = controller.measureText(json.elements[0].columns[0].name, 'bold');
    let assumeText1: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + textSize1.width,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + textSize1.height
    };
    TestHelper.equalRect(expect, headerFlats[0], assumeText1);
    let colTextSize2: ISize = controller.measureText(json.elements[0].columns[1].name, 'bold');
    let availableWidth: number = controller.paperWidth - controller.margins.left -
        controller.margins.right - SurveyHelper.GAP_BETWEEN_COLUMNS * controller.unitWidth;
    let assumeText2: IRect = {
        xLeft: controller.leftTopPoint.xLeft + availableWidth * 0.25 +
            SurveyHelper.GAP_BETWEEN_COLUMNS * controller.unitWidth,
        xRight: controller.leftTopPoint.xLeft + availableWidth * 0.25 + colTextSize2.width +
            SurveyHelper.GAP_BETWEEN_COLUMNS * controller.unitWidth,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + colTextSize2.height
    };
    TestHelper.equalRect(expect, headerFlats[1], assumeText2);
    let rowFlats: IPdfBrick[] = flats[0][1].unfold();
    expect(rowFlats.length).toBe(2);
    let assumeDrop1: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + availableWidth * 0.25,
        yTop: headerFlats[2].yBot +
            FlatMatrixMultiple.GAP_BETWEEN_ROWS * controller.unitHeight,
        yBot: controller.unitHeight + headerFlats[2].yBot +
            FlatMatrixMultiple.GAP_BETWEEN_ROWS * controller.unitHeight
    };
    TestHelper.equalRect(expect, rowFlats[0], assumeDrop1);
    let assumeDrop2: IRect = {
        xLeft: assumeDrop1.xRight + SurveyHelper.GAP_BETWEEN_COLUMNS * controller.unitWidth,
        xRight: assumeDrop1.xRight + SurveyHelper.GAP_BETWEEN_COLUMNS *
            controller.unitWidth + availableWidth * 0.75,
        yTop: assumeDrop1.yTop,
        yBot: assumeDrop1.yBot
    };
    TestHelper.equalRect(expect, rowFlats[1], assumeDrop2);
});
test('Check matrixdynamic with showInMultipleColumns', async () => {
    let json: any = {
        showQuestionNumbers: 'off',
        elements: [
            {
                type: 'matrixdynamic',
                name: 'madintotalsshowmulcol',
                titleLocation: 'hidden',
                hideNumber: true,
                columns: [
                    {
                        cellType: 'checkbox',
                        showInMultipleColumns: true,
                        choices: ['MulCol1', 'MulCol2']
                    }
                ],
                rowCount: 1
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    controller.margins.left += controller.unitWidth;
    let unfoldHeaderFlats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldHeaderFlats.length).toBe(3);
    let unfolRowFlats: IPdfBrick[] = flats[0][1].unfold();
    expect(unfolRowFlats.length).toBe(2);
    let assumeCheck1: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + controller.unitWidth,
        yTop: unfolRowFlats[0].yTop,
        yBot: unfolRowFlats[0].yTop + controller.unitHeight
    };
    assumeCheck1 = SurveyHelper.moveRect(SurveyHelper.scaleRect(assumeCheck1,
        SurveyHelper.SELECT_ITEM_FLAT_SCALE), controller.leftTopPoint.xLeft, unfolRowFlats[0].yTop);
    TestHelper.equalRect(expect, unfolRowFlats[0], assumeCheck1);
});
test('Check matrixdynamic with detailPanel', async () => {
    const json: any = {
        showQuestionNumbers: 'off',
        elements: [
            {
                type: 'matrixdynamic',
                name: 'detailPanelChecker',
                titleLocation: 'hidden',
                hideNumber: true,
                columns: [
                    {
                        cellType: 'input',
                    }
                ],
                detailElements: [
                    {
                        type: 'comment',
                        name: 'commentInPanel',
                        titleLocation: 'hidden',
                    }
                ],
                rowCount: 1,
                detailPanelMode: 'underRow',
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(3);
    controller.margins.left += controller.unitWidth;
    const unfoldHeaderFlats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldHeaderFlats.length).toBe(2);
    const unfoldRowFlats: IPdfBrick[] = flats[0][1].unfold();
    expect(unfoldRowFlats.length).toBe(1);
    const unfoldDetailPanelFlats: IPdfBrick[] = flats[0][2].unfold();
    expect(unfoldDetailPanelFlats.length).toBe(2);
});

test('Check matrixdynamic with empty detail panel', async () => {
    const json: any = {
        showQuestionNumbers: 'off',
        elements: [
            {
                type: 'matrixdynamic',
                name: 'detailPanelChecker',
                titleLocation: 'hidden',
                hideNumber: true,
                columns: [
                    {
                        cellType: 'input',
                    }
                ],
                rowCount: 1,
                detailPanelMode: 'underRow',
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    controller.margins.left += controller.unitWidth;
    const unfoldHeaderFlats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldHeaderFlats.length).toBe(2);
    const unfoldRowFlats: IPdfBrick[] = flats[0][1].unfold();
    expect(unfoldRowFlats.length).toBe(1);
});

test('Check matrixdynamic with allowRowsDragAndDrop', async () => {
    const json: any = {
        showQuestionNumbers: 'off',
        elements: [
            {
                type: 'matrixdynamic',
                name: 'panel',
                titleLocation: 'hidden',
                hideNumber: true,
                columns: [
                    {
                        cellType: 'input',
                    }
                ],
                allowRowsDragAndDrop: true,
                rowCount: 1,
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    const unfoldHeaderFlats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldHeaderFlats.length).toBe(2); //header + row line brick
    const unfoldRowFlats: IPdfBrick[] = flats[0][1].unfold();
    expect(unfoldRowFlats.length).toBe(1);
    expect(unfoldRowFlats[0].xLeft).toBeCloseTo(controller.margins.left + controller.unitWidth);
});
test('Check matrixdynamic with allowRowsDragAndDrop list', async () => {
    const json: any = {
        showQuestionNumbers: 'off',
        elements: [
            {
                type: 'matrixdynamic',
                name: 'panel',
                titleLocation: 'hidden',
                hideNumber: true,
                columns: [
                    {
                        cellType: 'input',
                    },
                    {
                        cellType: 'input',
                    },
                    {
                        cellType: 'input',
                    },
                    {
                        cellType: 'input',
                    },
                    {
                        cellType: 'input',
                    },
                    {
                        cellType: 'input',
                    }
                ],
                allowRowsDragAndDrop: true,
                rowCount: 1,
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    expect((<any>flats[0][0]).bricks.length).toBe(12);
});