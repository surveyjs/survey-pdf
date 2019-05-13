(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
    return {};
};
import { FlatMatrix } from '../src/flat_layout/flat_matrix';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { IRect } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { PdfSurvey } from '../src/survey';
let __dummy_mx = new FlatMatrix(null, null);
SurveyHelper.setFontSize(TestHelper.defaultOptions.fontSize);

test('test matrix hasRows true columns', () => {
    let json = {
        questions: [
            {
                titleLocation: 'hidden',
                type: "matrix",
                name: "test",
                columns: [
                    {
                        value: 1,
                        text: "test1"
                    }
                ],
                rows: [
                    {
                        value: 1,
                        text: "test2"
                    }
                ]
            }]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
    let assumeCells: IRect[] = [];
    let header = SurveyHelper.measureText(json.questions[0].columns[0].text, 'bold');
    let currPoint = TestHelper.defaultPoint;
    let cellWidth = (210 - TestHelper.defaultOptions.margins.marginLeft
        - TestHelper.defaultOptions.margins.marginRight) / 2;
    currPoint.xLeft = cellWidth + TestHelper.defaultOptions.margins.marginLeft;
    let columnRect = SurveyHelper.createRect(currPoint, header.width, header.height);
    assumeCells.push(columnRect);
    currPoint = SurveyHelper.createPoint(columnRect);
    assumeCells.push(SurveyHelper.createRect({ xLeft: TestHelper.defaultPoint.xLeft, yTop: columnRect.yBot },
        SurveyHelper.measureText(json.questions[0].rows[0].text).width,
        SurveyHelper.measureText(json.questions[0].rows[0].text).height));
    let itemWidth = SurveyHelper.measureText().width;
    assumeCells.push(SurveyHelper.createRect(currPoint, itemWidth, itemWidth));
    let receivedCells = [];
    receivedCells.push(...flats[0][0].unfold(), ...flats[0][2].unfold());
    TestHelper.equalRects(expect, receivedCells, assumeCells);
})
test.skip('test matrix hasRows false columns', () => {
    let json = {
        questions: [
            {
                titleLocation: 'hidden',
                type: "matrix",
                name: "test",
                columns: [
                    {
                        value: 1,
                        text: "test1"
                    }
                ]
            }]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
    let assumeCells: IRect[] = [];
    let header = SurveyHelper.measureText(json.questions[0].columns[0].text, 'bold');
    let columnRect = SurveyHelper.createRect(TestHelper.defaultPoint, header.width, header.height);
    assumeCells.push(columnRect);
    let currPoint = SurveyHelper.createPoint(columnRect);
    let itemWidth = SurveyHelper.measureText().width;
    assumeCells.push(SurveyHelper.createRect(currPoint, itemWidth, itemWidth));
    TestHelper.equalRects(expect, flats[0], assumeCells);
})

test('test matrix vertical', () => {
    let json = {
        questions: [
            {
                titleLocation: 'hidden',
                type: "matrix",
                name: "test",
                columns: [
                    {
                        value: 1,
                        text: "test1"
                    }, {
                        value: 2,
                        text: "test2"
                    }, {
                        value: 3,
                        text: "test3"
                    },
                    {
                        value: 4,
                        text: "test4"
                    }
                ]
            }]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
    let assumeCells: IRect[] = [];
    let itemWidth = SurveyHelper.measureText().width;
    let currPoint = TestHelper.defaultPoint;
    let receivedCells: IRect[] = [];
    flats[0].forEach((flat) => {
        receivedCells.push(...flat.unfold());
    })
    json.questions[0].columns.forEach((column) => {
        let itemRect = SurveyHelper.createRect(currPoint, itemWidth, itemWidth);
        assumeCells.push(itemRect);
        currPoint = SurveyHelper.createPoint(itemRect, false, true);
        let columnTextWidth = SurveyHelper.measureText(column.text).width;
        let columnTextHeight = SurveyHelper.measureText(column.text).height;
        assumeCells.push(SurveyHelper.createRect(currPoint, columnTextWidth, columnTextHeight))
        currPoint = SurveyHelper.createPoint(itemRect);
    })
    TestHelper.equalRects(expect, receivedCells, assumeCells);


});
test('test hidden header', () => {
    let json = {
        questions: [
            {
                titleLocation: 'hidden',
                showHeader: false,
                type: "matrix",
                name: "Quality",
                title: "Please indicate if you agree or disagree with the following statements",
                columns: [
                    {
                        value: 1,
                        text: "test1"
                    }, {
                        value: 2,
                        text: "test2"
                    }, {
                        value: 3,
                        text: "test3"
                    }
                ]
            }]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
    let assumeCells: IRect[] = [];
    let itemWidth = SurveyHelper.measureText().width;
    let cellWidth = (210 - TestHelper.defaultOptions.margins.marginLeft
        - TestHelper.defaultOptions.margins.marginRight) / 3;
    for (let i = 0; i < json.questions[0].columns.length; i++) {
        let currPoint = TestHelper.defaultPoint;
        currPoint.xLeft = cellWidth * i + TestHelper.defaultOptions.margins.marginLeft;
        assumeCells.push(SurveyHelper.createRect(currPoint, itemWidth, itemWidth));
    }
    TestHelper.equalRects(expect, flats[0][0].unfold(), assumeCells);
});