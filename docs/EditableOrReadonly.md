# Editable or readonly PDF

SurveyJS PDF can export a survey to a PDF document in two modes: editable (with forms fillable inside a PDF document) and readonly (with plain non editable text).

Use the [mode](https://surveyjs.io/Documentation/Library?id=surveymodel#mode) property of `SurveyPDF` object instance to choose export mode.

## Editable mode

A typical use case of editable PDF documents:

1. Export a blank survey (with empty [data](https://surveyjs.io/Documentation/Library?id=surveymodel#data) property) to a PDF document
2. Send the PDF document to respondents
3. Ask respondents to fill the PDF document (using Adobe Acrobat reader or Edge browser) and send it back
4. Obtain filled data from PDF documents (for instance, automatically using the thrid-party libraries)

Editable PDF documents are implemented via Adobe Acroforms. They contain form fields in which respondents can enter data (type text, check boxes or radiobuttons, and select items from lists).

![SurveyJS PDF Exporter example page 1](https://raw.githubusercontent.com/surveyjs/survey-pdf/master/docs/images/editable-pdf.gif)