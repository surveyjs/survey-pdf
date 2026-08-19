---
title: IQuestionSliderSpacing
product: PDF Generator
api-type: interface
description: Defines spacing values applied to UI elements within Slider questions in an exported PDF document.
source: https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionsliderspacing
---

# `IQuestionSliderSpacing`

Defines spacing values applied to UI elements within [Slider](https://surveyjs.io/form-library/documentation/api-reference/questionslidermodel) questions in an exported PDF document.

Available since: v3.0.0

## Inheritance

[`ISpacingBase`](https://surveyjs.io/pdf-generator/documentation/api-reference/ispacingbase.md) &rarr; [`IQuestionSpacing`](https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionspacing.md) &rarr; `IQuestionSliderSpacing`

## Properties

### `inputRangeGap`

**Type**: `number`

Specifies the horizontal gap between the two input elements representing a value range, in points. Applies only to questions with [`sliderType`](https://surveyjs.io/form-library/documentation/api-reference/questionslidermodel#sliderType) set to `"range"`.

Available since: v3.0.0
