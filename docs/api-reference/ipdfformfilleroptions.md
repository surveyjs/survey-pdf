---
title: IPDFFormFillerOptions
product: PDF Generator
api-type: interface
description: An object that configures the `PDFFormFiller` plugin.
source: https://surveyjs.io/pdf-generator/documentation/api-reference/ipdfformfilleroptions
---

# `IPDFFormFillerOptions`

An object that configures the [`PDFFormFiller`](https://surveyjs.io/pdf-generator/documentation/api-reference/pdfformfiller) plugin.

Pass this object to the `PDFFormFiller` constructor:

```js
const form = new PDFFormFiller.PDFFormFiller(pdfFormFillerOptions);

// In modular applications:
import { PDFFormFiller } from "survey-pdf/pdf-form-filler";
const form = new PDFFormFiller(pdfFormFillerOptions);
```

[View pdf-lib Demo](https://surveyjs.io/pdf-generator/examples/map-survey-responses-to-pdf-fields-using-pdflib/ (linkStyle))

[View PDF.js Demo](https://surveyjs.io/pdf-generator/examples/fill-in-pdf-form-fields-with-dynamic-survey-data-using-pdfjs/ (linkStyle))

## Properties

### `data`

**Type**: `any`

An object with data used to populate the PDF document.

Use the [`SurveyModel`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model)'s [`data`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#data) property to access this data object.

[View pdf-lib Demo](https://surveyjs.io/pdf-generator/examples/map-survey-responses-to-pdf-fields-using-pdflib/ (linkStyle))

[View PDF.js Demo](https://surveyjs.io/pdf-generator/examples/fill-in-pdf-form-fields-with-dynamic-survey-data-using-pdfjs/ (linkStyle))

### `fieldMap`

**Type**: `any`

An object that maps survey fields to PDF form fields. Object keys are survey field names and object values are PDF form field IDs.

The easiest way to build a field map is to access the data object with respondent answers using the `SurveyModel`'s `data` property and replace the values with the PDF form field IDs. To find the IDs, open your PDF document in any editor that allows viewing them. Note that certain field types, such as [Checkboxes](https://surveyjs.io/form-library/examples/create-checkboxes-question-in-javascript/), [Dynamic Matrix](https://surveyjs.io/form-library/examples/dynamic-matrix-add-new-rows/), and [Dynamic Panel](https://surveyjs.io/form-library/examples/duplicate-group-of-fields-in-form/) require a different configuration. Refer to the following demos for code examples.

[View pdf-lib Demo](https://surveyjs.io/pdf-generator/examples/map-survey-responses-to-pdf-fields-using-pdflib/ (linkStyle))

[View PDF.js Demo](https://surveyjs.io/pdf-generator/examples/fill-in-pdf-form-fields-with-dynamic-survey-data-using-pdfjs/ (linkStyle))

### `pdfLibraryAdapter`

**Type**: `IPDFFormAdapter`

An adapter that serves as a bridge between the `PDFFormFiller` plugin and a specific third-party library.

SurveyJS PDF Generator provides adapters for [`pdf-lib`](https://pdf-lib.js.org/) and [PDF.js](https://mozilla.github.io/pdf.js/) out of the box. Pass the libraries to the `PDFLibAdapter` or `PDFJSAdapter` constructor and assign the resulting instance to the `pdfLibraryAdapter` property.

[View pdf-lib Demo](https://surveyjs.io/pdf-generator/examples/map-survey-responses-to-pdf-fields-using-pdflib/ (linkStyle))

[View PDF.js Demo](https://surveyjs.io/pdf-generator/examples/fill-in-pdf-form-fields-with-dynamic-survey-data-using-pdfjs/ (linkStyle))

### `pdfTemplate`

**Type**: `any`

A PDF document with interactive form fields that you want to fill.

Because this document is passed on to a third-party library, the type of accepted values depends on this library.

[View pdf-lib Demo](https://surveyjs.io/pdf-generator/examples/map-survey-responses-to-pdf-fields-using-pdflib/ (linkStyle))

[View PDF.js Demo](https://surveyjs.io/pdf-generator/examples/fill-in-pdf-form-fields-with-dynamic-survey-data-using-pdfjs/ (linkStyle))
