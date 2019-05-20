(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
    return {};
};
import { FlatMatrix } from '../src/flat_layout/flat_matrix';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { IRect, IPoint } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';

import { CompositeBrick } from '../src/pdf_render/pdf_composite';
import { SurveyPDF } from '../src/survey';
import { Question } from 'survey-core';
let __dummy_mx = new FlatMatrix(null, null);
SurveyHelper.setFontSize(TestHelper.defaultOptions.fontSize);

test('check matrix hasRows true columns ', () => {
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
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
    let assumeCells: IRect[] = [];
    let currPoint: IPoint = TestHelper.defaultPoint;
    let oldMargins = SurveyHelper.clone(survey.controller.margins);
    SurveyHelper.setColumnMargins(<Question>survey.getAllQuestions()[0], survey.controller, 1);
    currPoint.xLeft = survey.controller.margins.left;
    let header = SurveyHelper.createBoldTextFlat(currPoint, <Question>survey.getAllQuestions()[0], survey.controller, json.questions[0].columns[0].text);
    assumeCells.push(header);
    currPoint.yTop = SurveyHelper.createPoint(header).yTop;
    currPoint.xLeft = TestHelper.defaultPoint.xLeft;
    survey.controller.margins.right = oldMargins.right;
    survey.controller.margins.left = oldMargins.left;
    let rowLineRect = SurveyHelper.createRowlineFlat(SurveyHelper.createPoint(header), survey.controller);
    assumeCells.push(rowLineRect);
    currPoint = SurveyHelper.createPoint(rowLineRect);
    SurveyHelper.setColumnMargins(<Question>survey.getAllQuestions()[0], survey.controller, 0);
    let rowText = SurveyHelper.createTextFlat(currPoint, <Question>survey.getAllQuestions()[0], survey.controller, json.questions[0].rows[0].text);
    assumeCells.push(rowText);
    survey.controller.margins.right = oldMargins.right;
    survey.controller.margins.left = oldMargins.left;
    SurveyHelper.setColumnMargins(<Question>survey.getAllQuestions()[0], survey.controller, 1);
    let itemWidth = SurveyHelper.measureText().width;
    currPoint = SurveyHelper.createPoint(rowText, false, true);
    assumeCells.push(SurveyHelper.createRect(currPoint, itemWidth, itemWidth));
    flats[0].push(... (<CompositeBrick>flats[0].pop()).unfoldOnce())
    TestHelper.equalRects(expect, flats[0], assumeCells);

});
test('test matrix hasRows false columns', () => {
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
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
    let assumeCells: IRect[] = [];
    let currPoint: IPoint = TestHelper.defaultPoint;
    let header = SurveyHelper.createBoldTextFlat(currPoint, <Question>survey.getAllQuestions()[0], survey.controller, json.questions[0].columns[0].text);
    assumeCells.push(header);
    let rowLineRect = SurveyHelper.createRowlineFlat(SurveyHelper.createPoint(header), survey.controller);
    assumeCells.push(rowLineRect);
    currPoint = SurveyHelper.createPoint(rowLineRect);
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
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
    let assumeCells: IRect[] = [];
    let itemWidth = SurveyHelper.measureText().width;
    let currPoint = TestHelper.defaultPoint;
    let receivedCells: IRect[] = [];
    (<CompositeBrick>flats[0][0]).unfoldOnce().forEach((flat: CompositeBrick) => {
        receivedCells.push(...flat.unfoldOnce());
    })
    json.questions[0].columns.forEach((column) => {
        let oldMarginLeft = survey.controller.margins.left;
        let itemRect = SurveyHelper.createRect(currPoint, itemWidth, itemWidth);
        assumeCells.push(itemRect);
        currPoint = SurveyHelper.createPoint(itemRect, false, true);
        survey.controller.margins.left = survey.controller.margins.left + itemWidth;
        let columnText = SurveyHelper.createTextFlat(currPoint, <Question>survey.getAllQuestions()[0], survey.controller, column.text)
        assumeCells.push(columnText)
        survey.controller.margins.left = oldMarginLeft;
        currPoint = SurveyHelper.createPoint(SurveyHelper.mergeRects(itemRect, columnText));

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
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
    let assumeCells: IRect[] = [];
    let itemWidth = SurveyHelper.measureText().width;
    let cellWidth = (survey.controller.paperWidth - survey.controller.margins.left - survey.controller.margins.right) / 3;
    for (let i = 0; i < json.questions[0].columns.length; i++) {
        let currPoint = TestHelper.defaultPoint;
        currPoint.xLeft = cellWidth * i + survey.controller.margins.left;
        assumeCells.push(SurveyHelper.createRect(currPoint, itemWidth, itemWidth));
    }
    TestHelper.equalRects(expect, flats[0][0].unfold(), assumeCells);
});
test('test default value', async () => {
    let json = {
        questions: [
            {
                titleLocation: 'hidden',
                showHeader: false,
                type: "matrix",
                name: "Quality",
                title: "Please indicate if you agree or disagree with the following statements",
                defaultValue: "Column",
                columns: [
                    "Column",
                    "Column2"
                ]
            }]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    await survey.render();
    let acroFormFields = survey.controller.doc.internal.acroformPlugin.acroFormDictionaryRoot.Fields;
    expect(acroFormFields[0].value).toBe("sq_104row0");

    expect(acroFormFields[1].AS).toBe("/sq_104row0index0");
    expect(acroFormFields[2].AS).toBe("/Off");
});
