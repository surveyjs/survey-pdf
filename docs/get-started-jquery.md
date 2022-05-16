# Export Survey to PDF in a jQuery Application

PDF Export for SurveyJS allows your end users to save surveys as interactive PDF documents. This tutorial describes how to add the export functionality to your jQuery application.

- [Link Resources](#link-resources)
- [Configure Export Properties](#configure-export-properties)
- [Export a Survey](#export-a-survey)

You can find the full code for this tutorial in the following GitHub repository: <a href="https://github.com/surveyjs/code-examples/tree/main/get-started-pdf/jquery" target="blank">Export Survey to PDF (SurveyJS for jQuery)</a>.

## Link Resources

PDF Export for SurveyJS is built upon the <a href="https://github.com/parallax/jsPDF#readme" target="_blank">jsPDF</a> library. Insert links to the jsPDF and SurveyJS PDF Export scripts within the `<head>` tag on your HTML page _after_ the jQuery link:

```html
<head>
    <!-- ... -->
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

    <!-- jsPDF library -->
    <script src="https://unpkg.com/jspdf@latest/dist/jspdf.umd.min.js"></script>

    <!-- SurveyJS PDF Export library -->
    <script src="https://unpkg.com/survey-pdf/survey.pdf.min.js"></script>
    <!-- ... -->
</head>
```

## Configure Export Properties

Export properties allow you to customize the page format, orientation, margins, font, and other parameters. Refer to the [`IDocOptions`](/Documentation/Pdf-Export?id=idocoptions) interface for a full list of properties. The following code changes the [`fontSize`](/Documentation/Pdf-Export?id=idocoptions#fontSize) property:

```js
const exportToPdfOptions = {
    fontSize: 12
};
```

## Export a Survey

To export a survey, you need to create a `SurveyPDF` instance. Its constructor accepts two parameters: a [survey JSON definition](/Documentation/Library?id=design-survey-create-a-simple-survey#define-a-static-survey-model-in-json) and [export properties](#configure-export-properties). To save a PDF document with the exported survey, call the [`save(fileName)`](/Documentation/Pdf-Export?id=surveypdf#save) method on the `SurveyPDF` instance. If you omit the `fileName` parameter, the document uses the default name (`"survey_result"`).

The code below implements a `savePdf` helper function that instantiates `SurveyPDF`, assigns survey data (user responses) to it, and calls the `save(fileName)` method. If you want to export the survey without the user responses, do not specify the `SurveyPDF`'s `data` property.

```js
const surveyJson = { /* ... */ };

const exportToPdfOptions = { /* ... */ };

const savePdf = function (surveyData) {
    const surveyPdf = new SurveyPDF.SurveyPDF(surveyJson, exportToPdfOptions);
    surveyPdf.data = surveyData;
    surveyPdf.save();
};
```

You can use any UI element to call this helper function. For instance, the following code adds a new [navigation button](/Documentation/Library?id=iaction) below the survey and calls the function when a user clicks this button:

```js
const survey = new Survey.Model(surveyJson);

survey.addNavigationItem({
    id: "pdf-export",
    title: "Save as PDF",
    action: () => savePdf(survey.data)
});
```

The following image illustrates the resulting UI in the [Modern theme](/Documentation/Library?id=get-started-jquery#link-surveyjs-resources):

![Export Survey to PDF - Save as PDF navigation button](images/surveypdf-navigation-button.png)

<details>
    <summary>View full code</summary>  

```html
<!DOCTYPE html>
<html>
<head>
    <title>Export Survey to PDF - SurveyJS for jQuery</title>
    <meta charset="utf-8">
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

    <!-- jsPDF library -->
    <script src="https://unpkg.com/jspdf@latest/dist/jspdf.umd.min.js"></script>

    <link href="https://unpkg.com/survey-jquery/modern.min.css" type="text/css" rel="stylesheet">
    <script type="text/javascript" src="https://unpkg.com/survey-jquery/survey.jquery.min.js"></script>

    <!-- SurveyJS PDF Export library -->
    <script src="https://unpkg.com/survey-pdf/survey.pdf.min.js"></script>
    
    <script type="text/javascript" src="index.js"></script>
</head>
<body>
    <div id="surveyContainer"></div>
</body>
</html>
```

```js
Survey.StylesManager.applyTheme("modern");

const surveyJson = {
    // ...
};

const survey = new Survey.Model(surveyJson);

const exportToPdfOptions = {
    fontSize: 12
};

const savePdf = function (surveyData) {
    const surveyPdf = new SurveyPDF.SurveyPDF(surveyJson, exportToPdfOptions);
    surveyPdf.data = surveyData;
    surveyPdf.save();
};

survey.addNavigationItem({
    id: "pdf-export",
    title: "Save as PDF",
    action: () => savePdf(survey.data)
});

$(function() {
    $("#surveyContainer").Survey({ model: survey });
});
```
</details>

<a href="https://github.com/surveyjs/code-examples/tree/main/get-started-pdf/jquery" target="blank">View full code on GitHub</a>

## Further Reading

- [Customization Options](/Documentation/Pdf-Export?id=Customization-Options)
- [Export HTML to PDF](/Documentation/Pdf-Export?id=HtmlToPdf)
- [Export Matrix Questions to PDF](/Documentation/Pdf-Export?id=MatrixToPdf)