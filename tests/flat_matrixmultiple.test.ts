(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { SurveyPDF } from '../src/survey';
import { IRect, ISize, IDocOptions, DocOptions, DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatDropdown } from '../src/flat_layout/flat_dropdown';
import { FlatMatrixMultiple } from '../src/flat_layout/flat_matrixmultiple';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { TestHelper } from '../src/helper_test';
import { SurveyHelper } from '../src/helper_survey';
let __dummy_dd = new FlatDropdown(null, null);
let __dummy_mm = new FlatMatrixMultiple(null, null);


test('Check matrix multiple one column no rows', async () => {
    let json = {
        elements: [
            {
                type: 'matrixdropdown',
                name: 'matri drop',
                titleLocation: 'hidden',
                columns: [
                    {
                        name: 'First power'
                    }
                ]
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let size: ISize = survey.controller.measureText(json.elements[0].columns[0].name, 'bold');
    let assumeMatrix: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft +
            SurveyHelper.getPageAvailableWidth(survey.controller) / 2.0,
        xRight: survey.controller.leftTopPoint.xLeft +
            SurveyHelper.getPageAvailableWidth(survey.controller) / 2.0 + size.width,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop + size.height
    };
    TestHelper.equalRect(expect, flats[0][0].unfold()[0], assumeMatrix);
});
test('Check matrix multiple one column one row', async () => {
    let json = {
        elements: [
            {
                type: 'matrixdropdown',
                name: 'simplimat',
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
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    let unfoldHeaderFlats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldHeaderFlats.length).toBe(2);
    let unfoldRowFlats: IPdfBrick[] = flats[0][1].unfold();
    expect(unfoldRowFlats.length).toBe(2);
    let header: ISize = survey.controller.measureText(json.elements[0].columns[0].name, 'bold');
    let assumeMatrix: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.paperWidth - survey.controller.margins.right,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop + header.height +
            SurveyHelper.EPSILON + survey.controller.measureText().height
    };
    TestHelper.equalRect(expect, SurveyHelper.mergeRects(flats[0][0], flats[0][1]), assumeMatrix);
    let assumeHeader: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft +
            SurveyHelper.getPageAvailableWidth(survey.controller) / 2.0,
        xRight: survey.controller.leftTopPoint.xLeft +
            SurveyHelper.getPageAvailableWidth(survey.controller) / 2.0 + header.width,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop + header.height
    };
    TestHelper.equalRect(expect, unfoldHeaderFlats[0], assumeHeader);
    let rowText: ISize = survey.controller.measureText(json.elements[0].rows[0]);
    let assumeRowText: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft + rowText.width,
        yTop: assumeHeader.yBot + SurveyHelper.EPSILON,
        yBot: assumeHeader.yBot + SurveyHelper.EPSILON + rowText.height
    };
    TestHelper.equalRect(expect, unfoldRowFlats[0], assumeRowText);
    let assumeRowQuestion: IRect = {
        xLeft: assumeHeader.xLeft,
        xRight: assumeMatrix.xRight,
        yTop: assumeRowText.yTop,
        yBot: assumeRowText.yTop + survey.controller.measureText().height
    };
    TestHelper.equalRect(expect, unfoldRowFlats[1], assumeRowQuestion);
});
test('Check matrix multiple two columns one row vertical layout', async () => {
    let json = {
        elements: [
            {
                type: 'matrixdropdown',
                name: 'vermat',
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
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(3);
    let unfoldHeaderFlats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldHeaderFlats.length).toBe(2);
    let unfoldRow1Flats: IPdfBrick[] = flats[0][1].unfold();
    expect(unfoldRow1Flats.length).toBe(3);
    let unfoldRow2Flats: IPdfBrick[] = flats[0][2].unfold();
    expect(unfoldRow2Flats.length).toBe(2);
    let header: ISize = survey.controller.measureText(json.elements[0].rows[0], 'bold');
    let assumeMatrix: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.paperWidth - survey.controller.margins.right,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop + header.height +
            + 2.0 * (survey.controller.measureText().height + SurveyHelper.EPSILON)
    };
    TestHelper.equalRect(expect, SurveyHelper.mergeRects(...flats[0]), assumeMatrix);
    let assumeHeader: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft +
            SurveyHelper.getPageAvailableWidth(survey.controller) / 2.0,
        xRight: survey.controller.leftTopPoint.xLeft +
            SurveyHelper.getPageAvailableWidth(survey.controller) / 2.0 + header.width,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop + header.height
    };
    TestHelper.equalRect(expect, unfoldHeaderFlats[0], assumeHeader);
    let row1Text: ISize = survey.controller.measureText(json.elements[0].columns[0].name, 'bold');
    let assumeRow1Text: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft + row1Text.width,
        yTop: assumeHeader.yBot + SurveyHelper.EPSILON,
        yBot: assumeHeader.yBot + SurveyHelper.EPSILON + row1Text.height
    };
    TestHelper.equalRect(expect, unfoldRow1Flats[0], assumeRow1Text);
    let assumeRow1Question: IRect = {
        xLeft: assumeHeader.xLeft,
        xRight: assumeMatrix.xRight,
        yTop: assumeRow1Text.yTop,
        yBot: assumeRow1Text.yTop + survey.controller.measureText().height
    };
    TestHelper.equalRect(expect, unfoldRow1Flats[1], assumeRow1Question);
    let row2Text: ISize = survey.controller.measureText(json.elements[0].columns[1].name, 'bold');
    let assumeRow2Text: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft + row2Text.width,
        yTop: assumeRow1Question.yBot + SurveyHelper.EPSILON,
        yBot: assumeRow1Question.yBot + SurveyHelper.EPSILON + row2Text.height
    };
    TestHelper.equalRect(expect, unfoldRow2Flats[0], assumeRow2Text);
    let assumeRow2Question: IRect = {
        xLeft: assumeHeader.xLeft,
        xRight: assumeMatrix.xRight,
        yTop: assumeRow2Text.yTop,
        yBot: assumeRow2Text.yTop + survey.controller.measureText().height
    };
    TestHelper.equalRect(expect, unfoldRow2Flats[1], assumeRow2Question);
});
test('Check matrix multiple two columns one row horizontal layout narrow width', async () => {
    let json = {
        elements: [
            {
                type: 'matrixdropdown',
                name: 'horonelinemat',
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
    let options: IDocOptions = TestHelper.defaultOptions;
    let pageWidth: number = options.margins.left + options.margins.right +
        new DocController(options).measureText(
            SurveyHelper.MATRIX_COLUMN_WIDTH).width * 1.5 / DocOptions.MM_TO_PT;
    options.format = [pageWidth, <number>(options.format[1])];
    let survey: SurveyPDF = new SurveyPDF(json, options);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let unfoldFlats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldFlats.length).toBe(5);
    let header: ISize = survey.controller.measureText(json.elements[0].rows[0]);
    let assumeHeader: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft + header.width,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop + header.height
    };
    TestHelper.equalRect(expect, unfoldFlats[0], assumeHeader);
    let row1Text: ISize = survey.controller.measureText(json.elements[0].columns[0].name);
    let assumeRow1Text: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft + row1Text.width,
        yTop: assumeHeader.yBot + SurveyHelper.EPSILON,
        yBot: assumeHeader.yBot + SurveyHelper.EPSILON + row1Text.height
    };
    TestHelper.equalRect(expect, unfoldFlats[1], assumeRow1Text);
    let assumeRow1Question: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.paperWidth - survey.controller.margins.right,
        yTop: assumeRow1Text.yBot,
        yBot: assumeRow1Text.yBot + survey.controller.measureText().height
    };
    TestHelper.equalRect(expect, unfoldFlats[2], assumeRow1Question);
    let row2Text: ISize = survey.controller.measureText(json.elements[0].columns[1].name);
    let assumeRow2Text: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft + row2Text.width,
        yTop: assumeRow1Question.yBot + SurveyHelper.EPSILON,
        yBot: assumeRow1Question.yBot + SurveyHelper.EPSILON + row2Text.height
    };
    TestHelper.equalRect(expect, unfoldFlats[3], assumeRow2Text);
    let assumeRow2Question: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.paperWidth - survey.controller.margins.right,
        yTop: assumeRow2Text.yBot,
        yBot: assumeRow2Text.yBot + survey.controller.measureText().height
    };
    TestHelper.equalRect(expect, unfoldFlats[4], assumeRow2Question);
    let assumeMatrix: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.paperWidth - survey.controller.margins.right,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop + header.height + row1Text.height +
            row2Text.height + 2.0 * (survey.controller.measureText().height + SurveyHelper.EPSILON)
    };
    TestHelper.equalRect(expect, SurveyHelper.mergeRects(flats[0][0]), assumeMatrix);
});
test('Check matrix multiple two columns one row vertical layout narrow width', async () => {
    let json = {
        elements: [
            {
                type: 'matrixdropdown',
                name: 'veronelinemat',
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
    let options: IDocOptions = TestHelper.defaultOptions;
    let pageWidth: number = options.margins.left + options.margins.right +
        new DocController(options).measureText(
            SurveyHelper.MATRIX_COLUMN_WIDTH).width * 1.5 / DocOptions.MM_TO_PT;
    options.format = [pageWidth, <number>(options.format[1])];
    let survey: SurveyPDF = new SurveyPDF(json, options);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    let unfoldRow1Flats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldRow1Flats.length).toBe(4);
    let unfoldRow2Flats: IPdfBrick[] = flats[0][1].unfold();
    expect(unfoldRow2Flats.length).toBe(3);
    let header1: ISize = survey.controller.measureText(json.elements[0].columns[0].name, 'bold');
    let assumeHeader1: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft + header1.width,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop + header1.height
    };
    TestHelper.equalRect(expect, unfoldRow1Flats[0], assumeHeader1);
    let row1Text: ISize = survey.controller.measureText(json.elements[0].rows[0]);
    let assumeRow1Text: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft + row1Text.width,
        yTop: assumeHeader1.yBot + SurveyHelper.EPSILON,
        yBot: assumeHeader1.yBot + SurveyHelper.EPSILON + row1Text.height
    };
    TestHelper.equalRect(expect, unfoldRow1Flats[1], assumeRow1Text);
    let assumeRow1Question: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.paperWidth - survey.controller.margins.right,
        yTop: assumeRow1Text.yBot,
        yBot: assumeRow1Text.yBot + survey.controller.measureText().height
    };
    TestHelper.equalRect(expect, unfoldRow1Flats[2], assumeRow1Question);
    let header2: ISize = survey.controller.measureText(json.elements[0].columns[1].name, 'bold');
    let assumeHeader2: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft + header2.width,
        yTop: assumeRow1Question.yBot + SurveyHelper.EPSILON,
        yBot: assumeRow1Question.yBot + SurveyHelper.EPSILON + header2.height
    };
    let row2Text: ISize = survey.controller.measureText(json.elements[0].rows[0]);
    TestHelper.equalRect(expect, unfoldRow2Flats[0], assumeHeader2);
    let assumeRow2Text: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft + row2Text.width,
        yTop: assumeHeader2.yBot + SurveyHelper.EPSILON,
        yBot: assumeHeader2.yBot + SurveyHelper.EPSILON + row2Text.height
    };
    TestHelper.equalRect(expect, unfoldRow2Flats[1], assumeRow2Text);
    let assumeRow2Question: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.paperWidth - survey.controller.margins.right,
        yTop: assumeRow2Text.yBot,
        yBot: assumeRow2Text.yBot + survey.controller.measureText().height
    };
    TestHelper.equalRect(expect, unfoldRow2Flats[2], assumeRow2Question);
    let assumeMatrix: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.paperWidth - survey.controller.margins.right,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop + header1.height + row1Text.height + header2.height +
            row2Text.height + 2.0 * survey.controller.measureText().height + SurveyHelper.EPSILON
    };
    TestHelper.equalRect(expect, SurveyHelper.mergeRects(...flats[0]), assumeMatrix);
});