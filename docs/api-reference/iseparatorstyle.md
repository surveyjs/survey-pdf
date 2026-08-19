---
title: ISeparatorStyle
product: PDF Generator
api-type: interface
description: Defines the visual style applied to a separator line in an exported PDF document.
source: https://surveyjs.io/pdf-generator/documentation/api-reference/iseparatorstyle
---

# `ISeparatorStyle`

Defines the visual style applied to a separator line in an exported PDF document.

Available since: v3.0.0

## Properties

### `color`

**Type**: `string`

Specifies the color of the separator.

Supported formats:

- Hexadecimal color values with an optional alpha channel (for example, `"#ff0000"`, `"#0000FF80"`)
- RGB and RGBA functional notation (for example, `"rgb(255, 0, 0)"`, `"rgba(0, 0, 255, 0.5)"`)
- CSS-named colors (for example, `"green"`, `"red"`, `"aliceblue"`)

Available since: v3.0.0

### `height`

**Type**: `number`

Specifies the height of the separator, in points.

Available since: v3.0.0

### `width`

**Type**: `number`

Specifies the width of the separator, in points.

Available since: v3.0.0
