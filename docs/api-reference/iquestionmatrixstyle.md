---
title: IQuestionMatrixStyle
product: PDF Generator
api-type: interface
description: Defines the visual style applied to UI elements within Single-Select Matrix questions in an exported PDF document.
source: https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionmatrixstyle
---

# `IQuestionMatrixStyle`

Defines the visual style applied to UI elements within [Single-Select Matrix](https://surveyjs.io/form-library/documentation/api-reference/matrix-table-question-model) questions in an exported PDF document.

[PDF Appearance Customization - Styles Config](/pdf-generator/documentation/pdf-appearance-customization#styles-config (linkStyle))

Available since: v3.0.0

## Inheritance

[`IQuestionStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionstyle.md) &rarr; [`IMatrixBaseStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/imatrixbasestyle.md) &rarr; `IQuestionMatrixStyle`

## Properties

### `checkboxInput`

**Type**: `ISelectionInputStyle`

Specifies the visual style applied to checkboxes.

Omitted settings are inherited from the [`input`](#input) property.

Available since: v3.0.0

### `checkboxInputReadOnly`

**Type**: `ISelectionInputStyle`

Specifies the visual style applied to checkboxes in read-only mode.

Omitted settings are inherited according to the following chain:

`checkboxInputReadOnly` <= [`inputReadonly`](#inputReadonly) <= [`checkboxInput`](#checkboxInput) <= [`input`](#input)

Available since: v3.0.0

### `checkboxInputReadOnlyChecked`

**Type**: `ISelectionInputStyle`

Specifies the visual style applied to checked checkboxes in read-only mode.

Omitted settings are inherited according to the following chain:

`checkboxInputReadOnlyChecked` <= [`inputReadOnlyChecked`](#inputReadOnlyChecked) <= [`checkboxInputReadOnly`](#checkboxInputReadOnly) <= [`inputReadonly`](#inputReadonly) <= [`checkboxInput`](#checkboxInput) <= [`input`](#input)

Available since: v3.0.0

### `input`

**Type**: `ISelectionInputStyle`

Specifies the visual style applied to selection inputs (checkboxes and radio buttons).

Available since: v3.0.0

### `inputReadOnly`

**Type**: `ISelectionInputStyle`

Specifies the visual style applied to selection inputs (checkboxes and radio buttons) in read-only mode.

Omitted settings are inherited from the [`input`](#input) property.

Available since: v3.0.0

### `inputReadOnlyChecked`

**Type**: `ISelectionInputStyle`

Specifies the visual style applied to checked selection inputs (checkboxes and radio buttons) in read-only mode.

Omitted settings are inherited according to the following chain:

`inputReadOnlyChecked` <= [`inputReadonly`](#inputReadonly) <= [`input`](#input)

Available since: v3.0.0

### `listChoiceText`

**Type**: `ITextStyle`

Specifies the visual style applied to choice text elements within list items. Applies only to matrices [rendered as lists](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#matrixRenderAs).

Available since: v3.0.0

### `radioInput`

**Type**: `ISelectionInputStyle`

Specifies the visual style applied to radio buttons.

Omitted settings are inherited from the [`input`](#input) property.

Available since: v3.0.0

### `radioInputReadOnly`

**Type**: `ISelectionInputStyle`

Specifies the visual style applied to radio buttons in read-only mode.

Omitted settings are inherited according to the following chain:

`radioInputReadOnly` <= [`inputReadonly`](#inputReadonly) <= [`radioInput`](#radioInput) <= [`input`](#input)

Available since: v3.0.0

### `radioInputReadOnlyChecked`

**Type**: `ISelectionInputStyle`

Specifies the visual style applied to checked radio buttons in read-only mode.

Omitted settings are inherited according to the following chain:

`radioInputReadonlyChecked` <= [`inputReadOnlyChecked`](#inputReadOnlyChecked) <= [`radioInputReadOnly`](#radioInputReadOnly) <= [`inputReadonly`](#inputReadonly) <= [`radioInput`](#radioInput) <= [`input`](#input)

Available since: v3.0.0

### `spacing`

**Type**: `IQuestionMatrixSpacing`

Specifies spacing values applied to matrix UI elements.

Available since: v3.0.0
