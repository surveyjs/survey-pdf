
/**
 * Defines the visual style applied to a text fragment in an exported PDF document.
 */
export interface ITextStyle {
    /**
     * Specifies the text color.
     *
     * Supported formats:
     *
     * - Hexadecimal color values with an optional alpha channel (for example, `"#ff0000"`, `"#0000FF80"`)
     * - RGB and RGBA functional notation (for example, `"rgb(255, 0, 0)"`, `"rgba(0, 0, 255, 0.5)"`)
     * - CSS-named colors (for example, `"green"`, `"red"`, `"aliceblue"`)
     */
    fontColor?: string;
    /**
     * Specifies the font family.
     *
     * Possible values:
     *
     * - `"Helvetica"`
     * - `"Courier"`
     * - `"Times"`
     * - `"Symbol"`
     * - `"ZapfDingbats"`
     * - [Custom font name](https://surveyjs.io/pdf-generator/documentation/customize-pdf-form-settings#custom-fonts)
     */
    fontName?: string;
    /**
     * Specifies the font size, in points.
     */
    fontSize?: number;
    /**
     * Specifies the font style.
     *
     * Possible values:
     *
     * - `"normal"`
     * - `"bold"`
     * - `"italic"`
     * - `"bolditalic"`
     */
    fontStyle?: string;
    /**
     * Specifies the line height, in points.
     */
    lineHeight?: number;
}

/**
 * Defines the visual style applied to an aligned text fragment in an exported PDF document.
 */
export interface IAlignedTextStyle extends ITextStyle {
    /**
     * Specifies the horizontal alignment of the text.
     *
     * Possible values:
     *
     * - `"left"`
     * - `"right"`
     * - `"center"`
     */
    textAlign?: 'center' | 'left' | 'right';
}

/**
 * Defines the visual style applied to an element border in an exported PDF document.
 */
export interface IBorderStyle {
    /**
     * Specifies the border color.
     *
     * Supported formats:
     *
     * - Hexadecimal color values with an optional alpha channel (for example, `"#ff0000"`, `"#0000FF80"`)
     * - RGB and RGBA functional notation (for example, `"rgb(255, 0, 0)"`, `"rgba(0, 0, 255, 0.5)"`)
     * - CSS-named colors (for example, `"green"`, `"red"`, `"aliceblue"`)
     */
    borderColor?: string;
    /**
     * Specifies the border width, in points.
     */
    borderWidth?: number;
    /**
     * Specifies the border radius, in points.
     */
    borderRadius?: number;
}

/**
 * Defines the visual style applied to an input element in an exported PDF document.
 */
export interface IInputStyle extends IBorderStyle, ITextStyle {
    /**
     * Specifies the background color of the input element.
     *
     * Supported formats:
     *
     * - Hexadecimal color values with an optional alpha channel (for example, `"#ff0000"`, `"#0000FF80"`)
     * - RGB and RGBA functional notation (for example, `"rgb(255, 0, 0)"`, `"rgba(0, 0, 255, 0.5)"`)
     * - CSS-named colors (for example, `"green"`, `"red"`, `"aliceblue"`)
     */
    backgroundColor?: string;
}

/**
 * Defines the visual style applied to a container element in an exported PDF document.
 */
export interface IContainerStyle extends IBorderStyle {
    /**
     * Specifies the background color of the container element.
     *
     * Supported formats:
     *
     * - Hexadecimal color values with an optional alpha channel (for example, `"#ff0000"`, `"#0000FF80"`)
     * - RGB and RGBA functional notation (for example, `"rgb(255, 0, 0)"`, `"rgba(0, 0, 255, 0.5)"`)
     * - CSS-named colors (for example, `"green"`, `"red"`, `"aliceblue"`)
     */
    backgroundColor?: string;
    /**
     * Specifies the container padding, in points.
     *
     * A single number applies uniform padding to all sides. An array specifies padding values for individual sides:
     *
     * ```js
     * // all four sides
     * padding: 12
     * // top and bottom | left and right
     * padding: [12, 24],
     * // top | left and right | bottom
     * padding: [12, 6, 24],
     * // top | right | bottom | left
     * padding: [12, 12, 24, 24],
     * ```
     */
    padding?: number | number[];
}

/**
 * Defines the visual style applied to a selection input (checkbox or radio button) in an exported PDF document.
 */
