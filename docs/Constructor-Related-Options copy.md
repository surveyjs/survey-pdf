# Options in Constructor

You can pass a set of options as a parameter into a [SurveyPDF](https://surveyjs.io/Documentation/Pdf-Export?id=surveypdf)'s [constructor](https://github.com/surveyjs/survey-pdf/blob/1220a71b51daddf1c4c8d506382c50be5f1b2941/src/survey.ts#L17) to predefine settings of the resulting PDF document.

```JavaScript
var options = {
    // Specify the required options here.
    orientation: "p",
	fontSize: 14,
    //...
	}
};
var survey = new SurveyPDF.SurveyPDF(json, options);
```

The available options are declared by the [IDocOptions](https://github.com/surveyjs/survey-pdf/blob/1220a71b51daddf1c4c8d506382c50be5f1b2941/src/doc_controller.ts#L33) interface and are implemented by the [DocOptions](https://github.com/surveyjs/survey-pdf/blob/1220a71b51daddf1c4c8d506382c50be5f1b2941/src/doc_controller.ts#L53) class.


You can customize the following document preferences through the options.

    orientation?: 'p' | 'l';
    format?: string | number[];
    fontSize?: number;
    fontName?: string;
    //base64Normal?: string;
    //base64Bold?: string;
    useCustomFontInHtml?: boolean;
    margins?: IMargin;
    commercial?: boolean;
    haveCommercialLicense?: boolean;
    htmlRenderAs?: IHTMLRenderType;
    matrixRenderAs?: 'auto' | 'list';
    readonlyRenderAs?: 'auto' | 'text' | 'acroform';
    textFieldRenderAs?: 'singleLine' | 'multiLine';
    compress?: boolean;



## Page orientation

Use the [orientation](https://github.com/surveyjs/survey-pdf/blob/1220a71b51daddf1c4c8d506382c50be5f1b2941/src/doc_controller.ts#L34) option to specify the page orientation within the document.

- [orientation](https://github.com/surveyjs/survey-pdf/blob/1220a71b51daddf1c4c8d506382c50be5f1b2941/src/doc_controller.ts#L34)  
`orientation?: 'p' | 'l';`  

Possible values:  
 - "p" - specifies the portrait orientation,
 - "l" - specifies the landscape orientation.

```JavaScript
var options = {
    orientation: "p"
};
```

## Page format

Use the [format](https://github.com/surveyjs/survey-pdf/blob/1220a71b51daddf1c4c8d506382c50be5f1b2941/src/doc_controller.ts#L35) option to specify the document's page size.

- [format](https://github.com/surveyjs/survey-pdf/blob/1220a71b51daddf1c4c8d506382c50be5f1b2941/src/doc_controller.ts#L35)  
`format?: string | number[];`

Possible values:  
- "a0" - "a10"
- "b0" - "b10"
- "c0" - "c10"
- "dl"
- "letter"
- "government-letter"
- "legal"
- "junior-legal"
- "ledger"
- "tabloid"
- "credit-card"

The default value is "a4".  

```JavaScript
var options = {
    format: "a3"
};
```

To use a custom format, set `format` to the required page size as a number array (in mm). Example: [210.0, 297.0].

```JavaScript
var options = {
    format: [210.0, 297.0]
};
```

## Font size

Use the [fontSize](https://github.com/surveyjs/survey-pdf/blob/1220a71b51daddf1c4c8d506382c50be5f1b2941/src/doc_controller.ts#L36) option to specify the base font size (in points) for the PDF document's text elements.

- [fontSize](https://github.com/surveyjs/survey-pdf/blob/1220a71b51daddf1c4c8d506382c50be5f1b2941/src/doc_controller.ts#L36)  
`fontSize?: number;`

The sizes of titles, descriptions, and text boxes will be calculated (scaled) proportionally based on the `fontSize` value.

```JavaScript
var options = {
    fontSize: 14
};
```


## Font name

Use the [fontName](https://github.com/surveyjs/survey-pdf/blob/1220a71b51daddf1c4c8d506382c50be5f1b2941/src/doc_controller.ts#L37) option to specify the font name or family for the PDF document's text elements.

- [fontName](https://github.com/surveyjs/survey-pdf/blob/1220a71b51daddf1c4c8d506382c50be5f1b2941/src/doc_controller.ts#L37)  
`fontName?: string;`

The default document font is Segoe.  
Two typefaces of this font (normal and bold) are by default embedded in a generated PDF document and are used to represent all survey texts within the document.  
> Specifying any other font instead of Segoe prevents embedding Segoe fonts into a PDF document and makes Segoe typefaces unavailable within the document.

Set the `fontName` option to the desired font's family name to [switch](https://surveyjs.io/Documentation/Pdf-Export?id=Customization-ChangeFonts#change-document-font) from the default Segoe font to one of the [standard 14 fonts](https://surveyjs.io/Documentation/Pdf-Export?id=Customization-ChangeFonts#standard-14-fonts) or to a [custom font](https://surveyjs.io/Documentation/Pdf-Export?id=Customization-ChangeFonts#use-custom-font) (explicitly integrated into a document).

Example: "Courier".

```JavaScript
var options = {
    fontName: "Courier"
};
```

Learn more: [Change Fonts](https://surveyjs.io/Documentation/Pdf-Export?id=Customization-ChangeFonts)

## ??? base64Normal
## ??? base64Bold

## ??? Ability to use custom fonts in HTML questions

Use the [useCustomFontInHtml](https://github.com/surveyjs/survey-pdf/blob/1220a71b51daddf1c4c8d506382c50be5f1b2941/src/doc_controller.ts#40) option to specify whether [custom fonts](https://surveyjs.io/Documentation/Pdf-Export?id=Customization-ChangeFonts#use-custom-font) should be used to render texts within questions of the HTML type.

- [useCustomFontInHtml](https://github.com/surveyjs/survey-pdf/blob/1220a71b51daddf1c4c8d506382c50be5f1b2941/src/doc_controller.ts#40)  
`useCustomFontInHtml?: boolean;`

```JavaScript
var options = {
    useCustomFontInHtml: true
};
```

## Page margins

Use the [margins](https://github.com/surveyjs/survey-pdf/blob/1220a71b51daddf1c4c8d506382c50be5f1b2941/src/doc_controller.ts#L41) option to specify the margins for document pages.

- [margins](https://github.com/surveyjs/survey-pdf/blob/1220a71b51daddf1c4c8d506382c50be5f1b2941/src/doc_controller.ts#L41)  
`margins?: IMargin;`

```JavaScript
var options = {
    margins: {
        top: 18,
        bot: 10,
        left: 12,
        right: 10
    }
};
```

See also: [Custom Render - Header/Footer: Drawing area](https://surveyjs.io/Documentation/Pdf-Export?id=Customization-CustomRender-HeaderFooter#drawing-area)

## Document compression

Use the [compress](https://github.com/surveyjs/survey-pdf/blob/1220a71b51daddf1c4c8d506382c50be5f1b2941/src/doc_controller.ts#L48) option to specify whether to compress the  generates PDF document. A compressed document does not support using custom fonts.

- [compress](https://github.com/surveyjs/survey-pdf/blob/1220a71b51daddf1c4c8d506382c50be5f1b2941/src/doc_controller.ts#L48)  
`compress?: boolean;`

```JavaScript
var options = {
    compress: true
};
```

## Commercial license

Use the [commercial](https://github.com/surveyjs/survey-pdf/blob/1220a71b51daddf1c4c8d506382c50be5f1b2941/src/doc_controller.ts#L42) or [haveCommercialLicense](https://github.com/surveyjs/survey-pdf/blob/1220a71b51daddf1c4c8d506382c50be5f1b2941/src/doc_controller.ts#L43) option to specify whether you have a commercial license for  the **Survey PDF Export** library.

- [commercial](https://github.com/surveyjs/survey-pdf/blob/1220a71b51daddf1c4c8d506382c50be5f1b2941/src/doc_controller.ts#L42)  
`commercial?: boolean;`

- [haveCommercialLicense](https://github.com/surveyjs/survey-pdf/blob/1220a71b51daddf1c4c8d506382c50be5f1b2941/src/doc_controller.ts#L43)  
`haveCommercialLicense?: boolean;`

Setting to true removes a non-commercial usage warning displayed on the top of the document.  

```JavaScript
var options = {
    commercial: true
};
```

or

```JavaScript
var options = {
    haveCommercialLicense: true
};
```

**Important:**  
Setting any of these options to true without having a commercial license is illegal.
