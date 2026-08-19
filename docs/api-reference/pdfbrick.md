---
title: PdfBrick
product: PDF Generator
api-type: class
description: An object that describes a PDF brick&mdash;a simple element with specified content, size, and location.
source: https://surveyjs.io/pdf-generator/documentation/api-reference/pdfbrick
---

# `PdfBrick`

An object that describes a PDF brick&mdash;a simple element with specified content, size, and location. Bricks are fundamental elements used to construct a PDF document.

You can access `PdfBrick` objects within functions that handle `SurveyPDF`'s [`onRenderQuestion`](https://surveyjs.io/pdf-generator/documentation/api-reference/surveypdf#onRenderQuestion), [`onRenderPanel`](https://surveyjs.io/pdf-generator/documentation/api-reference/surveypdf#onRenderPanel), and [`onRenderPage`](https://surveyjs.io/pdf-generator/documentation/api-reference/surveypdf#onRenderPage) events.

[View Demo](https://surveyjs.io/pdf-generator/examples/add-markup-to-customize-pdf-forms/ (linkStyle))

## Properties

### `height`

**Type**: `number`

The brick's height in pixels.

### `width`

**Type**: `number`

The brick's width in pixels.

### `xLeft`

**Type**: `number`

An X-coordinate for the left brick edge.

### `xRight`

**Type**: `number`

An X-coordinate for the right brick edge.

### `yBot`

**Type**: `number`

A Y-coordinate for the bottom brick edge.

### `yTop`

**Type**: `number`

A Y-coordinate for the top brick edge.

## Methods

### `unfold()`

**Return value:** `Array<IPdfBrick>` &ndash; A flat array of nested PDF bricks.

Allows you to get a flat array of nested PDF bricks.