export interface ISelectionInputStyle extends IInputStyle {
    /**
     * Specifies the check mark character used for the selection input.
     *
     * Check mark characters are taken from the standard Zapf Dingbats PDF font. Although any character from this font can be used, the most commonly suitable options are listed below:
     *
     * | Zapf Dingbats character | Description |
     * | ----------------------- | ----------- |
     * | `3` | Light check mark |
     * | `4` | Heavy check mark |
     * | `n` | Square box |
     * | `l` | Circle |
     * | `5` | Light "x" mark |
     * | `6` | Heavy "x" mark |
     * | `7` | Alternate cross |
     * | `8` | Alternate cross variant |
     */
    checkMark?: string;
    /**
     * Specifies the width of the selection input, in points.
     */
    width?: number;
    /**
     * Specifies the height of the selection input, in points.
     */
    height?: number;
}

/**
 * Defines the visual style applied to a separator line in an exported PDF document.
 */
export interface ISeparatorStyle {
    /**
     * Specifies the width of the separator, in points.
     */
    width?: number;
    /**
     * Specifies the height of the separator, in points.
     */
    height?: number;
    /**
     * Specifies the color of the separator.
     *
     * Supported formats:
     *
     * - Hexadecimal color values with an optional alpha channel (for example, `"#ff0000"`, `"#0000FF80"`)
     * - RGB and RGBA functional notation (for example, `"rgb(255, 0, 0)"`, `"rgba(0, 0, 255, 0.5)"`)
     * - CSS-named colors (for example, `"green"`, `"red"`, `"aliceblue"`)
     */
    color?: string;
}

export interface ISpacingBase {
    /**
     * Specifies the gap between the header (title and description) and the content, in points.
     */
    headerContentGap?: number;
    /**
     * Specifies the gap between the title and the description within the header, in points.
     */
    titleDescriptionGap?: number;
}
/**
 * Defines spacing values applied to survey UI elements in an exported PDF document.
 */
export interface ISurveySpacing extends ISpacingBase {}
/**
 * Defines the visual style applied to survey UI elements in an exported PDF document.
 */
export interface ISurveyStyle extends IContainerStyle {
    /**
     * Specifies the visual style applied to the survey title.
     */
    title?: ITextStyle;
    /**
     * Specifies the visual style applied to the survey description.
     */
    description?: ITextStyle;
    /**
     * Specifies spacing values applied to survey UI elements.
     */
    spacing?: ISurveySpacing;
}
/**
 * Defines spacing values applied to panel or page UI elements in an exported PDF document.
 */
export interface IPanelSpacing extends ISpacingBase {
    /**
     * Specifies the vertical gap between elements, in points.
     */
    elementGap?: number;
    /**
     * Specifies the horizontal gap between inline elements, in points.
     */
    inlineElementGap?: number;
}
/**
 * Defines the visual style applied to panel UI elements in an exported PDF document.
 */
export interface IPanelStyle {
    /**
     * Specifies the visual style applied to the panel or page title.
     */
    title?: ITextStyle;
    /**
     * Specifies the visual style applied to the panel or page description.
     */
    description?: ITextStyle;
    /**
     * Specifies the visual style applied to the panel or page header (title and description).
     */
    header?: IContainerStyle;
    /**
     * Specifies the visual style applied to the container in which the panel or page is rendered.
     */
    container?: IContainerStyle;
    /**
     * Specifies the minimum width of the container in which the panel or page is rendered, in points.
     */
    minWidth?: number;
    /**
     * Specifies spacing values applied to panel or page UI elements.
     */
    spacing?: IPanelSpacing;
}

/**
 * Defines the visual style applied to page UI elements in an exported PDF document.
 */
export interface IPageStyle extends IPanelStyle {}

/**
 * Defines spacing values applied to question UI elements in an exported PDF document.
 */
