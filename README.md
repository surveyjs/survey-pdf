<div align="center">

<img width="1200" height="600" alt="readme_overview_pdf" src="https://github.com/user-attachments/assets/cf909f79-3496-49f8-a885-b286a42c92a5" />
<br>
<br>

[![Build Status](https://dev.azure.com/SurveyJS/V2%20Libraries/_apis/build/status%2Fpdf%2FPDF%20Main?repoName=surveyjs%2Fsurvey-pdf&branchName=master)](https://dev.azure.com/SurveyJS/V2%20Libraries/_build/latest?definitionId=165&repoName=surveyjs%2Fsurvey-pdf&branchName=master)
[![Software License](https://img.shields.io/badge/license-Commercial-blue.svg?style=flat)](https://github.com/surveyjs/survey-pdf/blob/master/LICENSE)
[![Open Issues](https://img.shields.io/github/issues/surveyjs/survey-pdf.svg)](https://github.com/surveyjs/survey-pdf/issues)
[![Closed Issues](https://img.shields.io/github/issues-closed/surveyjs/survey-pdf.svg)](https://github.com/surveyjs/survey-pdf/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aclosed+)

# SurveyJS PDF Generator

</div>

<div align="justify">

`survey-pdf` renders a [SurveyJS Form Library](https://surveyjs.io/form-library) survey definition — with or without collected responses — as a PDF document. It produces either a static printout or an interactive fillable PDF form (AcroForm), driven by the same JSON schema used to render the survey on the web. It is a client-side extension of [`survey-core`](https://www.npmjs.com/package/survey-core) and is built on top of [jsPDF](https://github.com/parallax/jsPDF).

## Installation

```sh
npm install survey-pdf
```

`survey-pdf` also runs in Node.js (for example, to generate PDFs on the server after a form is submitted). See the [Node.js get-started tutorial](https://surveyjs.io/pdf-generator/documentation/get-started-nodejs).

SurveyJS PDF Generator is not free for commercial use — integrating it into an application requires a [commercial license](https://surveyjs.io/licensing). See [Licensing](#licensing).

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

Because `SurveyPDF` extends `SurveyModel` from `survey-core`, all of the survey model's logic — visibility, expressions, localization, value formatting — works unchanged. See [`IDocOptions`](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions) for available page-format, margin, font, and compression settings.

The generated document is an interactive fillable form (AcroForm) by default. To produce a static, non-interactive printout instead, set `readOnly` to `true`:

```js
surveyPdf.readOnly = true;
```

See [Customize PDF Form Settings](https://surveyjs.io/pdf-generator/documentation/customize-pdf-form-settings) for this and other rendering options.

## What's new in v3

- **CSS-based styling.** Colors, typography, spacing, and borders are no longer hard-coded. PDF appearance is derived from the active theme through the same `--sjs2-*` CSS variables used by [`survey-core`](https://www.npmjs.com/package/survey-core), so web and PDF outputs stay visually aligned. Pass an `ITheme` object to `applyTheme()` to reuse a web theme's colors, shadows, and elevation in the PDF. See [PDF Appearance Customization](https://surveyjs.io/pdf-generator/documentation/pdf-appearance-customization) and the [PDF Generator v3 announcement](https://surveyjs.io/stay-updated/major-updates/2025-2026#pdf-generator).
- **Built-in layout presets.** A layout defines the PDF-specific variables — spacing, sizing, typography, border radius. Import `Compact` (the default, optimized for dense forms and reduced page count) or `Spacious` (optimized for readability) from `survey-pdf/layouts` and pass it to `applyLayout()`:

    ```js
    import { Spacious } from "survey-pdf/layouts";

    surveyPdf.applyLayout(Spacious);
    ```

- **Fine-grained styles config.** Adjust individual elements of the document — titles, question containers, input fields, labels, panels, matrices — including colors, font size, font style, line height, padding, borders, and spacing, without rendering hacks or event handlers.
- **Better handling of complex layouts.** Matrices, composite question types, and dense structures translate more cleanly to PDF.
- **Populate existing PDF forms with survey data.** The `pdf-form-filler` sub-entry maps SurveyJS responses onto fields of an existing editable PDF, preserving the original document's design. See [Fill a PDF Form with Web Form Responses](https://surveyjs.io/pdf-generator/documentation/fill-pdf-form-with-web-form-responses).

## Related packages

| Package | Purpose |
| --- | --- |
| [`survey-core`](https://www.npmjs.com/package/survey-core) | Platform-independent survey model (peer dependency) |
| [`survey-react-ui`](https://www.npmjs.com/package/survey-react-ui) | React renderer for the web form |
| [`survey-angular-ui`](https://www.npmjs.com/package/survey-angular-ui) | Angular renderer for the web form |
| [`survey-vue3-ui`](https://www.npmjs.com/package/survey-vue3-ui) | Vue 3 renderer for the web form |
| [`survey-js-ui`](https://www.npmjs.com/package/survey-js-ui) | HTML/CSS/JavaScript renderer for the web form |

## Documentation

- [Website](https://surveyjs.io/pdf-generator)
- [Documentation](https://surveyjs.io/pdf-generator/documentation/overview)
- [Get Started — Angular](https://surveyjs.io/pdf-generator/documentation/get-started-angular)
- [Get Started — React](https://surveyjs.io/pdf-generator/documentation/get-started-react)
- [Get Started — Vue](https://surveyjs.io/pdf-generator/documentation/get-started-vue)
- [Get Started — HTML/CSS/JavaScript](https://surveyjs.io/pdf-generator/documentation/get-started-html-css-javascript)
- [Get Started — Node.js](https://surveyjs.io/pdf-generator/documentation/get-started-nodejs)
- [Live Examples](https://surveyjs.io/pdf-generator/examples/)
- [What's New](https://surveyjs.io/WhatsNew)

For AI coding agents: [https://surveyjs.io/llms.txt](https://surveyjs.io/llms.txt) indexes the documentation. Any documentation page is also available as raw Markdown — append `.md` to its URL, for example [https://surveyjs.io/pdf-generator/documentation/get-started-html-css-javascript.md](https://surveyjs.io/pdf-generator/documentation/get-started-html-css-javascript.md).

## SurveyJS ecosystem

| Product | Purpose | License |
| --- | --- | --- |
| [Form Library](https://surveyjs.io/form-library) | Render dynamic forms from JSON | MIT |
| [Survey Creator](https://surveyjs.io/survey-creator) | Drag-and-drop form builder UI | Commercial |
| [Dashboard](https://surveyjs.io/dashboard) | Visualize and analyze collected results | Commercial |
| [PDF Generator](https://surveyjs.io/pdf-generator) | Render forms and responses as PDF (this package) | Commercial |
| [AI Form Response Extractor](https://surveyjs.io/documentation/combine-paper-and-online-survey-form-data) | Extract responses from paper forms, PDFs, and images into a SurveyJS schema (`ai-form-response-extractor`) | MIT |

## Build from sources

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

SurveyJS PDF Generator is **not available for free commercial usage**. If you want to integrate it into your application, you must purchase a [commercial license](https://surveyjs.io/licensing) for software developer(s) who will be working with the SurveyJS product's APIs and implementing their integration.
