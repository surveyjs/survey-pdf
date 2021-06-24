(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { SurveyPDF } from '../src/survey';
import { IRect, ISize, IDocOptions, DocOptions, DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatDropdown } from '../src/flat_layout/flat_dropdown';
import { FlatMatrixMultiple } from '../src/flat_layout/flat_matrixmultiple';
import { FlatMatrixDynamic } from '../src/flat_layout/flat_matrixdynamic';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
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
            SurveyHelper.MATRIX_COLUMN_WIDTH).width * 1.5 / DocOptions.MM_TO_PT
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