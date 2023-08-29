(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { SurveyPDF } from '../src/survey';
import { IPoint, IRect, ISize, IDocOptions, DocOptions, DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatDropdown } from '../src/flat_layout/flat_dropdown';
import { FlatMatrixMultiple } from '../src/flat_layout/flat_matrixmultiple';
import { FlatMatrixDynamic } from '../src/flat_layout/flat_matrixdynamic';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
import { QuestionMatrixDropdownModel } from 'survey-core';
import { FlatRepository } from '../src/flat_layout/flat_repository';
import { CompositeBrick } from '../src/pdf_render/pdf_composite';
let __dummy_dd = new FlatDropdown(null, null, null);
let __dummy_mm = new FlatMatrixMultiple(null, null, null);

test('Check matrix multiple one column no rows', async () => {
    const json: any = {
        elements: [
            {
                type: 'matrixdropdown',
                name: 'matrixmultiple_onecolumnnorows',
                titleLocation: 'hidden',
                columns: [
                    {
                        name: 'First power'
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
    const size: ISize = controller.measureText(json.elements[0].columns[0].name, 'bold');
    const assumeMatrix: IRect = {
        xLeft: controller.leftTopPoint.xLeft +
            SurveyHelper.getPageAvailableWidth(controller) / 2.0 +
            SurveyHelper.GAP_BETWEEN_COLUMNS * controller.unitWidth / 2.0,
        xRight: controller.leftTopPoint.xLeft +
            SurveyHelper.getPageAvailableWidth(controller) / 2.0 +
            SurveyHelper.GAP_BETWEEN_COLUMNS * controller.unitWidth / 2.0 + size.width,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + size.height
    };
    TestHelper.equalRect(expect, flats[0][0].unfold()[0], assumeMatrix);
});
test('Check matrix multiple one column no rows vertical layout', async () => {
    const json: any = {
        elements: [
            {
                type: 'matrixdropdown',
                name: 'matrixmultiple_onecolumnnorows_vertical',
                titleLocation: 'hidden',
                columns: [
                    {
                        name: 'First power'
                    }
                ],
                columnLayout: 'vertical'
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    controller.margins.left += controller.unitWidth;
    const size: ISize = controller.measureText(json.elements[0].columns[0].name, 'normal');
    const assumeMatrix: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + size.width,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + size.height
    };
    TestHelper.equalRect(expect, flats[0][0].unfold()[0], assumeMatrix);
});
test('Check matrix multiple one column one row', async () => {
    const json: any = {
        elements: [
            {
                type: 'matrixdropdown',
                name: 'matrixmultiple_onecolumnonerow',
                titleLocation: 'hidden',
                columns: [
                    {
                        name: 'First power'
                    }
                ],
                rows: [
                    'Arrow'
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
    const unfoldHeaderFlats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldHeaderFlats.length).toBe(2);
    const unfoldRowFlats: IPdfBrick[] = flats[0][1].unfold();
    expect(unfoldRowFlats.length).toBe(2);
    const header: ISize = controller.measureText(json.elements[0].columns[0].name, 'bold');
    const assumeMatrix: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.paperWidth - controller.margins.right,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + header.height +
            SurveyHelper.EPSILON + controller.unitHeight * (1 + FlatMatrixMultiple.GAP_BETWEEN_ROWS)
    };
    TestHelper.equalRect(expect, SurveyHelper.mergeRects(flats[0][0], flats[0][1]), assumeMatrix);
    const assumeHeader: IRect = {
        xLeft: controller.leftTopPoint.xLeft +
            SurveyHelper.getPageAvailableWidth(controller) / 2.0 +
            SurveyHelper.GAP_BETWEEN_COLUMNS * controller.unitWidth / 2.0,
        xRight: controller.leftTopPoint.xLeft +
            SurveyHelper.getPageAvailableWidth(controller) / 2.0 +
            SurveyHelper.GAP_BETWEEN_COLUMNS * controller.unitWidth / 2.0 +
            header.width,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + header.height
    };
    TestHelper.equalRect(expect, unfoldHeaderFlats[0], assumeHeader);
    const rowText: ISize = controller.measureText(json.elements[0].rows[0]);
    const assumeRowText: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + rowText.width,
        yTop: assumeHeader.yBot + SurveyHelper.EPSILON
            + controller.unitHeight * FlatMatrixMultiple.GAP_BETWEEN_ROWS,
        yBot: assumeHeader.yBot + SurveyHelper.EPSILON + rowText.height +
            controller.unitHeight * FlatMatrixMultiple.GAP_BETWEEN_ROWS
    };
    TestHelper.equalRect(expect, unfoldRowFlats[0], assumeRowText);
    const assumeRowQuestion: IRect = {
        xLeft: assumeHeader.xLeft,
        xRight: assumeMatrix.xRight,
        yTop: assumeRowText.yTop,
        yBot: assumeRowText.yTop + controller.unitHeight
    };
    TestHelper.equalRect(expect, unfoldRowFlats[1], assumeRowQuestion);
});
test('Check matrix multiple two columns one row vertical layout', async () => {
    const json: any = {
        elements: [
            {
                type: 'matrixdropdown',
                name: 'matrixmultiple_onecolumnonerow_vertical',
                titleLocation: 'hidden',
                columns: [
                    {
                        name: 'First power'
                    },
                    {
                        name: 'Second choice'
                    }
                ],
                columnLayout: 'vertical',
                rows: [
                    'Cap'
                ]
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
    const unfoldRow1Flats: IPdfBrick[] = flats[0][1].unfold();
    expect(unfoldRow1Flats.length).toBe(3);
    const unfoldRow2Flats: IPdfBrick[] = flats[0][2].unfold();
    expect(unfoldRow2Flats.length).toBe(2);
    const header: ISize = controller.measureText(json.elements[0].rows[0], 'bold');
    const assumeMatrix: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.paperWidth - controller.margins.right,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + header.height +
            + 2.0 * ((1 + FlatMatrixDynamic.CONTENT_GAP_VERT_SCALE) * controller.unitHeight + SurveyHelper.EPSILON)
    };
    TestHelper.equalRect(expect, SurveyHelper.mergeRects(...flats[0]), assumeMatrix);
    const assumeHeader: IRect = {
        xLeft: controller.leftTopPoint.xLeft +
            SurveyHelper.getPageAvailableWidth(controller) / 2.0 + SurveyHelper.GAP_BETWEEN_COLUMNS * controller.unitWidth / 2.0,
        xRight: controller.leftTopPoint.xLeft +
            SurveyHelper.getPageAvailableWidth(controller) / 2.0 +
            SurveyHelper.GAP_BETWEEN_COLUMNS * controller.unitWidth / 2.0 +
            header.width,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + header.height
    };
    TestHelper.equalRect(expect, unfoldHeaderFlats[0], assumeHeader);
    const row1Text: ISize = controller.measureText(json.elements[0].columns[0].name);
    const assumeRow1Text: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + row1Text.width,
        yTop: assumeHeader.yBot + SurveyHelper.EPSILON
            + controller.unitHeight * FlatMatrixDynamic.GAP_BETWEEN_ROWS,
        yBot: assumeHeader.yBot + SurveyHelper.EPSILON + row1Text.height +
            controller.unitHeight * FlatMatrixDynamic.GAP_BETWEEN_ROWS
    };
    TestHelper.equalRect(expect, unfoldRow1Flats[0], assumeRow1Text);
    const assumeRow1Question: IRect = {
        xLeft: assumeHeader.xLeft,
        xRight: assumeMatrix.xRight,
        yTop: assumeRow1Text.yTop,
        yBot: assumeRow1Text.yTop + controller.unitHeight
    };
    TestHelper.equalRect(expect, unfoldRow1Flats[1], assumeRow1Question);
    const row2Text: ISize = controller.measureText(json.elements[0].columns[1].name);
    const assumeRow2Text: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + row2Text.width,
        yTop: assumeRow1Question.yBot + SurveyHelper.EPSILON
            + controller.unitHeight * FlatMatrixDynamic.GAP_BETWEEN_ROWS,
        yBot: assumeRow1Question.yBot + SurveyHelper.EPSILON + row2Text.height
            + controller.unitHeight * FlatMatrixDynamic.GAP_BETWEEN_ROWS
    };
    TestHelper.equalRect(expect, unfoldRow2Flats[0], assumeRow2Text);
    const assumeRow2Question: IRect = {
        xLeft: assumeHeader.xLeft,
        xRight: assumeMatrix.xRight,
        yTop: assumeRow2Text.yTop,
        yBot: assumeRow2Text.yTop + controller.unitHeight
    };
    TestHelper.equalRect(expect, unfoldRow2Flats[1], assumeRow2Question);
});
test('Check matrix multiple two columns one row horizontal layout narrow width', async () => {
    const json: any = {
        elements: [
            {
                type: 'matrixdropdown',
                name: 'matrixmultiple_twocolumnsonerow_horizontal_narrow',
                titleLocation: 'hidden',
                columns: [
                    {
                        name: 'First power'
                    },
                    {
                        name: 'Second choice'
                    }
                ],
                rows: [
                    'Cap'
                ]
            }
        ]
    };
    const options: IDocOptions = TestHelper.defaultOptions;
    const pageWidth: number = options.margins.left + options.margins.right +
        new DocController(options).measureText(
            SurveyHelper.MATRIX_COLUMN_WIDTH).width * 1.5 / DocOptions.MM_TO_PT;
    new DocController(options).unitWidth / DocOptions.MM_TO_PT;
    options.format = [pageWidth, <number>(options.format[1])];
    const survey: SurveyPDF = new SurveyPDF(json, options);
    const controller: DocController = new DocController(options);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    controller.margins.left += controller.unitWidth;
    const unfoldFlats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldFlats.length).toBe(5);
    const header: ISize = controller.measureText(json.elements[0].rows[0]);
    const assumeHeader: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + header.width,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + header.height
    };
    TestHelper.equalRect(expect, unfoldFlats[0], assumeHeader);
    const row1Text: ISize = controller.measureText(json.elements[0].columns[0].name);
    const assumeRow1Text: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + row1Text.width,
        yTop: assumeHeader.yBot + SurveyHelper.EPSILON +
            controller.unitHeight * FlatMatrixDynamic.GAP_BETWEEN_ROWS,
        yBot: assumeHeader.yBot + SurveyHelper.EPSILON + row1Text.height +
            controller.unitHeight * FlatMatrixDynamic.GAP_BETWEEN_ROWS
    };
    TestHelper.equalRect(expect, unfoldFlats[1], assumeRow1Text);
    const assumeRow1Question: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.paperWidth - controller.margins.right,
        yTop: assumeRow1Text.yBot + controller.unitHeight * FlatMatrixDynamic.GAP_BETWEEN_ROWS,
        yBot: assumeRow1Text.yBot + controller.unitHeight * (1 + FlatMatrixDynamic.GAP_BETWEEN_ROWS)
    };
    TestHelper.equalRect(expect, unfoldFlats[2], assumeRow1Question);
    const row2Text: ISize = controller.measureText(json.elements[0].columns[1].name);
    const assumeRow2Text: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + row2Text.width,
        yTop: assumeRow1Question.yBot + SurveyHelper.EPSILON
            + controller.unitHeight * FlatMatrixDynamic.GAP_BETWEEN_ROWS,
        yBot: assumeRow1Question.yBot + SurveyHelper.EPSILON + row2Text.height
            + controller.unitHeight * FlatMatrixDynamic.GAP_BETWEEN_ROWS
    };
    TestHelper.equalRect(expect, unfoldFlats[3], assumeRow2Text);
    const assumeRow2Question: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.paperWidth - controller.margins.right,
        yTop: assumeRow2Text.yBot +
            controller.unitHeight * FlatMatrixDynamic.GAP_BETWEEN_ROWS,
        yBot: assumeRow2Text.yBot + controller.unitHeight +
            controller.unitHeight * FlatMatrixDynamic.GAP_BETWEEN_ROWS
    };
    TestHelper.equalRect(expect, unfoldFlats[4], assumeRow2Question);
    const assumeMatrix: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.paperWidth - controller.margins.right,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + header.height + row1Text.height +
            row2Text.height + (2.0 + 4.0 * FlatMatrixDynamic.GAP_BETWEEN_ROWS) *
            controller.unitHeight + 2 * SurveyHelper.EPSILON
    };
    TestHelper.equalRect(expect, SurveyHelper.mergeRects(flats[0][0]), assumeMatrix);
});
test('Check matrix multiple two columns one row vertical layout narrow width', async () => {
    const json = {
        elements: [
            {
                type: 'matrixdropdown',
                name: 'matrixmultiple_twocolumnsonerow_vertical_narrow',
                titleLocation: 'hidden',
                columns: [
                    {
                        name: 'First power'
                    },
                    {
                        name: 'Second choice'
                    }
                ],
                columnLayout: 'vertical',
                rows: [
                    'Cap'
                ]
            }
        ]
    };
    const options: IDocOptions = TestHelper.defaultOptions;
    const pageWidth: number = options.margins.left + options.margins.right +
        new DocController(options).measureText(
            SurveyHelper.MATRIX_COLUMN_WIDTH).width * 1.5 / DocOptions.MM_TO_PT +
        new DocController(options).unitWidth / DocOptions.MM_TO_PT;
    options.format = [pageWidth, <number>(options.format[1])];
    const survey: SurveyPDF = new SurveyPDF(json, options);
    const controller: DocController = new DocController(options);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    controller.margins.left += controller.unitWidth;
    const unfoldRow1Flats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldRow1Flats.length).toBe(4);
    const unfoldRow2Flats: IPdfBrick[] = flats[0][1].unfold();
    expect(unfoldRow2Flats.length).toBe(3);
    const header1: ISize = controller.measureText(json.elements[0].columns[0].name);
    const assumeHeader1: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + header1.width,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + header1.height
    };
    TestHelper.equalRect(expect, unfoldRow1Flats[0], assumeHeader1);
    const row1Text: ISize = controller.measureText(json.elements[0].rows[0]);
    const assumeRow1Text: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + row1Text.width,
        yTop: assumeHeader1.yBot + SurveyHelper.EPSILON + controller.unitHeight *
            FlatMatrixDynamic.GAP_BETWEEN_ROWS,
        yBot: assumeHeader1.yBot + SurveyHelper.EPSILON + row1Text.height +
            controller.unitHeight * FlatMatrixDynamic.GAP_BETWEEN_ROWS
    };
    TestHelper.equalRect(expect, unfoldRow1Flats[1], assumeRow1Text);
    const assumeRow1Question: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.paperWidth - controller.margins.right,
        yTop: assumeRow1Text.yBot + controller.unitHeight * FlatMatrixDynamic.GAP_BETWEEN_ROWS,
        yBot: assumeRow1Text.yBot + controller.unitHeight * (1 + FlatMatrixDynamic.GAP_BETWEEN_ROWS)
    };
    TestHelper.equalRect(expect, unfoldRow1Flats[2], assumeRow1Question);
    const header2: ISize = controller.measureText(json.elements[0].columns[1].name);
    const assumeHeader2: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + header2.width,
        yTop: assumeRow1Question.yBot + SurveyHelper.EPSILON +
            controller.unitHeight * FlatMatrixDynamic.GAP_BETWEEN_ROWS,
        yBot: assumeRow1Question.yBot + SurveyHelper.EPSILON + header2.height +
            controller.unitHeight * FlatMatrixDynamic.GAP_BETWEEN_ROWS
    };
    const row2Text: ISize = controller.measureText(json.elements[0].rows[0]);
    TestHelper.equalRect(expect, unfoldRow2Flats[0], assumeHeader2);
    const assumeRow2Text: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + row2Text.width,
        yTop: assumeHeader2.yBot + SurveyHelper.EPSILON +
            controller.unitHeight * FlatMatrixDynamic.GAP_BETWEEN_ROWS,
        yBot: assumeHeader2.yBot + SurveyHelper.EPSILON + row2Text.height +
            controller.unitHeight * FlatMatrixDynamic.GAP_BETWEEN_ROWS
    };
    TestHelper.equalRect(expect, unfoldRow2Flats[1], assumeRow2Text);
    const assumeRow2Question: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.paperWidth - controller.margins.right,
        yTop: assumeRow2Text.yBot + controller.unitHeight * FlatMatrixDynamic.GAP_BETWEEN_ROWS,
        yBot: assumeRow2Text.yBot + controller.unitHeight * (1 + FlatMatrixDynamic.GAP_BETWEEN_ROWS)
    };
    TestHelper.equalRect(expect, unfoldRow2Flats[2], assumeRow2Question);
    const assumeMatrix: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.paperWidth - controller.margins.right,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + header1.height + row1Text.height + header2.height +
            row2Text.height + (2.0 + 5 * FlatMatrixDynamic.GAP_BETWEEN_ROWS) * controller.unitHeight + SurveyHelper.EPSILON
    };
    TestHelper.equalRect(expect, SurveyHelper.mergeRects(...flats[0]), assumeMatrix);
});
test('Check matrix multiple with showInMultipleColumns option and none choice', async () => {
    const json: any = {
        elements: [
            {
                type: 'matrixdropdown',
                name: 'matrixmultiple_showinmultiplecolumns_hasnonechoice',
                titleLocation: 'hidden',
                showHeader: false,
                columns: [
                    {
                        cellType: 'radiogroup',
                        showInMultipleColumns: true,
                        choices: [
                            {
                                value: 'choice1'
                            }
                        ],
                        hasNone: true,
                        noneText: 'None'
                    }
                ],
                rows: [
                    'row1'
                ]
            }
        ]
    };
    const options: IDocOptions = TestHelper.defaultOptions;
    options.fontSize = DocController.FONT_SIZE;
    const survey: SurveyPDF = new SurveyPDF(json, options);
    const controller: DocController = new DocController(options);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    controller.margins.left += controller.unitWidth;
    const unfoldFlats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldFlats.length).toBe(3);
    const rowText: ISize = controller.measureText(json.elements[0].rows[0]);
    const assumeRowName: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + rowText.width,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + rowText.height
    };
    TestHelper.equalRect(expect, unfoldFlats[0], assumeRowName);
    const leftTopPointColumn2: IPoint = {
        xLeft: controller.leftTopPoint.xLeft +
            SurveyHelper.getPageAvailableWidth(controller) / 3.0 + SurveyHelper.GAP_BETWEEN_COLUMNS * controller.unitWidth / 3.0,
        yTop: controller.leftTopPoint.yTop
    };
    const assumeChoice: IRect = SurveyHelper.moveRect(
        SurveyHelper.scaleRect(SurveyHelper.createRect(leftTopPointColumn2,
            controller.unitWidth, controller.unitHeight), SurveyHelper.SELECT_ITEM_FLAT_SCALE),
        leftTopPointColumn2.xLeft);
    TestHelper.equalRect(expect, unfoldFlats[1], assumeChoice);
    const leftTopPointColumn3: IPoint = {
        xLeft: controller.leftTopPoint.xLeft + 2.0 * SurveyHelper.getPageAvailableWidth(controller) / 3.0 +
            2.0 * SurveyHelper.GAP_BETWEEN_COLUMNS * controller.unitWidth / 3.0,
        yTop: controller.leftTopPoint.yTop
    };
    const assumeNoneChoice: IRect = SurveyHelper.moveRect(
        SurveyHelper.scaleRect(SurveyHelper.createRect(leftTopPointColumn3,
            controller.unitWidth, controller.unitHeight), SurveyHelper.SELECT_ITEM_FLAT_SCALE),
        leftTopPointColumn3.xLeft);
    TestHelper.equalRect(expect, unfoldFlats[2], assumeNoneChoice);
});
test('Check matrix multiple column widths', async () => {
    let json: any = {
        elements: [
            {
                type: 'matrixdropdown',
                name: 'matrixdropdown',
                titleLocation: 'hidden',
                rowTitleWidth: '400px',
                showHeader: false,
                columns: [
                    {
                        cellType: 'text',
                        name: 'Col1',
                    },
                    {
                        cellType: 'text',
                        name: 'Col1',
                        width: '50px'
                    },
                    {
                        cellType: 'text',
                        name: 'Col1',
                    }
                ],
                rows: ['Row1']
            }
        ]
    };
    const options: IDocOptions = TestHelper.defaultOptions;
    options.fontSize = DocController.FONT_SIZE;
    let survey: SurveyPDF = new SurveyPDF(json, options);
    let question = <QuestionMatrixDropdownModel>survey.getAllQuestions()[0];
    const controller: DocController = new DocController(options);
    let flat = new FlatMatrixMultiple(survey, question, controller);
    let widths = flat['calculateColumnWidth'](flat['visibleRows'], 4);
    let restWidth = controller.measureText(SurveyHelper.MATRIX_COLUMN_WIDTH).width;
    expect(widths).toEqual([300, restWidth, 37.5, restWidth]);
    expect(flat['calculateIsWide'](question.renderedTable, 4)).toBeFalsy();

    json = {
        elements: [
            {
                type: 'matrixdropdown',
                name: 'matrixdropdown',
                titleLocation: 'hidden',
                rowTitleWidth: '100px',
                showHeader: false,
                columns: [
                    {
                        cellType: 'text',
                        name: 'Col1',
                    },
                    {
                        cellType: 'text',
                        name: 'Col1',
                        width: '50px'
                    },
                    {
                        cellType: 'text',
                        name: 'Col1',
                    }
                ],
                rows: ['Row1']
            }
        ]
    };
    survey = new SurveyPDF(json, options);
    question = <QuestionMatrixDropdownModel>survey.getAllQuestions()[0];
    flat = new FlatMatrixMultiple(survey, question, controller);
    widths = flat['calculateColumnWidth'](flat['visibleRows'], 4);
    restWidth = (flat['getAvalableWidth'](4) - 75 - 37.5) / 2;
    expect(widths).toEqual([75, restWidth, 37.5, restWidth]);
    expect(flat['calculateIsWide'](question.renderedTable, 4)).toBeTruthy();
});
test('Check matrix dynamic column min widths', async () => {
    let json: any = {
        elements: [
            {
                type: 'matrixdynamic',
                name: 'matrixdropdown',
                titleLocation: 'hidden',
                showHeader: false,
                rowCount: 2,
                columns: [
                    {
                        cellType: 'text',
                        minWidth: '150px',
                        name: 'Col1',
                    },
                    {
                        cellType: 'text',
                        name: 'Col2',
                        width: '0px'
                    },
                    {
                        cellType: 'text',
                        name: 'Col3',
                        minWidth: '200px',
                    },
                    {
                        cellType: 'text',
                        name: 'Col4',
                        width: '0px'
                    },
                ],
                rows: ['Row1']
            }
        ]
    };
    const options: IDocOptions = TestHelper.defaultOptions;
    options.fontSize = DocController.FONT_SIZE;
    let survey: SurveyPDF = new SurveyPDF(json, options);
    let question = <QuestionMatrixDropdownModel>survey.getAllQuestions()[0];
    const controller: DocController = new DocController(options);
    let flat = new FlatMatrixDynamic(survey, question, controller);
    let widths = flat['calculateColumnWidth'](flat['visibleRows'], 4);
    let restWidth = (flat['getAvalableWidth'](4) - 112.5 - 150) / 2;
    expect(widths).toEqual([112.5, restWidth, 150, restWidth]);
});
test('Check matrix dynamic column min widths with detailPanel', async () => {
    let json: any = {
        elements: [
            {
                type: 'matrixdynamic',
                name: 'matrixdropdown',
                titleLocation: 'hidden',
                showHeader: false,
                rowCount: 1,
                columns: [
                    {
                        cellType: 'text',
                        minWidth: '150px',
                        name: 'Col1',
                    },
                    {
                        cellType: 'text',
                        name: 'Col2',
                        width: '0px'
                    },
                    {
                        cellType: 'text',
                        name: 'Col3',
                        minWidth: '200px',
                    },
                    {
                        cellType: 'text',
                        name: 'Col4',
                        width: '0px'
                    },
                ],
                detailElements: [
                    {
                        'type': 'text',
                        'name': 'text',
                    }
                ],
                detailPanelMode: 'underRow',
            }
        ]
    };
    const options: IDocOptions = TestHelper.defaultOptions;
    options.fontSize = DocController.FONT_SIZE;
    let survey: SurveyPDF = new SurveyPDF(json, options);
    let question = <QuestionMatrixDropdownModel>survey.getAllQuestions()[0];
    const controller: DocController = new DocController(options);
    let flat = new FlatMatrixDynamic(survey, question, controller);
    let widths = flat['calculateColumnWidth'](flat['visibleRows'], 4);
    let restWidth = (flat['getAvalableWidth'](4) - 112.5 - 150) / 2;
    expect(widths).toEqual([112.5, restWidth, 150, restWidth]);
});
test('Check getRowsToRender method', async () => {
    const json = {
        pages: [
            {
                name: 'page1',
                elements: [
                    {
                        type: 'matrixdropdown',
                        name: 'question1',
                        columns: [
                            {
                                name: 'Column 1',
                                title: 'Column 1',
                                totalType: 'sum'
                            },
                        ],
                        choices: [1, 2, 3, 4, 5],
                        rows: ['Row 1']
                    }
                ]
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const question = <QuestionMatrixDropdownModel>survey.getAllQuestions()[0];
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    let flat = new FlatMatrixMultiple(survey, survey.getAllQuestions()[0], controller);
    let table = question.renderedTable;
    let rows = flat['getRowsToRender'](question.renderedTable, false, true);
    expect(rows.length).toBe(3);

    expect(rows[0] === table.headerRow).toBeTruthy();
    expect(rows[1] === table.rows[1]).toBeTruthy();
    expect(rows[2] === table.footerRow).toBeTruthy();

    rows = flat['getRowsToRender'](question.renderedTable, false, false);
    expect(rows.length).toBe(2);

    expect(rows[0] === table.rows[1]).toBeTruthy();
    expect(rows[1] === table.footerRow).toBeTruthy();
});

test('Check matrix multiple one column one row with detailPanel', async () => {
    const json: any = {
        showQuestionNumbers: 'off',
        elements: [
            {
                type: 'matrixdropdown',
                name: 'detailPanelChecker',
                titleLocation: 'hidden',
                hideNumber: true,
                columns: [
                    {
                        name: 'Col1',
                    }
                ],
                detailElements: [
                    {
                        type: 'comment',
                        name: 'commentInPanel',
                        titleLocation: 'hidden',
                    }
                ],
                rows: ['Row1'],
                detailPanelMode: 'underRow',
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const question = <QuestionMatrixDropdownModel>survey.getAllQuestions()[0];
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(3);
    controller.margins.left += controller.unitWidth;
    const unfoldHeaderFlats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldHeaderFlats.length).toBe(2);
    const unfoldRowFlats: IPdfBrick[] = flats[0][1].unfold();
    expect(unfoldRowFlats.length).toBe(2);
    const header: ISize = controller.measureText(json.elements[0].columns[0].name, 'bold');
    const assumeMatrix: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.paperWidth - controller.margins.right,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + header.height +
            SurveyHelper.EPSILON + controller.unitHeight * (1 + FlatMatrixMultiple.GAP_BETWEEN_ROWS)
    };
    TestHelper.equalRect(expect, SurveyHelper.mergeRects(flats[0][0], flats[0][1]), assumeMatrix);
    const assumeHeader: IRect = {
        xLeft: controller.leftTopPoint.xLeft +
            SurveyHelper.getPageAvailableWidth(controller) / 2.0 +
            SurveyHelper.GAP_BETWEEN_COLUMNS * controller.unitWidth / 2.0,
        xRight: controller.leftTopPoint.xLeft +
            SurveyHelper.getPageAvailableWidth(controller) / 2.0 +
            SurveyHelper.GAP_BETWEEN_COLUMNS * controller.unitWidth / 2.0 +
            header.width,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + header.height
    };
    TestHelper.equalRect(expect, unfoldHeaderFlats[0], assumeHeader);
    const rowText: ISize = controller.measureText(json.elements[0].rows[0]);
    const assumeRowText: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + rowText.width,
        yTop: assumeHeader.yBot + SurveyHelper.EPSILON
            + controller.unitHeight * FlatMatrixMultiple.GAP_BETWEEN_ROWS,
        yBot: assumeHeader.yBot + SurveyHelper.EPSILON + rowText.height +
            controller.unitHeight * FlatMatrixMultiple.GAP_BETWEEN_ROWS
    };
    TestHelper.equalRect(expect, unfoldRowFlats[0], assumeRowText);
    const assumeRowQuestion: IRect = {
        xLeft: assumeHeader.xLeft,
        xRight: assumeMatrix.xRight,
        yTop: assumeRowText.yTop,
        yBot: assumeRowText.yTop + controller.unitHeight
    };
    TestHelper.equalRect(expect, unfoldRowFlats[1], assumeRowQuestion);
    question.visibleRows[0].showDetailPanel();
    const panel = question.visibleRows[0].detailPanel;
    const assumePanelBricks = await FlatSurvey.generateFlatsPanel(
        survey, controller, panel, { xLeft: assumeRowText.xLeft, yTop: assumeRowQuestion.yBot + SurveyHelper.EPSILON
            + controller.unitHeight * FlatMatrixMultiple.GAP_BETWEEN_ROWS });
    const assumePanelCompositeBrick = new CompositeBrick(...assumePanelBricks);
    TestHelper.equalRect(expect, flats[0][2], assumePanelCompositeBrick);
});

test('Check matrix multiple zero columns one row with detailPanel', async () => {
    const json: any = {
        showQuestionNumbers: 'off',
        elements: [
            {
                type: 'matrixdropdown',
                name: 'detailPanelChecker',
                titleLocation: 'hidden',
                hideNumber: true,
                columns: [],
                detailElements: [
                    {
                        type: 'comment',
                        name: 'commentInPanel',
                        titleLocation: 'hidden',
                    }
                ],
                rows: ['Row1'],
                detailPanelMode: 'underRow',
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const question = <QuestionMatrixDropdownModel>survey.getAllQuestions()[0];
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    controller.margins.left += controller.unitWidth;
    const unfoldRowFlats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldRowFlats.length).toBe(1);
    const rowText: ISize = controller.measureText(json.elements[0].rows[0]);
    const assumeRowText: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + rowText.width,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + controller.unitHeight
    };
    TestHelper.equalRect(expect, unfoldRowFlats[0], assumeRowText);
    question.visibleRows[0].showDetailPanel();
    const panel = question.visibleRows[0].detailPanel;
    const assumePanelBricks = await FlatSurvey.generateFlatsPanel(
        survey, controller, panel, { xLeft: assumeRowText.xLeft, yTop: assumeRowText.yBot + SurveyHelper.EPSILON
            + controller.unitHeight * FlatMatrixMultiple.GAP_BETWEEN_ROWS });
    const assumePanelCompositeBrick = new CompositeBrick(...assumePanelBricks);
    TestHelper.equalRect(expect, flats[0][1], assumePanelCompositeBrick);
});