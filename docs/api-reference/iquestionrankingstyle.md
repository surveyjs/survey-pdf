---
title: IQuestionRankingStyle
product: PDF Generator
api-type: interface
description: Defines the visual style applied to UI elements within Ranking questions in an exported PDF document.
source: https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionrankingstyle
---

# `IQuestionRankingStyle`

Defines the visual style applied to UI elements within [Ranking](https://surveyjs.io/form-library/documentation/api-reference/ranking-question-model) questions in an exported PDF document.

[PDF Appearance Customization - Styles Config](/pdf-generator/documentation/pdf-appearance-customization#styles-config (linkStyle))

Available since: v3.0.0

## Inheritance

[`IQuestionStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionstyle.md) &rarr; `IQuestionRankingStyle`

## Properties

### `choiceText`

**Type**: `ITextStyle`

Specifies the visual style applied to choice text elements.

Available since: v3.0.0

### `input`

**Type**: `ISelectionInputStyle`

Specifies the visual style applied to the question input.

Available since: v3.0.0

### `selectToRankAreaSeparator`

**Type**: `ISeparatorStyle`

Specifies the visual style applied to the separator line between the ranked and unranked areas. Applies only to questions with [`selectToRankEnabled`](https://surveyjs.io/form-library/documentation/api-reference/ranking-question-model#selectToRankEnabled) set to `true`.

Available since: v3.0.0

### `spacing`

**Type**: `ISelectBaseSpacing`

Specifies spacing values applied to question UI elements.

Available since: v3.0.0
