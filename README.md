<div align="center">

<img width="1200" height="600" alt="readme_overview_pdf" src="https://github.com/user-attachments/assets/cf909f79-3496-49f8-a885-b286a42c92a5" />
<br>
<br>

[![Build Status](https://dev.azure.com/SurveyJS/V2%20Libraries/_apis/build/status%2Fpdf%2FPDF%20Main?repoName=surveyjs%2Fsurvey-pdf&branchName=master)](https://dev.azure.com/SurveyJS/V2%20Libraries/_build/latest?definitionId=165&repoName=surveyjs%2Fsurvey-pdf&branchName=master)
[![Software License](https://img.shields.io/badge/license-Commercial-blue.svg?style=flat)](https://github.com/surveyjs/survey-pdf/blob/master/LICENSE)
[![Open Issues](https://img.shields.io/github/issues/surveyjs/survey-pdf.svg)](https://github.com/surveyjs/survey-pdf/issues)
[![Closed Issues](https://img.shields.io/github/issues-closed/surveyjs/survey-pdf.svg)](https://github.com/surveyjs/survey-pdf/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aclosed+)

# SurveyJS PDF Generator: JavaScript Library for PDF Forms

</div>

<div align="justify">

SurveyJS PDF Generator is a JavaScript library that renders SurveyJS forms and collected responses as PDF documents. Generate editable PDF forms (AcroForm) for offline completion, export completed forms as read-only PDFs, or create printable copies of blank forms using the same JSON form definition you use on the web.

The `survey-pdf` package extends [`survey-core`](https://github.com/surveyjs/survey-library/tree/master/packages/survey-core) and is built on top of [jsPDF](https://github.com/parallax/jsPDF). It supports React, Angular, Vue, and plain JavaScript applications. PDF files can be generated entirely in the browser or on a Node.js server without sending form definitions or response data to SurveyJS.

<br>
<p align="center">
    <a href="https://surveyjs.io/pdf-generator/documentation/overview">Documentation</a>
    ·
    <a href="https://surveyjs.io/find-surveyjs-guides-for-my-stack">Setup Guides for My Stack</a>
    ·
    <a href="https://surveyjs.io/pdf-generator/examples/">PDF Generator Demos</a>
    ·
    <a href="https://surveyjs.io/pdf-generator/documentation/pdf-appearance-customization">PDF Customization</a>
    ·
    <a href="https://surveyjs.io/licensing">Licensing</a>
    ·
    <a href="https://github.com/surveyjs/survey-pdf/issues/new">Report a Bug</a>
  </p>
<br>

## How It Works

SurveyJS PDF Generator uses the same JSON form definition as [SurveyJS Form Library](https://github.com/surveyjs/survey-library). You can generate a PDF from a blank form definition or populate it with collected response data before export.

Your application can:

1. Create a SurveyJS JSON form definition with [SurveyJS Survey Creator](https://github.com/surveyjs/survey-creator), AI, or manually.
2. Render the form on the web with [SurveyJS Form Library](https://github.com/surveyjs/survey-library).
3. Pass the same JSON definition to PDF Generator (this package).
4. Optionally add collected response data.
5. Generate an editable PDF form or a read-only PDF document.
6. Download the PDF in the browser or generate it on a Node.js server.

Because the web form and PDF share the same SurveyJS definition, form structure, conditional visibility, expressions, localization, and value formatting can remain consistent across both outputs.

## Installation

```sh
npm install survey-pdf
```

`survey-pdf` also runs in Node.js (for example, to generate PDFs on the server after a form is submitted). See the [Create PDF Forms in Node.js](https://surveyjs.io/pdf-generator/documentation/get-started-nodejs) guide.

## Usage

Create a `SurveyPDF` instance from the same JSON you feed to the SurveyJS Form Library, optionally assign collected responses to `data`, and call `save()`:

```js
import { SurveyPDF } from "survey-pdf";

const surveyJson = {
    elements: [
        { name: "firstName", title: "Enter your first name:", type: "text" },
        { name: "satisfaction", title: "How satisfied are you?", type: "rating" }
    ]
};

const pdfDocOptions = {
    fontSize: 12
};

const surveyPdf = new SurveyPDF(surveyJson, pdfDocOptions);
surveyPdf.data = { firstName: "Jane", satisfaction: 5 };
surveyPdf.save("survey-response.pdf");
```

Because `SurveyPDF` extends `SurveyModel` from `survey-core`, all of the survey model's logic&mdash;visibility, expressions, localization, value formatting&mdash;works unchanged. See [`IDocOptions`](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions) for available page-format, margin, font, and compression settings.

The generated document is an interactive fillable form (AcroForm) by default. To produce a static, non-interactive printout instead, set `readOnly` to `true`:

```js
surveyPdf.readOnly = true;
```

See [Customize PDF Form Settings](https://surveyjs.io/pdf-generator/documentation/customize-pdf-form-settings) for this and other rendering options.

## Related Packages

| Package | Purpose |
| --- | --- |
| [`survey-core`](https://www.npmjs.com/package/survey-core) | Platform-independent survey model (peer dependency) |
| [`survey-react-ui`](https://www.npmjs.com/package/survey-react-ui) | React renderer for the web form |
| [`survey-angular-ui`](https://www.npmjs.com/package/survey-angular-ui) | Angular renderer for the web form |
| [`survey-vue3-ui`](https://www.npmjs.com/package/survey-vue3-ui) | Vue 3 renderer for the web form |
| [`survey-js-ui`](https://www.npmjs.com/package/survey-js-ui) | HTML/CSS/JavaScript renderer for the web form |

## Get Started

- [React](https://surveyjs.io/pdf-generator/documentation/get-started-react)
- [Angular](https://surveyjs.io/pdf-generator/documentation/get-started-angular)
- [Vue](https://surveyjs.io/pdf-generator/documentation/get-started-vue)
- [HTML/CSS/JavaScript](https://surveyjs.io/pdf-generator/documentation/get-started-html-css-javascript)
- [Node.js](https://surveyjs.io/pdf-generator/documentation/get-started-nodejs)

## Key Features

### PDF Generation and Export

- Generate PDFs from SurveyJS JSON form definitions
- Export blank or completed forms
- Generate editable AcroForm PDFs or read-only documents
- Generate PDFs in the browser or Node.js
- Convert output to Blob, Base64, etc.

### PDF Appearance and Layout

The appearance of generated PDF forms is customized through shared themes, layout presets, and styles config API.

#### Themes

Colors, shadows, and other theme-level appearance values can be inherited from the active SurveyJS theme through the same `--sjs2-*` design tokens used by [`survey-core`](https://github.com/surveyjs/survey-library/tree/master/packages/survey-core), which helps keep web forms and generated PDFs visually aligned. 

Pass an `ITheme` object to `applyTheme()` to reuse a web theme's colors, shadows, and elevation in the PDF. See [PDF Appearance Customization](https://surveyjs.io/pdf-generator/documentation/pdf-appearance-customization) and the [PDF Generator v3 announcement](https://surveyjs.io/stay-updated/major-updates/2025-2026#pdf-generator).

#### Layout Presets

Control PDF-specific variables&mdash;spacing, sizing, typography, border radius. Import `Compact` (the default, optimized for dense forms and reduced page count) or `Spacious` (optimized for readability) from `survey-pdf/layouts` and pass it to `applyLayout()`:

    ```js
    import { Spacious } from "survey-pdf/layouts";

    surveyPdf.applyLayout(Spacious);
    ```
#### Styles Config API

Adjust individual elements of the form&mdash;titles, question containers, input fields, labels, panels, matrices&mdash;including colors, font size, font style, line height, padding, borders, and spacing, without rendering hacks or event handlers.

### PDF Form Filler

Collect responses online with SurveyJS Form Library and then use `pdf-form-filler` to populate existing PDF forms with response data. Unlike `SurveyPDF`, which generates a new PDF from a SurveyJS form definition, `pdf-form-filler` writes collected SurveyJS responses into fields in an existing PDF template. See the [Fill a PDF Form with Web Form Responses](https://surveyjs.io/pdf-generator/documentation/fill-pdf-form-with-web-form-responses) guide to learn more.

## Documentation

- [Website](https://surveyjs.io/)
- [Documentation](https://surveyjs.io/pdf-generator/documentation/overview)
- [PDF Generator Demos](https://surveyjs.io/pdf-generator/examples/)
- [Release Notes](https://surveyjs.io/stay-updated/release-notes)
- [Roadmap](https://surveyjs.io/stay-updated/roadmap)
- [What's New](https://surveyjs.io/stay-updated/major-updates/2025-2026)

For AI coding agents: [https://surveyjs.io/llms.txt](https://surveyjs.io/llms.txt) indexes the documentation. Any documentation page is also available as raw Markdown — append `.md` to its URL, for example [https://surveyjs.io/pdf-generator/documentation/get-started-html-css-javascript.md](https://surveyjs.io/pdf-generator/documentation/get-started-html-css-javascript.md).

## SurveyJS Product Family

| Product | Purpose | License |
| --- | --- | --- |
| [Form Library](https://surveyjs.io/form-library) | Render dynamic forms from JSON | MIT |
| [Survey Creator](https://surveyjs.io/survey-creator) | Drag-and-drop form builder UI | Commercial |
| [Dashboard](https://surveyjs.io/dashboard) | Visualize and analyze collected results | Commercial |
| [PDF Generator](https://surveyjs.io/pdf-generator) | Generate editable and read-only PDFs from SurveyJS forms and responses (this package) | Commercial |
| [AI Form Response Extractor](https://surveyjs.io/documentation/combine-paper-and-online-survey-form-data) | Extract responses from paper forms, PDFs, and images into a SurveyJS schema (`ai-form-response-extractor`) | MIT |

## Build from Source

Requires Node.js 20 or later.

1. **Clone the repo**

    ```sh
    git clone https://github.com/surveyjs/survey-pdf.git
    cd survey-pdf
    ```

2. **Install dependencies**

    ```sh
    npm install
    ```

    `survey-pdf` depends on `survey-core`. The `dependencies` entry in `package.json` points to `../survey-library/packages/survey-core/build`, so if you build against a local `survey-library` checkout, build `survey-core` first (see [`survey-core` build instructions](https://github.com/surveyjs/survey-library/blob/master/packages/survey-core/README.md#build-from-sources)). Otherwise, replace that entry with a published `survey-core` version before running `npm install`.

3. **Build the library**

    ```sh
    npm run build:all
    ```

    Build output goes to the `build` directory. `npm run build` produces the main bundle; `npm run build:all` also builds the embeddable fonts bundle, the interactive-forms (`pdf-form-filler`) bundle, and the layout presets. Use `npm run watch:dev` while developing.

4. **Run the local examples**

    ```sh
    npm run serve
    ```

    This serves the package directory at http://localhost:7777/. The examples load the bundles from `build`, so run `npm run build:all` (step 3) first — `npm start` only rebuilds the main bundle, which leaves the form-filler examples without `build/pdf-form-filler.js`.

    The [`examples`](examples) folder contains runnable pages: [`examples/jspdf`](examples/jspdf) generates a PDF from a survey definition, while [`examples/forms/pdf-lib`](examples/forms/pdf-lib) and [`examples/forms/pdfjs`](examples/forms/pdfjs) fill an existing PDF with survey responses through the `pdf-lib` and PDF.js adapters.

5. **Run unit tests**

    Unit tests use [Vitest](https://vitest.dev/) in a jsdom environment. PDF output is verified by snapshotting the computed layout — see `src/helper_test.ts`.

    ```sh
    npm run test                    # whole suite
    npm run test:watch              # watch mode
    npm run test:update-snapshots   # regenerate snapshots
    npx vitest run tests/flat_checkbox.test.ts   # a single file
    npx vitest run -t "test name"                # tests matching a substring
    ```

## Licensing

SurveyJS PDF Generator requires a [commercial license](https://surveyjs.io/licensing) for each software developer who works with the SurveyJS APIs or implements the integration.
