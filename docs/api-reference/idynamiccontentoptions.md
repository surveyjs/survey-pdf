---
title: IDynamicContentOptions
product: PDF Generator
api-type: interface
description: Options for including dynamic content in the PDF document regardless of the current survey answers.
source: https://surveyjs.io/pdf-generator/documentation/api-reference/idynamiccontentoptions
---

# `IDynamicContentOptions`

Options for including dynamic content in the PDF document regardless of the current survey answers.

Assign an object with these options to the [`IDocOptions.dynamicContent`](/pdf-generator/documentation/api-reference/idocoptions#dynamicContent) property:

```js
const pdfDocOptions = {
  dynamicContent: {
    choiceComments: true,
    // ...
  }
};

const surveyPdf = new SurveyPDF.SurveyPDF(surveyJson, pdfDocOptions);

// In modular applications:
import { SurveyPDF } from "survey-pdf";

const surveyPdf = new SurveyPDF(surveyJson, pdfDocOptions);
```

[Documentation: Dynamic Content](/pdf-generator/documentation/customize-pdf-form-settings#dynamic-content (linkStyle))

## Properties

### `choiceComments`

**Type**: `boolean`

Specifies whether to include [configured comment areas](/form-library/examples/individual-checkbox-comments/) for unselected choices.

Default value: `false`

**Related APIs:** [`IDocOptions.otherRowsCount`](/pdf-generator/documentation/api-reference/idocoptions#otherRowsCount), [`choiceNestedContent`](#choiceNestedContent)

### `choiceNestedContent`

**Type**: `boolean`

Specifies whether to include [nested content](/form-library/examples/nest-follow-up-questions-within-choice-options/) for unselected choices.

Default value: `false`

**Related APIs:** [`choiceComments`](#choiceComments), [`conditionalElements`](#conditionalElements)

### `conditionalChoices`

**Type**: `boolean`

Specifies whether to include choices hidden by visibility conditions.

Default value: `false`

**Related APIs:** [`IDocOptions.tagboxSelectedChoicesOnly`](/pdf-generator/documentation/api-reference/idocoptions#tagboxSelectedChoicesOnly), [`conditionalElements`](#conditionalElements)

### `conditionalElements`

**Type**: `boolean`

Specifies whether to include questions, panels, and pages hidden by visibility conditions.

Default value: `false`

**Related APIs:** [`choiceNestedContent`](#choiceNestedContent), [`conditionalChoices`](#conditionalChoices)

### `conditionalMatrixColumns`

**Type**: `boolean`

Specifies whether to include matrix columns hidden by visibility conditions.

Default value: `false`

**Related APIs:** [`IDocOptions.matrixRenderAs`](/pdf-generator/documentation/api-reference/idocoptions#matrixRenderAs), [`conditionalMatrixRows`](#conditionalMatrixRows)

### `conditionalMatrixRows`

**Type**: `boolean`

Specifies whether to include matrix rows hidden by visibility conditions.

Default value: `false`

**Related APIs:** [`IDocOptions.matrixRenderAs`](/pdf-generator/documentation/api-reference/idocoptions#matrixRenderAs), [`conditionalMatrixColumns`](#conditionalMatrixColumns)
