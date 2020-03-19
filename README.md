## PDF Export for SurveyJS

SurveyJS PDF exporter library is easy way to render [SurveyJS Library](https://surveyjs.io/Overview/Library/) surveys to PDF which can be emailed or printed

### Features

- Render all SurveyJS questions (textboxes, checkboxes, dropdowns, etc.) with results
- Support of SurveyJS widgets and your own custom adorners
- Generate PDF interactive forms which can be filled inside the PDF document
- Automatic splitting into separate pages without cuts inside the questions
- Customizable font and sizes of page and markdown text
- Ability to draw header and footer with logo and company information
- API to save PDF on disk or get PDF file via raw string

### Screenshots

![SurveyJS PDF Exporter example page 1](https://github.com/surveyjs/surveyjs/blob/master/docs/images/survey-pdf-page-1.png?raw=true)
![SurveyJS PDF Exporter example page 2](https://github.com/surveyjs/surveyjs/blob/master/docs/images/survey-pdf-page-2.png?raw=true)

### Usage (modern ES, modules)

```javascript
import * as SurveyPDF from "survey-pdf";
```

### Usage (ES5, scripts)

Add these scripts to your web page

```html
<!-- jsPDF library -->
<script src="https://unpkg.com/jspdf@latest/dist/jspdf.min.js"></script>
<!-- SurveyJS Core library -->
<script src="https://unpkg.com/survey-core@latest/survey.core.min.js"></script>
<!-- SurveyPDF Exporter library -->
<script src="https://unpkg.com/survey-pdf@latest/survey.pdf.min.js"></script>

<!-- Uncomment next line to add html and markdown text support -->
<!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/showdown/1.6.4/showdown.min.js"></script> -->
<!-- Uncomment next line to add IE11 support -->
<!-- <script src="https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.min.js"></script> -->
```

Also you may load any of SurveyJS with framework scripts without loading SurveyJS Core. Look at simple package dependency diagram

<img src="https://github.com/surveyjs/surveyjs/blob/master/docs/images/package-dependency.png?raw=true" alt="SurveyJS package dependency" width="50%"/>

Example of export SurveyJS library JSON to PDF

```javascript
var options = {
  fontSize: 14,
  margins: {
    left: 10,
    right: 10,
    top: 18,
    bot: 10
  }
};
//json is same as for SurveyJS Library
var surveyPDF = new SurveyPDF.SurveyPDF(json, options);

//uncomment next code to add html and markdown text support
/*var converter = new showdown.Converter();
surveyPDF.onTextMarkdown.add(function(survey, options) {
    var str = converter.makeHtml(options.text);
    str = str.substring(3);
    str = str.substring(0, str.length - 4);
    options.html = str;
});*/

surveyPDF.onRenderHeader.add(function(_, canvas) {
  canvas.drawText({
    text:
      "SurveyJS PDF | Please purchase a SurveyJS PDF developer license to use it in your app | https://surveyjs.io/Buy",
    fontSize: 10
  });
});
surveyPDF.save();
```

### Examples

- [es5 style example](https://surveyjs.io/Examples/Pdf-Export)
- [angular-cli](https://codesandbox.io/s/survey-pdf-angular-example-xpev7)

### Constraints

- No support of dynamic elements (visibleIf, buttons, validators, etc.)
- Implied DPI 72 when set questions width
- Question Text input types supported: text, password, color
- Question Radiogroup not able to set readOnly for separate items
- Question Imagepicker imagefit is always fill
- Question Boolean values only true and false
- Question Html support restricted subset of html markup
- Question File save files via RMB in Chrome only
- Question Panel state is always expanded
- Question Panel Dynamic mode is only list and state default

### License

[Commercial](https://surveyjs.io/Home/Licenses#PdfExport)