export interface IQuestionSpacing extends ISpacingBase {
    /**
     * Specifies the gap between the question title and the required mark, in points.
     */
    titleRequiredMarkGap?: number;
    /**
     * Specifies the gap between the question title and the question number, in points.
     */
    titleNumberGap?: number;
    /**
     * Specifies the gap between the question header (title and description) and the question content, in points. Applies only when the question is displayed [inline with another question](https://surveyjs.io/form-library/documentation/api-reference/question#startWithNewLine).
     */
    inlineHeaderContentGap?: number;
    /**
     * Specifies the indent from the start of the line for the question content, in points.
     */
    contentIndentStart?: number;
    /**
     * Specifies the gap between the question content and the comment area, in points. Applies only to questions with [include a comment area](https://surveyjs.io/form-library/documentation/api-reference/question#showCommentArea).
     */
    contentCommentGap?: number;
    /**
     * Specifies the gap between the question content and the question description, in points. Applies only when the description is displayed [under the question input](https://surveyjs.io/form-library/documentation/api-reference/question#descriptionLocation).
     */
    contentDescriptionGap?: number;
}
/**
 * Defines the visual style applied to question UI elements in an exported PDF document.
 */
export interface IQuestionStyle {
    /**
     * Specifies the visual style applied to the question title.
     */
    title?: ITextStyle;
    /**
     * Specifies the visual style applied to the question description.
     */
    description?: ITextStyle;
    /**
     * Specifies the visual style applied to the required mark.
     */
    requiredMark?: ITextStyle;
    /**
     * Specifies the visual style applied to the question number.
     */
    number?: ITextStyle;
    /**
     * Specifies the visual style applied to the question header (title and description).
     */
    header?: IContainerStyle;
    /**
     * Specifies the minimum width of the container in which the question is rendered, in points.
     */
    minWidth?: number;
    /**
     * Specifies the width percentage allocated to the question header. Applies only to questions with [`titleLocation`](https://surveyjs.io/form-library/documentation/api-reference/question#titleLocation) set to `"left"`.
     *
     * Possible values: from 0 to 1 (for example, `0.25`)
     */
    inlineHeaderWidthPercentage?: number;
    /**
     * Specifies the visual style applied to the container in which the question is rendered.
     */
    container?: IContainerStyle;
    /**
     * Specifies the visual style applied to the question comment. Applies only to questions with [include a comment area](https://surveyjs.io/form-library/documentation/api-reference/question#showCommentArea).
     */
    comment?: IInputStyle;
    /**
     * Specifies the visual style applied to the question comment in read-only mode. Applies only to questions with [include a comment area](https://surveyjs.io/form-library/documentation/api-reference/question#showCommentArea).
     */
    commentReadOnly?: IInputStyle;
    /**
     * Specifies the visual style applied to the question input.
     */
    input?: IInputStyle;
    /**
     * Specifies spacing values applied to question UI elements.
     */
    spacing?: IQuestionSpacing;
}

/**
 * Defines spacing values applied to UI elements within Checkboxes, Radio Button Group, Image Picker, Ranking, and Rating Scale questions in an exported PDF document.
 */
export interface ISelectBaseSpacing extends IQuestionSpacing {
    /**
     * Specifies the horizontal gap between choice columns, in points. Applies when choice options are [arranged in two or more columns](https://surveyjs.io/form-library/documentation/api-reference/checkbox-question-model#colCount).
     */
    choiceColumnGap?: number;
    /**
     * Specifies the vertical gap between choice options, in points.
     */
    choiceGap?: number;
    /**
     * Specifies the horizontal gap between the selection input (checkbox or radio button) and the choice text, in points.
     */
    choiceTextGap?: number;
}
export interface ISelectBaseStyle extends IQuestionStyle {
    /**
     * Specifies the minimum width of choice columns, in points. Applies when choice options are [arranged in two or more columns](https://surveyjs.io/form-library/documentation/api-reference/checkbox-question-model#colCount).
     */
    columnMinWidth?: number;
    /**
     * Specifies the visual style applied to choice text elements.
     */
    choiceText?: ITextStyle;
    /**
     * Specifies the visual style applied to selection inputs (checkbox or radio button).
     */
    input?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to selection inputs in read-only mode.
     */
    inputReadOnly?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to checked selection inputs in read-only mode.
     */
    inputReadOnlyChecked?: ISelectionInputStyle;
    /**
     * Specifies spacing values applied to question UI elements.
     */
    spacing?: ISelectBaseSpacing;
}

/**
 * Defines the visual style applied to UI elements within Checkboxes questions in an exported PDF document.
 */
export interface IQuestionCheckboxStyle extends ISelectBaseStyle {}
/**
 * Defines the visual style applied to UI elements within Radio Button Group questions in an exported PDF document.
 */
export interface IQuestionRadiogroupStyle extends ISelectBaseStyle {}

