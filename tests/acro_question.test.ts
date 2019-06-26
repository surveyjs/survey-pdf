(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
  return {};
};

import { Question } from 'survey-core';
import { SurveyPDF } from '../src/survey';
import { DocController } from '../src/doc_controller';
import { FlatTextbox } from '../src/flat_layout/flat_textbox';
import { FlatCheckbox } from '../src/flat_layout/flat_checkbox';
import { TestHelper } from '../src/helper_test';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
let __dummy_tx = new FlatTextbox(null, null);
let __dummy_cb = new FlatCheckbox(null, null);

async function checkTitleText(questionStartIndex: string, isRequired: boolean = false) {
  let json: any = {
    showQuestionNumbers: 'false',
    questions: [
      {
        name: 'textbox',
        type: 'text',
        title: 'Check my title',
        isRequired: isRequired
      }
    ]
  };
  let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
  if (questionStartIndex !== null) {
    survey.questionStartIndex = questionStartIndex;
  }
  let controller: DocController = new DocController(TestHelper.defaultOptions);
  await survey['render'](controller);
  let internalContent: string = controller.doc.internal.pages[1][2];
  expect(internalContent).toBeDefined();
  let regex: RegExp = /\((.*)\)/;
  let content: string = internalContent.match(regex)[1];
  expect(content).toBe(TestHelper.getTitleText(<Question>survey.getAllQuestions()[0]));
}
test('Check title number', async () => {
  await checkTitleText(null);
});
test('Check title number with custom questionStartIndex', async () => {
  await checkTitleText('7');
});
test('Check title number with alphabetical questionStartIndex', async () => {
  await checkTitleText('A');
});
test('Check title required text', async () => {
  await checkTitleText(null, true);
});
test('Check comment', async () => {
  let json: any = {
    showQuestionNumbers: 'false',
    questions: [
      {
        titleLocation: 'hidden',
        name: 'checkbox',
        type: 'checkbox',
        hasComment: true,
        commentText: 'comment check'
      }
    ]
  };
  let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
  let controller: DocController = new DocController(TestHelper.defaultOptions);
  await survey['render'](controller);
  let internal: any = controller.doc.internal;
  let internalContent: string = controller.doc.internal.pages[1][2];
  let textField: any = internal.acroformPlugin.acroFormDictionaryRoot.Fields[0]
  expect(internalContent).toBeDefined();
  let regex: RegExp = /\((.*)\)/;
  let content: string = internalContent.match(regex)[1];
  expect(content).toBe(json.questions[0].commentText);
  expect(textField.FT).toBe('/Tx');
});
test('Check comment readonly', async () => {
  let json: any = {
    questions: [
      {
        titleLocation: 'hidden',
        name: 'checkbox',
        type: 'checkbox',
        hasComment: true,
        commentText: 'comment check',
        readOnly: true
      }
    ]
  };
  let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
  let controller: DocController = new DocController(TestHelper.defaultOptions);
  await survey['render'](controller);
  let internal = controller.doc.internal;
  let textField = internal.acroformPlugin.acroFormDictionaryRoot.Fields[0]
  expect(textField.readOnly).toBe(true);
});
test('Check empty question', async () => {
  let json: any = {
    questions: [
      {
        titleLocation: 'hidden',
        name: 'checkbox',
        type: 'checkbox',
      }
    ]
  };
  let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
  let controller: DocController = new DocController(TestHelper.defaultOptions);
  let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
  expect(flats.length).toBe(1);
  expect(typeof flats[0]).not.toBe('undefined');
  expect(flats[0].length).toBe(0);
});
test('Not visible question', async () => {
  let json: any = {
    questions: [
      {
        type: 'checkbox',
        name: 'box',
        visible: false
      }
    ]
  };
  let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
  let controller: DocController = new DocController(TestHelper.defaultOptions);
  let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
  expect(flats.length).toBe(0);
});
test('Check descrition with hidden title', async () => {
  let json: any = {
    showQuestionNumbers: 'false',
    questions: [
      {
        titleLocation: 'top',
        name: 'checkbox',
        type: 'checkbox',
        description: 'test description',
      }
    ]
  };
  let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
  let controller: DocController = new DocController(TestHelper.defaultOptions);
  await survey['render'](controller);
  let internalContent: string = controller.doc.internal.pages[1][3];
  expect(internalContent).toBeDefined();
  let regex: RegExp = /\((.*)\)/;
  let content: string = internalContent.match(regex)[1];
  expect(content).toBe(json.questions[0].description);
});
test('Two pages', async () => {
  let json: any = {
    showQuestionNumbers: 'false',
    pages: [
      {
        name: 'First Page',
        elements: [
          {
            type: 'text',
            name: 'Enter me'
          }
        ]
      },
      {
        name: 'Second Page',
        elements: [
          {
            type: 'text',
            name: 'Not, me'
          }
        ]
      }
    ]
  };
  let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
  let controller: DocController = new DocController(TestHelper.defaultOptions);
  let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
  expect(flats.length).toBe(2);
  expect(flats[0].length).toBe(1);
  expect(flats[1].length).toBe(1);
});