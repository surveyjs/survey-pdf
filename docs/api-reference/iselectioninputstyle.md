---
title: ISelectionInputStyle
product: PDF Generator
api-type: interface
description: Defines the visual style applied to a selection input (checkbox or radio button) in an exported PDF document.
source: https://surveyjs.io/pdf-generator/documentation/api-reference/iselectioninputstyle
---

# `ISelectionInputStyle`

Defines the visual style applied to a selection input (checkbox or radio button) in an exported PDF document.

Available since: v3.0.0

## Inheritance

[`ITextStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/itextstyle.md) &rarr; [`IBorderStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/iborderstyle.md) &rarr; [`IInputStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/iinputstyle.md) &rarr; `ISelectionInputStyle`

## Properties

### `checkMark`

**Type**: `string`

Specifies the check mark character used for the selection input.

Check mark characters are taken from the standard Zapf Dingbats PDF font. Although any character from this font can be used, the most commonly suitable options are listed below:

| Zapf Dingbats character | Description |
| ----------------------- | ----------- |
| `3` | Light check mark |
| `4` | Heavy check mark |
| `n` | Square box |
| `l` | Circle |
| `5` | Light "x" mark |
| `6` | Heavy "x" mark |
| `7` | Alternate cross |
| `8` | Alternate cross variant |

Available since: v3.0.0

### `height`

**Type**: `number`

Specifies the height of the selection input, in points.

Available since: v3.0.0

### `width`

**Type**: `number`

Specifies the width of the selection input, in points.

Available since: v3.0.0
