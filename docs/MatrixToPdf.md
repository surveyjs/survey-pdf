# Export Matrix questions to PDF

SurveyPDF supports export all types of SurveyJS [matrix questions](https://surveyjs.io/Examples/Library?id=questiontype-matrix). When exporting, SurveyPDF tries to render the matrix as a table. But if there is no enough free space, then SurveyPDF will render the matrix as a list

You can set preferred render directly to fit your needs more accurately. Pass _matrixRenderAs_ parameter with "list" value to render all matrix questions as list. Omit this parameter or pass "auto" value to allow SurveyPDF automatically choose renders matrix as a table or as a list

```javascript
const options = {
    matrixRenderAs: 'list'
};
const surveyPDF = new SurveyPDF.SurveyPDF(json, options);
```

Also, you can override the render of particular matrix question via setting _renderAs_ property with "list" value. Default value is "auto"

```javascript
const json = {
    type: 'matrix',
    name: 'matrix_as_list',
    columns: [
        'Column 1'
    ],
    rows: [
        'Row 1'
    ],
    renderAs: 'list'
}
```