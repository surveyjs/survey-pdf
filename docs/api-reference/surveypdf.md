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

## Properties

### `style`

**Type**: `IDocStyle`

An object that defines the visual style applied to UI elements in an exported PDF document.

To apply a new visual style to the PDF document, call the [`applyStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/surveypdf#applyStyle) method.

[PDF Appearance Customization - Styles Config](/pdf-generator/documentation/pdf-appearance-customization#styles-config (linkStyle))

Available since: v3.0.0

## Methods

### `applyLayout()`

Applies a layout configuration to the exported PDF document.

A layout defines non-color CSS variables, including spacing, sizing, typography, border radius, and other dimensional variables. To configure colors and shadows, use the [`applyTheme`](#applyTheme) method.

Available since: v3.0.0

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `layout` | `IDocLayout` | An `IDocLayout` object that specifies layout variables. |
| `baseLayout` | `IDocLayout` | An optional `IDocLayout` object used as the base layout. When specified, it is deep-merged with `layout`, and the merged result is applied. |

### `applyStyle()`

Applies a visual style to UI elements in the exported PDF document.

This method accepts either an [`IDocStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/IDocStyle) object that overrides properties in the default visual style, or a callback function that returns such an object. When a callback is used, it receives helper functions&mdash;`getSizeVariable(name)` and `getColorVariable(name)`&mdash;which allow you to derive dimensions and colors from the currently applied UI theme.

