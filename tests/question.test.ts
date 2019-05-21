(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
  return {};
};

import { Question } from 'survey-core';
import { SurveyPDF } from '../src/survey';
import { FlatTextbox } from '../src/flat_layout/flat_textbox';
import { FlatCheckbox } from '../src/flat_layout/flat_checkbox';
import { TestHelper } from '../src/helper_test';
import { SurveyHelper } from '../src/helper_survey';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
let __dummy_tx = new FlatTextbox(null, null);
let __dummy_cb = new FlatCheckbox(null, null);

function checkTitleText(questionStartIndex: string, isRequired: boolean = false) {
  let json = {
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
  survey.render();
  let internalContent = survey.controller.doc.internal.pages[1][2];
  expect(internalContent).toBeDefined();
  let regex = /\((.*)\)/;
  let content = internalContent.match(regex)[1];
  expect(content).toBe(SurveyHelper.getTitleText(<Question>survey.getAllQuestions()[0]));
}
test('Check title number', () => {
  checkTitleText(null);
});
test('Check title number with custom questionStartIndex', () => {
  checkTitleText('7');
});
test('Check title number with alphabetical questionStartIndex', () => {
  checkTitleText('A');
});
test('Check title required text', () => {
  checkTitleText(null, true);
});
test('Check comment', async () => {
  let json = {
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
  await survey.render();
  let internal = survey.controller.doc.internal;
  let internalContent = survey.controller.doc.internal.pages[1][2];
  let textField = internal.acroformPlugin.acroFormDictionaryRoot.Fields[0]
  expect(internalContent).toBeDefined();
  let regex = /\((.*)\)/;
  let content = internalContent.match(regex)[1];
  expect(content).toBe(json.questions[0].commentText);
  expect(textField.FT).toBe('/Tx');
});
test('Check comment readonly', async () => {
  let json = {
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
  await survey.render();
  let internal = survey.controller.doc.internal;
  let textField = internal.acroformPlugin.acroFormDictionaryRoot.Fields[0]
  expect(textField.readOnly).toBe(true);
});
test('Check empty question', async () => {
  let json = {
    questions: [
      {
        titleLocation: 'hidden',
        name: 'checkbox',
        type: 'checkbox',
      }
    ]
  };
  let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
  let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
  expect(flats.length).toBe(1);
  expect(typeof flats[0]).not.toBe('undefined');
  expect(flats[0].length).toBe(0);
});
test('Not visible question', async () => {
  let json = {
    questions: [
      {
        type: 'checkbox',
        name: 'box',
        visible: false
      }
    ]
  };
  let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
  let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
  expect(flats.length).toBe(1);
  expect(typeof flats[0]).not.toBe('undefined');
  expect(flats[0].length).toBe(0);
});
test('Check descrition with hidden title', async () => {
  let json = {
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
  await survey.render();
  let internalContent = survey.controller.doc.internal.pages[1][3];
  expect(internalContent).toBeDefined();
  let regex = /\((.*)\)/;
  let content = internalContent.match(regex)[1];
  expect(content).toBe(json.questions[0].description);
});
test('Two pages', async () => {
  let json = {
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
  let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
  expect(flats.length).toBe(2);
  expect(flats[0].length).toBe(1);
  expect(flats[1].length).toBe(1);
});