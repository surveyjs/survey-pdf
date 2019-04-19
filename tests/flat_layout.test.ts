(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
    return {};
};

import { Question } from 'survey-core';
import { PdfSurvey } from '../src/survey';
import { IRect, IDocOptions, DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatTextbox } from '../src/flat_layout/flat_textbox';
import { FlatCheckbox } from '../src/flat_layout/flat_checkbox';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
let __dummy_tx = new FlatTextbox(null, null);
let __dummy_cb = new FlatCheckbox(null, null);

test('Test textbox title top flat layout', () => {
    let json = {
        questions: [
            {
                name: 'textbox',
                type: 'text',
                title: 'I\'m number 1'
            }
        ]
    };
    let options: IDocOptions = TestHelper.defaultOptions;
    let survey: PdfSurvey = new PdfSurvey(json, options);
    let controller: DocController = survey.controller;
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    let assumeTitle: IRect = SurveyHelper.createTextRect(
        TestHelper.defaultPoint, controller,
        SurveyHelper.getTitleText(<Question>survey.getAllQuestions()[0]));
    TestHelper.equalRect(expect, flats[0], assumeTitle);
    let assumeTextbox: IRect = SurveyHelper.createTextFieldRect(
        SurveyHelper.createPoint(assumeTitle), controller);
    TestHelper.equalRect(expect, flats[1], assumeTextbox);
});