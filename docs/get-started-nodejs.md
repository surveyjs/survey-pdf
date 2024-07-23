---
title: Create PDF Forms in Node.js with SurveyJS
description: Learn how to generate interactive PDF forms on a Node.js server using SurveyJS. This tutorial covers installation, configuration, data population, and PDF export. View full code on GitHub.
---

# Create PDF Forms in Node.js

PDF Generator for SurveyJS allows you to generate interactive PDF forms on a Node.js server. This tutorial describes how to configure PDF form creation in a Node.js application.

- [Install the `survey-pdf` npm package](#install-the-survey-pdf-npm-package)
- [Configure Export Properties](#configure-export-properties)
- [Populate the PDF Form with Data](#populate-the-pdf-form-with-data)
- [Export the PDF Form](#export-the-pdf-form)

[View Full Code on GitHub](https://github.com/surveyjs/code-examples/tree/main/surveyjs-pdf-nodejs (linkStyle))

## Install the `survey-pdf` npm package

PDF Generator for SurveyJS is built upon the <a href="https://github.com/parallax/jsPDF#readme" target="_blank">jsPDF</a> library and is distributed as a <a href="https://www.npmjs.com/package/survey-pdf" target="_blank">`survey-pdf`</a> npm package. Run the following command to install the package and its dependencies, including jsPDF:

```bash
npm install survey-pdf --save
```

If your survey contains [HTML](https://surveyjs.io/form-library/documentation/api-reference/add-custom-html-to-survey) or [Signature Pad](https://surveyjs.io/form-library/documentation/api-reference/signature-pad-model) questions, install the <a href="https://www.npmjs.com/package/jsdom" target="_blank">`jsdom`</a> package to create a simulated web environment in a Node.js application. Create a JSDOM instance and reference the `window` and `document` objects from the JSDOM instance in a global scope:

```js
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const SurveyPDF = require("survey-pdf");

const { window } = new JSDOM(`...`);
global.window = window;
global.document = window.document;
```

## Configure Export Properties

Export properties allow you to customize the page format, orientation, margins, font, and other parameters. Refer to the [`IDocOptions`](/Documentation/Pdf-Export?id=idocoptions) interface for a full list of properties. The following code changes the [`fontSize`](/Documentation/Pdf-Export?id=idocoptions#fontSize) property:

```js
const pdfDocOptions = {
  fontSize: 12
};
```

Pass the object with export properties as a second parameter to the [`SurveyPDF`](/pdf-generator/documentation/api-reference/surveypdf) constructor. The first parameter should be a survey JSON schema:

```js
// ...
const surveyJson = { ... };

const surveyPdf = new SurveyPDF.SurveyPDF(surveyJson, pdfDocOptions);
```

## Populate the PDF Form with Data

Specify the `data` property of a `SurveyPDF` instance to define question answers. If a survey contains default values, and you wish to preserve them, call the `mergeData(newObj)` method instead.

```js
surveyPdf.data = {
  // ...
  // An object with question answers
  // ...
};
// ----- or -----
surveyPdf.mergeData({
  // ...
  // An object with question answers
  // ...
});
```

For more information on how to programmatically define question answers, refer to the following help topic: [Populate Form Fields](https://surveyjs.io/form-library/documentation/design-survey/pre-populate-form-fields).

## Export the PDF Form

To save a PDF document with the exported survey, call the [`save(fileName)`](/Documentation/Pdf-Export?id=surveypdf#save) method on the `SurveyPDF` instance. If you omit the `fileName` parameter, the document uses the default name (`"survey_result.pdf"`).

```js
surveyPdf.save("My PDF Form.pdf");
```

[View Full Code on GitHub](https://github.com/surveyjs/code-examples/tree/main/surveyjs-pdf-nodejs (linkStyle))