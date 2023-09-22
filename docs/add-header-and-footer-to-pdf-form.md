---
title: Customize PDF Forms with Brand Logo, Slogan, and Annotation | SurveyJS
description: Boost your brand awareness with custom headers and footers in your PDF forms. This guide will show you how to add your brand logo, slogan, or annotations to give your PDF forms a professional and personalized look.
---

# Add Header and Footer to PDF Form Pages

A page header and footer is the content that appears consistently at the top and bottom of each page in a PDF form. Header and footer typically contain your brand logo, page numbers, or essential information about your document, such as its title, author, date of creation, or version number. This article describes how to customize header and footer in a PDF form created by SurveyJS PDF Generator.

## Add a Brand Logo to the Header

Generated PDF forms can include your company logo in the header. This will help increase your brand recognition and make your form look more professional. To add a logo to a PDF form, add it to the original survey. This logo can be exported to PDF without additional configuration.

To add a logo to a survey, assign a Base64 or URL string value to the [`logo`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#logo) property in the survey JSON schema. You can also specify other logo parameters:

- [`logoHeight`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#logoHeight) and [`logoWidth`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#logoWidth)          
Set the height and width of a logo in CSS-accepted values.

- [`logoFit`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#logoFit): `"contain"` (default) | `"cover"` | `"fill"` | `"none"`          
Specifies how a logo should be resized to fit its container.

- [`logoPosition`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#logoPosition): `"left"` (default) | `"right"` | `"none"`           
Specifies the position of a logo relative to the survey title.

The following code shows how to add a Base64-encoded logo to the right of the survey title. The full Base64 string is omitted for brevity.

```js
const surveyJson = {
  "logo": "data:image/png;base64,...",
  "logoPosition": "right"
};
const pdfDocOptions = { ... };

const surveyPdf = new SurveyPDF.SurveyPDF(surveyJson, pdfDocOptions);

// In modular applications:
import { SurveyPDF } from "survey-pdf";
const surveyPdf = new SurveyPDF(surveyJson, pdfDocOptions);
```

[View Demo](/pdf-generator/examples/customize-header-and-footer-of-pdf-form/ (linkStyle))

## Customize Header and Footer

With SurveyJS PDF Generator, you can create a fully custom header and footer for your PDF form. To do this, implement the [`onRenderHeader`](https://surveyjs.io/pdf-generator/documentation/api-reference/surveypdf#onRenderHeader) and [`onRenderFooter`](https://surveyjs.io/pdf-generator/documentation/api-reference/surveypdf#onRenderFooter) event handlers. They accept a [`DrawCanvas`](https://surveyjs.io/pdf-generator/documentation/api-reference/drawcanvas) object as the second parameter. The following subtopics describe how you can use this object to draw images or text within a PDF page header or footer.

### Drawing Area

Drawing area is limited by a rectangle in which you can draw text and images. A `DrawCanvas` object includes the [`rect`](https://surveyjs.io/pdf-generator/documentation/api-reference/drawcanvas#rect) property that contains rectangle coordinates: `xLeft`, `xRight`, `xTop`, and `yBot`. To find the width and height of the rectangle, and therefore the available drawing area, subtract `xLeft` from `xRight` and `xTop` from `xBot`:

```js
surveyPdf.onRenderHeader.add((_, canvas) => {
  const width = canvas.rect.xRight - canvas.rect.xLeft;
  const height = canvas.rect.yBot - canvas.rect.yTop;
});
```

The width and height of the header and footer rectangles depend upon [PDF page settings](/pdf-generator/documentation/customize-pdf-form-settings#page-settings) as follows:

- A header rectangle's height is specified by the [`margins.top`](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#margins) property.
- A footer rectangle's width is specified by the [`margins.bot`](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#margins) property.
- The width of both rectangles equals [page width](/pdf-generator/documentation/customize-pdf-form-settings#page-size).

### Draw Text

A `DrawCanvas` object has the [`drawText()`](https://surveyjs.io/pdf-generator/documentation/api-reference/drawcanvas#drawText) method that draws a piece of text within the [drawing area](#drawing-area). This method accepts an [`IDrawTextOptions`](https://surveyjs.io/pdf-generator/documentation/api-reference/idrawtextoptions) object in which you can specify the text string to draw, font size, text boldness, and other parameters.

The following code draws a text in bold with reduced font size in the page footer:

```js
surveyPdf.onRenderFooter.add((_, canvas) => {
  canvas.drawText({
    text: "Created by SurveyJS PDF Generator",
    fontSize: 10,
    isBold: true
  });
});
```

[View Demo](/pdf-generator/examples/customize-header-and-footer-of-pdf-form/ (linkStyle))

### Draw an Image

To draw an image within the drawing area, use `DrawCanvas`'s [`drawImage()`](https://surveyjs.io/pdf-generator/documentation/api-reference/drawcanvas#drawImage) method. It accepts an [`IDrawImageOptions`](https://surveyjs.io/pdf-generator/documentation/api-reference/idrawimageoptions) object that allows you to specify the image to draw, its height and width, and other parameters. Note that this method supports only Base64-encoded images.

The code below shows how to draw in image that occupies only half of the drawing area's width and height:

```js
surveyPdf.onRenderFooter.add((_, canvas) => {
  canvas.drawImage({
    base64: "data:image/png;base64,...",
    width: (canvas.rect.yBot - canvas.rect.yTop) * 0.5,
    height: (canvas.rect.yBot - canvas.rect.yTop) * 0.5
  });
});
```

### Add Page Numbers

A `DrawCanvas` object contains the [`pageNumber`](https://surveyjs.io/pdf-generator/documentation/api-reference/drawcanvas#pageNumber) and [`pageCount`](https://surveyjs.io/pdf-generator/documentation/api-reference/drawcanvas#pageCount) properties that you can use to add page numbers to your PDF form. Use the [`drawText()`](https://surveyjs.io/pdf-generator/documentation/api-reference/drawcanvas#drawText) to draw the numbers on the canvas:

```js
surveyPdf.onRenderFooter.add((_, canvas) => {
  canvas.drawText({
    text: "Page " + canvas.pageNumber + " of " + canvas.pageCount
  });
});
```

### Align Elements Within Header and Footer

Objects passed to the `drawText()` and `drawImage()` methods ([`IDrawTextOptions`](/pdf-generator/documentation/api-reference/idrawtextoptions) and [`IDrawImageOptions`](/pdf-generator/documentation/api-reference/idrawimageoptions)) can contain properties that specify element alignment within the header or footer. These properties are listed below:

- [`horizontalAlign`](/pdf-generator/documentation/api-reference/idrawtextoptions#horizontalAlign): `"center"` (default) | `"left"` | `"right"`    
Aligns an element within a header or footer in the horizontal direction.

- [`verticalAlign`](/pdf-generator/documentation/api-reference/idrawtextoptions#verticalAlign): `"middle"` (default) | `"top"` | `"bottom"`    
Aligns an element within a header or footer in the vertical direction.

- [`margins`](/pdf-generator/documentation/api-reference/idrawtextoptions#margins): `{ left: number, right: number, top: number, bot: number }`    
Specifies an element's margins within the [drawing area](#drawing-area). Margins apply only if the element is aligned to the left/right or top/bottom.

- [`rect`](/pdf-generator/documentation/api-reference/idrawtextoptions#rect): `{ xLeft: number, xRight: number, yTop: number, yBot: number}`    
Specifies the position of the drawing area on the canvas in absolute coordinates and thus aligns an element. Use this property as an alternative to the previously listed properties.

The following code adds page numbers to the page footer and positions them in the bottom right corner with 12-millimeter margins.

```js
surveyPdf.onRenderFooter.add((_, canvas) => {
  canvas.drawText({
    text: "Page " + canvas.pageNumber + " of " + canvas.pageCount,
    horizontalAlign: "right",
    verticalAlign: "bottom",
    margins: {
      right: 12,
      bot: 12
    }
  });
});
```

[View Demo](/pdf-generator/examples/customize-header-and-footer-of-pdf-form/ (linkStyle))