export interface IMatrixBaseSpacing extends IQuestionSpacing {
    /**
     * Specifies the horizontal gap between matrix table columns, in points. Applies only to matrices [rendered as tables](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#matrixRenderAs).
     */
    tableColumnGap?: number;
    /**
     * Specifies the vertical gap between matrix table rows, in points. Applies only to matrices [rendered as tables](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#matrixRenderAs).
     */
    tableRowGap?: number;
    /**
     * Specifies the vertical gap between list item sections, in points. Applies only to matrices [rendered as lists](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#matrixRenderAs).
     */
    listSectionGap?: number;
    /**
     * Specifies the vertical gap between list items, in points. Applies only to matrices [rendered as lists](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#matrixRenderAs).
     */
    listItemGap?: number;
    /**
     * Specifies the vertical gap between the list item title and the item content, in points. Applies only to matrices [rendered as lists](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#matrixRenderAs).
     */
    listItemTitleContentGap?: number;
}
export interface IMatrixBaseStyle extends IQuestionStyle {
    /**
     * Specifies the minimum width of the container in which the matrix is rendered, in points.
     */
    minWidth?: number;
    /**
     * Specifies the minimum width of matrix columns, in points. Applies only to matrices [rendered as tables](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#matrixRenderAs).
     */
    columnMinWidth?: number;
    /**
     * Specifies the visual style applied to matrix cells in the exported PDF.
     */
    cell?: IContainerStyle;
    /**
     * Specifies the visual style applied to matrix row titles in the exported PDF.
     */
    rowTitle?: IAlignedTextStyle;
    /**
     * Specifies the visual style applied to matrix column titles in the exported PDF.
     */
    columnTitle?: ITextStyle;
    /**
     * Specifies the visual style applied to the titles of list item sections. Applies only to matrices [rendered as lists](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#matrixRenderAs).
     *
     * Omitted settings are inherited from the [`rowTitle`](#rowTitle) property.
     */
    listSectionTitle?: IAlignedTextStyle;
    /**
     * Specifies spacing values applied to matrix UI elements.
     */
    spacing?: IMatrixBaseSpacing;
}
/**
 * Defines spacing values applied to UI elements within Single-Select Matrix questions in an exported PDF document.
 */
export interface IQuestionMatrixSpacing extends IMatrixBaseSpacing {
    gapBetweenItemText?: number; // remove this property
    /**
     * Specifies the vertical gap between choice options within list items, in points. Applies only to matrices [rendered as lists](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#matrixRenderAs).
     */
    listChoiceGap?: number;
    /**
     * Specifies the horizontal gap between the selection input (checkbox or radio button) and the choice text within list items, in points. Applies only to matrices [rendered as lists](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#matrixRenderAs).
     */
    listChoiceTextGap?: number;
}
/**
 * Defines the visual style applied to UI elements within Single-Select Matrix questions in an exported PDF document.
 */
