---
title: DrawCanvas
product: PDF Generator
api-type: class
description: An object that describes a drawing area and enables you to draw an image or a piece of text within the area.
source: https://surveyjs.io/pdf-generator/documentation/api-reference/drawcanvas
---

# `DrawCanvas`

An object that describes a drawing area and enables you to draw an image or a piece of text within the area. You can access this object within functions that handle `SurveyPDF`'s [`onRenderHeader`](https://surveyjs.io/pdf-generator/documentation/api-reference/surveypdf#onRenderHeader) and [`onRenderFooter`](https://surveyjs.io/pdf-generator/documentation/api-reference/surveypdf#onRenderFooter) events.

[View Demo](https://surveyjs.io/pdf-generator/examples/customize-header-and-footer-of-pdf-form/ (linkStyle))

## Properties

### `pageCount`

**Type**: `number`

A total number of pages in the document.

### `pageNumber`

**Type**: `number`

The number of the page that contains the drawing area. Enumeration starts with 1.

### `rect`

**Type**: `IRect`

An object with coordinates of a rectangle that limits the drawing area. This object contain the following fields: `xLeft`, `xRight`, `yTop`, `yBot`.

## Methods

### `drawImage()`

**Return value:** `Promise<void><any>`

Draws an image within the drawing area.

[View Demo](https://surveyjs.io/pdf-generator/examples/customize-header-and-footer-of-pdf-form/ (linkStyle))

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `imageOptions` | `IDrawImageOptions` | An [`IDrawImageOptions`](https://surveyjs.io/pdf-generator/documentation/api-reference/idrawimageoptions) object that configures drawing. |

### `drawText()`

Draws a piece of text within the drawing area.

[View Demo](https://surveyjs.io/pdf-generator/examples/customize-header-and-footer-of-pdf-form/ (linkStyle))

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `textOptions` | `IDrawTextOptions` | An [`IDrawTextOptions`](https://surveyjs.io/pdf-generator/documentation/api-reference/idrawtextoptions) object that configures the drawing. |
