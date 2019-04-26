(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
    return {};
};

import { Question, QuestionCheckboxModel } from 'survey-core';
import { PdfSurvey } from '../src/survey';
import { IPoint, IRect, DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatTextbox } from '../src/flat_layout/flat_textbox';
import { FlatCheckbox } from '../src/flat_layout/flat_checkbox';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { TitleBrick } from '../src/pdf_render/pdf_title';
import { DescriptionBrick } from '../src/pdf_render/pdf_description';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
import { TextBrick } from '../src/pdf_render/pdf_text';
let __dummy_tx = new FlatTextbox(null, null);
let __dummy_cb = new FlatCheckbox(null, null);

function calcTitleTop(leftTopPoint: IPoint, controller: DocController,
    titleQuestion: Question, compositeFlat: IPdfBrick, isDesc: boolean = false): IPoint {
    let assumeTitle: IRect = SurveyHelper.createTextFlat(
        leftTopPoint, null, controller,
        SurveyHelper.getTitleText(titleQuestion), TitleBrick);
    let assumeTextbox: IRect = SurveyHelper.createTextFieldRect(
        SurveyHelper.createPoint(assumeTitle), controller);
    if (isDesc) {
        let assumeDesc: IRect = SurveyHelper.createDescFlat(
            SurveyHelper.createPoint(assumeTitle), null,
            controller, SurveyHelper.getLocString(
                titleQuestion.locDescription), DescriptionBrick);
        assumeTextbox = SurveyHelper.createTextFieldRect(
            SurveyHelper.createPoint(assumeDesc), controller);
        TestHelper.equalRect(expect, compositeFlat, 
            SurveyHelper.mergeRects(assumeTitle, assumeDesc, assumeTextbox));
    }
    else {
        TestHelper.equalRect(expect, compositeFlat,
            SurveyHelper.mergeRects(assumeTitle, assumeTextbox));
    }
    return SurveyHelper.createPoint(assumeTextbox);
}
function calcTitleBottom(controller: DocController, titleQuestion: Question,
    compositeFlat: IPdfBrick, textboxFlat: IPdfBrick, isDesc: boolean = false) {
    let assumeTextbox: IRect = SurveyHelper.createTextFieldRect(
        controller.leftTopPoint, controller);
    TestHelper.equalRect(expect, textboxFlat, assumeTextbox);
    let assumeTitle: IRect = SurveyHelper.createTextFlat(
            SurveyHelper.createPoint(assumeTextbox), null, controller,
            SurveyHelper.getTitleText(titleQuestion), TitleBrick);
    if (isDesc) {
        let assumeDesc: IRect = SurveyHelper.createDescFlat(
            SurveyHelper.createPoint(assumeTitle), null,
            controller, SurveyHelper.getLocString(
                titleQuestion.locDescription), DescriptionBrick);
        TestHelper.equalRect(expect, compositeFlat, SurveyHelper.mergeRects(assumeTitle, assumeDesc));
    } else {
        TestHelper.equalRect(expect, compositeFlat, assumeTitle);
    }
}
function calcTitleLeft(controller: DocController, titleQuestion: Question,
    compositeFlat: IPdfBrick, textboxFlat: IPdfBrick, isDesc: boolean = false) {
    let assumeTitle: IRect = SurveyHelper.createTextFlat(
        controller.leftTopPoint, null, controller,
        SurveyHelper.getTitleText(titleQuestion), TitleBrick);
    let assumeTextbox: IRect = SurveyHelper.createTextFieldRect(
        SurveyHelper.createPoint(assumeTitle, false, true), controller);
    if (isDesc) {
        let assumeDesc: IRect = SurveyHelper.createDescFlat(
            SurveyHelper.createPoint(assumeTitle), null,
            controller, SurveyHelper.getLocString(
                titleQuestion.locDescription), DescriptionBrick);
        TestHelper.equalRect(expect, compositeFlat, SurveyHelper.mergeRects(assumeTitle, assumeDesc));
        assumeTextbox.xLeft = Math.max(assumeTextbox.xLeft, assumeDesc.xRight);
    }
    else {
        TestHelper.equalRect(expect, compositeFlat, assumeTitle);
    }
    TestHelper.equalRect(expect, textboxFlat, assumeTextbox);
}
export function calcIndent(expect: any, leftTopPoint: IPoint, controller: DocController,
    compositeFlat: IPdfBrick, checktext: string, titleQuestion: Question = null) {
    let assumeTitle: IRect = SurveyHelper.createRect(leftTopPoint, 0, 0);
    if (titleQuestion != null) {
        assumeTitle = SurveyHelper.createTextFlat(
            leftTopPoint, null, controller,
            SurveyHelper.getTitleText(titleQuestion), TitleBrick);
    }
    let assumeCheckbox: IRect = SurveyHelper.createRect(
        SurveyHelper.createPoint(assumeTitle),
        controller.measureText().height, controller.measureText().height);
    let assumeChecktext: IRect = SurveyHelper.createTextFlat(
        SurveyHelper.createPoint(assumeCheckbox, false, true),
        null, controller, checktext, TextBrick);
    TestHelper.equalRect(expect, compositeFlat, SurveyHelper.mergeRects(assumeTitle, assumeCheckbox, assumeChecktext));
    return SurveyHelper.createPoint(assumeCheckbox);
}

