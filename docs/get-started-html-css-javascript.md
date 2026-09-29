---
title: Save survey form to fillable PDF in a JavaScript app | SurveyJS
description: Export your SurveyJS survey, quiz, or poll to a fillable PDF form in a JavaScript application. A step-by-step guide to help you get started.
---
# Export Survey to PDF in a JavaScript Application

PDF Generator for SurveyJS allows your users to save surveys as interactive PDF documents. This tutorial describes how to add the export functionality to your JavaScript application.

[View Full Code on GitHub](https://github.com/surveyjs/code-examples/tree/main/get-started-pdf/html-css-js (linkStyle))

## Link Resources

PDF Generator for SurveyJS is built upon the <a href="https://github.com/parallax/jsPDF#readme" target="_blank">jsPDF</a> library. Insert links to the jsPDF and SurveyJS PDF Generator scripts within the `<head>` tag on your HTML page. Ensure the base script for all SurveyJS products, `survey-core`, is referenced as well:

```html
<head>
    <!-- jsPDF library -->
    <script src="https://unpkg.com/jspdf/dist/jspdf.umd.min.js"></script>

    <!-- `survey-core` -->
    <script src="https://unpkg.com/survey-core/survey.core.min.js"></script>

    <!-- SurveyJS PDF Generator library -->
    <script src="https://unpkg.com/survey-pdf/survey.pdf.min.js"></script>
    <!-- ... -->
</head>
```

## Export a Survey

To export a survey, you need to create a `SurveyPDF` instance. Its constructor accepts two parameters: a [survey JSON schema](/Documentation/Library?id=design-survey-create-a-simple-survey#define-a-static-survey-model-in-json) and optional [PDF document settings](/pdf-generator/documentation/api-reference/idocoptions).

To save a PDF document with the exported survey, call the [`save(fileName)`](/Documentation/Pdf-Export?id=surveypdf#save) method on the `SurveyPDF` instance. If you omit the `fileName` parameter, the document uses the default name (`"survey_result"`).

The code below implements a `savePdf` helper function that instantiates `SurveyPDF`, assigns survey data (user responses) to this instance, and calls the `save(fileName)` method. If you want to export the survey without user responses, do not specify the `SurveyPDF`'s `data` property.

```js
const surveyJson = { /* ... */ };

const pdfDocOptions = { /* ... */ };

const savePdf = function (surveyData) {
    const surveyPdf = new SurveyPDF.SurveyPDF(surveyJson, pdfDocOptions);
    surveyPdf.data = surveyData;
    surveyPdf.save();
};
```

The following image illustrates a generated PDF form:

<img src="images/nps-pdf-form.png" alt="SurveyJS PDF Generator: NPS PDF form" width="759" height="958">

You can call this helper function from any UI element. The following example adds a custom [navigation button](/Documentation/Library?id=iaction) below the survey and exports the current survey state when users click the button.

```js
const survey = new Survey.Model(surveyJson);

survey.addNavigationItem({
    id: "pdf-export",
    title: "Save as PDF",
    action: () => savePdf(survey.data)
});
```

The following image illustrates the resulting UI:

<img src="images/surveypdf-navigation-button.png" alt="Export Survey to PDF - Save as PDF navigation button" width="772" height="404">

## Customize the PDF Form

If the default appearance of the exported form does not meet your requirements, use the following customization APIs to tailor the generated PDF document:

- [PDF Form Settings](/pdf-generator/documentation/customize-pdf-form-settings)     
Configure page orientation, fonts, compression, read-only mode, and other document-level settings.

- [PDF Appearance Customization](/pdf-generator/documentation/pdf-appearance-customization)      
Customize themes, layouts, and styles.

- [Question Rendering](/pdf-generator/documentation/customize-survey-question-rendering-in-pdf-form)      
Customize the rendering behavior of specific question types.

In this tutorial, the exported PDF form uses the print-optimized Monochrome Light theme:

```html
<head>
    <!-- ... -->
     <script src="https://unpkg.com/survey-core/themes/monochrome-light.min.js"></script>
     <!-- .. -->
</head>
```

```js
const surveyPdf = new SurveyPDF({ /* ... */ });
surveyPdf.applyTheme(SurveyTheme.MonochromeLight);
```

<details>
    <summary>View Full Code</summary>  

```html
<!DOCTYPE html>
<html>
<head>
    <title>Export Survey to PDF - SurveyJS</title>
    <meta charset="utf-8">
    <!-- jsPDF library -->
    <script src="https://unpkg.com/jspdf/dist/jspdf.umd.min.js"></script>

    <link href="https://unpkg.com/survey-core/survey-core.min.css" rel="stylesheet">
    <script src="https://unpkg.com/survey-core/survey.core.min.js"></script>
    <script src="https://unpkg.com/survey-js-ui/survey-js-ui.min.js"></script>
    <script src="https://unpkg.com/survey-core/themes/monochrome-light.min.js"></script>


    <!-- SurveyJS PDF Generator library -->
    <script src="https://unpkg.com/survey-pdf/survey.pdf.min.js"></script>
    
    <script src="index.js"></script>
</head>
<body>
    <div id="surveyContainer"></div>
</body>
</html>
```

```js
const surveyJson = {
  "title": "NPS Survey Question",
  "description": "NPS (net promoter score) is a metric used to evaluate customer loyalty and business growth opportunities. To measure NPS, respondents should rate on a scale of 0 to 10 how likely they would recommend your product or service to a friend or colleague.",
  "pages": [
    {
      "name": "page1",
      "elements": [
        {
          "type": "rating",
          "name": "nps-score",
          "title": "On a scale from 0 to 10, how likely are you to recommend us to a friend or colleague?",
          "rateMin": 0,
          "rateMax": 10
        },
        {
          "type": "comment",
          "name": "disappointing-experience",
          "title": "If your score is 0 to 5, how did we disappoint you and what can we do to improve?",
          "maxLength": 300
        },
        {
          "type": "comment",
          "name": "improvements-required",
          "title": "If your score is 6 or higher, what can we do to improve your experience?",
          "maxLength": 300
        },
        {
          "type": "checkbox",
          "name": "promoter-features",
          "title": "If your score is 9 or 10, which features do you value most?",
          "description": "Select up to three features, if applicable.",
          "choices": [
            {
              "value": "performance",
              "text": "Performance"
            },
            {
              "value": "stability",
              "text": "Stability"
            },
            {
              "value": "ui",
              "text": "User interface"
            },
            {
              "value": "complete-functionality",
              "text": "Complete functionality"
            },
            {
              "value": "learning-materials",
              "text": "Learning materials"
            },
            {
              "value": "support",
              "text": "Support quality"
            }
          ],
          "showOtherItem": true,
          "otherText": "Other",
          "colCount": 2,
          "maxSelectedChoices": 3
        }
      ]
    },
    {
      "name": "page2",
      "elements": [
        {
          "type": "boolean",
          "name": "rebuy",
          "title": "Would you buy our product again?"
        }
      ]
    },
    {
      "name": "page3",
      "elements": [
        {
          "type": "boolean",
          "name": "testimonial",
          "title": "Would you be willing to provide a short testimonial?"
        },
        {
          "type": "text",
          "name": "email",
          "title": "If yes, enter your email address",
          "inputType": "email"
        }
      ]
    }
  ],
  "questionsOnPageMode": "singlePage"
};

const survey = new Survey.Model(surveyJson);

const pdfDocOptions = { };

const savePdf = function (surveyData) {
    const surveyPdf = new SurveyPDF.SurveyPDF(surveyJson, pdfDocOptions);
    surveyPdf.data = surveyData;
    surveyPdf.applyTheme(SurveyTheme.MonochromeLight);
    surveyPdf.save();
};

survey.addNavigationItem({
    id: "pdf-export",
    title: "Save as PDF",
    action: () => savePdf(survey.data)
});

document.addEventListener("DOMContentLoaded", function() {
    survey.render(document.getElementById("surveyContainer"));
});
```
</details>

[View Full Code on GitHub](https://github.com/surveyjs/code-examples/tree/main/get-started-pdf/html-css-js (linkStyle))

## Activate a SurveyJS License

SurveyJS PDF Generator is not available for free commercial use. To integrate it into your application, you must purchase a [commercial license](https://surveyjs.io/licensing) for the software developer(s) who will be working with the PDF Generator APIs and implementing the integration. If you use SurveyJS PDF Generator without a license, an alert banner will appear at the top of each page in an exported PDF document:

<img src="images/alert-banner-pdf.png" alt="SurveyJS PDF Generator: Alert banner" width="772" height="494">

After purchasing a license, follow the steps below to activate it and remove the alert banner:

1. [Log in](https://surveyjs.io/login) to the SurveyJS website using your email address and password. If you've forgotten your password, [request a reset](https://surveyjs.io/reset-password) and check your inbox for the reset link.
2. Open the following page: [How to Remove the Alert Banner](https://surveyjs.io/remove-alert-banner). You can also access it by clicking **Set up your license key** in the alert banner itself.
3. Follow the instructions on that page.

Once you've completed the setup correctly, the alert banner will no longer appear.

## See Also

- [Fill PDF Form with Web Form Responses](/pdf-generator/documentation/fill-pdf-form-with-web-form-responses)
- [PDF Generator Demos](/pdf-generator/examples/save-completed-forms-as-pdf-files/)