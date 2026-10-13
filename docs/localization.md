---
title: SurveyJS PDF Generator Localization & Globalization
description: Learn how to localize PDF form text, select a language, export a web survey in its current locale, and embed fonts for non-Latin characters in SurveyJS PDF Generator.
---

# Localization & Globalization

SurveyJS PDF Generator can create the same form in different languages. It uses Form Library dictionaries for predefined labels and translations in your survey JSON schema for question titles, descriptions, and choices. This help topic explains how to select a language, customize translations, and use fonts that support the characters in your PDF.

## Localize Predefined Form Text

### Available Languages

PDF Generator uses the Form Library's translations for predefined text, such as the "Other" choice and Boolean answer labels. These translations are available in over 50 languages as community-maintained [dictionary files](https://github.com/surveyjs/survey-library/tree/master/packages/survey-core/src/localization). Strings marked `[Auto-translated]` were translated from English using <a href="https://learn.microsoft.com/en-us/azure/ai-services/translator/" target="_blank">Azure AI Translator by Microsoft</a>. You can [override individual translations](#override-individual-translations) to change their wording.

If your language is not included, use the [English dictionary](https://github.com/surveyjs/survey-library/blob/master/packages/survey-core/src/localization/english.ts) as a starting point. Copy its keys, provide translated strings, and [register a custom locale](#create-a-custom-locale) in your application.

You can share new dictionaries or improvements to existing translations by submitting a pull request to the [`survey-library` repository](https://github.com/surveyjs/survey-library). Follow the [dictionary contribution instructions](https://github.com/surveyjs/survey-library/blob/master/packages/survey-core/src/localization/readme.md) to add your translations to the library.

### Enable Localization and Select a Locale

Load the Form Library dictionaries for the languages you need before creating a PDF model:

```js
// Modular applications
import "survey-core/i18n/french";
```

```html
<!-- Classic script applications -->
<script src="https://unpkg.com/survey-core/i18n/french.min.js"></script>
```

English is the default language. To select another language, assign its code to the `locale` property of a [`SurveyPDF`](/pdf-generator/documentation/api-reference/surveypdf) instance before generating the document. The following example exports a PDF in French:

```js
import { SurveyPDF } from "survey-pdf";
import "survey-core/i18n/french";

const surveyPdf = new SurveyPDF(surveyJson);
surveyPdf.locale = "fr";

await surveyPdf.save("survey-fr.pdf");
```

The selected locale applies to predefined labels and to any matching translations in your [survey schema](#localize-survey-contents). You can also set `"locale": "fr"` in the schema to make French the initial language.

### Override Individual Translations

To change a predefined label, call `getLocaleStrings(locale)` from `survey-core` and update the corresponding dictionary key. For example, the following code changes the French "Other" choice label:

```js
import { getLocaleStrings } from "survey-core";
import "survey-core/i18n/french";

const frenchTranslations = getLocaleStrings("fr");
frenchTranslations.otherItemText = "Autre réponse";
```

Apply overrides before generating the PDF. Refer to the [English dictionary](https://github.com/surveyjs/survey-library/blob/master/packages/survey-core/src/localization/english.ts) for the available keys. Since Form Library and PDF Generator share these dictionaries, the updated label also appears in web surveys that use the same locale.

### Create a Custom Locale

A custom locale lets you change several predefined labels together or add translations for a new language. Register it with `setupLocale` from `survey-core`, then assign its code to the `locale` property on the PDF model.

The following example creates a custom English locale:

```js
import { setupLocale } from "survey-core";
import { SurveyPDF } from "survey-pdf";

setupLocale({
  localeCode: "en-custom",
  nativeName: "Custom English",
  strings: {
    otherItemText: "Another answer",
    noneItemText: "None of these"
  }
});

const surveyPdf = new SurveyPDF(surveyJson);
surveyPdf.locale = "en-custom";

await surveyPdf.save("survey-custom.pdf");
```

Missing dictionary strings fall back to English. To use another fallback language, load its dictionary and set `surveyLocalization.defaultLocale` before creating the PDF model:

```js
import { surveyLocalization } from "survey-core";
import "survey-core/i18n/french";

surveyLocalization.defaultLocale = "fr";
```

For your own question titles and choices, add translations under the same locale code in the survey JSON schema.

## Localize Survey Contents

### Translate Titles, Descriptions, and Choices

PDF Generator reads survey content from the same JSON schema used by Form Library. For a form in one language, assign translated strings to text properties. For a multilingual form, use objects whose keys are locale codes and values are translations.

The following schema contains English and French question and choice text. The `default` field supplies text when a translation for the selected language is missing. The `locale` property selects French as the initial language.

```json
{
  "locale": "fr",
  "pages": [
    {
      "name": "feedback",
      "elements": [
        {
          "type": "radiogroup",
          "name": "satisfaction",
          "title": {
            "default": "How satisfied are you with our product?",
            "fr": "Dans quelle mesure êtes-vous satisfait de notre produit ?"
          },
          "choices": [
            {
              "value": "not-satisfied",
              "text": {
                "default": "Not satisfied",
                "fr": "Pas satisfait"
              }
            },
            {
              "value": "satisfied",
              "text": {
                "default": "Satisfied",
                "fr": "Satisfait"
              }
            },
            {
              "value": "completely-satisfied",
              "text": {
                "default": "Completely satisfied",
                "fr": "Complètement satisfait"
              }
            }
          ]
        }
      ]
    }
  ]
}
```

You can translate descriptions, placeholders, matrix rows and columns, and other text properties in the same way. Keep question names and choice values unchanged so that responses use the same keys and values in every language.

[Documentation: Localize Survey Contents](/form-library/documentation/survey-localization#localize-survey-contents (linkStyle))

### Inherit the Web Survey Language

When exporting an existing web survey, copy its current locale and responses to the PDF model. This ensures that the PDF uses the language selected in the web form and contains the respondent's answers:

```js
import { SurveyPDF } from "survey-pdf";

async function saveLocalizedPdf(survey) {
  const surveyPdf = new SurveyPDF(survey.toJSON());
  surveyPdf.locale = survey.locale;
  surveyPdf.data = survey.data;

  await surveyPdf.save("survey.pdf");
}
```

[Demo: Localize a PDF Form](/pdf-generator/examples/how-to-localize-pdf-forms/ (linkStyle))

## Render Non-Latin Characters and Special Symbols

The standard PDF fonts do not contain every character used in other languages. If text appears as blank spaces, garbled characters, or symbols, embed a font that includes the required characters.

### Register and Apply a Custom Font

Obtain the font as a TTF file and encode it as a Base64 string. Load this data before generating the PDF, then call [`DocController.addFont(fontName, base64, fontStyle)`](/pdf-generator/documentation/api-reference/doccontroller#addFont) to register it.

Use the same `fontName` for each font variant. Set `fontStyle` to `"normal"`, `"bold"`, `"italic"`, or `"bolditalic"`, and provide the matching TTF data for that style.

The following example assumes that `regularFontBase64` and `boldFontBase64` contain Base64-encoded Noto Sans Korean font files and that `surveyJson` contains Korean text. Register both styles so that regular text and bold headings use the custom font:

```js
import { DocController, SurveyPDF } from "survey-pdf";

DocController.addFont("NotoSansKR", regularFontBase64, "normal");
DocController.addFont("NotoSansKR", boldFontBase64, "bold");

const surveyPdf = new SurveyPDF(surveyJson, {
  fontName: "NotoSansKR"
});

await surveyPdf.save("survey-korean.pdf");
```

The [`fontName`](/pdf-generator/documentation/api-reference/idocoptions#fontName) document option must match the name used during registration. If HTML questions should use the same font, also set [`useCustomFontInHtml`](/pdf-generator/documentation/api-reference/idocoptions#useCustomFontInHtml) to `true`.

Embedded fonts increase the document size. Leave [`compress`](/pdf-generator/documentation/api-reference/idocoptions#compress) disabled when using custom fonts, because compressed documents do not support them.

[Demo: Render non-English Characters in PDF Forms](/pdf-generator/examples/special-characters-in-pdf-form/ (linkStyle))

### Right-to-Left Languages

For languages such as Arabic or Hebrew, choose a font that contains the required characters and set [`isRTL`](/pdf-generator/documentation/api-reference/idocoptions#isRTL) to `true` in the PDF document options. Select the corresponding locale and provide its translations in the survey schema before exporting.


## See Also

- [Documentation: Fonts](/pdf-generator/documentation/customize-pdf-form-settings#fonts)
- [Documentation: PDF Appearance Customization](/pdf-generator/documentation/pdf-appearance-customization)
- [Documentation: Fill PDF Form with Web Form Responses](/pdf-generator/documentation/fill-pdf-form-with-web-form-responses)