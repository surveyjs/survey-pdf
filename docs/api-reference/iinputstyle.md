---
title: IInputStyle
product: PDF Generator
api-type: interface
description: Defines the visual style applied to an input element in an exported PDF document.
source: https://surveyjs.io/pdf-generator/documentation/api-reference/iinputstyle
---

# `IInputStyle`

Defines the visual style applied to an input element in an exported PDF document.

Available since: v3.0.0

## Inheritance

[`ITextStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/itextstyle.md) &rarr; [`IBorderStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/iborderstyle.md) &rarr; `IInputStyle`

## Properties

### `backgroundColor`

**Type**: `string`

Specifies the background color of the input element.

Supported formats:

- Hexadecimal color values with an optional alpha channel (for example, `"#ff0000"`, `"#0000FF80"`)
- RGB and RGBA functional notation (for example, `"rgb(255, 0, 0)"`, `"rgba(0, 0, 255, 0.5)"`)
- CSS-named colors (for example, `"green"`, `"red"`, `"aliceblue"`)

Available since: v3.0.0
