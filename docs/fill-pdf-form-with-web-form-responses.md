---
title: Populate PDF Form Fields with JSON Data
description: Learn how to use SurveyJS PDF Generator with third-party libraries like pdf-lib or PDF.js to auto-fill interactive PDF form fields programmatically. This help topic describes how to configure the PDFFormFiller plugin to map survey responses collected through a web form to PDF fields and save the completed PDF document.
---

# Fill PDF Form with Web Form Responses

Many PDF forms contain editable fields that allow users to complete the form directly within their PDF viewer and then save, share, or print it. SurveyJS offers a plugin that enables users to fill out form fields using a dynamic SurveyJS UI. Once a user has finished, the plugin automatically transfers the responses to the corresponding fields in the PDF form and saves the document as a PDF file. This help topic explains how to enable and integrate this feature into your application.

## Add a Third-Party PDF Library

The form filling functionality requires a third-party PDF library, such as <a href="https://pdf-lib.js.org/" target="_blank">`pdf-lib`</a> or <a href="https://mozilla.github.io/pdf.js/" target="_blank">`PDF.js`</a>. Depending on whether you have a modular or classic script application, add one of those libraries as shown below.

## Option 1: Add the pdf-lib Library

<details>
    <summary>Classic script applications</summary>

Reference the `pdf-lib` script on your HTML page.

```html
<head>
  <!-- ... -->
  <script src="https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js"></script>
  <!-- ... -->
</head>
```

</details>

<details>
    <summary>Modular applications</summary>

Install the <a href="https://www.npmjs.com/package/pdf-lib" target="_blank">`pdf-lib`</a> npm package and import the entire `pdf-lib` module.

```sh
npm install pdf-lib --save
```

```js
import * as PDFLib from "pdf-lib";
```
    
</details>

### Option 2: Add the PDF.js Library

<details>
    <summary>Classic script applications</summary>

Reference the PDF.js script on your HTML page and specify the path or URL to the PDF.js worker script.

```html
<head>
  <!-- ... -->
  <script src="https://unpkg.com/pdfjs-dist@5.1.91/build/pdf.min.mjs" type="module"></script>
  <!-- ... -->
</head>
<body>
  <script>
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = "https://unpkg.com/pdfjs-dist@5.1.91/build/pdf.worker.min.mjs";
    }
  </script>
</body>
```

</details>

<details>
    <summary>Modular applications</summary>

Install the <a href="https://www.npmjs.com/package/pdfjs-dist" target="_blank">`pdfjs-dist`</a> npm package, import the entire `pdfjs-dist` module, and specify the path or URL to the PDF.js worker script.

```sh
npm install pdfjs-dist --save
```

```js
import * as pdfjsLib from "pdfjs-dist";

if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://unpkg.com/pdfjs-dist@5.1.91/build/pdf.worker.min.mjs";
}
```
    
</details>

## Configure the PDFFormFiller Plugin

SurveyJS PDF Generator integrates with a third-party library using the [`PDFFormFiller`](https://surveyjs.io/pdf-generator/documentation/api-reference/pdfformfiller) plugin. To add it to your application, use the same options as with the PDF libraries:

- Option 1: Reference the `pdf-form-filler` script on your HTML page.

    ```html
    <head>
      <!-- ... -->
      <script src="https://unpkg.com/survey-pdf/pdf-form-filler.min.js"></script>
      <!-- ... -->
    </head>
    ```

- Option 2: Install the <a href="https://www.npmjs.com/package/survey-pdf" target="_blank">`survey-pdf`</a> npm package and import `PDFFormFiller` from the `survey-pdf/pdf-form-filler` module.

    ```sh
    npm install survey-pdf --save
    ```

    ```js
    import { PDFFormFiller } from "survey-pdf/pdf-form-filler";
    ```

To configure the `PDFFormFiller` plugin, pass a configuration object with the following properties to its constructor:

- [`pdfLibraryAdapter`](https://surveyjs.io/pdf-generator/documentation/api-reference/pdfformfiller#pdfLibraryAdapter)     
An adapter serves as a bridge between the plugin and a specific third-party library. SurveyJS PDF Generator provides adapters for `pdf-lib` and PDF.js out of the box. Pass the libraries to the `PDFLibAdapter` or `PDFJSAdapter` constructor and assign the resulting instance to the `pdfLibraryAdapter` property.

- [`pdfTemplate`](https://surveyjs.io/pdf-generator/documentation/api-reference/pdfformfiller#pdfTemplate)     
A PDF document with interactive fields that you want to fill. You can load it from a server or encode the document to a Base64 data URL and embed it in your code.

- [`data`](https://surveyjs.io/pdf-generator/documentation/api-reference/pdfformfiller#data)    
An object with data used to populate the PDF document. Use the [`SurveyModel`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model)'s [`data`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#data) property to access this data object.

- [`fieldMap`](https://surveyjs.io/pdf-generator/documentation/api-reference/pdfformfiller#fieldMap)      
An object that maps survey fields to PDF form fields. Object keys are survey field names and object values are PDF form field IDs. The easiest way to build a field map is to access the data object with respondent answers using the `SurveyModel`'s `data` property and replace the values with the PDF form field IDs. To find the IDs, open your PDF document in any editor that allows viewing them. Note that certain field types, such as [Checkboxes](https://surveyjs.io/form-library/examples/create-checkboxes-question-in-javascript/), [Dynamic Matrix](https://surveyjs.io/form-library/examples/dynamic-matrix-add-new-rows/), and [Dynamic Panel](https://surveyjs.io/form-library/examples/duplicate-group-of-fields-in-form/) require a different configuration. Refer to the [demos](#demos) for a code example.

The following code shows a simple example of `PDFFormFiller` configuration:

```js
// ...
const pdfTemplate = "data:application/pdf;base64,...";
const data = {
  "employer": "ABC Technologies",
  "position": "Software Developer",
  "name": "Doe, Jane Marie",
  // ...
}
const fieldMap = {
  "employer": "Employer",
  "position": "Position",
  "name": "Candidate Name",
  // ...
}
const form = new PDFFormFiller({
  pdfLibraryAdapter: new PDFLibAdapter(PDFLib), // For pdf-lib
  pdfLibraryAdapter: new PDFJSAdapter(pdfjsLib), // For PDF.js
  pdfTemplate: pdfTemplate,
  data: data,
  fieldMap: fieldMap
});
```

## Save the Filled Out PDF Form

To save the PDF document with populated interactive fields on a user's storage, call the `PDFFormFiller`'s [`save(name)`](https://surveyjs.io/pdf-generator/documentation/api-reference/pdfformfiller#save) method:

```js
form.save("FilledForm.pdf");
```

## Demos

[View pdf-lib Demo](https://surveyjs.io/pdf-generator/examples/map-survey-responses-to-pdf-fields-using-pdflib/ (linkStyle))

[View PDF.js Demo](https://surveyjs.io/pdf-generator/examples/fill-in-pdf-form-fields-with-dynamic-survey-data-using-pdfjs/ (linkStyle))