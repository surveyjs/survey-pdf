# Export HTML to PDF

SurveyPDF supports export html to pdf via SurveyJS [Html Question](https://surveyjs.io/Documentation/Library/?id=questionhtmlmodel). Nevertheless, it is a difficult task to map html elements to pdf document primitives. Therefore SurveyPDF automatically choose more suitable of two render types. If the given html markup is simple enough, it will be rendered as selectable text in pdf document (fits to long descriptive text). Otherwise, it will be rendered as an image (fits to greeting text)

You can set preferred render directly to fit your needs more accurately. Pass `htmlRenderAs` parameter with `'standard'` value to render all html questions as selectable text or with `'image'` value to render all html questions as an image. Default value is `'auto'`

```javascript
const options = {
    htmlRenderAs: 'image'
};
const surveyPDF = new SurveyPDF.SurveyPDF(json, options);
```

Also, you can override the render of particular html question via setting `renderAs` property with values `'standard'` or `'image'` correspondingly. Default value is `'auto'`

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

## Use custom font in HTML
In case of rendering html as image, you can pass `useCustomFontInHtml` parameter with `true` value to use custom font in html. Default value is `false`. Please, note that using custom font in html can increase time of export. See more [information about custom fonts in SurveyPDF](https://surveyjs.io/Examples/Pdf-Export?id=survey-pdf-customfont#content-docs)

```javascript
const options = {
    fontName: 'custom',
    base64Bold: 'base64 encoded font',
    htmlRenderAs: 'image',
    useCustomFontInHtml: true
};
const surveyPDF = new SurveyPDF.SurveyPDF(json, options);
```

Standard render of html is not supports of using custom font at this moment