import { TextQuestion } from "../src/jspdf/text";
import {
  JsPdfSurveyModel,
  PdfQuestionRendererBase,
  DocOptions,
  IPoint,
  IRect
} from "../src/jspdf/survey";
import { Question } from "../src/question";
import { CheckBoxQuestion } from "../src/jspdf/checkbox";
import jsPDF from "jspdf";
import { QuestionCheckboxModel } from "../src/question_checkbox";
import { QuestionSelectBase } from "../src/question_baseselect";
export default QUnit.module("JsPDF");

QUnit.test("", function(assert) {
  let point = { xLeft: 1, yTop: 1 };
  let assumedBoundaries = {
    xLeft: point.xLeft,
    xRight: point.xLeft,
    yTop: point.yTop,
    yBot: point.yTop
  };
  let resultBoundaries = new PdfQuestionRendererBase(
    new Question("q1"),
    new DocOptions(new jsPDF(), 14, 1, 1, 595.28, 841.89, 0)
  ).getBoundariesContent(point);
  assert.deepEqual(
    assumedBoundaries,
    resultBoundaries,
    "PdfQuestionRendererBase.getBoundariesContent return not same boundaries"
  );
});

QUnit.test("select base item js2Pdf", function(assert) {
  let point: IPoint = { xLeft: 1, yTop: 1 };
  let fontsize = 14;
  let pageHeight = 841.89;
  let pageWidth = 595.28;
  let xScale = 1;
  let yScale = 1;
  let margin = 0;
  let assumedBoundaries: IRect = {
    xLeft: 1,
    xRight: 113,
    yTop: 1,
    yBot: 15
  };
  let selectBase: QuestionSelectBase = new QuestionSelectBase("q1");
  selectBase.choices = ["choise1"];
  let resultBoundaries = new CheckBoxQuestion(
    selectBase,
    new DocOptions(
      new jsPDF(),
      fontsize,
      xScale,
      yScale,
      pageWidth,
      pageHeight,
      margin
    )
  ).getBoudndariesItem(point, selectBase.choices[0]);
  assert.deepEqual(
    assumedBoundaries,
    resultBoundaries,
    "QuestionCheckBox.getBoundariesContent return not same boundaries"
  );
});
QUnit.test("checkbox js2Pdf", function(assert) {
  let point: IPoint = { xLeft: 1, yTop: 1 };
  let fontsize = 14;
  let pageHeight = 841.89;
  let pageWidth = 595.28;
  let xScale = 1;
  let yScale = 1;
  let margin = 0;
  let assumedBoundaries: IRect = {
    xLeft: 1,
    xRight: 113,
    yTop: 1,
    yBot: 43
  };
  let checkbox: QuestionCheckboxModel = new QuestionCheckboxModel("q1");
  checkbox.choices = ["choise1", "choise2", "choise3"];
  let resultBoundaries = new CheckBoxQuestion(
    checkbox,
    new DocOptions(
      new jsPDF(),
      fontsize,
      xScale,
      yScale,
      pageWidth,
      pageHeight,
      margin
    )
  ).getBoundariesContent(point);
  assert.deepEqual(
    assumedBoundaries,
    resultBoundaries,
    "QuestionCheckBox.getBoundariesContent return not same boundaries"
  );
});
