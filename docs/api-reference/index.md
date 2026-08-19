---
title: Classes and Interfaces
product: PDF Generator
---

# SurveyJS PDF Generator API Reference

## Classes

- [`SurveyPDF`](https://surveyjs.io/pdf-generator/documentation/api-reference/surveypdf.md) — The `SurveyPDF` object enables you to export your surveys and forms to PDF documents.
- [`PdfBrick`](https://surveyjs.io/pdf-generator/documentation/api-reference/pdfbrick.md) — An object that describes a PDF brick&mdash;a simple element with specified content, size, and location.
- [`PDFFormFillerBase`](https://surveyjs.io/pdf-generator/documentation/api-reference/pdfformfillerbase.md) — A base class for the `PDFFormFiller` plugin.
- [`DocController`](https://surveyjs.io/pdf-generator/documentation/api-reference/doccontroller.md) — The `DocController` object includes an API that allows you to configure main PDF document properties (font, margins, page width and height).
- [`DrawCanvas`](https://surveyjs.io/pdf-generator/documentation/api-reference/drawcanvas.md) — An object that describes a drawing area and enables you to draw an image or a text fragment within the area.
- [`PDFFormFiller`](https://surveyjs.io/pdf-generator/documentation/api-reference/pdfformfiller.md) — A plugin that enables you to fill interactive fields in existing PDF forms.

## Interfaces

- [`IDocStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/idocstyle.md) — Defines the visual style applied to UI elements in an exported PDF document.
- [`IDocOptions`](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions.md) — PDF document configuration.
- [`IQuestionStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionstyle.md) — Defines the visual style applied to question UI elements in an exported PDF document.
- [`IQuestionBooleanStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionbooleanstyle.md) — Defines the visual style applied to UI elements within Yes/No (Boolean) questions in an exported PDF document.
- [`IQuestionMatrixStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionmatrixstyle.md) — Defines the visual style applied to UI elements within Single-Select Matrix questions in an exported PDF document.
- [`IQuestionImagePickerStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionimagepickerstyle.md) — Defines the visual style applied to UI elements within Image Picker questions in an exported PDF document.
- [`IMatrixBaseStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/imatrixbasestyle.md) — A base interface extended by other interfaces that define visual styles for UI elements within matrix questions in an exported PDF document.
- [`IQuestionSpacing`](https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionspacing.md) — Defines spacing values applied to question UI elements in an exported PDF document.
- [`IPanelStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/ipanelstyle.md) — Defines the visual style applied to panel UI elements in an exported PDF document.
- [`IQuestionRatingStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionratingstyle.md) — Defines the visual style applied to UI elements within Rating Scale questions in an exported PDF document.
- [`ISelectBaseStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/iselectbasestyle.md) — A base interface extended by other interfaces that define visual styles for UI elements within select-like questions in an exported PDF document.
- [`IMatrixBaseSpacing`](https://surveyjs.io/pdf-generator/documentation/api-reference/imatrixbasespacing.md) — A base interface extended by other interfaces that define spacing values for matrix questions in an exported PDF document.
- [`ITextStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/itextstyle.md) — Defines the visual style applied to a text fragment in an exported PDF document.
- [`IDrawImageOptions`](https://surveyjs.io/pdf-generator/documentation/api-reference/idrawimageoptions.md) — An object that configures rendering an image.
- [`IPDFFormFillerOptions`](https://surveyjs.io/pdf-generator/documentation/api-reference/ipdfformfilleroptions.md) — An object that configures the `PDFFormFiller` plugin.
- [`IQuestionFileStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionfilestyle.md) — Defines the visual style applied to UI elements within File Upload questions in an exported PDF document.
- [`IQuestionMultipleTextStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionmultipletextstyle.md) — Defines the visual style applied to UI elements within Multiple Textboxes questions in an exported PDF document.
- [`IQuestionRankingStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionrankingstyle.md) — Defines the visual style applied to UI elements within Ranking questions in an exported PDF document.
- [`IQuestionSliderStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionsliderstyle.md) — Defines the visual style applied to UI elements within Slider questions in an exported PDF document.
- [`ISurveyStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/isurveystyle.md) — Defines the visual style applied to survey UI elements in an exported PDF document.
- [`IBorderStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/iborderstyle.md) — Defines the visual style applied to an element border in an exported PDF document.
- [`IDrawTextOptions`](https://surveyjs.io/pdf-generator/documentation/api-reference/idrawtextoptions.md) — An object that configures rendering a text fragment.
- [`IQuestionFileSpacing`](https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionfilespacing.md) — Defines spacing values applied to UI elements within File Upload questions in an exported PDF document.
- [`IQuestionMultipleTextSpacing`](https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionmultipletextspacing.md) — Defines spacing values applied to UI elements within Multiple Textboxes questions in an exported PDF document.
- [`ISelectBaseSpacing`](https://surveyjs.io/pdf-generator/documentation/api-reference/iselectbasespacing.md) — Defines spacing values applied to UI elements within Checkboxes, Radio Button Group, Image Picker, Ranking, and Rating Scale questions in an exported PDF document.
- [`ISelectionInputStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/iselectioninputstyle.md) — Defines the visual style applied to a selection input (checkbox or radio button) in an exported PDF document.
- [`ISeparatorStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/iseparatorstyle.md) — Defines the visual style applied to a separator line in an exported PDF document.
- [`IContainerStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/icontainerstyle.md) — Defines the visual style applied to a container element in an exported PDF document.
- [`IMargin`](https://surveyjs.io/pdf-generator/documentation/api-reference/imargin.md) — An interface that describes margins.
- [`IPanelSpacing`](https://surveyjs.io/pdf-generator/documentation/api-reference/ipanelspacing.md) — Defines spacing values applied to panel or page UI elements in an exported PDF document.
- [`IQuestionBooleanSpacing`](https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionbooleanspacing.md) — Defines spacing values applied to UI elements within Yes/No (Boolean) questions in an exported PDF document.
- [`IQuestionMatrixSpacing`](https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionmatrixspacing.md) — Defines spacing values applied to UI elements within Single-Select Matrix questions in an exported PDF document.
- [`IRect`](https://surveyjs.io/pdf-generator/documentation/api-reference/irect.md) — An interface that describes a rectangle.
- [`ISpacingBase`](https://surveyjs.io/pdf-generator/documentation/api-reference/ispacingbase.md) — A base interface extended by other interfaces that define spacing values in an exported PDF document.
- [`IAlignedTextStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/ialignedtextstyle.md) — Defines the visual style applied to an aligned text fragment in an exported PDF document.
- [`IInputStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/iinputstyle.md) — Defines the visual style applied to an input element in an exported PDF document.
- [`IMatrixDropdownBaseStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/imatrixdropdownbasestyle.md) — A base interface extended by other interfaces that define visual styles for UI elements within Multi-Select Matrix and Dynamic Matrix questions in an exported PDF document.
- [`IQuestionDropdownStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/iquestiondropdownstyle.md) — Defines the visual style applied to UI elements within Dropdown questions in an exported PDF document.
- [`IQuestionHtmlStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionhtmlstyle.md) — Defines the visual style applied to HTML survey elements in an exported PDF document.
- [`IQuestionImagePickerSpacing`](https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionimagepickerspacing.md) — Defines spacing values applied to UI elements within Image Picker questions in an exported PDF document.
- [`IQuestionMatrixDropdownStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionmatrixdropdownstyle.md) — Defines the visual style applied to UI elements within Multi-Select Matrix questions in an exported PDF document.
- [`IQuestionPanelDynamicSpacing`](https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionpaneldynamicspacing.md) — Defines spacing values applied to UI elements within Dynamic Panels in an exported PDF document.
- [`IQuestionPanelDynamicStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionpaneldynamicstyle.md) — Defines the visual style applied to UI elements within Dynamic Panels in an exported PDF document.
- [`IQuestionSliderSpacing`](https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionsliderspacing.md) — Defines spacing values applied to UI elements within Slider questions in an exported PDF document.
- [`ISurveySpacing`](https://surveyjs.io/pdf-generator/documentation/api-reference/isurveyspacing.md) — Defines spacing values applied to survey UI elements in an exported PDF document.
- [`ITextBaseStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/itextbasestyle.md) — A base interface extended by other interfaces that define visual styles for UI elements within text questions in an exported PDF document.
- [`IPageStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/ipagestyle.md) — Defines the visual style applied to page UI elements in an exported PDF document.
- [`IQuestionCheckboxStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/iquestioncheckboxstyle.md) — Defines the visual style applied to UI elements within Checkboxes questions in an exported PDF document.
- [`IQuestionCommentStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/iquestioncommentstyle.md) — Defines the visual style applied to UI elements within Long Text questions in an exported PDF document.
- [`IQuestionExpressionStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionexpressionstyle.md) — Defines the visual style applied to Expression survey elements in an exported PDF document.
- [`IQuestionMatrixDynamicStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionmatrixdynamicstyle.md) — Defines the visual style applied to UI elements within Dynamic Matrix questions in an exported PDF document.
- [`IQuestionRadiogroupStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/iquestionradiogroupstyle.md) — Defines the visual style applied to UI elements within Radio Button Group questions in an exported PDF document.
- [`IQuestionTagboxStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/iquestiontagboxstyle.md) — Defines the visual style applied to UI elements within Multi-Select Dropdown (Tag Box) questions in an exported PDF document.
- [`IQuestionTextStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/iquestiontextstyle.md) — Defines the visual style applied to UI elements within Single-Line Input questions in an exported PDF document.
