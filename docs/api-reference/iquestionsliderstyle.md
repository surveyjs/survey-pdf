---
title: IQuestionSliderStyle
product: PDF Generator
api-type: interface
description: Defines the visual style applied to UI elements within Slider questions in an exported PDF document.
source: https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionsliderstyle
---

# `IQuestionSliderStyle`

Defines the visual style applied to UI elements within [Slider](https://surveyjs.io/form-library/documentation/api-reference/questionslidermodel) questions in an exported PDF document.

[PDF Appearance Customization - Styles Config](/pdf-generator/documentation/pdf-appearance-customization#styles-config (linkStyle))

Available since: v3.0.0

## Inheritance

[`IQuestionStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionstyle.md) &rarr; `IQuestionSliderStyle`

## Properties

### `input`

**Type**: `IInputStyle`

Specifies the visual style applied to input elements.

Available since: v3.0.0

### `inputReadOnly`

**Type**: `IInputStyle`

Specifies the visual style applied to input elements in read-only mode.

Omitted settings are inherited from the [`input`](#input) property.

Available since: v3.0.0

### `rangeSeparator`

**Type**: `ISeparatorStyle`

Specifies the visual style applied to the separator line between the minimum and maximum values in a range. Applies only to questions with [`sliderType`](https://surveyjs.io/form-library/documentation/api-reference/questionslidermodel#sliderType) set to `"range"`.

Available since: v3.0.0

### `spacing`

**Type**: `IQuestionSliderSpacing`

Specifies spacing values applied to question UI elements.

Available since: v3.0.0