[PDF Appearance Customization - Styles Config](/pdf-generator/documentation/pdf-appearance-customization#styles-config (linkStyle))

Available since: v3.0.0

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `value` | `IDocStyle \| ((options: { getColorVariable: (name: string) => string; getSizeVariable: (name: string) => number; }) => IDocStyle)` | An [`IDocStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/IDocStyle) object, or a callback function that returns an `IDocStyle` object. |

### `applyTheme()`

Applies a UI theme to the exported PDF document.

A theme defines color- and shadow-related CSS variables. To configure spacing, sizing, typography, and other non-color variables, use the [`applyLayout`](#applyLayout) method.

Available since: v3.0.0

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `theme` | `ITheme` | An [`ITheme`](https://surveyjs.io/form-library/documentation/api-reference/itheme) object with theme settings. |
| `baseTheme` | `ITheme` | An optional `ITheme` object used as the base theme. When specified, it is deep-merged with `theme`, and the merged result is applied. |

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

### `onGetItemStyle`

An event that allows you to customize the visual style applied to a choice item in an exported PDF document.

Parameters:

- `sender`: `SurveyPDF`\
A `SurveyPDF` instance that raised the event.
- `options.question`: [`Question`](https://surveyjs.io/form-library/documentation/api-reference/question)\
A question to which the item belongs.
- `options.item`: `ItemValue`\
A choice item whose style is being customized.
- `options.getColorVariable`: `(name: string) => string`\
A helper function that returns the value of a color variable by name.
- `options.getSizeVariable`: `(name: string) => number`\
A helper function that returns the value of a size variable by name.
- `options.style.choiceText`: [`ITextStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/ITextStyle)\
An object that defines the visual style applied to the item's text.
- `options.style.input`: [`ISelectionInputStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/ISelectionInputStyle)\
An object that defines the visual style applied to the item's input control.

Modify the properties of `options.style.choiceText` and `options.style.input` to control how the item is rendered in the exported PDF document.

[Customize Individual Element Styles in PDF](https://surveyjs.io/pdf-generator/documentation/customize-survey-question-rendering-in-pdf-form#customize-individual-element-styles (linkStyle))

Available since: v3.0.0

### `onGetPageStyle`

An event that allows you to customize the visual style applied to a page in an exported PDF document.

Parameters:

- `sender`: `SurveyPDF`\
A `SurveyPDF` instance that raised the event.
- `options.page`: [`PageModel`](https://surveyjs.io/form-library/documentation/api-reference/page-model)\
A page whose style is being customized.
- `options.getColorVariable`: `(name: string) => string`\
A helper function that returns the value of a color variable by name.
- `options.getSizeVariable`: `(name: string) => number`\
A helper function that returns the value of a size variable by name.
- `options.style`: [`IPageStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/IPageStyle)\
An object that defines the page's visual style. Modify its properties to control how the page is rendered in the exported PDF document.

[Customize Individual Element Styles in PDF](https://surveyjs.io/pdf-generator/documentation/customize-survey-question-rendering-in-pdf-form#customize-individual-element-styles (linkStyle))

Available since: v3.0.0

### `onGetPanelStyle`

An event that allows you to customize the visual style applied to a panel in an exported PDF document.

Parameters:

- `sender`: `SurveyPDF`\
A `SurveyPDF` instance that raised the event.
- `options.panel`: [`PanelModel`](https://surveyjs.io/form-library/documentation/api-reference/panel-model)\
A panel whose style is being customized.
- `options.getColorVariable`: `(name: string) => string`\
A helper function that returns the value of a color variable by name.
- `options.getSizeVariable`: `(name: string) => number`\
A helper function that returns the value of a size variable by name.
- `options.style`: [`IPanelStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/IPanelStyle)\
An object that defines the panel's visual style. Modify its properties to control how the panel is rendered in the exported PDF document.

[Customize Individual Element Styles in PDF](https://surveyjs.io/pdf-generator/documentation/customize-survey-question-rendering-in-pdf-form#customize-individual-element-styles (linkStyle))

Available since: v3.0.0

### `onGetQuestionStyle`

An event that allows you to customize the visual style applied to a question in an exported PDF document.

Parameters:

- `sender`: `SurveyPDF`\
A `SurveyPDF` instance that raised the event.
- `options.question`: [`Question`](https://surveyjs.io/form-library/documentation/api-reference/question)\
A survey question whose style is being customized.
- `options.getColorVariable`: `(name: string) => string`\
A helper function that returns the value of a color variable by name.
- `options.getSizeVariable`: `(name: string) => number`\
A helper function that returns the value of a size variable by name.
- `options.style`: [`IQuestionStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/IQuestionStyle)\
An object that defines the question's visual style. Modify its properties to control how the question is rendered in the exported PDF document.

[Customize Individual Element Styles in PDF](https://surveyjs.io/pdf-generator/documentation/customize-survey-question-rendering-in-pdf-form#customize-individual-element-styles (linkStyle))

Available since: v3.0.0

### `onRenderFooter`

An event that is raised when SurveyJS PDF Generator renders a page footer. Handle this event to customize the footer.

Parameters:

- `sender`: `SurveyPDF`\
A `SurveyPDF` instance that raised the event.
- `canvas`: [`DrawCanvas`](https://surveyjs.io/pdf-generator/documentation/api-reference/drawcanvas)\
An object that you can use to draw text and images in the page footer.
[View Demo](https://surveyjs.io/pdf-generator/examples/customize-header-and-footer-of-pdf-form/ (linkStyle))

### `onRenderHeader`

An event that is raised when SurveyJS PDF Generator renders a page header. Handle this event to customize the header.

Parameters:

- `sender`: `SurveyPDF`\
A `SurveyPDF` instance that raised the event.
- `canvas`: [`DrawCanvas`](https://surveyjs.io/pdf-generator/documentation/api-reference/drawcanvas)\
An object that you can use to draw text and images in the page header.
[View Demo](https://surveyjs.io/pdf-generator/examples/customize-header-and-footer-of-pdf-form/ (linkStyle))

### `onRenderPage`

An event that is raised when SurveyJS PDF Generator renders a page. Handle this event to customize page rendering.

Parameters:

- `sender`: `SurveyPDF`\
A `SurveyPDF` instance that raised the event.
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

### `onRenderPanel`

An event that is raised when SurveyJS PDF Generator renders a panel. Handle this event to customize panel rendering.

Parameters:

- `sender`: `SurveyPDF`\
A `SurveyPDF` instance that raised the event.
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

### `onRenderQuestion`

An event that is raised when SurveyJS PDF Generator renders a survey question. Handle this event to customize question rendering.

Parameters:

- `sender`: `SurveyPDF`\
A `SurveyPDF` instance that raised the event.
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
