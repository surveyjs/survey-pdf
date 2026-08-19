---
title: IQuestionMultipleTextStyle
product: PDF Generator
api-type: interface
description: Defines the visual style applied to UI elements within Multiple Textboxes questions in an exported PDF document.
source: https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionmultipletextstyle
---

# `IQuestionMultipleTextStyle`

Defines the visual style applied to UI elements within [Multiple Textboxes](https://surveyjs.io/form-library/documentation/api-reference/multiple-text-entry-question-model) questions in an exported PDF document.

[PDF Appearance Customization - Styles Config](/pdf-generator/documentation/pdf-appearance-customization#styles-config (linkStyle))

Available since: v3.0.0

## Inheritance

[`IQuestionStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionstyle.md) &rarr; `IQuestionMultipleTextStyle`

## Properties

### `itemCell`

**Type**: `IContainerStyle`

Specifies the visual style applied to table cells that contain items titles or text boxes.

Available since: v3.0.0

### `itemTitle`

**Type**: `ITextStyle`

Specifies the visual style applied to item titles.

Available since: v3.0.0

### `itemTitleWidthPercentage`

**Type**: `number`

Specifies the width percentage allocated to item titles.

Possible values: from 0 to 1 (for example, `0.25`)

Available since: v3.0.0

### `spacing`

**Type**: `IQuestionMultipleTextSpacing`

Specifies spacing values applied to question UI elements.

Available since: v3.0.0
