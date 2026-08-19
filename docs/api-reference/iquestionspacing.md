---
title: IQuestionSpacing
product: PDF Generator
api-type: interface
description: Defines spacing values applied to question UI elements in an exported PDF document.
source: https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionspacing
---

# `IQuestionSpacing`

Defines spacing values applied to [question](https://surveyjs.io/form-library/documentation/api-reference/question) UI elements in an exported PDF document.

Available since: v3.0.0

## Inheritance

[`ISpacingBase`](https://surveyjs.io/pdf-generator/documentation/api-reference/ispacingbase.md) &rarr; `IQuestionSpacing`

## Properties

### `commentLabelGap`

**Type**: `number`

Specifies the gap between the question's comment area and the text above it, in points. Applies only to questions that [include a comment area](https://surveyjs.io/form-library/documentation/api-reference/question#showCommentArea).

Available since: v3.0.0

### `contentCommentGap`

**Type**: `number`

Specifies the gap between the question content and the comment area, in points. Applies only to questions that [include a comment area](https://surveyjs.io/form-library/documentation/api-reference/question#showCommentArea).

Available since: v3.0.0

### `contentDescriptionGap`

**Type**: `number`

Specifies the gap between the question content and the question description, in points. Applies only when the description is displayed [under the question input](https://surveyjs.io/form-library/documentation/api-reference/question#descriptionLocation).

Available since: v3.0.0

### `contentIndentStart`

**Type**: `number`

Specifies the indent from the start of the line for the question content, in points.

Available since: v3.0.0

### `inlineHeaderContentGap`

**Type**: `number`

Specifies the gap between the question header (title and description) and the question content, in points. Applies only when the question is displayed [inline with another question](https://surveyjs.io/form-library/documentation/api-reference/question#startWithNewLine).

Available since: v3.0.0

### `titleNumberGap`

**Type**: `number`

Specifies the gap between the question title and the question number, in points.

Available since: v3.0.0

### `titleRequiredMarkGap`

**Type**: `number`

Specifies the gap between the question title and the required mark, in points.

Available since: v3.0.0
