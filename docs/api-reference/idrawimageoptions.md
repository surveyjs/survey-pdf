---
title: IDrawImageOptions
product: PDF Generator
api-type: interface
description: An object that configures rendering an image.
source: https://surveyjs.io/pdf-generator/documentation/api-reference/idrawimageoptions
---

# `IDrawImageOptions`

An object that configures rendering an image.

## Inheritance

[`IDrawRectOptions`](https://surveyjs.io/pdf-generator/documentation/api-reference/idrawrectoptions.md) &rarr; `IDrawImageOptions`

## Properties

### `base64`

**Type**: `string`

A string value with a base64-encoded image to be drawn.

### `height`

**Type**: `number`

An image height in pixels. Defaults to the [rectangle height](https://surveyjs.io/pdf-generator/documentation/api-reference/idrawimageoptions#rect).

### `imageFit`

**Type**: `string`

Specifies how to resize the image to fit it into its container.

Default value: `"contain"` if [`applyImageFit`](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#applyImageFit) is enabled or `undefined` if not.

Refer to the [`object-fit`](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit) CSS property description for information on accepted values.

### `width`

**Type**: `number`

An image width in pixels. Defaults to the [rectangle width](https://surveyjs.io/pdf-generator/documentation/api-reference/idrawimageoptions#rect).
