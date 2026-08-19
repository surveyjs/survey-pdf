---
title: ISurveySpacing
product: PDF Generator
api-type: interface
description: Defines spacing values applied to survey UI elements in an exported PDF document.
source: https://surveyjs.io/pdf-generator/documentation/api-reference/isurveyspacing
---

# `ISurveySpacing`

Defines spacing values applied to survey UI elements in an exported PDF document.

Available since: v3.0.0

## Inheritance

[`ISpacingBase`](https://surveyjs.io/pdf-generator/documentation/api-reference/ispacingbase.md) &rarr; `ISurveySpacing`

## Properties

### `pageGap`

**Type**: `number`

Specifies the vertical gap between rendered survey pages, in points. Applies only when all survey pages are rendered on a single PDF page ([`questionsOnPageMode`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#questionsOnPageMode) is set to `"singlePage"`).

Available since: v3.0.0
