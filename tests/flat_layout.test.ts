(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
    return {};
};

import { Question, QuestionCheckboxModel } from 'survey-core';
import { PdfSurvey } from '../src/survey';
import { IPoint, IRect, DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatQuestion } from '../src/flat_layout/flat_question';
import { FlatTextbox } from '../src/flat_layout/flat_textbox';
import { FlatCheckbox } from '../src/flat_layout/flat_checkbox';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
let __dummy_tx = new FlatTextbox(null, null);
let __dummy_cb = new FlatCheckbox(null, null);

function calcTitleTop(controller: DocController, titleQuestion:
    Question, titleFlat: IPdfBrick, textboxFlat: IPdfBrick, leftTopPoint: IPoint) {
    let assumeTitle: IRect = SurveyHelper.createTextRect(
        leftTopPoint, controller,
        SurveyHelper.getTitleText(titleQuestion));
    TestHelper.equalRect(expect, titleFlat, assumeTitle);
    let assumeTextbox: IRect = SurveyHelper.createTextFieldRect(
        SurveyHelper.createPoint(assumeTitle), controller);
    TestHelper.equalRect(expect, textboxFlat, assumeTextbox);
    return SurveyHelper.createPoint(assumeTextbox);
}

test('Calc textbox boundaries title top', () => {
    let json = {
        questions: [
            {
                name: 'textbox',
                type: 'text',
                title: 'Title top'
            }
        ]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    calcTitleTop(survey.controller, <Question>survey.getAllQuestions()[0],
        flats[0], flats[1], survey.controller.leftTopPoint);
});
test('Calc textbox boundaries title bottom', () => {
    let json = {
        questions: [
            {
                name: 'textbox',
                type: 'text',
                title: 'Title bottom',
                titleLocation: 'bottom'
            }
        ]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let controller: DocController = survey.controller;
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    let assumeTextbox: IRect = SurveyHelper.createTextFieldRect(
        controller.leftTopPoint, controller);
    TestHelper.equalRect(expect, flats[0], assumeTextbox);
    let assumeTitle: IRect = SurveyHelper.createTextRect(
        SurveyHelper.createPoint(assumeTextbox), controller,
        SurveyHelper.getTitleText(<Question>survey.getAllQuestions()[0]));
    TestHelper.equalRect(expect, flats[1], assumeTitle);
});
test('Calc textbox boundaries title left', () => {
    let json = {
        questions: [
            {
                name: 'textbox',
                type: 'text',
                title: 'Title left',
                titleLocation: 'left'
            }
        ]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let controller: DocController = survey.controller;
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    let assumeTitle: IRect = SurveyHelper.createTextRect(
        controller.leftTopPoint, controller,
        SurveyHelper.getTitleText(<Question>survey.getAllQuestions()[0]));
    TestHelper.equalRect(expect, flats[0], assumeTitle);
    let assumeTextbox: IRect = SurveyHelper.createTextFieldRect(
        SurveyHelper.createPoint(assumeTitle, false, true), controller);
    TestHelper.equalRect(expect, flats[1], assumeTextbox);
});
function commmentPointTests(titleLocation: string, isChoices: boolean) {
    let question: QuestionCheckboxModel = new QuestionCheckboxModel('test');
    let docController = new DocController(TestHelper.defaultOptions);
    question.hasComment = true;
    question.titleLocation = titleLocation;
    if (isChoices) question.choices = ["test"];
    let flatQuestion: FlatCheckbox = new FlatCheckbox(question, docController);
    let resultRects: IRect[] = flatQuestion.generateFlats(TestHelper.defaultPoint);
    switch (titleLocation) {
        case 'hidden':
        case 'bottom': {
            test('Test comment point, title: ' + titleLocation, () => {
                let assumePoint = TestHelper.defaultPoint;
                let resultPoint = resultRects[0];
                if (isChoices) {
                    let height: number = docController.measureText().height;
                    let itemRect: IRect = SurveyHelper.createRect(TestHelper.defaultPoint, height, height);
                    let checkboxRect = SurveyHelper.createTextRect(SurveyHelper.createPoint(itemRect, false, true), docController, question.choices[0]);
                    assumePoint = SurveyHelper.createPoint(SurveyHelper.mergeRects(itemRect, checkboxRect));
                    resultPoint = resultRects[2];
                }
                TestHelper.equalPoint(expect, resultPoint, assumePoint);
            });
            break;
        }
        case 'top':
        case 'left': {
            test('Test comment point, title:' + titleLocation, () => {
                let assumePoint;
                if (titleLocation == "top") {
                    assumePoint = SurveyHelper.createPoint(SurveyHelper.createTextRect(TestHelper.defaultPoint, docController, question.title));
                } else {
                    assumePoint = SurveyHelper.createPoint(SurveyHelper.createTextRect(TestHelper.defaultPoint, docController, question.title), false, true);
                }
                let resultPoint = resultRects[1];
                if (isChoices) {
                    let height: number = docController.measureText().height;
                    let itemRect: IRect = SurveyHelper.createRect(assumePoint, height, height);
                    let checkboxRect = SurveyHelper.createTextRect(SurveyHelper.createPoint(itemRect, false, true), docController, question.choices[0]);
                    assumePoint = SurveyHelper.createPoint(SurveyHelper.mergeRects(itemRect, checkboxRect));
                    resultPoint = resultRects[3];
                }
                TestHelper.equalPoint(expect, resultPoint, assumePoint);
            });
            break;
        }
    }

}
['right', 'left', 'bottom', 'hidden'].forEach((titleLocation) => {
    commmentPointTests(titleLocation, true);
    commmentPointTests(titleLocation, false);
})
test('Calc textbox boundaries title hidden', () => {
    let json = {
        questions: [
            {
                name: 'textbox',
                type: 'text',
                title: 'Title hidden',
                titleLocation: 'hidden'
            }
        ]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let controller: DocController = survey.controller;
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    let assumeTextbox: IRect = SurveyHelper.createTextFieldRect(
        controller.leftTopPoint, controller);
    TestHelper.equalRect(expect, flats[0], assumeTextbox);
});
test('Calc boundaries with space between questions', () => {
    let json = {
        questions: [{
            name: 'textbox1',
            type: 'text',
            title: 'What have we here?'
        },
        {
            name: 'textbox2',
            type: 'text',
            title: 'Space between questions!'
        }]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    let title2point: IPoint = calcTitleTop(survey.controller,
        <Question>survey.getAllQuestions()[0],
        flats[0], flats[1], survey.controller.leftTopPoint);
    title2point.yTop += survey.controller.measureText().height;
    calcTitleTop(survey.controller, <Question>survey.getAllQuestions()[1],
        flats[2], flats[3], title2point);
});
test('Calc textbox boundaries title without number', () => {
    let json = {
        questions: [{
            name: 'textbox',
            type: 'text',
            title: 'I do not need a number'
        }]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    survey.showQuestionNumbers = 'off';
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    calcTitleTop(survey.controller, <Question>survey.getAllQuestions()[0],
        flats[0], flats[1], survey.controller.leftTopPoint);
});
test('Calc textbox boundaries required', () => {
    let json = {
        questions: [{
            name: 'textbox',
            type: 'text',
            title: 'Please enter your name:',
            isRequired: true
        }]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    calcTitleTop(survey.controller, <Question>survey.getAllQuestions()[0],
        flats[0], flats[1], survey.controller.leftTopPoint);
});
test('Check that checkbox has square boundaries', () => {
    let json = {
        questions: [
            {
                type: 'checkbox',
                name: 'box',
                title: 'Square Pants',
                choices: [
                    'S'
                ]
            }
        ]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let controller: DocController = survey.controller;
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    let assumeTitle: IRect = SurveyHelper.createTextRect(
        controller.leftTopPoint, controller,
        SurveyHelper.getTitleText(<Question>survey.getAllQuestions()[0]));
    TestHelper.equalRect(expect, flats[0], assumeTitle);
    let assumeCheckbox: IRect = SurveyHelper.createRect(
        SurveyHelper.createPoint(assumeTitle),
        controller.measureText().height, controller.measureText().height);
    TestHelper.equalRect(expect, flats[1], assumeCheckbox);
});