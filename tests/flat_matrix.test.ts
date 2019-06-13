(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
    return {};
};
import { SurveyPDF } from '../src/survey';
import { IRect, DocOptions } from '../src/doc_controller';
import { FlatMatrix } from '../src/flat_layout/flat_matrix';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
import { TextBrick } from '../src/pdf_render/pdf_text';
let __dummy_mt = new FlatMatrix(null, null);

test('test matrix hasRows true columns', async () => {
    let json = {
        questions: [
            {
                titleLocation: 'hidden',
                type: 'matrix',
                name: 'test',
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
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    let assumeCells: IRect[] = [];
    let header = survey.controller.measureText(json.questions[0].columns[0].text, 'bold');
    let currPoint = TestHelper.defaultPoint;
    let cellWidth = SurveyHelper.getColumnWidth(survey.controller, 2);
    currPoint.xLeft = cellWidth + survey.controller.margins.left +
        survey.controller.measureText().width * SurveyHelper.GAP_BETWEEN_COLUMNS;
    let columnRect = SurveyHelper.createRect(currPoint, header.width, header.height);
    assumeCells.push(columnRect);
    currPoint = SurveyHelper.createPoint(columnRect);
    assumeCells.push(SurveyHelper.createRect({ xLeft: TestHelper.defaultPoint.xLeft, yTop: columnRect.yBot },
        survey.controller.measureText(json.questions[0].rows[0].text).width,
        survey.controller.measureText(json.questions[0].rows[0].text).height));
    let itemWidth = survey.controller.measureText().width;
    assumeCells.push(SurveyHelper.moveRect(SurveyHelper.scaleRect(
        SurveyHelper.createRect(currPoint, itemWidth, itemWidth),
        SurveyHelper.SELECT_ITEM_FLAT_SCALE), currPoint.xLeft));
    let receivedCells = [];
    receivedCells.push(...flats[0][0].unfold(), ...flats[0][2].unfold());
    TestHelper.equalRects(expect, receivedCells, assumeCells);
})
test('test matrix hasRows false columns', async () => {
    let json = {
        questions: [
            {
                titleLocation: 'hidden',
                type: 'matrix',
                name: 'test',
                columns: [
                    {
                        value: 1,
                        text: 'test1'
                    }
                ]
            }]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    let assumeCells: IRect[] = [];
    let header = survey.controller.measureText(json.questions[0].columns[0].text, 'bold');
    let columnRect = SurveyHelper.createRect(TestHelper.defaultPoint, header.width, header.height);
    assumeCells.push(columnRect);
    let rowLineRect = SurveyHelper.createRowlineFlat(SurveyHelper.createPoint(columnRect), survey.controller);
    assumeCells.push(rowLineRect);
    let currPoint = SurveyHelper.createPoint(rowLineRect);
    let itemWidth = survey.controller.measureText().width;
    assumeCells.push(SurveyHelper.moveRect(SurveyHelper.scaleRect(
        SurveyHelper.createRect(currPoint, itemWidth, itemWidth),
        SurveyHelper.SELECT_ITEM_FLAT_SCALE), currPoint.xLeft));
    TestHelper.equalRects(expect, flats[0], assumeCells);
})
test('test matrix vertical', async () => {
    let json = {
        questions: [
            {
                titleLocation: 'hidden',
                type: 'matrix',
                name: 'test',
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
                    },
                    {
                        value: 4,
                        text: 'test4'
                    }
                ]
            }]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    let assumeCells: IRect[] = [];
    let itemWidth = survey.controller.measureText().width;
    let currPoint = TestHelper.defaultPoint;
    let receivedCells: IRect[] = [];
    flats[0].forEach((flat) => {
        receivedCells.push(...flat.unfold());
    })
    json.questions[0].columns.forEach((column) => {
        let itemRect = SurveyHelper.createRect(currPoint, itemWidth, itemWidth);
        assumeCells.push(SurveyHelper.moveRect(
            SurveyHelper.scaleRect(itemRect, SurveyHelper.SELECT_ITEM_FLAT_SCALE),
            currPoint.xLeft));
        let oldXleft = currPoint.xLeft;
        currPoint.xLeft += 2 * SurveyHelper.SELECT_ITEM_FLAT_SCALE * itemWidth
        let columnTextWidth = survey.controller.measureText(column.text).width;
        let columnTextHeight = survey.controller.measureText(column.text).height;
        assumeCells.push(SurveyHelper.createRect(currPoint, columnTextWidth, columnTextHeight))
        currPoint.xLeft = oldXleft;
        currPoint.yTop += SurveyHelper.GAP_BETWEEN_ROWS *
            survey.controller.measureText().height + columnTextHeight;
    })
    TestHelper.equalRects(expect, receivedCells, assumeCells);
});
test('test hidden header', async () => {
    let json = {
        questions: [
            {
                titleLocation: 'hidden',
                showHeader: false,
                type: 'matrix',
                name: 'Quality',
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
                ]
            }]
    };
    let options = TestHelper.defaultOptions;
    options.format = [240.0, 297.0];
    let survey: SurveyPDF = new SurveyPDF(json, options);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    let assumeCells: IRect[] = [];
    let itemWidth = survey.controller.measureText().width;
    let cellWidth = SurveyHelper.getColumnWidth(survey.controller, 3);
    for (let i: number = 0; i < json.questions[0].columns.length; i++) {
        let currPoint = TestHelper.defaultPoint;
        currPoint.xLeft = i * (cellWidth + survey.controller.measureText().width * SurveyHelper.GAP_BETWEEN_COLUMNS)
            + survey.controller.margins.left;
        assumeCells.push(SurveyHelper.moveRect(SurveyHelper.scaleRect(
            SurveyHelper.createRect(currPoint, itemWidth, itemWidth),
            SurveyHelper.SELECT_ITEM_FLAT_SCALE), currPoint.xLeft));
    }
    TestHelper.equalRects(expect, flats[0][0].unfold(), assumeCells);
});
test('Matrix default value', async () => {
    let json = {
        questions: [
            {
                titleLocation: 'hidden',
                showHeader: false,
                type: 'matrix',
                name: 'Quality',
                title: 'Please indicate if you agree or disagree with the following statements',
                defaultValue: 'Column',
                columns: [
                    'Column',
                    'Column2'
                ]
            }]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    await survey.render();
    let acroFormFields = survey.controller.doc.internal.acroformPlugin.acroFormDictionaryRoot.Fields;
    expect(acroFormFields[0].value).toBe('sq_104row0');
    expect(acroFormFields[1].AS).toBe('/sq_104row0index0');
    expect(acroFormFields[2].AS).toBe('/Off');
});

test('Matrix rubric check horisontally', async () => {
    let json = {
        questions: [
            {

                type: 'matrix',
                titleLocation: 'hidden',
                name: 'test',
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
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    let assumeFlats: IRect[] = [];
    let cellWidth = SurveyHelper.getColumnWidth(survey.controller, 2);
    let rowTextFlat = await SurveyHelper.createTextFlat(TestHelper.defaultPoint,
        survey.getAllQuestions()[0], survey.controller, json.questions[0].rows[0].text, TextBrick);
    let currPoint = TestHelper.defaultPoint;
    currPoint.xLeft += cellWidth + survey.controller.measureText().width * SurveyHelper.GAP_BETWEEN_COLUMNS;
    let itemFlat = SurveyHelper.createRect(currPoint, cellWidth, survey.controller.measureText(1).height);
    currPoint.yTop = itemFlat.yBot;
    let cellTextFlat = await SurveyHelper.createTextFlat(currPoint,
        survey.getAllQuestions()[0], survey.controller, json.questions[0].cells['row1']['column1'], TextBrick);
    assumeFlats.push(rowTextFlat, itemFlat, cellTextFlat);
    TestHelper.equalRects(expect, flats[0][0].unfold(), assumeFlats);
});

test('Matrix rubric check vertically', async () => {
    let json = {
        questions: [
            {

                type: 'matrix',
                titleLocation: 'hidden',
                name: 'test',
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
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    let assumeFlats: IRect[] = [];
    let rowTextFlat = await SurveyHelper.createTextFlat(TestHelper.defaultPoint,
        survey.getAllQuestions()[0], survey.controller, json.questions[0].rows[0].text, TextBrick);
    assumeFlats.push(rowTextFlat);
    let currPoint = TestHelper.defaultPoint;
    currPoint.yTop = rowTextFlat.yBot;
    for (let i: number = 1; i < 4; i++) {
        let itemFlat = SurveyHelper.createRect(currPoint, SurveyHelper.getPageAvailableWidth(survey.controller), survey.controller.measureText(1).height);
        currPoint.yTop = itemFlat.yBot;
        let cellTextFlat = await SurveyHelper.createTextFlat(currPoint,
            survey.getAllQuestions()[0], survey.controller, (<any>json.questions[0]).cells['row1']['column' + i], TextBrick);
        currPoint.yTop = cellTextFlat.yBot;
        assumeFlats.push(itemFlat, cellTextFlat);
    }
    TestHelper.equalRects(expect, flats[0][0].unfold(), assumeFlats);
});