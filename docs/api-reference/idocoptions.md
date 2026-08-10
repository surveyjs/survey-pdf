---
title: IDocOptions
product: PDF Generator
api-type: interface
description: PDF document configuration.
source: https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions
---

# `IDocOptions`

PDF document configuration. Pass it as the second argument to the `SurveyPDF` constructor:

```js
const surveyPdf = new SurveyPDF.SurveyPDF(surveyJson, pdfDocOptions);

// In modular applications:
import { SurveyPDF } from "survey-pdf";
const surveyPdf = new SurveyPDF(surveyJson, pdfDocOptions);
```

## Properties

### `applyImageFit`

**Type**: `boolean`

Specifies whether to apply `imageFit` settings specified in the survey JSON schema to exported images.

Default value: `false`

This property applies the following settings:

- [`imageFit`](https://surveyjs.io/form-library/documentation/api-reference/add-image-to-survey#imageFit) to exported [Image](https://surveyjs.io/form-library/documentation/api-reference/add-image-to-survey) questions
- [`imageFit`](https://surveyjs.io/form-library/documentation/api-reference/image-picker-question-model#imageFit) to exported [Image Picker](https://surveyjs.io/form-library/documentation/api-reference/image-picker-question-model) questions
- [`logoFit`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#logoFit) to an exported logo in the survey header

If you enable the `applyImageFit` property, the quality of images may be lower because they pass through several conversions. If `applyImageFit` is disabled, exported images fill the entire container and do not preserve their aspect ratio, but their quality remains the same because they are exported as is.

### `compress`

**Type**: `boolean`

Specifies whether to compress the PDF document. Compressed documents do not support [custom fonts](https://surveyjs.io/Documentation/Pdf-Export?id=Customization-ChangeFonts#use-custom-font).

Default value: `false`

### `fontName`

**Type**: `string`

Font name.

Possible values:

- `"Helvetica"` (default)
- `"Courier"`
- `"Times"`
- `"Symbol"`
- `"ZapfDingbats"`
- [Custom font name](https://surveyjs.io/pdf-generator/documentation/customize-pdf-form-settings#custom-fonts)

[View Demo](https://surveyjs.io/pdf-generator/examples/change-font-in-pdf-form/ (linkStyle))

**Related APIs:** [`fontSize`](#fontSize)

### `fontSize`

**Type**: `number`

Font size in points.

Default value: 14

**Related APIs:** [`fontName`](#fontName)

### `format`

**Type**: `string | {}`

Page format.

Possible values:

- `"a0"` - `"a10"` (`"a4"` is default)
- `"b0"` - `"b10"`
- `"c0"` - `"c10"`
- `"dl"`
- `"letter"`
- `"government-letter"`
- `"legal"`
- `"junior-legal"`
- `"ledger"`
- `"tabloid"`
- `"credit-card"`
- `[width, height]` - Custom page size in millimeters, for example, `[210, 297]`.

[View Demo](https://surveyjs.io/pdf-generator/examples/save-completed-forms-as-pdf-files/ (linkStyle))

**Related APIs:** [`orientation`](#orientation)

### `htmlRenderAs`

**Type**: `"auto" | "standard" | "image"`

Specifies how to render [HTML questions](https://surveyjs.io/Documentation/Library?id=questionhtmlmodel) into PDF.

Possible values:

- `"standard"` - Render HTML questions as selectable text.
- `"image"` - Render HTML questions as images.
- `"auto"` (default) - Select between the `"standard"` and `"image"` modes automatically based on the HTML content.

[View Demo](https://surveyjs.io/pdf-generator/examples/split-html-image-across-pages/ (linkStyle))

You can override this property for an individual HTML question. Set the question's `renderAs` property to `"standard"` or `"image"` in the survey JSON schema.

**Related APIs:** [`useCustomFontInHtml`](#useCustomFontInHtml)

### `isRTL`

**Type**: `boolean`

Specifies whether the PDF document contains text in right-to-left languages.

Default value: `false`

### `margins`

**Type**: `IMargin`

Page margins.

Set this property to an object with the following fields: `top`, `bot`, `left`, `right`.

[View Demo](https://surveyjs.io/pdf-generator/examples/save-completed-forms-as-pdf-files/ (linkStyle))

### `matrixRenderAs`

**Type**: `"auto" | "list"`

Specifies how to render [Matrix](https://surveyjs.io/Documentation/Library?id=questionmatrixmodel), [Matrix Dropdown](https://surveyjs.io/Documentation/Library?id=questionmatrixdropdownmodel), and [Matrix Dynamic](https://surveyjs.io/Documentation/Library?id=questionmatrixdynamicmodel) questions into PDF.

Possible values:

- `"list"` - Render matrix-like questions as lists.
- `"auto"` (default) - Render matrix-like questions as tables if they fit into the available space. Otherwise, render the questions as lists.

You can override this property for an individual matrix-like question. Set the question's `renderAs` property to `"list"` in the survey JSON schema.

### `orientation`

**Type**: `"p" | "l"`

Page orientation.

Possible values:

- `"p"` (default) - Portrait orientation.
- `"l"` - Landscape orientation.

**Related APIs:** [`format`](#format)

### `readonlyRenderAs`

**Type**: `"auto" | "text" | "acroform"`

Specifies how to render read-only questions.

Possible values:

- `"text"` - Render read-only questions as plain text and custom primitives.
- `"acroform"` - Use Adobe AcroForms to render questions that support them as interactive form elements switched to their native read-only state. Other questions are rendered in `"text"` mode.
- `"auto"` (default) - Prefer the `"text"` mode but use `"acroform"` for [File Upload](https://surveyjs.io/form-library/documentation/api-reference/file-model) questions and links.

### `tagboxSelectedChoicesOnly`

**Type**: `boolean`

Specifies whether to include only selected choices when PDF Generator renders a [Multi-Select Dropdown (Tag Box)](https://surveyjs.io/form-library/examples/how-to-create-multiselect-tag-box/) question.

Default value: `false` (include all choices)

### `useCustomFontInHtml`

**Type**: `boolean`

Specifies whether to apply a custom font to [HTML questions](https://surveyjs.io/form-library/examples/questiontype-html/).

Default value: `false`

[View Demo](https://surveyjs.io/pdf-generator/examples/change-font-in-pdf-form/ (linkStyle))

**Related APIs:** [`htmlRenderAs`](#htmlRenderAs)
