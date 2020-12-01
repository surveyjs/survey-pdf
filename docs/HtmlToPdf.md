# Export HTML to PDF

SurveyPDF supports export html to pdf via SurveyJS [Html Question](https://surveyjs.io/Documentation/Library/?id=questionhtmlmodel). Nevertheless, it is a difficult task to map html elements to pdf document primitives. Therefore SurveyPDF automatically choose more suitable of two render types. If the given html markup is simple enough, it will be rendered as interactive (selectable) text in pdf document (fits to long descriptive text). Otherwise, it will be rendered as an image (fits to greeting text)

You can set preferred render directly to fit your needs more accurately. Pass _htmlRenderAs_ parameter with "standard" value to render all html questions as interactive text or with "image" value to render all html questions as an image. Default value is "auto"

```javascript
var options = {
    htmlRenderAs: "image"
};
var surveyPDF = new SurveyPDF.SurveyPDF(json, options);
```

Also, you can override the render of particular html question via setting _renderAs_ property with values "standard" or "image" correspondingly. Default value is "auto"

```javascript
var json = {
    elements: [
        {
            type: "html",
            name: "html_as_image",
            html: "<i>Cheeese!</i>",
            renderAs: "image"
        }
    ]
};
```