(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { SurveyPDF } from '../src/survey';
import { IRect, ISize, IDocOptions, DocOptions, DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatDropdown } from '../src/flat_layout/flat_dropdown';
import { FlatMatrixDynamic } from '../src/flat_layout/flat_matrixdynamic';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { RowlineBrick } from '../src/pdf_render/pdf_rowline';
import { TestHelper } from '../src/helper_test';
import { SurveyHelper } from '../src/helper_survey';
let __dummy_dd = new FlatDropdown(null, null);
let __dummy_md = new FlatMatrixDynamic(null, null);

test('Check matrix dynamic one column no rows', async () => {
    let json = {
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
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    survey.controller.margins.left += survey.controller.unitWidth;
    let unfoldFlats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldFlats.length).toBe(2);
    let size: ISize = survey.controller.measureText(json.elements[0].columns[0].name, 'bold');
    let assumeMatrix: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft + size.width,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop + size.height
    };
    TestHelper.equalRect(expect, unfoldFlats[0], assumeMatrix);
    expect(unfoldFlats[1] instanceof RowlineBrick).toBe(true);
});
test('Check matrix dynamic no columns one row', async () => {
    let json = {
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
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let unfoldFlats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldFlats.length).toBe(1);
    expect(unfoldFlats[0] instanceof RowlineBrick).toBe(true);
});
test('Check matrix dynamic one column no rows show header off', async () => {
    let json = {
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
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let unfoldFlats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldFlats.length).toBe(1);
    expect(unfoldFlats[0] instanceof RowlineBrick).toBe(true);
});
test('Check matrix dynamic one column one row show header off', async () => {
    let json = {
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
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    survey.controller.margins.left += survey.controller.unitWidth;
    let unfoldHeaderFlats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldHeaderFlats.length).toBe(1);
    expect(unfoldHeaderFlats[0] instanceof RowlineBrick).toBe(true);
    let unfoldRowFlats: IPdfBrick[] = flats[0][1].unfold();
    expect(unfoldRowFlats.length).toBe(1);
    let assumeQuestion: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.paperWidth - survey.controller.margins.right,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop +
            survey.controller.unitHeight
    };
    TestHelper.equalRect(expect, unfoldRowFlats[0], assumeQuestion);
});
test('Check matrix dynamic one column one row', async () => {
    let json = {
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
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    survey.controller.margins.left += survey.controller.unitWidth;
    let unfoldHeaderFlats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldHeaderFlats.length).toBe(2);
    let unfoldRowFlats: IPdfBrick[] = flats[0][1].unfold();
    expect(unfoldRowFlats.length).toBe(1);
    let header: ISize = survey.controller.measureText(json.elements[0].columns[0].name, 'bold');
    let assumeText: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft + header.width,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop + header.height
    };
    TestHelper.equalRect(expect, unfoldHeaderFlats[0], assumeText);
    expect(unfoldHeaderFlats[1] instanceof RowlineBrick).toBe(true);
    let assumeQuestion: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.paperWidth - survey.controller.margins.right,
        yTop: survey.controller.leftTopPoint.yTop + header.height + SurveyHelper.EPSILON +
            survey.controller.unitHeight * FlatMatrixDynamic.GAP_BETWEEN_ROWS,
        yBot: survey.controller.leftTopPoint.yTop + header.height +
            SurveyHelper.EPSILON + survey.controller.unitHeight * (1 + FlatMatrixDynamic.GAP_BETWEEN_ROWS)
    };
    TestHelper.equalRect(expect, unfoldRowFlats[0], assumeQuestion);
    let assumeMatrix: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.paperWidth - survey.controller.margins.right,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: assumeQuestion.yBot
    };
    TestHelper.equalRect(expect, SurveyHelper.mergeRects(...flats[0]), assumeMatrix);
});
test('Check matrix dynamic one column one row vertical layout show header off', async () => {
    let json = {
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
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    survey.controller.margins.left += survey.controller.unitWidth;
    let unfoldHeaderFlats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldHeaderFlats.length).toBe(1);
    expect(unfoldHeaderFlats[0] instanceof RowlineBrick).toBe(true);
    let unfoldRowFlats: IPdfBrick[] = flats[0][1].unfold();
    expect(unfoldRowFlats.length).toBe(1);
    let assumeQuestion: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.paperWidth - survey.controller.margins.right,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop +
            survey.controller.unitHeight
    };
    TestHelper.equalRect(expect, unfoldRowFlats[0], assumeQuestion);
});
test('Check matrix dynamic one column one row vertical layout', async () => {
    let json = {
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
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    survey.controller.margins.left += survey.controller.unitWidth;
    let unfoldHeaderFlats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldHeaderFlats.length).toBe(1);
    expect(unfoldHeaderFlats[0] instanceof RowlineBrick).toBe(true);
    let unfoldRowFlats: IPdfBrick[] = flats[0][1].unfold();
    expect(unfoldRowFlats.length).toBe(2);
    let header: ISize = survey.controller.measureText(json.elements[0].columns[0].name, 'bold');
    let assumeText: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft + header.width,
        yTop: survey.controller.leftTopPoint.yTop + SurveyHelper.EPSILON,
        yBot: survey.controller.leftTopPoint.yTop +
            SurveyHelper.EPSILON + header.height
    };
    TestHelper.equalRect(expect, unfoldRowFlats[0], assumeText);
    let assumeQuestion: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft +
            (SurveyHelper.getPageAvailableWidth(survey.controller) +
                survey.controller.unitWidth * SurveyHelper.GAP_BETWEEN_COLUMNS) / 2.0,
        xRight: survey.controller.paperWidth - survey.controller.margins.right,
        yTop: survey.controller.leftTopPoint.yTop + SurveyHelper.EPSILON,
        yBot: survey.controller.leftTopPoint.yTop + SurveyHelper.EPSILON +
            survey.controller.unitHeight
    };
    TestHelper.equalRect(expect, unfoldRowFlats[1], assumeQuestion);
    let assumeMatrix: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.paperWidth - survey.controller.margins.right,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: assumeQuestion.yBot
    };
    TestHelper.equalRect(expect, SurveyHelper.mergeRects(...flats[0]), assumeMatrix);
});
test('Check matrix dynamic two columns one row vertical layout show header off', async () => {
    let json = {
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
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(3);
    survey.controller.margins.left += survey.controller.unitWidth;
    let unfoldHeaderFlats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldHeaderFlats.length).toBe(1);
    expect(unfoldHeaderFlats[0] instanceof RowlineBrick).toBe(true);
    let unfoldRow1Flats: IPdfBrick[] = flats[0][1].unfold();
    expect(unfoldRow1Flats.length).toBe(2);
    let unfoldRow2Flats: IPdfBrick[] = flats[0][2].unfold();
    expect(unfoldRow2Flats.length).toBe(1);
    let assumeQuestion1: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.paperWidth - survey.controller.margins.right,
        yTop: survey.controller.leftTopPoint.yTop + SurveyHelper.EPSILON,
        yBot: survey.controller.leftTopPoint.yTop + SurveyHelper.EPSILON +
            survey.controller.unitHeight
    };
    expect(unfoldRow1Flats[1] instanceof RowlineBrick).toBe(true);
    TestHelper.equalRect(expect, unfoldRow1Flats[0], assumeQuestion1);
    let assumeQuestion2: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.paperWidth - survey.controller.margins.right,
        yTop: assumeQuestion1.yBot + SurveyHelper.EPSILON + FlatMatrixDynamic.GAP_BETWEEN_ROWS * survey.controller.unitHeight,
        yBot: assumeQuestion1.yBot + SurveyHelper.EPSILON +
            survey.controller.unitHeight * (1 + FlatMatrixDynamic.GAP_BETWEEN_ROWS)
    };
    TestHelper.equalRect(expect, unfoldRow2Flats[0], assumeQuestion2);
    let assumeMatrix: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.paperWidth - survey.controller.margins.right,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: assumeQuestion2.yBot
    };
    TestHelper.equalRect(expect, SurveyHelper.mergeRects(...flats[0]), assumeMatrix);
});
test('Check matrix dynamic one column no rows narrow width', async () => {
    let json = {
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
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(0);
});
test('Check matrix dynamic one column one row verical layout narrow width', async () => {
    let json = {
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
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    survey.controller.margins.left += survey.controller.unitWidth;
    let unfoldFlats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldFlats.length).toBe(3);
    let header: ISize = survey.controller.measureText(json.elements[0].columns[0].name, 'bold');
    let assumeHeader: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft + header.width,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop + header.height
    };
    TestHelper.equalRect(expect, unfoldFlats[0], assumeHeader);
    let text: ISize = survey.controller.measureText(json.elements[0].columns[0].name);
    let assumeText: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft + text.width,
        yTop: survey.controller.leftTopPoint.yTop +
            header.height + SurveyHelper.EPSILON +
            survey.controller.unitHeight * FlatMatrixDynamic.GAP_BETWEEN_ROWS,
        yBot: survey.controller.leftTopPoint.yTop +
            header.height + SurveyHelper.EPSILON + text.height +
            survey.controller.unitHeight * FlatMatrixDynamic.GAP_BETWEEN_ROWS
    };
    TestHelper.equalRect(expect, unfoldFlats[1], assumeText);
    let assumeQuestion: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.paperWidth - survey.controller.margins.right,
        yTop: assumeText.yBot + survey.controller.unitHeight * FlatMatrixDynamic.GAP_BETWEEN_ROWS,
        yBot: assumeText.yBot + survey.controller.unitHeight * (1 + FlatMatrixDynamic.GAP_BETWEEN_ROWS),
    };
    TestHelper.equalRect(expect, unfoldFlats[2], assumeQuestion);
    let assumeMatrix: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.paperWidth - survey.controller.margins.right,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: assumeQuestion.yBot
    };
    TestHelper.equalRect(expect, SurveyHelper.mergeRects(...flats[0]), assumeMatrix);
});
test('Check matrix dynamic two columns one row narrow width', async () => {
    let json = {
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
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    survey.controller.margins.left += survey.controller.unitWidth;
    let unfoldFlats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldFlats.length).toBe(4);
    let text1: ISize = survey.controller.measureText(json.elements[0].columns[0].name);
    let assumeText1: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft + text1.width,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop + text1.height
    };
    TestHelper.equalRect(expect, unfoldFlats[0], assumeText1);
    let assumeQuestion1: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.paperWidth - survey.controller.margins.right,
        yTop: assumeText1.yBot + survey.controller.unitHeight * FlatMatrixDynamic.GAP_BETWEEN_ROWS,
        yBot: assumeText1.yBot + survey.controller.unitHeight * (1 + FlatMatrixDynamic.GAP_BETWEEN_ROWS)
    };
    TestHelper.equalRect(expect, unfoldFlats[1], assumeQuestion1);
    let text2: ISize = survey.controller.measureText(json.elements[0].columns[1].name);
    let assumeText2: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft + text2.width,
        yTop: assumeQuestion1.yBot + SurveyHelper.EPSILON +
            survey.controller.unitHeight * FlatMatrixDynamic.GAP_BETWEEN_ROWS,
        yBot: assumeQuestion1.yBot + SurveyHelper.EPSILON + text2.height +
            survey.controller.unitHeight * FlatMatrixDynamic.GAP_BETWEEN_ROWS
    };
    TestHelper.equalRect(expect, unfoldFlats[2], assumeText2);
    let assumeQuestion2: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.paperWidth - survey.controller.margins.right,
        yTop: assumeText2.yBot + survey.controller.unitHeight * FlatMatrixDynamic.GAP_BETWEEN_ROWS,
        yBot: assumeText2.yBot + survey.controller.unitHeight * (1 + FlatMatrixDynamic.GAP_BETWEEN_ROWS)
    };
    TestHelper.equalRect(expect, unfoldFlats[3], assumeQuestion2);
    let assumeMatrix: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.paperWidth - survey.controller.margins.right,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: assumeQuestion2.yBot
    };
    TestHelper.equalRect(expect, flats[0][0], assumeMatrix);
});