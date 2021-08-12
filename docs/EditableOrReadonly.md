# Editable or readonly PDF

SurveyJS PDF can export a survey to a PDF document in two modes:  
- editable (with fillable text forms inside a PDF document), 
- readonly (with plain non-editable texts).

Use the [mode](https://surveyjs.io/Documentation/Library?id=surveymodel#mode) property of a `SurveyPDF` object instance to choose export mode.

## Editable mode

Typical use cases of having an editable PDF document:

1. Export a blank survey (with empty [data](https://surveyjs.io/Documentation/Library?id=surveymodel#data) property) to a PDF document.
2. Send a PDF document to respondents.
3. Ask respondents to fill a PDF document (using Adobe Acrobat Reader or Edge browser) and send it back for processing.
4. Obtain filled data from PDF documents (for instance, automatically using the third-party libraries).

Editable PDF documents are implemented via Adobe Acroforms. They contain form fields within which respondents can enter data (type text, check boxes or radio buttons, and select items from lists).

![SurveyJS PDF Exporter example page 1](https://raw.githubusercontent.com/surveyjs/survey-pdf/master/docs/images/editable-pdf.gif)