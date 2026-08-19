---
title: ITextStyle
product: PDF Generator
api-type: interface
description: Defines the visual style applied to a text fragment in an exported PDF document.
source: https://surveyjs.io/pdf-generator/documentation/api-reference/itextstyle
---

# `ITextStyle`

Defines the visual style applied to a text fragment in an exported PDF document.

Available since: v3.0.0

## Properties

### `fontColor`

**Type**: `string`

Specifies the text color.

Supported formats:

- Hexadecimal color values with an optional alpha channel (for example, `"#ff0000"`, `"#0000FF80"`)
- RGB and RGBA functional notation (for example, `"rgb(255, 0, 0)"`, `"rgba(0, 0, 255, 0.5)"`)
- CSS-named colors (for example, `"green"`, `"red"`, `"aliceblue"`)

Available since: v3.0.0

### `fontName`

**Type**: `string`

Specifies the font family.

Possible values:

- `"Helvetica"`
- `"Courier"`
- `"Times"`
- `"Symbol"`
- `"ZapfDingbats"`
- [Custom font name](https://surveyjs.io/pdf-generator/documentation/customize-pdf-form-settings#custom-fonts)

Available since: v3.0.0

### `fontSize`

**Type**: `number`

Specifies the font size, in points.

Available since: v3.0.0

### `fontStyle`

**Type**: `string`

Specifies the font style.

Possible values:

- `"normal"`
- `"bold"`
- `"italic"`
- `"bolditalic"`

Available since: v3.0.0

### `lineHeight`

**Type**: `number`

Specifies the line height, in points.

Available since: v3.0.0
