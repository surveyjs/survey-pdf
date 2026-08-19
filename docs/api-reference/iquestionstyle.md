---
title: IQuestionStyle
product: PDF Generator
api-type: interface
description: Defines the visual style applied to question UI elements in an exported PDF document.
source: https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionstyle
---

# `IQuestionStyle`

Defines the visual style applied to [question](https://surveyjs.io/form-library/documentation/api-reference/question) UI elements in an exported PDF document.

[PDF Appearance Customization - Styles Config](/pdf-generator/documentation/pdf-appearance-customization#styles-config (linkStyle))

Available since: v3.0.0

## Properties

### `comment`

**Type**: `IInputStyle`

Specifies the visual style applied to the question comment. Applies only to questions that [include a comment area](https://surveyjs.io/form-library/documentation/api-reference/question#showCommentArea).

Available since: v3.0.0

### `commentLabel`

**Type**: `ITextStyle`

Specifies the visual style applied to the text above the question's comment area. Applies only to questions that [include a comment area](https://surveyjs.io/form-library/documentation/api-reference/question#showCommentArea).

Available since: v3.0.0

### `commentReadOnly`

**Type**: `IInputStyle`

Specifies the visual style applied to the question comment in read-only mode. Applies only to questions that [include a comment area](https://surveyjs.io/form-library/documentation/api-reference/question#showCommentArea).

Available since: v3.0.0

### `container`

**Type**: `IContainerStyle`

Specifies the visual style applied to the container in which the question is rendered.

Available since: v3.0.0

### `description`

**Type**: `ITextStyle`

Specifies the visual style applied to the question description.

Available since: v3.0.0

### `header`

**Type**: `IContainerStyle`

Specifies the visual style applied to the question header.

Available since: v3.0.0

### `inlineHeaderWidthPercentage`

**Type**: `number`

Specifies the width percentage allocated to the question header. Applies only to questions with [`titleLocation`](https://surveyjs.io/form-library/documentation/api-reference/question#titleLocation) set to `"left"`.

Possible values: from 0 to 1 (for example, `0.25`)

Available since: v3.0.0

### `input`

**Type**: `IInputStyle`

Specifies the visual style applied to the question input.

Available since: v3.0.0

### `minWidth`

**Type**: `number`

Specifies the minimum width of the container in which the question is rendered, in points.

Available since: v3.0.0

### `number`

**Type**: `ITextStyle`

Specifies the visual style applied to the question number.

Available since: v3.0.0

### `requiredMark`

**Type**: `ITextStyle`

Specifies the visual style applied to the required mark.

Available since: v3.0.0

### `spacing`

**Type**: `IQuestionSpacing`

Specifies spacing values applied to question UI elements.

Available since: v3.0.0

### `title`

**Type**: `ITextStyle`

Specifies the visual style applied to the question title.

Available since: v3.0.0
