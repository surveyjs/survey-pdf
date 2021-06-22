# Custom Render - Header/Footer 


Sections in this topic:  
* [Handle events](#handle-events)
* [Use event parameter options - DrawCanvas object](#drawcanvas-object)
  * [Drawing area](#drawing-area)
  * [Draw text](#draw-text)
  * [Draw image](#draw-image)
  * [Page numbers](#page-numbers)
* [Specify element alignment](#element-alignment)


**API to use:**  
_Events:_  
`SurveyPDF.onRenderHeader`  
`SurveyPDF.onRenderFooter`  
_Event parameter options:_  
`DrawCanvas.rect`  
`DrawCanvas.drawText()`  
`DrawCanvas.drawImage()`  
`DrawCanvas.pageNumber`  
`DrawCanvas.countPages`

<a id="handle-events"></a>
## Handle events

You can use the [onRenderHeader](https://surveyjs.io/Documentation/Pdf-Export?id=surveypdf#onRenderHeader) and [onRenderFooter](https://surveyjs.io/Documentation/Pdf-Export?id=surveypdf#onRenderFooter) events to render texts and images in a PDF document's header and footer sections. These events fire for every rendered page in the PDF document. 

The event signature is similar for both events - two parameters are passed to event handlers: 
 - `survey` - The event sender. A [SurveyPDF](https://surveyjs.io/Documentation/Pdf-Export?id=surveypdf) object instance, 
 - `canvas` - The canvas to draw graphics. A [DrawCanvas](https://surveyjs.io/Documentation/Pdf-Export?id=drawcanvas) object instance.


Example:  
```javascript
var surveyPDF = new SurveyPDF.SurveyPDF(json);
surveyPDF.onRenderHeader.add(function (survey, canvas) {
    canvas.drawText({
    	text: "SurveyPDF Header",
    });
});
surveyPDF.onRenderFooter.add(function (survey, canvas) {
    canvas.drawText({
    	text: "SurveyPDF Footer",
    });
});
```

> **Online Example**  
> [Render Header and Footer](https://surveyjs.io/Examples/Pdf-Export?id=survey-pdf-header)

<a id="drawcanvas-object"></a>
## Use event parameter options - DrawCanvas object

A `DrawCanvas` object instance is passed to [onRenderHeader](https://surveyjs.io/Documentation/Pdf-Export?id=surveypdf#onRenderHeader) and [onRenderFooter](https://surveyjs.io/Documentation/Pdf-Export?id=surveypdf#onRenderFooter) event handlers as the `canvas` parameter. This parameter exposes specific properties and methods to help you draw custom graphics in headers and footers.

<a id="drawing-area"></a>
### Drawing area 
Use the `canvas.`[rect](https://surveyjs.io/Documentation/Pdf-Export?id=drawcanvas#rect) property to access a rectangle whose coordinates determine the header/footer area available for drawing.

`rect: IRect`   
The rectangle ([IRect](https://github.com/surveyjs/survey-pdf/blob/a18e99ad0d5a481ea390f6918c01a1bdbaa716d7/src/doc_controller.ts#L14)) is defined by four absolute coordinates - xLeft, xRight, yTop, and yBot.  

Example:    
```javascript
survey.onRenderHeader.add(function (survey, canvas) {
    var width = canvas.rect.xRight - canvas.rect.xLeft;
    var height = canvas.rect.yBot - canvas.rect.yTop;
});
```
The rectangle size depends upon page margin settings defined for a document through the [options](https://github.com/surveyjs/survey-pdf/blob/a18e99ad0d5a481ea390f6918c01a1bdbaa716d7/src/survey.ts#L16) of an instantiated SurveyPDF:  

 - The **width** of a rectangle equals a document's page width.
 - The **height** of a rectangle may differ for headers and footers and depends upon a document's vertical margins:
    - headers' height is specified by `margins.top`,
    - footers' height is specified by `margins.bottom`.  


<a id="draw-text"></a>
### Draw text

Use the `canvas.`[drawText()](https://surveyjs.io/Documentation/Pdf-Export?id=drawcanvas#drawText) method to draw a text string within a header/footer.  

`drawText(textOptions: IDrawTextOptions) => void`   

This method accepts a parameter of the [IDrawTextOptions](https://github.com/surveyjs/survey-pdf/blob/0e0bb386fee3796be0f8f8eeff62607e92fd4fd6/src/event_handler/draw_canvas.ts#L49) type with the following properties:  

 - [text](https://github.com/surveyjs/survey-pdf/blob/0e0bb386fee3796be0f8f8eeff62607e92fd4fd6/src/event_handler/draw_canvas.ts#L53)  
 `text: string`  
 A string to be drawn.  
 - [fontSize](https://github.com/surveyjs/survey-pdf/blob/0e0bb386fee3796be0f8f8eeff62607e92fd4fd6/src/event_handler/draw_canvas.ts#L57)  
 `fontSize?: number`  
 (Optional) The text font size. (Is taken from DocOptions.fontSize, 14 by default)  
 - [isBold](https://github.com/surveyjs/survey-pdf/blob/0e0bb386fee3796be0f8f8eeff62607e92fd4fd6/src/event_handler/draw_canvas.ts#L61)  
 `isBold?: boolean`  
 (Optional) Set it to true to make the text bold. (false by default)


Example:  
```javascript
survey.onRenderFooter.add(function (survey, canvas) {
    canvas.drawText({
        text: "Generated via SurveyJS PDF library",
        fontSize: 10,
        isBold: true
    });
});
```

> **Online Example**  
> [Render Header and Footer](https://surveyjs.io/Examples/Pdf-Export?id=survey-pdf-header)


<a id="draw-image"></a>
### Draw image
Use the `canvas.`[drawImage()](https://surveyjs.io/Documentation/Pdf-Export?id=drawcanvas#drawImage) method to draw an image within a header/footer.

`drawImage(imageOptions: IDrawImageOptions) => void`  

This method accepts a parameter of the [IDrawImageOptions](https://github.com/surveyjs/survey-pdf/blob/0e0bb386fee3796be0f8f8eeff62607e92fd4fd6/src/event_handler/draw_canvas.ts#L66) type with the following properties:

 - [base64](https://github.com/surveyjs/survey-pdf/blob/0e0bb386fee3796be0f8f8eeff62607e92fd4fd6/src/event_handler/draw_canvas.ts#L78)  
 `base64: string`  
 A string that contains a base64 encoded image.
 - [height](https://github.com/surveyjs/survey-pdf/blob/0e0bb386fee3796be0f8f8eeff62607e92fd4fd6/src/event_handler/draw_canvas.ts#L74)  
 `height?: number`  
 (Optional) Specifies the image height. Used if `alignment` is set. (canvas.rect's height by default)
 - [width](https://github.com/surveyjs/survey-pdf/blob/0e0bb386fee3796be0f8f8eeff62607e92fd4fd6/src/event_handler/draw_canvas.ts#L70)  
 `width?: number`  
 (Optional) Specifies the image width. Used if `alignment` is set. (canvas.rect's width by default)

Example:  
```javascript
survey.onRenderHeader.add(function (survey, canvas) {
    canvas.drawImage({
        base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mPk+A8AARUBCWbeTf4AAAAASUVORK5CYII=',
        width: (canvas.rect.yBot - canvas.rect.yTop) * 0.6,
        height: (canvas.rect.yBot - canvas.rect.yTop) * 0.6 		
    });
});
```

> **Online Example**  
> [Render Header and Footer](https://surveyjs.io/Examples/Pdf-Export?id=survey-pdf-header)



<a id="page-numbers"></a>
### Page numbers

You can add page numbering information into a document's headers/footers. Use the `DrawCanvas` object's specific properties to obtain page-related information.

[countPages](https://surveyjs.io/Documentation/Pdf-Export?id=drawcanvas#countPages) property  
`countPages: number`   
Gets the total count of pages in the PDF document.

[pageNumber](https://surveyjs.io/Documentation/Pdf-Export?id=drawcanvas#pageNumber) property  
`pageNumber: number`   
Gets the current page number. Page numbering starts from 1.  


Example:  
```javascript
survey.onRenderHeader.add(function (survey, canvas) {
    canvas.drawText({
        text: canvas.pageNumber + "/" + canvas.countPages
    });
});
```

> **Online Example**  
> [Render Header and Footer](https://surveyjs.io/Examples/Pdf-Export?id=survey-pdf-header)


<a id="element-alignment"></a>
## Specify element alignment

In calls to the [drawText()](https://surveyjs.io/Documentation/Pdf-Export?id=drawcanvas#drawText) and [drawImage()](https://surveyjs.io/Documentation/Pdf-Export?id=drawcanvas#drawImage) methods, you can additionally specify the alignment and/or position of an element (text or image) being drawn within a header/footer. For this purpose, use the following parameter properties exposed by [IDrawRectOptions](https://github.com/surveyjs/survey-pdf/blob/0e0bb386fee3796be0f8f8eeff62607e92fd4fd6/src/event_handler/draw_canvas.ts#L28) (which is a base for both [IDrawTextOptions](https://github.com/surveyjs/survey-pdf/blob/0e0bb386fee3796be0f8f8eeff62607e92fd4fd6/src/event_handler/draw_canvas.ts#L49) and [IDrawImageOptions](https://github.com/surveyjs/survey-pdf/blob/0e0bb386fee3796be0f8f8eeff62607e92fd4fd6/src/event_handler/draw_canvas.ts#L66)).

 - [horizontalAlign](https://github.com/surveyjs/survey-pdf/blob/0e0bb386fee3796be0f8f8eeff62607e92fd4fd6/src/event_handler/draw_canvas.ts#L32)  
 `horizontalAlign?: HorizontalAlign`  
 (Optional) Specifies an element's horizontal alignment.  
 Available values: `notset`, `left`, `center`, `right`. (Default is `center`)
 - [verticalAlign](https://github.com/surveyjs/survey-pdf/blob/0e0bb386fee3796be0f8f8eeff62607e92fd4fd6/src/event_handler/draw_canvas.ts#L36)  
 `verticalAlign?: VerticalAlign`  
 (Optional) Specifies an element's vertical alignment.  
 Available values: `notset`, `top`, `middle`, `bottom`. (Default is `middle`)
 - [margins](https://github.com/surveyjs/survey-pdf/blob/0e0bb386fee3796be0f8f8eeff62607e92fd4fd6/src/event_handler/draw_canvas.ts#L40)  
 `margins?: IMargin`  
 (Optional) Specifies an element's margins inside the drawing rectangle.   
 Available values: `left`, `right`, `top`, `bot`. (All are set to `zero` by default)  
 Margins are in effect when applied together with the corresponding alignment.
 - [rect](https://github.com/surveyjs/survey-pdf/blob/0e0bb386fee3796be0f8f8eeff62607e92fd4fd6/src/event_handler/draw_canvas.ts#L44)  
 `rect?: IRect`  
 (Optional) An object ([IRect](https://github.com/surveyjs/survey-pdf/blob/a18e99ad0d5a481ea390f6918c01a1bdbaa716d7/src/doc_controller.ts#L14))  with coordinates of a text rectangle.  
  Available values: `xLeft`, `xRight`, `yTop`, `yBot`.  
 Use `rect` as an alternative to alignment settings.

Example:  
```javascript
survey.onRenderFooter.add(function (survey, canvas) {
    canvas.drawText({
        text: canvas.pageNumber + "/" + canvas.countPages,
        horizontalAlign: "right",
        verticalAlign: "bottom",
        margins: {
            right: 12,
            bot: 12
        }
    });
});
```

> **Online Example**  
> [Render Header and Footer](https://surveyjs.io/Examples/Pdf-Export?id=survey-pdf-header)


