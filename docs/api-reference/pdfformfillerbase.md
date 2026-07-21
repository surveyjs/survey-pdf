---
title: PDFFormFillerBase
product: PDF Generator
api-type: class
description: A base class for the `PDFFormFiller` plugin.
source: https://surveyjs.io/pdf-generator/documentation/api-reference/pdfformfillerbase
---

# `PDFFormFillerBase`

A base class for the `PDFFormFiller` plugin.

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

## Methods

### `raw()`

**Return value:** `unknown`

An asynchronous method that allows you to get PDF content in different formats.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `type` | `"blob" \| "bloburl" \| "dataurlstring"` | *(Optional)* One of `"blob"`, `"bloburl"`, `"dataurlstring"`. Do not specify this parameter if you want to get raw PDF content as a string value. |

### `save()`

**Return value:** `any`

An asynchronous method that starts to download the filled PDF form in the web browser.

[View pdf-lib Demo](https://surveyjs.io/pdf-generator/examples/map-survey-responses-to-pdf-fields-using-pdflib/ (linkStyle))

[View PDF.js Demo](https://surveyjs.io/pdf-generator/examples/fill-in-pdf-form-fields-with-dynamic-survey-data-using-pdfjs/ (linkStyle))

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `fileName` | `string` | *(Optional)* A file name with the ".pdf" extension. Default value: `"FilledForm.pdf"`. |