test('Calc textbox boundaries title top', () => {
    let json = {
        questions: [
            {
                type: 'text',
                name: 'textbox',
                title: 'Title top'
            }
        ]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    calcTitleTop(survey.controller.leftTopPoint, survey.controller,
        <Question>survey.getAllQuestions()[0], flats[0]);
});
test('Calc textbox boundaries title bottom', () => {
    let json = {
        questions: [
            {
                type: 'text',
                name: 'textbox',
                title: 'Title bottom',
                titleLocation: 'bottom'
            }
        ]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(2);
    calcTitleBottom(survey.controller, <Question>survey.getAllQuestions()[0],
        flats[1], flats[0]);
});
test('Calc textbox boundaries title left', () => {
    let json = {
        questions: [
            {
                type: 'text',
                name: 'textbox',
                title: 'Title left',
                titleLocation: 'left'
            }
        ]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(2);
    calcTitleLeft(survey.controller, <Question>survey.getAllQuestions()[0],
        flats[0], flats[1]);
});
test('Calc textbox boundaries title hidden', () => {
    let json = {
        questions: [
            {
                type: 'text',
                name: 'textbox',
                title: 'Title hidden',
                titleLocation: 'hidden'
            }
        ]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    let assumeTextbox: IRect = SurveyHelper.createTextFieldRect(
        survey.controller.leftTopPoint, survey.controller);
    TestHelper.equalRect(expect, flats[0], assumeTextbox);
});
function commmentPointTests(titleLocation: string, isChoices: boolean) {
    let json = {
        questions: [
            {
                name: 'checkbox',
                type: 'checkbox',
                hasComment: 'true',
                title: 'test',
                titleLocation: titleLocation
            }
        ]
    };
    if (isChoices) {
        (<any>json.questions[0]).choices = ['test'];
    }
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let docController: DocController = survey.controller;
    let resultRects: IPdfBrick[] = FlatSurvey.generateFlats(survey);

    switch (titleLocation) {
        case 'hidden':
        case 'bottom': {
            test('comment point, title location: ' + titleLocation + ' with choice: ' + isChoices, () => {
                let assumePoint = TestHelper.defaultPoint;
                let resultPoint = resultRects[0];
                if (isChoices) {
                    let height: number = docController.measureText().height;
                    let checkboxItemRect: IRect = SurveyHelper.createRect(TestHelper.defaultPoint, height, height);
                    let checkboxTextRect = SurveyHelper.createTextFlat(SurveyHelper.createPoint(
                        checkboxItemRect, false, true), null, docController,
                        (<any>json.questions[0]).choices[0], TextBrick);
                    assumePoint = SurveyHelper.createPoint(SurveyHelper.mergeRects(checkboxItemRect, checkboxTextRect));
                    resultPoint = resultRects[1];
                }
                TestHelper.equalPoint(expect, resultPoint, assumePoint);
            });
            break;
        }
        case 'top':
        case 'left': {
            test('comment point, title location:' + titleLocation + ' with choice: ' + isChoices, () => {
                let assumePoint: IPoint;
                if (titleLocation == "top") {
                    assumePoint = SurveyHelper.createPoint(SurveyHelper.createTextFlat(
                        TestHelper.defaultPoint, null, docController,
                        SurveyHelper.getTitleText(<Question>survey.getAllQuestions()[0]), TextBrick));
                } else {
                    assumePoint = SurveyHelper.createPoint(SurveyHelper.createTextFlat(
                        TestHelper.defaultPoint, null, docController, SurveyHelper.getTitleText(
                            <Question>survey.getAllQuestions()[0]), TextBrick), false, true);
                }
                let resultPoint: IPoint = resultRects[1];
                if (isChoices) {
                    let height: number = docController.measureText().height;
                    let checkboxItemRect: IRect = SurveyHelper.createRect(assumePoint, height, height);
                    let checkboxTextRect = SurveyHelper.createTextFlat(
                        SurveyHelper.createPoint(checkboxItemRect, false, true),
                        null, docController, (<any>json.questions[0]).choices[0], TextBrick);
                    assumePoint = SurveyHelper.createPoint(SurveyHelper.mergeRects(checkboxItemRect, checkboxTextRect));
                    resultPoint = resultRects[2];
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
            type: 'text',
            name: 'textbox1',
            title: 'What have we here?'
        },
        {
            type: 'text',
            name: 'textbox2',
            title: 'Space between questions!'
        }]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(2);
    let title2point: IPoint = calcTitleTop(survey.controller.leftTopPoint,
        survey.controller, <Question>survey.getAllQuestions()[0], flats[0]);
    title2point.yTop += survey.controller.measureText().height;
    calcTitleTop(title2point, survey.controller,
        <Question>survey.getAllQuestions()[1], flats[1]);
});
test('Calc textbox boundaries title without number', () => {
    let json = {
        questions: [{
            type: 'text',
            name: 'textbox',
            title: 'I do not need a number'
        }]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    survey.showQuestionNumbers = 'off';
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    calcTitleTop(survey.controller.leftTopPoint, survey.controller,
        <Question>survey.getAllQuestions()[0], flats[0]);
});
test('Calc textbox boundaries required', () => {
    let json = {
        questions: [{
            type: 'text',
            name: 'textbox',
            title: 'Please enter your name:',
            isRequired: true
        }]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    calcTitleTop(survey.controller.leftTopPoint, survey.controller,
        <Question>survey.getAllQuestions()[0], flats[0]);
});
//to review
test('Check that checkbox has square boundaries', () => {
    let json = {
        questions: [
            {
                type: 'checkbox',
                name: 'box',
                titleLocation: 'hidden',
                title: 'Square Pants',
                choices: [
                    'S'
                ]
            }
        ]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let controller: DocController = survey.controller;
    survey.render();
    let assumeCheckbox: IRect = SurveyHelper.createRect(
        TestHelper.defaultPoint,
        controller.measureText().height, controller.measureText().height);
    let acroFormFields = survey.controller.doc.internal.acroformPlugin.acroFormDictionaryRoot.Fields;
    let internalRect = acroFormFields[0].Rect;

    TestHelper.equalRect(expect, SurveyHelper.createRect(
        { xLeft: internalRect[0], yTop: internalRect[1] },
        internalRect[2], internalRect[3]), assumeCheckbox);
});
test('Calc boundaries title top longer than description', () => {
    let json = {
        questions: [
            {
                type: 'text',
                name: 'box',
                title: 'My title is so interesting',
                description: 'But the description is not enough'
            }
        ]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    calcTitleTop(survey.controller.leftTopPoint, survey.controller,
        <Question>survey.getAllQuestions()[0], flats[0], true);
});
test('Calc boundaries title top shorter than description', () => {
    let json = {
        questions: [
            {
                type: 'text',
                name: 'box',
                title: 'Tiny title',
                description: 'The description is so long, very long, very'
            }
        ]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    calcTitleTop(survey.controller.leftTopPoint, survey.controller,
        <Question>survey.getAllQuestions()[0], flats[0], true);
});
test('Calc boundaries title bottom longer than description', () => {
    let json = {
        questions: [
            {
                type: 'text',
                name: 'box',
                title: 'What a gorgeous title',
                titleLocation: 'bottom',
                description: 'Who reads the descriptions?'
            }
        ]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(2);
    calcTitleBottom(survey.controller, <Question>survey.getAllQuestions()[0],
        flats[1], flats[0], true);
});
test('Calc boundaries title bottom shorter than description', () => {
    let json = {
        questions: [
            {
                type: 'text',
                name: 'box',
                title: 'Piece of title',
                titleLocation: 'bottom',
                description: 'Very important information: required to read'
            }
        ]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(2);
    calcTitleBottom(survey.controller, <Question>survey.getAllQuestions()[0],
        flats[1], flats[0], true);
});
test('Calc boundaries title left longer than description', () => {
    let json = {
        questions: [
            {
                type: 'text',
                name: 'box',
                title: 'I only wish that wisdom',
                titleLocation: 'left',
                description: 'Oh dear Pan'
            }
        ]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(2);
    calcTitleLeft(survey.controller, <Question>survey.getAllQuestions()[0],
        flats[0], flats[1], true);
});
test('Calc boundaries title left shorter than description', () => {
    let json = {
        questions: [
            {
                type: 'text',
                name: 'box',
                title: 'Diamonds',
                titleLocation: 'left',
                description: 'Takes One To Know One'
            }
        ]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(2);
    calcTitleLeft(survey.controller, <Question>survey.getAllQuestions()[0],
        flats[0], flats[1], true);
});
test('Calc boundaries title hidden with description', () => {
    let json = {
        questions: [
            {
                type: 'text',
                name: 'textbox',
                title: 'Ninja',
                titleLocation: 'hidden',
                description: 'Under cover of night'
            }
        ]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    let assumeTextbox: IRect = SurveyHelper.createTextFieldRect(
        survey.controller.leftTopPoint, survey.controller);
    TestHelper.equalRect(expect, flats[0], assumeTextbox);
});
test('Calc boundaries with indent', () => {
    for (let i = 0; i < 10; i++) {
        let json = {
            questions: [
                {
                    type: 'checkbox',
                    name: 'box',
                    title: 'I stand straight',
                    indent: i,
                    choices: [
                        'Right choice'
                    ]
                }
            ]
        };
        let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
        let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
        expect(flats.length).toBe(1);
        let leftTopPoint: IPoint = survey.controller.leftTopPoint;
        leftTopPoint.xLeft += survey.controller.measureText(i).width;
        calcIndent(expect, leftTopPoint, survey.controller,
            flats[0], json.questions[0].choices[0],
            <Question>survey.getAllQuestions()[0]);
    }
});
test('not visible question', () => {
    let json = {
        questions: [
            {
                type: 'checkbox',
                name: 'box',
                visible: false
            }
        ]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(0);
});
test('not visible question and visible question', () => {
    let json = {
        questions: [
            {
                type: 'checkbox',
                name: 'box',
                visible: false
            },
            {
                type: 'checkbox',
                name: 'box',
                visible: true
            }
        ]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let rects: IRect[] = FlatSurvey.generateFlats(survey);
    survey.controller.fontStyle = 'bold';
    let text: string = SurveyHelper.getTitleText(<Question>survey.getAllQuestions()[1]);
    let assumeRect = [];
    assumeRect[0] = SurveyHelper.createTextFlat(TestHelper.defaultPoint, null,
        survey.controller, text, TextBrick);
    survey.controller.fontStyle = 'normal'
    TestHelper.equalRects(expect, rects, assumeRect)
});

//TODO empty choices checkbox tests