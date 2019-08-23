(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { Question, JsonObject, CustomWidgetCollection } from 'survey-core';
import { SurveyPDF } from '../src/survey';
import { DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatTextbox } from '../src/flat_layout/flat_textbox';
import { FlatCheckbox } from '../src/flat_layout/flat_checkbox';
import { FlatRadiogroup } from '../src/flat_layout/flat_radiogroup';
import { PagePacker } from '../src/page_layout/page_packer';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { RadioItemBrick } from '../src/pdf_render/pdf_radioitem';
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
            JsonObject.metaData.addClass(
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
    JsonObject.metaData.removeClass('checkradio');
});