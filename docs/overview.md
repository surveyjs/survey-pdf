---
title: Introduction to the PDF Generator Library | SurveyJS
description: SurveyJS PDF Generator is an open-source JS component that allows you to save and download created surveys and forms in PDF and convert forms to fillable PDF files.
---
# SurveyJS PDF Generator Overview

SurveyJS PDF Generator is a client-side extension over the [SurveyJS Form Library](/Documentation/Library) that enables users to save surveys as PDF documents.

![Survey PDF Generator](images/survey-pdf-export-overview.png)

## Features

- Support for all built-in SurveyJS Form Library question types
- Export of survey results
- Interactive PDF documents that allow users to fill them
- Automatic page breaks
- Markdown support
- Customizable page format and font
- Header and footer support
- An API to save a PDF document on the user's computer or get raw PDF content

## Get Started

- [Angular](/Documentation/Pdf-Export?id=get-started-angular)
- [Vue](/Documentation/Pdf-Export?id=get-started-vue)
- [React](/Documentation/Pdf-Export?id=get-started-react)
- [Knockout](/Documentation/Pdf-Export?id=get-started-knockout)
- [jQuery](/Documentation/Pdf-Export?id=get-started-jquery)

We also include multiple [demo examples](/Examples/Pdf-Export) that allow you to edit and copy code.

## Limitations

- Dynamic elements and characteristics (visibility, validation, navigation buttons) are not supported.
- Implied screen resolution for element width calculation is 72 dpi.
- Text questions support only the following input types: text, password, color.
- Radiogroup questions do not support individual read-only items.
- For Image Picker questions, [`imageFit`](/Documentation/Library?id=questionimagepickermodel#imageFit) is always `"fill"`.
- HTML questions support only a restricted subset of HTML.
- Panels cannot be collapsed.
- Dynamic panels support only the `"list"` [`renderMode`](/Documentation/Library?id=questionpaneldynamicmodel#renderMode) and cannot be collapsed.

## What's New

Visit our [What's New page](/WhatsNew) for information on new features, recent bug fixes, and latest additions.

## Licensing

SurveyJS PDF Generator is **not available for free commercial usage**. If you want to integrate it into your application, you must purchase a [commercial license](/Licenses#SurveyCreator).
