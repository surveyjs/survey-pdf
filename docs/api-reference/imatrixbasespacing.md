---
title: IMatrixBaseSpacing
product: PDF Generator
api-type: interface
description: A base interface extended by other interfaces that define spacing values for matrix questions in an exported PDF document.
source: https://surveyjs.io/pdf-generator/documentation/api-reference/imatrixbasespacing
---

# `IMatrixBaseSpacing`

A base interface extended by other interfaces that define spacing values for matrix questions in an exported PDF document.

Available since: v3.0.0

## Inheritance

[`ISpacingBase`](https://surveyjs.io/pdf-generator/documentation/api-reference/ispacingbase.md) &rarr; [`IQuestionSpacing`](https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionspacing.md) &rarr; `IMatrixBaseSpacing`

## Properties

### `listItemGap`

**Type**: `number`

Specifies the vertical gap between list items, in points. Applies only to matrices [rendered as lists](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#matrixRenderAs).

Available since: v3.0.0

### `listItemTitleContentGap`

**Type**: `number`

Specifies the vertical gap between the list item title and the item content, in points. Applies only to matrices [rendered as lists](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#matrixRenderAs).

Available since: v3.0.0

### `listSectionGap`

**Type**: `number`

Specifies the vertical gap between list item sections, in points. Applies only to matrices [rendered as lists](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#matrixRenderAs).

Available since: v3.0.0

### `tableColumnGap`

**Type**: `number`

Specifies the horizontal gap between matrix table columns, in points. Applies only to matrices [rendered as tables](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#matrixRenderAs).

Available since: v3.0.0

### `tableRowGap`

**Type**: `number`

Specifies the vertical gap between matrix table rows, in points. Applies only to matrices [rendered as tables](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#matrixRenderAs).

Available since: v3.0.0
