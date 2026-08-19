---
title: ISelectBaseSpacing
product: PDF Generator
api-type: interface
description: Defines spacing values applied to UI elements within Checkboxes, Radio Button Group, Image Picker, Ranking, and Rating Scale questions in an exported PDF document.
source: https://surveyjs.io/pdf-generator/documentation/api-reference/iselectbasespacing
---

# `ISelectBaseSpacing`

Defines spacing values applied to UI elements within [Checkboxes](https://surveyjs.io/form-library/documentation/api-reference/checkbox-question-model), [Radio Button Group](https://surveyjs.io/form-library/documentation/api-reference/radio-button-question-model), [Image Picker](https://surveyjs.io/form-library/documentation/api-reference/image-picker-question-model), [Ranking](https://surveyjs.io/form-library/documentation/api-reference/ranking-question-model), and [Rating Scale](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model) questions in an exported PDF document.

Available since: v3.0.0

## Inheritance

[`ISpacingBase`](https://surveyjs.io/pdf-generator/documentation/api-reference/ispacingbase.md) &rarr; [`IQuestionSpacing`](https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionspacing.md) &rarr; `ISelectBaseSpacing`

## Properties

### `choiceColumnGap`

**Type**: `number`

Specifies the horizontal gap between choice columns, in points. Applies when choice options are [arranged in two or more columns](https://surveyjs.io/form-library/documentation/api-reference/checkbox-question-model#colCount).

Available since: v3.0.0

### `choiceGap`

**Type**: `number`

Specifies the vertical gap between choice options, in points.

Available since: v3.0.0

### `choiceTextGap`

**Type**: `number`

Specifies the horizontal gap between the selection input (checkbox or radio button) and the choice text, in points.

Available since: v3.0.0
