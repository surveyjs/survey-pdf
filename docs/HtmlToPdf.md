# Export HTML to PDF

SurveyPDF can export HTML markup to PDF via SurveyJS [Html](https://surveyjs.io/Documentation/Library/?id=questionhtmlmodel) questions. Nevertheless, it is a difficult task to map HTML elements to PDF document primitives. Therefore, SurveyPDF automatically chooses the more suitable from two render types - standard text or image. If the given HTML markup is simple enough, it will be rendered as selectable text in the PDF document (this is appropriate for long descriptive texts with a simple layout). Otherwise (if the HTML markup is complex), it will be rendered as an image (this is suitable for greeting texts that might have an elaborate layout).

You can set the preferred render mode directly to fit your needs more accurately. Pass the `'standard'` value through the `htmlRenderAs` parameter to render all HTML questions as selectable texts. Or pass the `'image'` value to render all HTML questions as images. The default value is `'auto'`.

```javascript
const options = {
    htmlRenderAs: 'image'
};
const surveyPDF = new SurveyPDF.SurveyPDF(json, options);
```

Also, you can override the render of a particular HTML question by setting its `renderAs` property to the `'standard'` or `'image'` value correspondingly. The default value is `'auto'`.

```javascript
const json = {
    elements: [
        {
            type: 'html',
            name: 'html_as_image',
            html: '<i>Cheeese!</i>',
            renderAs: 'image'
        }
    ]
};
```

**See Also**  
[Options in SurveyPDF Constructor: HTML question render mode](https://surveyjs.io/pdf-generator/documentation/options-in-constructor#html-question-render-mode)

## Use custom font in HTML
In case of rendering HTML as ans image, you can pass `true` through the `useCustomFontInHtml` parameter to use custom font in HTML. The default value is `false`.  
Please, note that using a custom font in HTML can increase the time of export.  
See more: [Information about custom fonts in SurveyPDF](https://surveyjs.io/Examples/Pdf-Export?id=survey-pdf-customfont#content-docs)

```javascript
const options = {
    fontName: 'custom',
    base64Bold: 'base64 encoded font',
    htmlRenderAs: 'image',
    useCustomFontInHtml: true
};
const surveyPDF = new SurveyPDF.SurveyPDF(json, options);
```

<!-- A standard render of HTML does not support using custom fonts at this moment. -->

**See Also**  
[Options in SurveyPDF Constructor: Ability to use custom fonts in HTML questions](https://surveyjs.io/pdf-generator/documentation/options-in-constructor#ability-to-use-custom-fonts-in-html-questions)