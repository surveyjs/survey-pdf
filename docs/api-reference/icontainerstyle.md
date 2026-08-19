---
title: IContainerStyle
product: PDF Generator
api-type: interface
description: Defines the visual style applied to a container element in an exported PDF document.
source: https://surveyjs.io/pdf-generator/documentation/api-reference/icontainerstyle
---

# `IContainerStyle`

Defines the visual style applied to a container element in an exported PDF document.

Available since: v3.0.0

## Inheritance

[`IBorderStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/iborderstyle.md) &rarr; `IContainerStyle`

## Properties

### `backgroundColor`

**Type**: `string`

Specifies the background color of the container element.

Supported formats:

- Hexadecimal color values with an optional alpha channel (for example, `"#ff0000"`, `"#0000FF80"`)
- RGB and RGBA functional notation (for example, `"rgb(255, 0, 0)"`, `"rgba(0, 0, 255, 0.5)"`)
- CSS-named colors (for example, `"green"`, `"red"`, `"aliceblue"`)

Available since: v3.0.0

### `padding`

**Type**: `number | {}`

Specifies the container padding, in points.

A single number applies uniform padding to all sides. An array specifies padding values for individual sides:

```js
// all four sides
padding: 12,
// top and bottom | left and right
padding: [12, 24],
// top | left and right | bottom
padding: [12, 6, 24],
// top | right | bottom | left
padding: [12, 12, 24, 24]
```

Available since: v3.0.0
