# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

This is **SurveyJS PDF Generator** (`survey-pdf`) — it renders a SurveyJS survey definition (optionally pre-filled with data) into a PDF document, either as a static printout or as an interactive fillable PDF form. It is built on **jsPDF**.

## Repository layout

A **single package** (not a monorepo). Source under `src/`, build output to `build/`.

- `src/` — all TypeScript.
- `src/entries/` — bundle entry points: `pdf.ts` / `pdf-base.ts` / `pdf-node.ts` (the core generator, browser vs Node image handling) and `forms.ts` / `forms-node.ts` (the interactive-forms add-on).
- `tests/` — Vitest tests. `flat_*.test.ts` cover the static-layout renderers; `acro_*.test.ts` cover the interactive AcroForm field renderers; `event_*` and `controller.test.ts` cover events and the doc controller.
- `examples/`, `docs/`, embeddable fonts under the build.

### Dependency on survey-core — note the difference

Unlike survey-creator and survey-analytics, `package.json` declares `"survey-core": "latest"` — survey-pdf consumes the **published npm package**, *not* the local `survey-library/build`. So this repo is self-contained: you do **not** need to build survey-library first, and local survey-core changes won't show up here unless you manually link/install them. Other key runtime deps: **jspdf** (the PDF engine), `node-fetch` + `image-size` (image loading), `node-interval-tree` (layout packing).

## Build

```bash
npm run build          # main bundle (rollup), emits minified + non-source files
npm run build:fonts    # the embeddable fonts bundle (rollup.fonts.config.mjs)
npm run build:forms    # the interactive-forms bundle (rollup.forms.config.mjs)
npm run build:all      # build + build:fonts + build:forms
npm run watch:dev      # rollup -w
```

`fonts.ts` holds base64 font data and is built/served separately (and excluded from coverage). `jspdf_plugins/` contains jsPDF extensions applied at load time.

## Lint

```bash
npm run lint           # eslint ./src --quiet
```

The husky `pre-push` hook runs `npm run pre-push-check` = **lint + build + test** (note: stricter than the sibling repos — a push runs the whole build and test suite).

## Tests

Vitest, jsdom environment. **PDF output is verified by snapshotting the computed layout** (brick rectangles / text) rather than pixel-diffing rendered pages — see `helper_test.ts` (`TestHelper`, `SurveyPDFTester`).

```bash
npm run test                    # vitest run --coverage
npm run test:watch              # vitest --no-isolate
npm run test:update-snapshots   # regenerate snapshots (vitest --mode update-snapshots)
npx vitest run tests/<file>.test.ts
npx vitest run -t "test name"
```

`vitest.config.ts` sets `oxc`/`useDefineForClassFields: false` options — worth keeping unless you know what you're changing: the file comments explain that without them a subclass field re-declaration (e.g. `protected question` in `FlatHTML`) clobbers the value set by the base constructor and breaks tests. `vitest-global-setup.ts` is the global setup.

## Architecture

The rendering pipeline is three stages: **model → flats (layout) → bricks (drawing)**.

### Entry model: `SurveyPDF`
`src/survey.ts` defines `SurveyPDF extends SurveyModel` (from survey-core). You construct it with the same survey JSON (and optional `data`), then call its save/raw methods to produce the PDF. Because it *is* a `SurveyModel`, all survey-core logic (visibility, expressions, localization, value formatting) works unchanged — survey-pdf only adds the rendering.

### `DocController` — the jsPDF wrapper
`src/doc_controller.ts` defines `IDocOptions` / `DocOptions` (page format, orientation, margins, fonts, font size, compression) and `DocController extends DocOptions`, which owns the live jsPDF document, the current drawing coordinates, the available render area, and font measurement. Everything that draws goes through the controller. `IPoint`/`IRect`/`ISize`/`IMargin` geometry helpers live here too.

### Flat layout: question type → renderer (`FlatRepository`)
`src/flat_layout/` turns each question into positioned content. `FlatRepository` (`flat_repository.ts`) is the singleton registry: renderers register with `FlatRepository.register(questionType, FlatConstructor)`. `FlatQuestion` (`flat_question.ts`, implements `IFlatQuestion`) is the base; there is one `flat_*.ts` per question type (`flat_checkbox.ts`, `flat_matrix.ts`, `flat_paneldynamic.ts`, …), plus `flat_survey.ts` for the whole survey and `flat_default.ts` as fallback. A flat renderer's job is to **compute bricks** for its question. To support a new question type, add a `Flat*` class and register it here.

### Bricks: the drawable units (`IPdfBrick` / `pdf_render/`)
A "brick" is a rectangle that knows how to draw itself into the jsPDF doc. `src/pdf_render/pdf_brick.ts` defines `IPdfBrick extends IRect, ISize` and the `PdfBrick` base class (it carries its bounding box and a `render()`). Concrete bricks in `pdf_render/` cover primitives: `pdf_text.ts`, `pdf_textfield.ts`, `pdf_checkitem.ts`, `pdf_radioitem.ts`, `pdf_image.ts`, `pdf_link.ts`, `pdf_html.ts`, `pdf_composite.ts` (groups bricks), `pdf_rowline.ts`, etc. Flats produce bricks; bricks render pixels.

### Page packing
`src/page_layout/page_packer.ts` arranges the produced bricks into pages — splitting content across page breaks and honoring margins/keep-together rules (uses the interval-tree for overlap/placement).

### Events & adorners
`src/event_handler/` (`event_handler.ts`, `adorners.ts`, `draw_canvas.ts`) implements the `onRender*` hooks (header/footer, per-question, watermarks) that let callers draw custom content on top of the generated layout.

### Interactive forms (`src/pdf_forms/`)
The `forms` entry adds fillable **AcroForm** PDFs: `PDFFormFiller` (`forms.ts`) plus pluggable engine adapters (`adapters/pdf-lib`, `adapters/pdfjs`). This is what the `acro_*.test.ts` suite exercises — questions rendered as real interactive PDF form fields rather than static text.
