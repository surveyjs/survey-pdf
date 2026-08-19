---
title: IBorderStyle
product: PDF Generator
api-type: interface
description: Defines the visual style applied to an element border in an exported PDF document.
source: https://surveyjs.io/pdf-generator/documentation/api-reference/iborderstyle
---

# `IBorderStyle`

Defines the visual style applied to an element border in an exported PDF document.

Available since: v3.0.0

## Properties

### `borderColor`

**Type**: `any`

Specifies the border color.

Supported formats:

- Hexadecimal color values with an optional alpha channel (for example, `"#ff0000"`, `"#0000FF80"`)
- RGB and RGBA functional notation (for example, `"rgb(255, 0, 0)"`, `"rgba(0, 0, 255, 0.5)"`)
- CSS-named colors (for example, `"green"`, `"red"`, `"aliceblue"`)

A single value applies the same color to all four sides. An array assigns colors per side using CSS shorthand semantics:

```js
// all four sides
borderColor: "#ff0000",
// top and bottom | left and right
borderColor: ["#ff0000", "#0000ff"],
// top | left and right | bottom
borderColor: ["#ff0000", "#008000", "#0000ff"],
// top | right | bottom | left
borderColor: ["#ff0000", "#008000", "#0000ff", "#FFA500"]
```

Available since: v3.0.0

### `borderRadius`

**Type**: `any`

Specifies the border radius, in points.

A single value applies the same radius to all four corners. An array assigns corner radii using CSS shorthand semantics:

```js
// all four corners
borderRadius: 15,
// top-left and bottom-right | top-right and bottom-left
borderRadius: [15, 50],
// top-left | top-right and bottom-left | bottom-right
borderRadius: [15, 50, 30],
// top-left | top-right | bottom-right | bottom-left
borderRadius: [15, 50, 30, 5]
```

Available since: v3.0.0

### `borderWidth`

**Type**: `any`

Specifies the border width, in points.

A single value applies the same width to all four sides. An array assigns widths per side using CSS shorthand semantics:

```js
// all four sides
borderWidth: 2,
// top and bottom | left and right
borderWidth: [2, 1],
// top | left and right | bottom
borderWidth: [2, 1, 4],
// top | right | bottom | left
borderWidth: [2, 1, 4, 3]
```

Available since: v3.0.0