export interface IQuestionMatrixStyle extends IMatrixBaseStyle {
    /**
     * Specifies the visual style applied to choice text elements within list items. Applies only to matrices [rendered as lists](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#matrixRenderAs).
     */
    listChoiceText?: ITextStyle;
    /**
     * Specifies the visual style applied to selection inputs (checkboxes and radio buttons).
     */
    input?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to selection inputs (checkboxes and radio buttons) in read-only mode.
     *
     * Omitted settings are inherited from the [`input`](#input) property.
     */
    inputReadOnly?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to checked selection inputs (checkboxes and radio buttons) in read-only mode.
     *
     * Omitted settings are inherited according to the following chain:
     *
     * `inputReadOnlyChecked` <= [`inputReadonly`](#inputReadonly) <= [`input`](#input)
     */
    inputReadOnlyChecked?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to radio buttons.
     *
     * Omitted settings are inherited from the [`input`](#input) property.
     */
    radioInput?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to radio buttons in read-only mode.
     *
     * Omitted settings are inherited according to the following chain:
     *
     * `radioInputReadOnly` <= [`inputReadonly`](#inputReadonly) <= [`radioInput`](#radioInput) <= [`input`](#input)
     */
    radioInputReadOnly?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to checked radio buttons in read-only mode.
     *
     * Omitted settings are inherited according to the following chain:
     *
     * `radioInputReadonlyChecked` <= [`inputReadOnlyChecked`](#inputReadOnlyChecked) <= [`radioInputReadOnly`](#radioInputReadOnly) <= [`inputReadonly`](#inputReadonly) <= [`radioInput`](#radioInput) <= [`input`](#input)
     */
    radioInputReadOnlyChecked?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to checkboxes.
     *
     * Omitted settings are inherited from the [`input`](#input) property.
     */
    checkboxInput?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to checkboxes in read-only mode.
     *
     * Omitted settings are inherited according to the following chain:
     *
     * `checkboxInputReadOnly` <= [`inputReadonly`](#inputReadonly) <= [`checkboxInput`](#checkboxInput) <= [`input`](#input)
     */
    checkboxInputReadOnly?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to checked checkboxes in read-only mode.
     *
     * Omitted settings are inherited according to the following chain:
     *
     * `checkboxInputReadOnlyChecked` <= [`inputReadOnlyChecked`](#inputReadOnlyChecked) <= [`checkboxInputReadOnly`](#checkboxInputReadOnly) <= [`inputReadonly`](#inputReadonly) <= [`checkboxInput`](#checkboxInput) <= [`input`](#input)
     */
    checkboxInputReadOnlyChecked?: ISelectionInputStyle;
    /**
     * Specifies spacing values applied to matrix UI elements.
     */
    spacing?: IQuestionMatrixSpacing;
}

export interface IMatrixDropdownBaseStyle extends IMatrixBaseStyle {
    /**
     * Specifies the visual style applied to list item titles. Applies only to matrices [rendered as lists](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#matrixRenderAs).
     */
    listItemTitle?: ITextStyle;
}
/**
 * Defines the visual style applied to UI elements within Multi-Select Matrix questions in an exported PDF document.
 */
export interface IQuestionMatrixDropdownStyle extends IMatrixDropdownBaseStyle {
    /**
     * Specifies the visual style applied to the containers in which item section titles are rendered. Applies only to matrices [rendered as lists](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#matrixRenderAs).
     */
    listSectionTitleContainer?: IContainerStyle;
}
/**
 * Defines the visual style applied to UI elements within Dynamic Matrix questions in an exported PDF document.
 */
export interface IQuestionMatrixDynamicStyle extends IMatrixDropdownBaseStyle {}

/**
 * Defines spacing values applied to UI elements within Multiple Textboxes questions in an exported PDF document.
 */
export interface IQuestionMultipleTextSpacing extends IQuestionSpacing {
    /**
     * Specifies the horizontal gap between item columns, in points.
     */
    itemColumnGap?: number;
    /**
     * Specifies the vertical gap between items, in points.
     */
    itemGap?: number;
    /**
     * Specifies the horizontal gap between item titles and text boxes, in points.
     */
    itemTitleGap?: number;
}
/**
 * Defines the visual style applied to UI elements within Multiple Textboxes questions in an exported PDF document.
 */
export interface IQuestionMultipleTextStyle extends IQuestionStyle {
    /**
     * Specifies the width percentage allocated to item titles.
     *
     * Possible values: from 0 to 1 (for example, `0.25`)
     */
    itemTitleWidthPercentage?: number;
    /**
     * Specifies the visual style applied to item titles.
     */
    itemTitle?: ITextStyle;
    /**
     * Specifies the visual style applied to table cells that contain items titles or text boxes.
     */
    itemCell?: IContainerStyle;
    /**
     * Specifies spacing values applied to question UI elements.
     */
    spacing?: IQuestionMultipleTextSpacing;
}

/**
 * Defines the visual style applied to UI elements within Rating Scale questions in an exported PDF document.
 */
export interface IQuestionRatingStyle extends IQuestionStyle {
    /**
     * Specifies the minimum width of a choice item, in points.
     */
    choiceMinWidth?: number;
    /**
     * Specifies the visual style applied to choice text elements.
     */
    choiceText?: ITextStyle;
    /**
     * Specifies the visual style applied to selection inputs (radio buttons).
     */
    input?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to selection inputs (radio buttons) in read-only mode.
     *
     * Omitted settings are inherited from the [`input`](#input) property.
     */
    inputReadOnly?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to checked selection inputs (radio buttons) in read-only mode.
     *
     * Omitted settings are inherited according to the following chain:
     *
     * `inputReadOnlyChecked` <= [`inputReadonly`](#inputReadonly) <= [`input`](#input)
     */
    inputReadOnlyChecked?: ISelectionInputStyle;
    /**
     * Specifies spacing values applied to question UI elements.
     */
    spacing?: ISelectBaseSpacing;
}
/**
 * Defines the visual style applied to UI elements within Ranking questions in an exported PDF document.
 */
export interface IQuestionRankingStyle extends IQuestionStyle {
    /**
     * Specifies the visual style applied to the question input.
     */
    input?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to the separator line between the ranked and unranked areas. Applies only to questions with [`selectToRankEnabled`](https://surveyjs.io/form-library/documentation/api-reference/ranking-question-model#selectToRankEnabled) set to `true`.
     */
    selectToRankAreaSeparator?: ISeparatorStyle;
    /**
     * Specifies the visual style applied to choice text elements.
     */
    choiceText?: ITextStyle;
    /**
     * Specifies spacing values applied to question UI elements.
     */
    spacing?: ISelectBaseSpacing;
}
/**
 * Defines spacing values applied to UI elements within Slider questions in an exported PDF document.
 */
export interface IQuestionSliderSpacing extends IQuestionSpacing {
    /**
     * Specifies the horizontal gap between the two input elements representing a value range, in points. Applies only to questions with [`sliderType`](https://surveyjs.io/form-library/documentation/api-reference/questionslidermodel#sliderType) set to `"range"`.
     */
    inputRangeGap?: number;
}
/**
 * Defines the visual style applied to UI elements within Slider questions in an exported PDF document.
 */
export interface IQuestionSliderStyle extends IQuestionStyle {
    /**
     * Specifies the visual style applied to input elements.
     */
    input?: IInputStyle;
    /**
     * Specifies the visual style applied to input elements in read-only mode.
     *
     * Omitted settings are inherited from the [`input`](#input) property.
     */
    inputReadOnly?: IInputStyle;
    /**
     * Specifies the visual style applied to the separator line between the minimum and maximum values in a range. Applies only to questions with [`sliderType`](https://surveyjs.io/form-library/documentation/api-reference/questionslidermodel#sliderType) set to `"range"`.
     */
    rangeSeparator?: ISeparatorStyle;
    /**
     * Specifies spacing values applied to question UI elements.
     */
    spacing?: IQuestionSliderSpacing;
}
/**
 * Defines the visual style applied to UI elements within Dropdown questions in an exported PDF document.
 */
export interface IQuestionDropdownStyle extends IQuestionStyle {
    /**
     * Specifies the visual style applied to the input element in read-only mode.
     *
     * Omitted settings are inherited from the [`input`](#input) property.
     */
    inputReadOnly?: IInputStyle;
}
/**
 * Defines the visual style applied to UI elements within Multi-Select Dropdown (Tag Box) questions in an exported PDF document.
 */
export interface IQuestionTagboxStyle extends IQuestionCheckboxStyle {}

/**
 * Defines spacing values applied to UI elements within File Upload questions in an exported PDF document.
 */
export interface IQuestionFileSpacing extends IQuestionSpacing {
    /**
     * Specifies the vertical gap between image previews and file names, in points.
     */
    imageFileNameGap?: number;
    /**
     * Specifies the horizontal gap between file item columns, in points.
     */
    fileItemColumnGap?: number;
    /**
     * Specifies the vertical gap between file items, in points.
     */
    fileItemGap?: number;
}
/**
 * Defines the visual style applied to UI elements within File Upload questions in an exported PDF document.
 */
export interface IQuestionFileStyle extends IQuestionStyle {
    /**
     * Specifies the minimum width allocated to render a file item (file name and preview), in points.
     */
    fileItemMinWidth?: number;
    /**
     * Specifies how image previews are resized to fit into their container.
     *
     *  Possible values:
     *
     * - `"cover"`
     * - `"fill"`
     * - `"contain"`
     */
    defaultImageFit?: string;
    /**
     * Specifies the visual style applied to file names.
     */
    fileName?: ITextStyle;
    /**
     * Specifies spacing values applied to question UI elements.
     */
    spacing?: IQuestionFileSpacing;
}
/**
 * Defines spacing values applied to UI elements within Dynamic Panels in an exported PDF document.
 */
export interface IQuestionPanelDynamicSpacing extends IQuestionSpacing {
    /**
     * Specifies the vertical gap between panels, in points.
     */
    panelGap?: number;
}
/**
 * Defines the visual style applied to UI elements within Dynamic Panels in an exported PDF document.
 */
export interface IQuestionPanelDynamicStyle extends IQuestionStyle {
    /**
     * Specifies spacing values applied to the Dynamic Panel UI elements.
     */
    spacing?: IQuestionPanelDynamicSpacing;
}
/**
 * Defines spacing values applied to UI elements within Yes/No (Boolean) questions in an exported PDF document.
 */
export interface IQuestionBooleanSpacing extends IQuestionSpacing {
    /**
     * Specifies the horizontal gap between choice columns, in points.
     */
    choiceColumnGap?: number;
    /**
     * Specifies the horizontal gap between the selection input (checkbox or radio button) and the choice text, in points.
     */
    choiceTextGap?: number;
}
/**
 * Defines the visual style applied to UI elements within Yes/No (Boolean) questions in an exported PDF document.
 */
export interface IQuestionBooleanStyle extends IQuestionStyle {
    /**
     * Specifies the visual style applied to choice text elements.
     */
    choiceText?: ITextStyle;
    /**
     * Specifies the visual style applied to selection inputs (checkboxes and radio buttons).
     */
    input?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to selection inputs (checkboxes and radio buttons) in read-only mode.
     *
     * Omitted settings are inherited from the [`input`](#input) property.
     */
    inputReadOnly?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to checked selection inputs (checkboxes and radio buttons) in read-only mode.
     *
     * Omitted settings are inherited according to the following chain:
     *
     * `inputReadOnlyChecked` <= [`inputReadonly`](#inputReadonly) <= [`input`](#input)
     */
    inputReadOnlyChecked?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to radio buttons.
     *
     * Omitted settings are inherited from the [`input`](#input) property.
     */
    radioInput?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to radio buttons in read-only mode.
     *
     * Omitted settings are inherited according to the following chain:
     *
     * `radioInputReadOnly` <= [`inputReadonly`](#inputReadonly) <= [`radioInput`](#radioInput) <= [`input`](#input)
     */
    radioInputReadOnly?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to checked radio buttons in read-only mode.
     *
     * Omitted settings are inherited according to the following chain:
     *
     * `radioInputReadonlyChecked` <= [`inputReadOnlyChecked`](#inputReadOnlyChecked) <= [`radioInputReadOnly`](#radioInputReadOnly) <= [`inputReadonly`](#inputReadonly) <= [`radioInput`](#radioInput) <= [`input`](#input)
     */
    radioInputReadOnlyChecked?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to checkboxes.
     *
     * Omitted settings are inherited from the [`input`](#input) property.
     */
    checkboxInput?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to checkboxes in read-only mode.
     *
     * Omitted settings are inherited according to the following chain:
     *
     * `checkboxInputReadOnly` <= [`inputReadonly`](#inputReadonly) <= [`checkboxInput`](#checkboxInput) <= [`input`](#input)
     */
    checkboxInputReadOnly?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to checked checkboxes in read-only mode.
     *
     * Omitted settings are inherited according to the following chain:
     *
     * `checkboxInputReadOnlyChecked` <= [`inputReadOnlyChecked`](#inputReadOnlyChecked) <= [`checkboxInputReadOnly`](#checkboxInputReadOnly) <= [`inputReadonly`](#inputReadonly) <= [`checkboxInput`](#checkboxInput) <= [`input`](#input)
     */
    checkboxInputReadOnlyChecked?: ISelectionInputStyle;
    /**
     * Specifies spacing values applied to matrix UI elements.
     */
    spacing?: IQuestionBooleanSpacing;
}
/**
 * Defines spacing values applied to UI elements within Image Picker questions in an exported PDF document.
 */
export interface IQuestionImagePickerSpacing extends ISelectBaseSpacing {
    /**
     * Specifies the vertical gap between the image preview and the input element, in points.
     */
    imageInputGap?: number;
}
/**
 * Defines the visual style applied to UI elements within Image Picker questions in an exported PDF document.
 */
export interface IQuestionImagePickerStyle extends ISelectBaseStyle {
    /**
     * Specifies the aspect ratio of images.
     */
    imageRatio?: number;
    /**
     * Specifies the minimum width of images, in points.
     */
    imageMinWidth?: number;
    /**
     * Specifies the maximum width of images, in points.
     */
    imageMaxWidth?: number;
    /**
     * Specifies the visual style applied to radio buttons.
     *
     * Omitted settings are inherited from the [`input`](#input) property.
     */
    radioInput?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to radio buttons in read-only mode.
     *
     * Omitted settings are inherited according to the following chain:
     *
     * `radioInputReadOnly` <= [`inputReadonly`](#inputReadonly) <= [`radioInput`](#radioInput) <= [`input`](#input)
     */
    radioInputReadOnly?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to checked radio buttons in read-only mode.
     *
     * Omitted settings are inherited according to the following chain:
     *
     * `radioInputReadonlyChecked` <= [`inputReadOnlyChecked`](#inputReadOnlyChecked) <= [`radioInputReadOnly`](#radioInputReadOnly) <= [`inputReadonly`](#inputReadonly) <= [`radioInput`](#radioInput) <= [`input`](#input)
     */
    radioInputReadOnlyChecked?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to checkboxes.
     *
     * Omitted settings are inherited from the [`input`](#input) property.
     */
    checkboxInput?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to checkboxes in read-only mode.
     *
     * Omitted settings are inherited according to the following chain:
     *
     * `checkboxInputReadOnly` <= [`inputReadonly`](#inputReadonly) <= [`checkboxInput`](#checkboxInput) <= [`input`](#input)
     */
    checkboxInputReadOnly?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to checked checkboxes in read-only mode.
     *
     * Omitted settings are inherited according to the following chain:
     *
     * `checkboxInputReadOnlyChecked` <= [`inputReadOnlyChecked`](#inputReadOnlyChecked) <= [`checkboxInputReadOnly`](#checkboxInputReadOnly) <= [`inputReadonly`](#inputReadonly) <= [`checkboxInput`](#checkboxInput) <= [`input`](#input)
     */
    checkboxInputReadOnlyChecked?: ISelectionInputStyle;
    /**
     * Specifies spacing values applied to matrix UI elements.
     */
    spacing?: IQuestionImagePickerSpacing;
}
export interface ITextBaseStyle extends IQuestionStyle {
    /**
     * Specifies the visual style applied to the question input in read-only mode.
     *
     * Omitted settings are inherited from the [`input`](#input) property.
     */
    inputReadOnly?: IInputStyle;
}
/**
 * Defines the visual style applied to UI elements within Single-Line Input questions in an exported PDF document.
 */
export interface IQuestionTextStyle extends ITextBaseStyle {}
/**
 * Defines the visual style applied to UI elements within Long Text questions in an exported PDF document.
 */
export interface IQuestionCommentStyle extends ITextBaseStyle {}
/**
 * Defines the visual style applied to Expression survey elements in an exported PDF document.
 */
export interface IQuestionExpressionStyle extends IQuestionStyle {}
/**
 * Defines the visual style applied to HTML survey elements in an exported PDF document.
 */
export interface IQuestionHtmlStyle extends IQuestionStyle {
    /**
     * Specifies the visual style applied to textual content.
     */
    text?: ITextStyle;
}
export interface IDocStyles {
    survey?: ISurveyStyle;
    page?: IPageStyle;
    panel?: IPanelStyle;
    paneldynamic?: IQuestionPanelDynamicStyle;
    matrixbase?: IMatrixBaseStyle;
    matrix?: IQuestionMatrixStyle;
    matrixdropdownbase?: IMatrixDropdownBaseStyle;
    matrixdropdown?: IQuestionMatrixDropdownStyle;
    matrixdynamic?: IQuestionMatrixDynamicStyle;
    textbase?: ITextBaseStyle;
    text?: IQuestionTextStyle;
    comment?: IQuestionCommentStyle;
    multipletext?: IQuestionMultipleTextStyle;
    question?: IQuestionStyle;
    selectbase?: ISelectBaseStyle;
    checkbox?: IQuestionCheckboxStyle;
    radiogroup?: IQuestionRadiogroupStyle;
    imagepicker?: IQuestionImagePickerStyle;
    dropdown?: IQuestionDropdownStyle;
    tagbox?: IQuestionTagboxStyle;
    boolean?: IQuestionBooleanStyle;
    rating?: IQuestionRatingStyle;
    ranking?: IQuestionRankingStyle;
    expression?: IQuestionExpressionStyle;
    html?: IQuestionHtmlStyle;
    file?: IQuestionFileStyle;
    slider?: IQuestionSliderStyle;
}