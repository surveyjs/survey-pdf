---
title: Customize the Settings of Your SurveyJS PDF Forms | PDF Generator Library
description: Learn how to configure PDF page settings, fonts, and create both editable and read-only PDF forms using SurveyJS PDF Generator. Explore options for page orientation, size, margins, standard and custom fonts, font size, and document compression to tailor your PDF forms to your specific needs.
---

# PDF Form Settings

PDF forms created with SurveyJS PDF Generator can have various settings and configurations depending on your needs and requirements. This help topic describes how to specify PDF page settings (orientation, size, margins), change fonts, create a read-only PDF form, and compress a PDF document to reduce its size.

## Page Settings

### Page Orientation

SurveyJS PDF Generator can create PDF documents with portrait or landscape orientation. To change page orientation, set the [`orientation`](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#orientation) property to `"p"` (portrait, default) or `"l"` (landscape):

```js
const pdfDocOptions = {
  orientation: "l" // or "p"
};

const surveyPdf = new SurveyPDF.SurveyPDF(surveyJson, pdfDocOptions);

// In modular applications:
import { SurveyPDF } from "survey-pdf";
const surveyPdf = new SurveyPDF(surveyJson, pdfDocOptions);
```

### Page Size

Generated PDF documents support predefined page sizes (for instance, `"a3"`, `"letter"`, `"credit-card"`) and allow you to define a custom page size in millimeters. Specify the [`format`](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#format) property to set the desired page size. Refer to the property description for a full list of supported page size types. If you do not specify this property, generated PDF documents use the A4 page size.

```js
const pdfDocOptions = {
  // A predefined page format
  format: "a2"
  // A custom page size in millimeters: [width, height]
  format: [210, 297]
};

const surveyPdf = new SurveyPDF.SurveyPDF(surveyJson, pdfDocOptions);

// In modular applications:
import { SurveyPDF } from "survey-pdf";
const surveyPdf = new SurveyPDF(surveyJson, pdfDocOptions);
```

### Page Margins

Use the [`margins`](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#margins) property to specify page margins. This property accepts an object with fields that specify the top, bottom, left, and right page margins in millimeters. Increase the top and bottom margins if you plan to add [header and footer](/pdf-generator/documentation/add-header-and-footer-to-pdf-form) to your PDF form.

```js
const pdfDocOptions = {
  top: 10,
  bot: 10,
  left: 15,
  right: 15
};

const surveyPdf = new SurveyPDF.SurveyPDF(surveyJson, pdfDocOptions);

// In modular applications:
import { SurveyPDF } from "survey-pdf";
const surveyPdf = new SurveyPDF(surveyJson, pdfDocOptions);
```

## Fonts

### Standard Fonts

Any PDF document supports a set of standard 14 fonts. They are available in most PDF viewers and ensure consistent document representation on any device. The standard 14 fonts include the following fonts and their variants:

- Helvetica | Helvetica-Bold | Helvetica-BoldOblique | Helvetica-Oblique
- Courier | Courier-Bold | Courier-BoldOblique | Courier-Oblique
- Times-Roman | Times-Bold | Times-Italic | Times-BoldItalic
- Symbol
- ZapfDingbats

SurveyJS PDF Generator supports these fonts out of the box. To apply one of them, specify the [`fontName`](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#fontName) property. The default font is Helvetica.

```js
const pdfDocOptions = {
  fontName: "Helvetica" // or "Courier" | "Times" | "Symbol" | "ZapfDingbats"
};

const surveyPdf = new SurveyPDF.SurveyPDF(surveyJson, pdfDocOptions);

// In modular applications:
import { SurveyPDF } from "survey-pdf";
const surveyPdf = new SurveyPDF(surveyJson, pdfDocOptions);
```

### Custom Fonts

You can also use custom fonts in your PDF document. Unlike the standard fonts, custom fonts are embedded in the document and increase its size. To add a custom font, call the `DocController.addFont(fontName, base64, fontStyle)` method with the following parameters:

- `fontName`: `string`\
A custom name that you will use to apply a custom font.
- `base64`: `string`\
The custom font as a Base64-encoded string. To encode your font to Base64, obtain it as a TTF file and use any TTF-to-Base64 online converter.
- `fontStyle`: `"normal"` | `"bold"` | `"italic"` | `"bolditalic"`\
The style of the custom font.

To apply a custom font to a PDF document, assign its name to the [`fontName`](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#fontName) property. This setting applies a custom font to all survey questions except [HTML](https://surveyjs.io/form-library/examples/questiontype-html/). To include HTML questions too, enable the [`useCustomFontInHtml`](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#useCustomFontInHtml) property.

[View Demo](https://surveyjs.io/pdf-generator/examples/change-font-in-pdf-form/ (linkStyle))

### Font Size

Use the [`fontSize`](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#fontSize) property to specify the font size in points. The sizes of titles, descriptions, and other text elements will be scaled proportionally based on the `fontSize` value.

```js
const pdfDocOptions = {
  fontSize: 16
};

const surveyPdf = new SurveyPDF.SurveyPDF(surveyJson, pdfDocOptions);

// In modular applications:
import { SurveyPDF } from "survey-pdf";
const surveyPdf = new SurveyPDF(surveyJson, pdfDocOptions);
```

## Editable vs Read-Only PDF Documents

Editable PDF forms allow respondents to fill in form fields: enter text in text boxes, select items from drop-down lists, radio button groups, or checkbox questions, and so on. Respondents can save a filled-in PDF form and send it you for further processing. Editable PDF documents use Adobe AcroForms. SurveyJS PDF Generator creates editable PDF documents by default.

If you do not want users to fill in your PDF form, generate it in read-only mode. In this mode, form fields are non-interactive. You can pre-fill a read-only PDF form with user responses if required. Read-only PDF documents have smaller size because they do not use Adobe AcroForms.

To generate a read-only PDF form, set the `mode` property on a `SurveyPDF` instance to `"display"`. To pre-fill your form with user responses, assign a data object to `SurveyPDF`'s `data` property. This is the same object saved in the [`data`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#data) property of a `SurveyModel` instance.

```js
const surveyJson = { ... };
const survey = new Survey.Model(surveyJson);

const surveyPdf = new SurveyPDF.SurveyPDF(surveyJson, pdfDocOptions);
surveyPdf.mode = "display";
surveyPdf.data = survey.data;

// In modular applications:
import { Model } from "survey-core";
import { SurveyPDF } from "survey-pdf";

const surveyJson = { ... };
const survey = new Model(surveyJson);

const surveyPdf = new SurveyPDF(surveyJson, pdfDocOptions);
surveyPdf.mode = "display";
surveyPdf.data = survey.data;
```

## Document Compression

If you need to reduce the size of a PDF document, you can compress it. Compressed documents do not support [AcroForms](#editable-and-read-only-pdf-documents) and [custom fonts](#custom-fonts). Enable the `compress` property to create a compressed PDF document:

```js
const pdfDocOptions = {
  compress: true
};

const surveyPdf = new SurveyPDF.SurveyPDF(surveyJson, pdfDocOptions);

// In modular applications:
import { SurveyPDF } from "survey-pdf";
const surveyPdf = new SurveyPDF(surveyJson, pdfDocOptions);
```