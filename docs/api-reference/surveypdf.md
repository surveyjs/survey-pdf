---
title: SurveyPDF
product: PDF Generator
api-type: class
description: The `SurveyPDF` object enables you to export your surveys and forms to PDF documents.
source: https://surveyjs.io/pdf-generator/documentation/api-reference/surveypdf
---

# `SurveyPDF`

The `SurveyPDF` object enables you to export your surveys and forms to PDF documents.

[View Demo](https://surveyjs.io/pdf-generator/examples/ (linkStyle))

## Methods

### `raw()`

**Return value:** `Promise<string><any> | Promise<ArrayBuffer><ArrayBuffer> | Promise<Blob><Blob> | Promise<URL><URL> | Promise<any><any>`

An asynchronous method that allows you to get PDF content in different formats.

[View Demo](https://surveyjs.io/pdf-generator/examples/convert-pdf-form-blob-base64-raw-pdf-javascript/ (linkStyle))

### `save()`

**Return value:** `Promise<any><any>`

An asynchronous method that starts to download the generated PDF file in the web browser.

[View Demo](https://surveyjs.io/pdf-generator/examples/save-completed-forms-as-pdf-files/ (linkStyle))

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `fileName` | `string` | *(Optional)* A file name with the ".pdf" extension. Default value: `"survey_result.pdf"`. |

## Events

### `onRenderFooter`

An event that is raised when SurveyJS PDF Generator renders a page footer. Handle this event to customize the footer.

Parameters:

- `sender`: `SurveyPDF`\
A SurveyPDF instance that raised the event.

- `canvas`: [`DrawCanvas`](https://surveyjs.io/pdf-generator/documentation/api-reference/drawcanvas)\
An object that you can use to draw text and images in the page footer.

[View Demo](https://surveyjs.io/pdf-generator/examples/customize-header-and-footer-of-pdf-form/ (linkStyle))

### `onRenderHeader`

An event that is raised when SurveyJS PDF Generator renders a page header. Handle this event to customize the header.

Parameters:

- `sender`: `SurveyPDF`\
A SurveyPDF instance that raised the event.

- `canvas`: [`DrawCanvas`](https://surveyjs.io/pdf-generator/documentation/api-reference/drawcanvas)\
An object that you can use to draw text and images in the page header.

[View Demo](https://surveyjs.io/pdf-generator/examples/customize-header-and-footer-of-pdf-form/ (linkStyle))

### `onRenderPage`

An event that is raised when SurveyJS PDF Generator renders a page. Handle this event to customize page rendering.

Parameters:

- `sender`: `SurveyPDF`\
A SurveyPDF instance that raised the event.

- `options.page`: [`PageModel`](https://surveyjs.io/form-library/documentation/api-reference/page-model)\
A page that is being rendered.

- `options.point`: `IPoint`\
An object with coordinates of the top-left corner of the element being rendered. This object contains the following properties: `{ xLeft: number, yTop: number }`.

- `options.bricks`: [`PdfBrick[]`](https://surveyjs.io/pdf-generator/documentation/api-reference/pdfbrick)\
An array of [bricks](https://surveyjs.io/pdf-generator/documentation/customize-survey-question-rendering-in-pdf-form#custom-rendering) used to render the element.

- `options.controller`: [`DocController`](https://surveyjs.io/pdf-generator/documentation/api-reference/doccontroller)\
An object that provides access to main PDF document properties (font, margins, page width and height) and allows you to modify them.

- `options.repository`: `FlatRepository`\
A repository with classes that render elements to PDF. Use its `create` method if you need to create a new instance of a rendering class.

[View Demo](https://surveyjs.io/pdf-generator/examples/how-to-use-adorners-in-pdf-forms/ (linkStyle))

### `onRenderPanel`

An event that is raised when SurveyJS PDF Generator renders a panel. Handle this event to customize panel rendering.

Parameters:

- `sender`: `SurveyPDF`\
A SurveyPDF instance that raised the event.

- `options.panel`: [`PanelModel`](https://surveyjs.io/form-library/documentation/api-reference/panel-model)\
A panel that is being rendered.

- `options.point`: `IPoint`\
An object with coordinates of the top-left corner of the element being rendered. This object contains the following properties: `{ xLeft: number, yTop: number }`.

- `options.bricks`: [`PdfBrick[]`](https://surveyjs.io/pdf-generator/documentation/api-reference/pdfbrick)\
An array of [bricks](https://surveyjs.io/pdf-generator/documentation/customize-survey-question-rendering-in-pdf-form#custom-rendering) used to render the element.

- `options.controller`: [`DocController`](https://surveyjs.io/pdf-generator/documentation/api-reference/doccontroller)\
An object that provides access to main PDF document properties (font, margins, page width and height) and allows you to modify them.

- `options.repository`: `FlatRepository`\
A repository with classes that render elements to PDF. Use its `create` method if you need to create a new instance of a rendering class.

[View Demo](https://surveyjs.io/pdf-generator/examples/how-to-use-adorners-in-pdf-forms/ (linkStyle))

### `onRenderQuestion`

An event that is raised when SurveyJS PDF Generator renders a survey question. Handle this event to customize question rendering.

Parameters:

- `sender`: `SurveyPDF`\
A SurveyPDF instance that raised the event.

- `options.question`: [`Question`](https://surveyjs.io/form-library/documentation/api-reference/question)\
A survey question that is being rendered.

- `options.point`: `IPoint`\
An object with coordinates of the top-left corner of the element being rendered. This object contains the following properties: `{ xLeft: number, yTop: number }`.

- `options.bricks`: [`PdfBrick[]`](https://surveyjs.io/pdf-generator/documentation/api-reference/pdfbrick)\
An array of [bricks](https://surveyjs.io/pdf-generator/documentation/customize-survey-question-rendering-in-pdf-form#custom-rendering) used to render the element.

- `options.controller`: [`DocController`](https://surveyjs.io/pdf-generator/documentation/api-reference/doccontroller)\
An object that provides access to main PDF document properties (font, margins, page width and height) and allows you to modify them.

- `options.repository`: `FlatRepository`\
A repository with classes that render elements to PDF. Use its `create` method if you need to create a new instance of a rendering class.

[View Demo](https://surveyjs.io/pdf-generator/examples/how-to-use-adorners-in-pdf-forms/ (linkStyle))
