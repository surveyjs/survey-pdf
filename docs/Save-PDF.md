# SurveyPDF save options

## Basics

[SurveyPDF](https://surveyjs.io/Documentation/Pdf-Export?id=surveypdf) exposes the following two methods - `save()` and `raw()` - that allow you to save a survey's generated PDF document to different formats, such as a downloadable PDF file, a JavaScript [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) or [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) object, etc.

- `save(fileName: string = 'survey_result.pdf'): Promise<any>`  
  [Docs](https://surveyjs.io/Documentation/Pdf-Export?id=surveypdf#save) | [Sources](https://github.com/surveyjs/survey-pdf/blob/ef6a5d8ea79b459293d8fb2fcad009b4e1d581f8/src/survey.ts#L128)  
  Downloads a PDF document as a file.  
  The _fileName_ parameter specifies the name of the result PDF file. If omitted, defaults to "survey_result.pdf".

- `raw(type?: string): Promise<string>`  
  [Docs](https://surveyjs.io/Documentation/Pdf-Export?id=surveypdf#raw) | [Sources](https://github.com/surveyjs/survey-pdf/blob/5225a077e05f3f3750c349cdd15de3bbbd572197/src/survey.ts#L138)   
  Returns a PDF document in different formats depending upon the value passed trough the _type_ parameter. If the _type_ parameter is undefined, the `raw` method's output is a raw body of the resulting PDF returned as a string.  
  The _type_ parameter accepts the following values:  
  - undefined  
    Allows you to obtain the PDF document as a JavaScript [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) object.
  - "dataurlstring"   
    Allows you to get the PDF document as a data URL string encoded into base64 format.
  - "blob"  
    Allows you to obtain the PDF document as a JavaScript [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) object.
  - "bloburl"  
    Allows you to get the PDF document as a URL to a Blob object.

    Note that the `raw` method wraps the [jsPDF](https://artskydj.github.io/jsPDF/) library's [output](https://artskydj.github.io/jsPDF/docs/jsPDF.html#output) method, so the `raw` method might accept additional output types available for `output`. 

The sections below describe the available save options in more detail.

- [Download a file](#save)
- [Get a string object](#raw-string)
- [Get a data URL to a base64-encoded string](#raw-dataurlstring)
  - [Use a data URL string to download a PDF](#raw-dataurlstring-save)
  - [Use a data URL string to preview a PDF](#raw-dataurlstring-preview)
- [Get a Blob object](#raw-blob)
- [Get a URL to a Blob object](#raw-bloburl)



<a id="save"></a>
## Download a file

Call the [save](https://surveyjs.io/Documentation/Pdf-Export?id=surveypdf#save) method with an optional _filename_ parameter to download a PDF file within a browser. 

Syntax:  
`save(fileName: string = 'survey_result.pdf'): Promise<any>`  

Usage:  
`surveyPDF.save("mySurveyAsPDFFile");`  

This is asynchronous method.

If you do not specify the _fileName_ parameter's value explicitly, the method uses the default "survey_result.pdf" file name.


```JavaScript
const surveyPDF = new SurveyPDF.SurveyPDF(json);
surveyPDF.save("myPdfDocument.pdf");
```

See a Plunker sample:  
[SurveyPDF - How to save the result PDF as a file](https://plnkr.co/edit/OwcuW3kXTKAGn9gv)




<a id="raw-string"></a>
## Get a string object

Call the [raw](https://surveyjs.io/Documentation/Pdf-Export?id=surveypdf#raw) method without a parameter to get a PDF document as a [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) object. Note that JavaScript strings cannot represent all possible byte combinations of PDF documents, so the final PDF might be corrupted (e.g. it might miss a bold font or there might take place a font mismatch). 

Syntax:  
`raw(type?: string): Promise<string>`   

Usage:  
`surveyPDF.raw();`  

This is asynchronous method.

Example:  
Obtains a PDF document as a string, creates a Blob object from the string, creates a URL for the Blob object and downloads the Blob through a dynamically created `a` element with `href` set to the Blob URL.

```JavaScript
var surveyPDF = new SurveyPDF.SurveyPDF(json);
surveyPDF.data = survey.data;
surveyPDF
    .raw()
    .then(function (text) {
        var file = new Blob([text], {type: "application/pdf"});
        var a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        a.download = "surveyThroughString.pdf";
        a.click();
        URL.revokeObjectURL(a.href);
});
```

See a Plunker sample:  
[SurveyPDF - How to save the result PDF as a string](https://plnkr.co/edit/TeYhoAxkvwF3EAPc)



<a id="raw-dataurlstring"></a>
## Get a data URL to a base64-encoded string

Call the [raw](https://surveyjs.io/Documentation/Pdf-Export?id=surveypdf#raw) method with the "dataurlstring" value passed as the _type_ parameter to get a base64-encoded data URL string for the PDF document. 

Syntax:  
`raw(type?: string): Promise<string>`   

Usage:  
`surveyPDF.raw('dataurlstring');`  

This is asynchronous method.


<a id="raw-dataurlstring-save"></a>
### Use a data URL string to download a PDF 

You can use the "dataurlstring" value in the `raw` method's _type_ parameter to download the generated PDF document.

Example:  
Obtains a PDF document as a data URL string and assigns this URL to a dynamically created `a` element's `href` to download the PDF.

```JavaScript
var surveyPDF = new SurveyPDF.SurveyPDF(json);
surveyPDF.data = survey.data;
surveyPDF
    .raw('dataurlstring')
    .then(function (text) {
        var a = document.createElement("a");
        a.href = text;
        a.download = "surveyThroughDataUrlString.pdf";
        a.click();
});
```

See a Plunker sample:  
[SurveyPDF - How to use a base64-encoded data URL string to save the result PDF](https://plnkr.co/edit/rq0o5GhH15zitEp1)


<a id="raw-dataurlstring-preview"></a>
### Use a data URL string to preview a PDF 

You can use the "dataurlstring" value in the `raw` method's _type_ parameter to preview a PDF document within a web page (in the `embed` html tag).

Example:  
Obtains a PDF document as a data URL string, creates an `embed` element, and assigns the data URL to the embed element's `scr` to preview the PDF.


```JavaScript
var surveyPDF = new SurveyPDF.SurveyPDF(json);
surveyPDF
    .raw("dataurlstring")
    .then(function (dataurl) {
        var pdfEmbed = document.createElement("embed");
        pdfEmbed.setAttribute("type", "application/pdf");
        pdfEmbed.setAttribute("style", "width:100%");
        pdfEmbed.setAttribute("height", 600);
        pdfEmbed.setAttribute("src", dataurl);
        var previewDiv = document.getElementById("pdf-preview");
        previewDiv.appendChild(pdfEmbed);
});
```

See a Plunker sample:  
[SurveyPDF - How to use a base64-encoded data URL string to preview the result PDF](https://plnkr.co/edit/nDBah2IrnxojQ1iM)



<a id="raw-blob"></a>
## Get a Blob object

Call the [raw](https://surveyjs.io/Documentation/Pdf-Export?id=surveypdf#raw) method with the "blob" value passed as the _type_ parameter to get a [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) object for the PDF document. 

Example:  
Obtains a PDF document as a Blob object, creates a URL for the Blob object, and downloads the PDF through a dynamically created `a` element with `href` set to the Blob URL.

```JavaScript
var surveyPDF = new SurveyPDF.SurveyPDF(json);
surveyPDF
    .raw("blob")
    .then(function (blob) {
        var a = document.createElement("a");
        a.download = "surveyThroughBlob.pdf";
        a.href = URL.createObjectURL(blob);
        a.click();
        URL.revokeObjectURL(a.href);
});
```

See a Plunker sample:  
[SurveyPDF - How to save the result PDF as a Blob](https://plnkr.co/edit/FobOW59o2gDx6PsZ)



<a id="raw-bloburl"></a>
## Get a URL to a Blob object

Call the [raw](https://surveyjs.io/Documentation/Pdf-Export?id=surveypdf#raw) method with the "bloburl" value passed as the _type_ parameter to get a URL to a Blob object that represents the generated PDF document. 


Example:  
Obtains a PDF document as a URL to a Blob object and downloads the PDF through a dynamically created `a` element with `href` set to the Blob URL.

```JavaScript
var surveyPDF = new SurveyPDF.SurveyPDF(json);
surveyPDF
    .raw("bloburl")
    .then(function (bloburl) {
        var a = document.createElement("a");
        a.href = bloburl;
        a.download = "surveyThroughBlobUrl.pdf";
        a.click();
});
```

See a Plunker sample:  
[SurveyPDF - How to save the result PDF through a Blob URL](https://plnkr.co/edit/Kebhczinl7iMdXTq)

