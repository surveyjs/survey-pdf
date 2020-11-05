(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { Question, Serializer, CustomWidgetCollection } from 'survey-core';
import { SurveyPDF } from '../src/survey';
import { DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatRadiogroup } from '../src/flat_layout/flat_radiogroup';
import { PagePacker } from '../src/page_layout/page_packer';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { TextBrick } from '../src/pdf_render/pdf_text';
import { RadioItemBrick } from '../src/pdf_render/pdf_radioitem';
import { AdornersOptions } from '../src/event_handler/adorners';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
let __dummy_rg = new FlatRadiogroup(null, null, null);

test('Render checkbox base widget as radiogroup', async () => {
    CustomWidgetCollection.Instance.clear();
    CustomWidgetCollection.Instance.addCustomWidget({
        name: 'checkradio',
        isFit: (question: Question) => {
          return question.getType() === 'checkradio';
        },
        activatedByChanged: () => {
            Serializer.addClass(
              'checkradio',
              [],
              null,
              'checkbox'
            );
        },
        pdfQuestionType: 'radiogroup'
      });
    let json: any = {
        questions: [
            {
                type: 'checkradio',
                name: 'event_customwidgets_checkboxasradio',
                titleLocation: 'hidden',
                choices: ['A', 'B']
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    let packs: IPdfBrick[][] = PagePacker.pack(flats, controller);
    expect(packs.length).toBe(1);
    expect(packs[0].length).toBe(2);
    expect(packs[0][0].unfold()[0] instanceof RadioItemBrick).toBe(true);
    expect(packs[0][1].unfold()[0] instanceof RadioItemBrick).toBe(true);
    Serializer.removeClass('checkradio');
});
test('Render custom widget via callback', async () => {
    CustomWidgetCollection.Instance.clear();
    CustomWidgetCollection.Instance.addCustomWidget({
        name: 'customquestion',
        isFit: (question: Question) => {
          return question.getType() === 'customquestion';
        },
        activatedByChanged: () => {
            Serializer.addClass(
              'customquestion',
              [],
              null,
              'empty'
            );
        },
        pdfRender: (_: SurveyPDF, options: AdornersOptions) => {
            if (options.question.getType() === 'customquestion') {
              options.bricks = [SurveyHelper.createPlainTextFlat(
                  options.point, options.question, options.controller,
                  'Hello there', TextBrick
              )];
            }
          }
      });
    let json: any = {
        questions: [
            {
                type: 'customquestion',
                name: 'event_customwidgets_customquestion'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    let packs: IPdfBrick[][] = PagePacker.pack(flats, controller);
    expect(packs.length).toBe(1);
    expect(packs[0].length).toBe(1);
    expect(packs[0][0].unfold()[0] instanceof TextBrick).toBe(true);
    Serializer.removeClass('customquestion');
});