---
title: IQuestionMatrixSpacing
product: PDF Generator
api-type: interface
description: Defines spacing values applied to UI elements within Single-Select Matrix questions in an exported PDF document.
source: https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionmatrixspacing
---

# `IQuestionMatrixSpacing`

Defines spacing values applied to UI elements within [Single-Select Matrix](https://surveyjs.io/form-library/documentation/api-reference/matrix-table-question-model) questions in an exported PDF document.

Available since: v3.0.0

## Inheritance

[`ISpacingBase`](https://surveyjs.io/pdf-generator/documentation/api-reference/ispacingbase.md) &rarr; [`IQuestionSpacing`](https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionspacing.md) &rarr; [`IMatrixBaseSpacing`](https://surveyjs.io/pdf-generator/documentation/api-reference/imatrixbasespacing.md) &rarr; `IQuestionMatrixSpacing`

## Properties

### `listChoiceGap`

**Type**: `number`

Specifies the vertical gap between choice options within list items, in points. Applies only to matrices [rendered as lists](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#matrixRenderAs).

Available since: v3.0.0

### `listChoiceTextGap`

**Type**: `number`

Specifies the horizontal gap between the selection input (checkbox or radio button) and the choice text within list items, in points. Applies only to matrices [rendered as lists](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#matrixRenderAs).

Available since: v3.0.0
