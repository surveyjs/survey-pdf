---
title: IQuestionFileStyle
product: PDF Generator
api-type: interface
description: Defines the visual style applied to UI elements within File Upload questions in an exported PDF document.
source: https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionfilestyle
---

# `IQuestionFileStyle`

Defines the visual style applied to UI elements within [File Upload](https://surveyjs.io/form-library/documentation/api-reference/file-model) questions in an exported PDF document.

[PDF Appearance Customization - Styles Config](/pdf-generator/documentation/pdf-appearance-customization#styles-config (linkStyle))

Available since: v3.0.0

## Inheritance

[`IQuestionStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionstyle.md) &rarr; `IQuestionFileStyle`

## Properties

### `defaultImageFit`

**Type**: `string`

Specifies how image previews are resized to fit into their container.

 Possible values:

- `"cover"`
- `"fill"`
- `"contain"`

Available since: v3.0.0

### `fileItemMinWidth`

**Type**: `number`

Specifies the minimum width allocated to render a file item (file name and preview), in points.

Available since: v3.0.0

### `fileName`

**Type**: `ITextStyle`

Specifies the visual style applied to file names.

Available since: v3.0.0

### `spacing`

**Type**: `IQuestionFileSpacing`

Specifies spacing values applied to question UI elements.

Available since: v3.0.0
