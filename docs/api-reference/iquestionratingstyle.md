---
title: IQuestionRatingStyle
product: PDF Generator
api-type: interface
description: Defines the visual style applied to UI elements within Rating Scale questions in an exported PDF document.
source: https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionratingstyle
---

# `IQuestionRatingStyle`

Defines the visual style applied to UI elements within [Rating Scale](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model) questions in an exported PDF document.

[PDF Appearance Customization - Styles Config](/pdf-generator/documentation/pdf-appearance-customization#styles-config (linkStyle))

Available since: v3.0.0

## Inheritance

[`IQuestionStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionstyle.md) &rarr; `IQuestionRatingStyle`

## Properties

### `choiceMinWidth`

**Type**: `number`

Specifies the minimum width of a choice item, in points.

Available since: v3.0.0

### `choiceText`

**Type**: `ITextStyle`

Specifies the visual style applied to choice text elements.

Available since: v3.0.0

### `input`

**Type**: `ISelectionInputStyle`

Specifies the visual style applied to selection inputs (radio buttons).

Available since: v3.0.0

### `inputReadOnly`

**Type**: `ISelectionInputStyle`

Specifies the visual style applied to selection inputs (radio buttons) in read-only mode.

Omitted settings are inherited from the [`input`](#input) property.

Available since: v3.0.0

### `inputReadOnlyChecked`

**Type**: `ISelectionInputStyle`

Specifies the visual style applied to checked selection inputs (radio buttons) in read-only mode.

Omitted settings are inherited according to the following chain:

`inputReadOnlyChecked` <= [`inputReadonly`](#inputReadonly) <= [`input`](#input)

Available since: v3.0.0

### `spacing`

**Type**: `ISelectBaseSpacing`

Specifies spacing values applied to question UI elements.

Available since: v3.0.0
