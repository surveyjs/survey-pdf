---
title: IMatrixBaseStyle
product: PDF Generator
api-type: interface
description: A base interface extended by other interfaces that define visual styles for UI elements within matrix questions in an exported PDF document.
source: https://surveyjs.io/pdf-generator/documentation/api-reference/imatrixbasestyle
---

# `IMatrixBaseStyle`

A base interface extended by other interfaces that define visual styles for UI elements within matrix questions in an exported PDF document.

Available since: v3.0.0

## Inheritance

[`IQuestionStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionstyle.md) &rarr; `IMatrixBaseStyle`

## Properties

### `cell`

**Type**: `IContainerStyle`

Specifies the visual style applied to matrix cells in the exported PDF.

Available since: v3.0.0

### `columnMinWidth`

**Type**: `number`

Specifies the minimum width of matrix columns, in points. Applies only to matrices [rendered as tables](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#matrixRenderAs).

Available since: v3.0.0

### `columnTitle`

**Type**: `ITextStyle`

Specifies the visual style applied to matrix column titles in the exported PDF.

Available since: v3.0.0

### `listSectionTitle`

**Type**: `IAlignedTextStyle`

Specifies the visual style applied to the titles of list item sections. Applies only to matrices [rendered as lists](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#matrixRenderAs).

Omitted settings are inherited from the [`rowTitle`](#rowTitle) property.

Available since: v3.0.0

### `minWidth`

**Type**: `number`

Specifies the minimum width of the container in which the matrix is rendered, in points.

Available since: v3.0.0

### `rowTitle`

**Type**: `IAlignedTextStyle`

Specifies the visual style applied to matrix row titles in the exported PDF.

Available since: v3.0.0

### `spacing`

**Type**: `IMatrixBaseSpacing`

Specifies spacing values applied to matrix UI elements.

Available since: v3.0.0
