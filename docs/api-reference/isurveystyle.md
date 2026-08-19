---
title: ISurveyStyle
product: PDF Generator
api-type: interface
description: Defines the visual style applied to survey UI elements in an exported PDF document.
source: https://surveyjs.io/pdf-generator/documentation/api-reference/isurveystyle
---

# `ISurveyStyle`

Defines the visual style applied to [survey](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model) UI elements in an exported PDF document.

[PDF Appearance Customization - Styles Config](/pdf-generator/documentation/pdf-appearance-customization#styles-config (linkStyle))

Available since: v3.0.0

## Inheritance

[`IBorderStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/iborderstyle.md) &rarr; [`IContainerStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/icontainerstyle.md) &rarr; `ISurveyStyle`

## Properties

### `description`

**Type**: `ITextStyle`

Specifies the visual style applied to the survey description.

Available since: v3.0.0

### `header`

**Type**: `IContainerStyle`

Specifies the visual style applied to the survey header.

Available since: v3.0.0

### `spacing`

**Type**: `ISurveySpacing`

Specifies spacing values applied to survey UI elements.

Available since: v3.0.0

### `title`

**Type**: `ITextStyle`

Specifies the visual style applied to the survey title.

Available since: v3.0.0
