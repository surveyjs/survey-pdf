(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
    return {};
};
import { SurveyPDF } from '../src/survey';
import { IPoint, IRect, ISize, IDocOptions, DocController } from '../src/doc_controller';
import { FlatMatrix } from '../src/flat_layout/flat_matrix';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { TextBrick } from '../src/pdf_render/pdf_text';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
import { FlatQuestion } from '../src/entries/pdf';
let __dummy_mt = new FlatMatrix(null, null, null);

test('Matrix simple hasRows true columns', async () => {
    let json: any = {
        questions: [
            {
                titleLocation: 'hidden',
                type: 'matrix',
                name: 'matsimp_hasrowstrue',
                columns: [
                    {
                        value: 1,
                        text: 'test1'
                    }
                ],
                rows: [
                    {
                        value: 1,
                        text: 'test2'
                    }
                ]
            }]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    controller.margins.left += controller.unitWidth;
    let assumeCells: IRect[] = [];
    let headerSize: ISize = controller.measureText(json.questions[0].columns[0].text, 'bold');
    let currPoint: IPoint = controller.leftTopPoint;
    let cellWidth: number = SurveyHelper.getColumnWidth(controller, 2);
    currPoint.xLeft = cellWidth + controller.margins.left +
        controller.unitWidth * SurveyHelper.GAP_BETWEEN_COLUMNS;
    let columnRect: IRect = SurveyHelper.createRect(currPoint, headerSize.width, headerSize.height);
    assumeCells.push(columnRect);
    currPoint = SurveyHelper.createPoint(columnRect);
    currPoint.yTop += FlatMatrix.GAP_BETWEEN_ROWS * controller.unitHeight;
    assumeCells.push(SurveyHelper.createRect({ xLeft: controller.leftTopPoint.xLeft, yTop: currPoint.yTop },
        controller.measureText(json.questions[0].rows[0].text).width,
        controller.measureText(json.questions[0].rows[0].text).height));
    let itemWidth: number = controller.unitWidth;
    assumeCells.push(SurveyHelper.moveRect(SurveyHelper.scaleRect(
        SurveyHelper.createRect(currPoint, itemWidth, itemWidth),
        SurveyHelper.SELECT_ITEM_FLAT_SCALE), currPoint.xLeft));
    let receivedCells = [];
    receivedCells.push(...flats[0][0].unfold(), ...flats[0][2].unfold());
    TestHelper.equalRects(expect, receivedCells, assumeCells);
});
test('Matrix simple hasRows false columns', async () => {
    let json: any = {
        questions: [
            {
                titleLocation: 'hidden',
                type: 'matrix',
                name: 'matsimp_hasrowsfalse',
                columns: [
                    {
                        value: 1,
                        text: 'test1'
                    }
                ]
            }]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    controller.margins.left += controller.unitWidth;
    let assumeCells: IRect[] = [];
    let headerSize: ISize = controller.measureText(json.questions[0].columns[0].text, 'bold');
    let columnRect: IRect = SurveyHelper.createRect(controller.leftTopPoint, headerSize.width, headerSize.height);
    assumeCells.push(columnRect);
    let rowLineRect: IPdfBrick = SurveyHelper.createRowlineFlat(SurveyHelper.createPoint(columnRect), controller);
    assumeCells.push(rowLineRect);
    let currPoint: IPoint = SurveyHelper.createPoint(rowLineRect);
    currPoint.yTop += controller.unitHeight * FlatMatrix.GAP_BETWEEN_ROWS;
    let itemWidth: number = controller.unitWidth;
    assumeCells.push(SurveyHelper.moveRect(SurveyHelper.scaleRect(
        SurveyHelper.createRect(currPoint, itemWidth, itemWidth),
        SurveyHelper.SELECT_ITEM_FLAT_SCALE), currPoint.xLeft));
    TestHelper.equalRects(expect, flats[0], assumeCells);
});
test('Matrix simple vertical', async () => {
    let json: any = {
        questions: [
            {
                titleLocation: 'hidden',
                type: 'matrix',
                name: 'matsimp_vertical',
                columns: [
                    {
                        value: 1,
                        text: 'test1'
                    }, {
                        value: 2,
                        text: 'test2'
                    }, {
                        value: 3,
                        text: 'test3'
                    }, {
                        value: 4,
                        text: 'test4'
                    }
                ]
            }]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    controller.margins.left += controller.unitWidth;
    let assumeCells: IRect[] = [];
    let itemWidth: number = controller.unitWidth;
    let currPoint: IPoint = controller.leftTopPoint;
    let unfoldCells: IRect[] = [];
    flats[0].forEach((flat: IPdfBrick) => {
        unfoldCells.push(...flat.unfold());
    });
    json.questions[0].columns.forEach((column: any) => {
        let itemRect: IRect = SurveyHelper.createRect(currPoint, itemWidth, itemWidth);
        assumeCells.push(SurveyHelper.moveRect(SurveyHelper.scaleRect(itemRect,
            SurveyHelper.SELECT_ITEM_FLAT_SCALE), currPoint.xLeft));
        let oldXleft: number = currPoint.xLeft;
        currPoint.xLeft += itemWidth * (SurveyHelper.SELECT_ITEM_FLAT_SCALE + SurveyHelper.GAP_BETWEEN_ITEM_TEXT);
        let columnTextWidth: number = controller.measureText(column.text).width;
        let columnTextHeight: number = controller.measureText(column.text).height;
        assumeCells.push(SurveyHelper.createRect(currPoint, columnTextWidth, columnTextHeight));
        currPoint.xLeft = oldXleft;
        currPoint.yTop += SurveyHelper.GAP_BETWEEN_ROWS *
            controller.unitHeight + columnTextHeight;
    });
    TestHelper.equalRects(expect, unfoldCells, assumeCells);
});
test('Matrix simple hidden header', async () => {
    let json: any = {
        questions: [
            {
                titleLocation: 'hidden',
                showHeader: false,
                type: 'matrix',
                name: 'matsimp_hiddenheader',
                title: 'Please indicate if you agree or disagree with the following statements',
                columns: [
                    {
                        value: 1,
                        text: 'test1'
                    }, {
                        value: 2,
                        text: 'test2'
                    }, {
                        value: 3,
                        text: 'test3'
                    }
                ],
                rows: ['Row1']
            }]
    };
    let options: IDocOptions = TestHelper.defaultOptions;
    options.format = [400, 297.0];
    let survey: SurveyPDF = new SurveyPDF(json, options);
    let controller: DocController = new DocController(options);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    let assumeCells: IRect[] = [];
    let itemWidth: number = controller.unitHeight;
    controller.margins.left += controller.unitWidth;
    let cellWidth: number = SurveyHelper.getColumnWidth(controller, 4);
    let rowTextFlat: IPdfBrick = await SurveyHelper.createTextFlat(controller.leftTopPoint,
        survey.getAllQuestions()[0], controller, json.questions[0].rows[0], TextBrick);
    assumeCells.push(rowTextFlat);
    let columnsCurrPoint = controller.leftTopPoint;
    columnsCurrPoint.xLeft += cellWidth + controller.unitWidth * SurveyHelper.GAP_BETWEEN_COLUMNS;
    for (let i: number = 0; i < json.questions[0].columns.length; i++) {
        let currPoint = SurveyHelper.createPoint(<IRect>columnsCurrPoint, true, true);
        currPoint.xLeft += i * (cellWidth + controller.unitWidth *
            SurveyHelper.GAP_BETWEEN_COLUMNS);
        assumeCells.push(SurveyHelper.moveRect(SurveyHelper.scaleRect(
            SurveyHelper.createRect(currPoint, itemWidth, itemWidth),
            SurveyHelper.SELECT_ITEM_FLAT_SCALE), currPoint.xLeft));
    }
    TestHelper.equalRects(expect, flats[0][0].unfold(), assumeCells);
});
test('Matrix simple check horisontally', async () => {
    let json: any = {
        questions: [
            {
                type: 'matrix',
                titleLocation: 'hidden',
                name: 'matsimp_horisontal',
                showHeader: false,
                columns: [
                    'column1'
                ],
                rows: [
                    {
                        value: 'row1',
                        text: 'row1'
                    }
                ],
                cells:
                {
                    'row1': {
                        'column1': 'test1'
                    }

                }
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    let assumeFlats: IRect[] = [];
    controller.margins.left += controller.unitWidth;
    let cellWidth: number = SurveyHelper.getColumnWidth(controller, 2);
    let rowTextFlat: IPdfBrick = await SurveyHelper.createTextFlat(controller.leftTopPoint,
        survey.getAllQuestions()[0], controller, json.questions[0].rows[0].text, TextBrick);
    let currPoint: IPoint = controller.leftTopPoint;
    currPoint.xLeft += cellWidth + controller.unitWidth * SurveyHelper.GAP_BETWEEN_COLUMNS;
    let itemRect: IRect = SurveyHelper.createRect(currPoint, cellWidth, controller.unitHeight);
    currPoint.yTop = itemRect.yBot + SurveyHelper.GAP_BETWEEN_ITEM_TEXT * controller.unitHeight;
    let cellTextFlat: IPdfBrick = await SurveyHelper.createTextFlat(currPoint,
        survey.getAllQuestions()[0], controller, json.questions[0].cells['row1']['column1'], TextBrick);
    assumeFlats.push(rowTextFlat, itemRect, cellTextFlat);
    TestHelper.equalRects(expect, flats[0][0].unfold(), assumeFlats);
});
test('Matrix simple check vertical rows', async () => {
    let json: any = {
        questions: [
            {
                type: 'matrix',
                titleLocation: 'hidden',
                name: 'matsimp_verticalrows',
                showHeader: false,
                columns: [
                    'column1', 'column2', 'column3'
                ],
                rows: [
                    {
                        value: 'row1',
                        text: 'row1'
                    }
                ],
                cells:
                {
                    'row1': {
                        'column1': 'test1',
                        'column2': 'test2',
                        'column3': 'test3',
                    }

                }
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    let assumeFlats: IRect[] = [];
    controller.margins.left += controller.unitWidth;
    let rowTextFlat: IPdfBrick = await SurveyHelper.createTextFlat(controller.leftTopPoint,
        survey.getAllQuestions()[0], controller, json.questions[0].rows[0].text, TextBrick);
    assumeFlats.push(rowTextFlat);
    let currPoint: IPoint = controller.leftTopPoint;
    currPoint.yTop = rowTextFlat.yBot + FlatMatrix.GAP_BETWEEN_ROWS * controller.unitHeight;
    for (let i: number = 1; i < 4; i++) {
        let itemRect: IRect = SurveyHelper.createRect(currPoint,
            SurveyHelper.getPageAvailableWidth(controller), controller.unitHeight);
        currPoint.yTop = itemRect.yBot + SurveyHelper.GAP_BETWEEN_ITEM_TEXT * controller.unitHeight;
        let cellTextFlat: IPdfBrick = await SurveyHelper.createTextFlat(currPoint,
            survey.getAllQuestions()[0], controller, (<any>json.questions[0]).cells['row1']['column' + i], TextBrick);
        currPoint.yTop = cellTextFlat.yBot + SurveyHelper.GAP_BETWEEN_ROWS * controller.unitHeight;
        assumeFlats.push(itemRect, cellTextFlat);
    }
    TestHelper.equalRects(expect, flats[0][0].unfold(), assumeFlats);
});
test('Matrix simple check matrixRenderAs list', async () => {
    let json: any = {
        questions: [
            {
                type: 'matrix',
                name: 'matsimp_renderaslist',
                titleLocation: 'hidden',
                showHeader: false,
                columns: [
                    'Column 1',
                    'Column 2'
                ],
                rows: ['Row']
            }
        ]
    };
    let options: IDocOptions = TestHelper.defaultOptions;
    options.matrixRenderAs = 'list';
    let survey: SurveyPDF = new SurveyPDF(json, options);
    let controller: DocController = new DocController(options);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    let unfoldFlats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldFlats[1].xLeft).toBeCloseTo(unfoldFlats[3].xLeft);
    expect(unfoldFlats[1].yTop).toBeLessThan(unfoldFlats[3].yTop);
    expect(unfoldFlats[1].xRight).toBeCloseTo(unfoldFlats[3].xRight);
    expect(unfoldFlats[1].yBot).not.toBeCloseTo(unfoldFlats[3].yBot);
});

test('Matrix check rowTitleWidth', async () => {
    let json: any = {
        questions: [
            {
                type: 'matrix',
                name: 'matrix',
                titleLocation: 'hidden',
                showHeader: true,
                rowTitleWidth: '40px',
                columns: [
                    'Column 1',
                    'Column 2'
                ],
                rows: ['Row']
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    let unfoldHeaderFlats: IPdfBrick[] = flats[0][0].unfold();
    let unfoldRowFlats: IPdfBrick[] = flats[0][2].unfold();
    const pageWidth = SurveyHelper.getPageAvailableWidth(controller);
    const defaultLeftMargin = controller.margins.left + controller.unitWidth * FlatQuestion.CONTENT_INDENT_SCALE;
    const gapBetweenColumns = SurveyHelper.GAP_BETWEEN_COLUMNS * controller.unitWidth;
    let rowTitleWidth = SurveyHelper.parseWidth('40px', pageWidth);
    let columnWidth = (pageWidth - controller.unitWidth * FlatQuestion.CONTENT_INDENT_SCALE - rowTitleWidth - 2 * gapBetweenColumns) / 2;
    expect(unfoldHeaderFlats[0].xLeft).toBe(rowTitleWidth + defaultLeftMargin + gapBetweenColumns);
    expect(unfoldHeaderFlats[1].xLeft).toBe(rowTitleWidth + defaultLeftMargin + columnWidth + 2 * gapBetweenColumns);
    expect(unfoldRowFlats[3].xLeft).toBe(rowTitleWidth + defaultLeftMargin + gapBetweenColumns);
    expect(unfoldRowFlats[4].xLeft).toBe(rowTitleWidth + defaultLeftMargin + columnWidth + 2 * gapBetweenColumns);

    survey.getAllQuestions()[0].rowTitleWidth = '50px';
    flats = await FlatSurvey.generateFlats(survey, controller);
    unfoldHeaderFlats = flats[0][0].unfold();
    unfoldRowFlats = flats[0][2].unfold();
    rowTitleWidth = SurveyHelper.parseWidth('50px', pageWidth);
    columnWidth = (pageWidth - controller.unitWidth * FlatQuestion.CONTENT_INDENT_SCALE - rowTitleWidth - 2 * gapBetweenColumns) / 2;
    expect(unfoldHeaderFlats[0].xLeft).toBe(rowTitleWidth + defaultLeftMargin + gapBetweenColumns);
    expect(unfoldHeaderFlats[1].xLeft).toBe(rowTitleWidth + defaultLeftMargin + columnWidth + 2 * gapBetweenColumns);
    expect(unfoldRowFlats[3].xLeft).toBe(rowTitleWidth + defaultLeftMargin + gapBetweenColumns);
    expect(unfoldRowFlats[4].xLeft).toBe(rowTitleWidth + defaultLeftMargin + columnWidth + 2 * gapBetweenColumns);
});