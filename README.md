# SurveyJS PDF Export

[![Build Status](https://dev.azure.com/SurveyJS/SurveyJS%20Integration%20Tests/_apis/build/status/SurveyJS%20Library?branchName=master)](https://dev.azure.com/SurveyJS/SurveyJS%20Integration%20Tests/_build/latest?definitionId=7&branchName=master)
<a href="https://github.com/surveyjs/survey-pdf/issues">
<img alt="Issues" title="Open Issues" src="https://img.shields.io/github/issues/surveyjs/survey-pdf.svg">
</a>
<a href="https://github.com/surveyjs/survey-pdf/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aclosed+">
<img alt="Closed issues" title="Closed Issues" src="https://img.shields.io/github/issues-closed/surveyjs/survey-pdf.svg">
</a>

SurveyJS PDF Export is a client-side extension over the [SurveyJS Library](https://github.com/surveyjs/survey-library) that enables users to save surveys as PDF documents.

### Features

- Support for all built-in SurveyJS Library question types
- Export of survey results
- Interactive PDF documents that allow users to fill them
- Automatic page breaks
- Markdown support
- Customizable page format and font
- Header and footer support
- An API to save a PDF document on the user's computer or get raw PDF content

## Get Started

- [Angular](https://surveyjs.io/Documentation/Pdf-Export?id=get-started-angular)
- [Vue](https://surveyjs.io/Documentation/Pdf-Export?id=get-started-vue)
- [React](https://surveyjs.io/Documentation/Pdf-Export?id=get-started-react)
- [Knockout](https://surveyjs.io/Documentation/Pdf-Export?id=get-started-knockout)
- [jQuery](https://surveyjs.io/Documentation/Pdf-Export?id=get-started-jquery)

## Resources

- [Website](https://surveyjs.io/)
- [Documentation](https://surveyjs.io/Documentation/Pdf-Export)
- [Live Examples](https://surveyjs.io/Examples/Pdf-Export)
- [What's New](https://surveyjs.io/WhatsNew)

## Build SurveyJS PDF Export from Sources

1. **Clone the repo**

    ```
    git clone https://github.com/surveyjs/survey-pdf.git
    cd survey-pdf
    ```

1. **Install dependencies**          
Make sure that you have Node.js v6.0.0 or later and npm v2.7.0 or later installed.

    ```
    npm install
    ```

1. **Build the library**

    ```
    npm run build_prod
    ```

    You can find the built scripts and style sheets in the `survey-pdf` folder under the `packages` directory.

1. **Run test examples**

    ```
    npm start
    ```

    This command runs a local HTTP server at http://localhost:7777/.

1. **Run unit tests**

    ```
    npm test
    ```

## Licensing

SurveyJS PDF Export is **not available for free commercial usage**. If you want to integrate it into your application, you must purchase a [commercial license](/Licenses#SurveyCreator).
