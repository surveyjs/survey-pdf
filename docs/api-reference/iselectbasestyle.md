---
title: ISelectBaseStyle
product: PDF Generator
api-type: interface
description: A base interface extended by other interfaces that define visual styles for UI elements within select-like questions in an exported PDF document.
source: https://surveyjs.io/pdf-generator/documentation/api-reference/iselectbasestyle
---

# `ISelectBaseStyle`

A base interface extended by other interfaces that define visual styles for UI elements within select-like questions in an exported PDF document.

Available since: v3.0.0

## Inheritance

[`IQuestionStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionstyle.md) &rarr; `ISelectBaseStyle`

## Properties

### `choiceText`

**Type**: `ITextStyle`

Specifies the visual style applied to choice text elements.

Available since: v3.0.0

### `columnMinWidth`

**Type**: `number`

Specifies the minimum width of choice columns, in points. Applies when choice options are [arranged in two or more columns](https://surveyjs.io/form-library/documentation/api-reference/checkbox-question-model#colCount).

Available since: v3.0.0

### `input`

**Type**: `ISelectionInputStyle`

Specifies the visual style applied to selection inputs (checkbox or radio button).

Available since: v3.0.0

### `inputReadOnly`

**Type**: `ISelectionInputStyle`

Specifies the visual style applied to selection inputs in read-only mode.

Available since: v3.0.0

### `inputReadOnlyChecked`

**Type**: `ISelectionInputStyle`

Specifies the visual style applied to checked selection inputs in read-only mode.

Available since: v3.0.0

### `spacing`

**Type**: `ISelectBaseSpacing`

Specifies spacing values applied to question UI elements.

Available since: v3.0.0
