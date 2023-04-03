---
title: Export custom questions | SurveyJS
description: Export custom and third-party widgets to a PDF form.
---
# Export Custom Questions to PDF

This help topic describes how to export a custom question type to PDF.

If you implement a [custom question](https://surveyjs.io/survey-creator/documentation/customize-question-types/third-party-component-integration-react) and export a survey to PDF, you can use either option to export custom questions to PDF.

### Use Default Rendering
The SurveyJS PDF library renders a custom component's `value` as a text field by default.

### Use a Standard SurveyJS Question Renderer
If you derive your custom question from one of the standard Survey questions (for instance, from a [QuestionTextModel](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model)), you can export a custom component as one of the [standard question](https://github.com/surveyjs/survey-pdf/tree/1c6c73528b18fbf70533933e265a250eab5e9a80/src/flat_layout) types. For instance, the following code registers a Text Box question PDF renderer for a custom `color-picker` question.
```js
// TODO: Instead of using undocumented FlatTextbox, create a new API function: https://github.com/surveyjs/survey-pdf/issues/218
import { FlatRepository, FlatTextbox } from "survey-pdf";

FlatRepository.getInstance().register('color-picker', 
  FlatTextbox
);
```
[Example](https://codesandbox.io/s/amazing-fast-kb5lkq?file=/src/SurveyPdfComponent.jsx)

### Use a Custom Brick
If none of the standard options suits you, you can use [jspdf API](https://raw.githack.com/MrRio/jsPDF/master/docs/index.html) to render the content of your custom component.

The following code registers a custom PDF brick for a `color-picker` question type. The `renderInteractive` function calls the [setFillColor](https://artskydj.github.io/jsPDF/docs/jsPDF.html#setFillColor) and [rect](https://artskydj.github.io/jsPDF/docs/jsPDF.html#rect) function of [a jsPDF document instance](https://artskydj.github.io/jsPDF/docs/jsPDF.html) to render a custom Color question as a rectangle filled in with a selected color.

```js
class CustomPdfBrick extends PdfBrick {
  async renderInteractive() {
    const doc = this.controller.doc;
    let oldFillColor = doc.getFillColor();
    doc.setFillColor(this.question.value || "black");
    doc.rect(this.xLeft, this.yTop, this.width, this.height, "F");
    doc.setFillColor(oldFillColor);
  }
}

class FlatCustomColor extends FlatQuestion {
  async generateFlatsContent(point) {
    const rect = { ...point };
    rect.yBot = point.yTop + 20;
    rect.xRight = point.xLeft + 100;
    return [new CustomPdfBrick(this.question, this.controller, rect)];
  }
}

FlatRepository.getInstance().register(CUSTOM_TYPE, FlatCustomColor);
```
[Example](https://codesandbox.io/s/trusting-golick-7uzd59?file=/src/SurveyPdfComponent.jsx)

