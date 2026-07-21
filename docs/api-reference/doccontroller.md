---
title: DocController
product: PDF Generator
api-type: class
description: The `DocController` object includes an API that allows you to configure main PDF document properties (font, margins, page width and height).
source: https://surveyjs.io/pdf-generator/documentation/api-reference/doccontroller
---

# `DocController`

The `DocController` object includes an API that allows you to configure main PDF document properties (font, margins, page width and height).

[View Demo](https://surveyjs.io/pdf-generator/examples/change-font-in-pdf-form/ (linkStyle))

## Properties

### `paperHeight`

**Type**: `number`

The height of a PDF page in pixels.

### `paperWidth`

**Type**: `number`

The width of a PDF page in pixels.

### `unitHeight`

**Type**: `number`

The heigth of one character in pixels.

### `unitWidth`

**Type**: `number`

The width of one character in pixels.

## Methods

### `addFont()`

Adds a custom font to the PDF Generator.

[View Demo](https://surveyjs.io/pdf-generator/examples/change-font-in-pdf-form/ (linkStyle))

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `fontName` | `string` | A custom name that you will use to apply the custom font. |
| `base64` | `string` | The custom font as a Base64-encoded string. To encode your font to Base64, obtain it as a TTF file and use any TTF-to-Base64 online converter. |
| `fontStyle` | `"normal" \| "bold" \| "italic" \| "bolditalic"` | The style of the custom font: `"normal"`, `"bold"`, `"italic"`, or `"bolditalic"`. |
