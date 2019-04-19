(<any>window)["HTMLCanvasElement"].prototype.getContext = () => {
    return {};
};

import { PdfSurvey } from '../src/survey';
import { IRect, IDocOptions, DocController } from '../src/docController';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { TestHelper } from '../src/helper_test';

test.skip("Test textbox title top flat layout", () => {
    let json = {
        questions: [
            {
                name: "textbox",
                type: "text",
                title: "I'm number 1"
            }
        ]
    };
    let options: IDocOptions = TestHelper.defaultOptions;
    let survey: PdfSurvey = new PdfSurvey(json, options);
    let controller: DocController = survey.controller;
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    let assumeTitle: IRect = {
        xLeft: options.margins.marginLeft,
        xRight: options.margins.marginLeft +
            controller.measureText(json.questions[0].title).width,
        yTop: options.margins.marginTop,
        yBot: options.margins.marginTop + controller.measureText().height
    };
    TestHelper.equalRect(this, flats[0], assumeTitle);
    let assumeTextbox: IRect = {
        xLeft: options.margins.marginLeft,
        xRight: options.paperWidth - options.margins.marginRight,
        yTop: assumeTitle.yBot,
        yBot: assumeTitle.yBot + controller.measureText().height
    };
    TestHelper.equalRect(this, flats[1], assumeTextbox);
});