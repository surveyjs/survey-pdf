
/**
 * Defines the visual style applied to a text fragment in an exported PDF document.
 * @since 3.0.0
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
     * @since 3.0.0
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
     * @since 3.0.0
     */
    fontName?: string;
    /**
     * Specifies the font size, in points.
     * @since 3.0.0
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
     * @since 3.0.0
     */
    fontStyle?: string;
    /**
     * Specifies the line height, in points.
     * @since 3.0.0
     */
    lineHeight?: number;
}

/**
 * Defines the visual style applied to an aligned text fragment in an exported PDF document.
 * @since 3.0.0
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
     * @since 3.0.0
     */
    textAlign?: 'center' | 'left' | 'right';
}

/**
 * Defines the visual style applied to an element border in an exported PDF document.
 * @since 3.0.0
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
     *
     * A single value applies the same color to all four sides. An array assigns colors per side using CSS shorthand semantics:
     *
     * ```js
     * // all four sides
     * borderColor: "#ff0000",
     * // top and bottom | left and right
     * borderColor: ["#ff0000", "#0000ff"],
     * // top | left and right | bottom
     * borderColor: ["#ff0000", "#008000", "#0000ff"],
     * // top | right | bottom | left
     * borderColor: ["#ff0000", "#008000", "#0000ff", "#FFA500"]
     * ```
     * @since 3.0.0
     */
    borderColor?: string | Array<string>;
    /**
     * Specifies the border width, in points.
     *
     * A single value applies the same width to all four sides. An array assigns widths per side using CSS shorthand semantics:
     *
     * ```js
     * // all four sides
     * borderWidth: 2,
     * // top and bottom | left and right
     * borderWidth: [2, 1],
     * // top | left and right | bottom
     * borderWidth: [2, 1, 4],
     * // top | right | bottom | left
     * borderWidth: [2, 1, 4, 3]
     * ```
     * @since 3.0.0
     */
    borderWidth?: number | Array<number>;
    /**
     * Specifies the border radius, in points.
     *
     * A single value applies the same radius to all four corners. An array assigns corner radii using CSS shorthand semantics:
     *
     * ```js
     * // all four corners
     * borderRadius: 15,
     * // top-left and bottom-right | top-right and bottom-left
     * borderRadius: [15, 50],
     * // top-left | top-right and bottom-left | bottom-right
     * borderRadius: [15, 50, 30],
     * // top-left | top-right | bottom-right | bottom-left
     * borderRadius: [15, 50, 30, 5]
     * ```
     * @since 3.0.0
     */
    borderRadius?: number | Array<number>;
}

/**
 * Defines the visual style applied to an input element in an exported PDF document.
 * @since 3.0.0
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
     * @since 3.0.0
     */
    backgroundColor?: string;
}

/**
 * Defines the visual style applied to a container element in an exported PDF document.
 * @since 3.0.0
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
     * @since 3.0.0
     */
    backgroundColor?: string;
    /**
     * Specifies the container padding, in points.
     *
     * A single number applies uniform padding to all sides. An array specifies padding values for individual sides:
     *
     * ```js
     * // all four sides
     * padding: 12,
     * // top and bottom | left and right
     * padding: [12, 24],
     * // top | left and right | bottom
     * padding: [12, 6, 24],
     * // top | right | bottom | left
     * padding: [12, 12, 24, 24]
     * ```
     * @since 3.0.0
     */
    padding?: number | number[];
}

/**
 * Defines the visual style applied to a selection input (checkbox or radio button) in an exported PDF document.
 * @since 3.0.0
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
     * @since 3.0.0
     */
    checkMark?: string;
    /**
     * Specifies the width of the selection input, in points.
     * @since 3.0.0
     */
    width?: number;
    /**
     * Specifies the height of the selection input, in points.
     * @since 3.0.0
     */
    height?: number;
}

/**
 * Defines the visual style applied to a separator line in an exported PDF document.
 * @since 3.0.0
 */
export interface ISeparatorStyle {
    /**
     * Specifies the width of the separator, in points.
     * @since 3.0.0
     */
    width?: number;
    /**
     * Specifies the height of the separator, in points.
     * @since 3.0.0
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
     * @since 3.0.0
     */
    color?: string;
}

/**
 * A base interface extended by other interfaces that define spacing values in an exported PDF document.
 * @since 3.0.0
 */
export interface ISpacingBase {
    /**
     * Specifies the gap between the header (title and description) and the content, in points.
     * @since 3.0.0
     */
    headerContentGap?: number;
    /**
     * Specifies the gap between the title and the description within the header, in points.
     * @since 3.0.0
     */
    titleDescriptionGap?: number;
}
/**
 * Defines spacing values applied to survey UI elements in an exported PDF document.
 * @since 3.0.0
 */
export interface ISurveySpacing extends ISpacingBase {
    /**
     * Specifies the vertical gap between rendered survey pages, in points. Applies only when all survey pages are rendered on a single PDF page ([`questionsOnPageMode`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#questionsOnPageMode) is set to `"singlePage"`).
     * @since 3.0.0
     */
    pageGap?: number;
}
/**
 * Defines the visual style applied to [survey](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model) UI elements in an exported PDF document.
 *
 * [PDF Appearance Customization - Styles Config](/pdf-generator/documentation/pdf-appearance-customization#styles-config (linkStyle))
 * @since 3.0.0
 */
export interface ISurveyStyle extends IContainerStyle {
    /**
     * Specifies the visual style applied to the survey title.
     * @since 3.0.0
     */
    title?: ITextStyle;
    /**
     * Specifies the visual style applied to the survey description.
     * @since 3.0.0
     */
    description?: ITextStyle;
    /**
     * Specifies spacing values applied to survey UI elements.
     * @since 3.0.0
     */
    spacing?: ISurveySpacing;
    /**
     * Specifies the visual style applied to the survey header.
     * @since 3.0.0
     */
    header?: IContainerStyle;
}
/**
 * Defines spacing values applied to [panel](https://surveyjs.io/form-library/documentation/api-reference/panel-model) or [page](https://surveyjs.io/form-library/documentation/api-reference/page-model) UI elements in an exported PDF document.
 * @since 3.0.0
 */
export interface IPanelSpacing extends ISpacingBase {
    /**
     * Specifies the vertical gap between elements, in points.
     * @since 3.0.0
     */
    elementGap?: number;
    /**
     * Specifies the horizontal gap between inline elements, in points.
     * @since 3.0.0
     */
    inlineElementGap?: number;
}
/**
 * Defines the visual style applied to [panel](https://surveyjs.io/form-library/documentation/api-reference/panel-model) UI elements in an exported PDF document.
 *
 * [PDF Appearance Customization - Styles Config](/pdf-generator/documentation/pdf-appearance-customization#styles-config (linkStyle))
 * @since 3.0.0
 */
export interface IPanelStyle {
    /**
     * Specifies the visual style applied to the panel or page title.
     * @since 3.0.0
     */
    title?: ITextStyle;
    /**
     * Specifies the visual style applied to the panel or page description.
     * @since 3.0.0
     */
    description?: ITextStyle;
    /**
     * Specifies the visual style applied to the panel or page header.
     * @since 3.0.0
     */
    header?: IContainerStyle;
    /**
     * Specifies the visual style applied to the container in which the panel or page is rendered.
     * @since 3.0.0
     */
    container?: IContainerStyle;
    /**
     * Specifies the minimum width of the container in which the panel or page is rendered, in points.
     * @since 3.0.0
     */
    minWidth?: number;
    /**
     * Specifies spacing values applied to panel or page UI elements.
     * @since 3.0.0
     */
    spacing?: IPanelSpacing;
}

/**
 * Defines the visual style applied to [page](https://surveyjs.io/form-library/documentation/api-reference/page-model) UI elements in an exported PDF document.
 *
 * [PDF Appearance Customization - Styles Config](/pdf-generator/documentation/pdf-appearance-customization#styles-config (linkStyle))
 * @since 3.0.0
 */
export interface IPageStyle extends IPanelStyle {}

/**
 * Defines spacing values applied to [question](https://surveyjs.io/form-library/documentation/api-reference/question) UI elements in an exported PDF document.
 * @since 3.0.0
 */
export interface IQuestionSpacing extends ISpacingBase {
    /**
     * Specifies the gap between the question title and the required mark, in points.
     * @since 3.0.0
     */
    titleRequiredMarkGap?: number;
    /**
     * Specifies the gap between the question title and the question number, in points.
     * @since 3.0.0
     */
    titleNumberGap?: number;
    /**
     * Specifies the gap between the question header (title and description) and the question content, in points. Applies only when the question is displayed [inline with another question](https://surveyjs.io/form-library/documentation/api-reference/question#startWithNewLine).
     * @since 3.0.0
     */
    inlineHeaderContentGap?: number;
    /**
     * Specifies the indent from the start of the line for the question content, in points.
     * @since 3.0.0
     */
    contentIndentStart?: number;
    /**
     * Specifies the gap between the question content and the comment area, in points. Applies only to questions that [include a comment area](https://surveyjs.io/form-library/documentation/api-reference/question#showCommentArea).
     * @since 3.0.0
     */
    contentCommentGap?: number;
    /**
     * Specifies the gap between the question content and the question description, in points. Applies only when the description is displayed [under the question input](https://surveyjs.io/form-library/documentation/api-reference/question#descriptionLocation).
     * @since 3.0.0
     */
    contentDescriptionGap?: number;
    /**
     * Specifies the gap between the question's comment area and the text above it, in points. Applies only to questions that [include a comment area](https://surveyjs.io/form-library/documentation/api-reference/question#showCommentArea).
     * @since 3.0.0
     */
    commentLabelGap?: number;
}
/**
 * Defines the visual style applied to [question](https://surveyjs.io/form-library/documentation/api-reference/question) UI elements in an exported PDF document.
 *
 * [PDF Appearance Customization - Styles Config](/pdf-generator/documentation/pdf-appearance-customization#styles-config (linkStyle))
 * @since 3.0.0
 */
export interface IQuestionStyle {
    /**
     * Specifies the visual style applied to the question title.
     * @since 3.0.0
     */
    title?: ITextStyle;
    /**
     * Specifies the visual style applied to the question description.
     * @since 3.0.0
     */
    description?: ITextStyle;
    /**
     * Specifies the visual style applied to the required mark.
     * @since 3.0.0
     */
    requiredMark?: ITextStyle;
    /**
     * Specifies the visual style applied to the question number.
     * @since 3.0.0
     */
    number?: ITextStyle;
    /**
     * Specifies the visual style applied to the question header.
     * @since 3.0.0
     */
    header?: IContainerStyle;
    /**
     * Specifies the minimum width of the container in which the question is rendered, in points.
     * @since 3.0.0
     */
    minWidth?: number;
    /**
     * Specifies the width percentage allocated to the question header. Applies only to questions with [`titleLocation`](https://surveyjs.io/form-library/documentation/api-reference/question#titleLocation) set to `"left"`.
     *
     * Possible values: from 0 to 1 (for example, `0.25`)
     * @since 3.0.0
     */
    inlineHeaderWidthPercentage?: number;
    /**
     * Specifies the visual style applied to the container in which the question is rendered.
     * @since 3.0.0
     */
    container?: IContainerStyle;
    /**
     * Specifies the visual style applied to the question comment. Applies only to questions that [include a comment area](https://surveyjs.io/form-library/documentation/api-reference/question#showCommentArea).
     * @since 3.0.0
     */
    comment?: IInputStyle;
    /**
     * Specifies the visual style applied to the question comment in read-only mode. Applies only to questions that [include a comment area](https://surveyjs.io/form-library/documentation/api-reference/question#showCommentArea).
     * @since 3.0.0
     */
    commentReadOnly?: IInputStyle;
    /**
     * Specifies the visual style applied to the question input.
     * @since 3.0.0
     */
    input?: IInputStyle;
    /**
     * Specifies spacing values applied to question UI elements.
     * @since 3.0.0
     */
    spacing?: IQuestionSpacing;
    /**
     * Specifies the visual style applied to the text above the question's comment area. Applies only to questions that [include a comment area](https://surveyjs.io/form-library/documentation/api-reference/question#showCommentArea).
     * @since 3.0.0
     */
    commentLabel?: ITextStyle;
}

/**
 * Defines spacing values applied to UI elements within [Checkboxes](https://surveyjs.io/form-library/documentation/api-reference/checkbox-question-model), [Radio Button Group](https://surveyjs.io/form-library/documentation/api-reference/radio-button-question-model), [Image Picker](https://surveyjs.io/form-library/documentation/api-reference/image-picker-question-model), [Ranking](https://surveyjs.io/form-library/documentation/api-reference/ranking-question-model), and [Rating Scale](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model) questions in an exported PDF document.
 * @since 3.0.0
 */
export interface ISelectBaseSpacing extends IQuestionSpacing {
    /**
     * Specifies the horizontal gap between choice columns, in points. Applies when choice options are [arranged in two or more columns](https://surveyjs.io/form-library/documentation/api-reference/checkbox-question-model#colCount).
     * @since 3.0.0
     */
    choiceColumnGap?: number;
    /**
     * Specifies the vertical gap between choice options, in points.
     * @since 3.0.0
     */
    choiceGap?: number;
    /**
     * Specifies the horizontal gap between the selection input (checkbox or radio button) and the choice text, in points.
     * @since 3.0.0
     */
    choiceTextGap?: number;
}
/**
 * A base interface extended by other interfaces that define visual styles for UI elements within select-like questions in an exported PDF document.
 * @since 3.0.0
 */
export interface ISelectBaseStyle extends IQuestionStyle {
    /**
     * Specifies the minimum width of choice columns, in points. Applies when choice options are [arranged in two or more columns](https://surveyjs.io/form-library/documentation/api-reference/checkbox-question-model#colCount).
     * @since 3.0.0
     */
    columnMinWidth?: number;
    /**
     * Specifies the visual style applied to choice text elements.
     * @since 3.0.0
     */
    choiceText?: ITextStyle;
    /**
     * Specifies the visual style applied to selection inputs (checkbox or radio button).
     * @since 3.0.0
     */
    input?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to selection inputs in read-only mode.
     * @since 3.0.0
     */
    inputReadOnly?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to checked selection inputs in read-only mode.
     * @since 3.0.0
     */
    inputReadOnlyChecked?: ISelectionInputStyle;
    /**
     * Specifies spacing values applied to question UI elements.
     * @since 3.0.0
     */
    spacing?: ISelectBaseSpacing;
}

/**
 * Defines the visual style applied to UI elements within [Checkboxes](https://surveyjs.io/form-library/documentation/api-reference/checkbox-question-model) questions in an exported PDF document.
 *
 * [PDF Appearance Customization - Styles Config](/pdf-generator/documentation/pdf-appearance-customization#styles-config (linkStyle))
 * @since 3.0.0
 */
export interface IQuestionCheckboxStyle extends ISelectBaseStyle {}
/**
 * Defines the visual style applied to UI elements within [Radio Button Group](https://surveyjs.io/form-library/documentation/api-reference/radio-button-question-model) questions in an exported PDF document.
 *
 * [PDF Appearance Customization - Styles Config](/pdf-generator/documentation/pdf-appearance-customization#styles-config (linkStyle))
 * @since 3.0.0
 */
export interface IQuestionRadiogroupStyle extends ISelectBaseStyle {}

/**
 * A base interface extended by other interfaces that define spacing values for matrix questions in an exported PDF document.
 * @since 3.0.0
 */
export interface IMatrixBaseSpacing extends IQuestionSpacing {
    /**
     * Specifies the horizontal gap between matrix table columns, in points. Applies only to matrices [rendered as tables](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#matrixRenderAs).
     * @since 3.0.0
     */
    tableColumnGap?: number;
    /**
     * Specifies the vertical gap between matrix table rows, in points. Applies only to matrices [rendered as tables](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#matrixRenderAs).
     * @since 3.0.0
     */
    tableRowGap?: number;
    /**
     * Specifies the vertical gap between list item sections, in points. Applies only to matrices [rendered as lists](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#matrixRenderAs).
     * @since 3.0.0
     */
    listSectionGap?: number;
    /**
     * Specifies the vertical gap between list items, in points. Applies only to matrices [rendered as lists](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#matrixRenderAs).
     * @since 3.0.0
     */
    listItemGap?: number;
    /**
     * Specifies the vertical gap between the list item title and the item content, in points. Applies only to matrices [rendered as lists](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#matrixRenderAs).
     * @since 3.0.0
     */
    listItemTitleContentGap?: number;
}
/**
 * A base interface extended by other interfaces that define visual styles for UI elements within matrix questions in an exported PDF document.
 * @since 3.0.0
 */
export interface IMatrixBaseStyle extends IQuestionStyle {
    /**
     * Specifies the minimum width of the container in which the matrix is rendered, in points.
     * @since 3.0.0
     */
    minWidth?: number;
    /**
     * Specifies the minimum width of matrix columns, in points. Applies only to matrices [rendered as tables](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#matrixRenderAs).
     * @since 3.0.0
     */
    columnMinWidth?: number;
    /**
     * Specifies the visual style applied to matrix cells in the exported PDF.
     * @since 3.0.0
     */
    cell?: IContainerStyle;
    /**
     * Specifies the visual style applied to matrix row titles in the exported PDF.
     * @since 3.0.0
     */
    rowTitle?: IAlignedTextStyle;
    /**
     * Specifies the visual style applied to matrix column titles in the exported PDF.
     * @since 3.0.0
     */
    columnTitle?: ITextStyle;
    /**
     * Specifies the visual style applied to the titles of list item sections. Applies only to matrices [rendered as lists](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#matrixRenderAs).
     *
     * Omitted settings are inherited from the [`rowTitle`](#rowTitle) property.
     * @since 3.0.0
     */
    listSectionTitle?: IAlignedTextStyle;
    /**
     * Specifies spacing values applied to matrix UI elements.
     * @since 3.0.0
     */
    spacing?: IMatrixBaseSpacing;
}
/**
 * Defines spacing values applied to UI elements within [Single-Select Matrix](https://surveyjs.io/form-library/documentation/api-reference/matrix-table-question-model) questions in an exported PDF document.
 * @since 3.0.0
 */
export interface IQuestionMatrixSpacing extends IMatrixBaseSpacing {
    gapBetweenItemText?: number; // remove this property
    /**
     * Specifies the vertical gap between choice options within list items, in points. Applies only to matrices [rendered as lists](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#matrixRenderAs).
     * @since 3.0.0
     */
    listChoiceGap?: number;
    /**
     * Specifies the horizontal gap between the selection input (checkbox or radio button) and the choice text within list items, in points. Applies only to matrices [rendered as lists](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#matrixRenderAs).
     * @since 3.0.0
     */
    listChoiceTextGap?: number;
}
/**
 * Defines the visual style applied to UI elements within [Single-Select Matrix](https://surveyjs.io/form-library/documentation/api-reference/matrix-table-question-model) questions in an exported PDF document.
 *
 * [PDF Appearance Customization - Styles Config](/pdf-generator/documentation/pdf-appearance-customization#styles-config (linkStyle))
 * @since 3.0.0
 */
export interface IQuestionMatrixStyle extends IMatrixBaseStyle {
    /**
     * Specifies the visual style applied to choice text elements within list items. Applies only to matrices [rendered as lists](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#matrixRenderAs).
     * @since 3.0.0
     */
    listChoiceText?: ITextStyle;
    /**
     * Specifies the visual style applied to selection inputs (checkboxes and radio buttons).
     * @since 3.0.0
     */
    input?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to selection inputs (checkboxes and radio buttons) in read-only mode.
     *
     * Omitted settings are inherited from the [`input`](#input) property.
     * @since 3.0.0
     */
    inputReadOnly?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to checked selection inputs (checkboxes and radio buttons) in read-only mode.
     *
     * Omitted settings are inherited according to the following chain:
     *
     * `inputReadOnlyChecked` <= [`inputReadonly`](#inputReadonly) <= [`input`](#input)
     * @since 3.0.0
     */
    inputReadOnlyChecked?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to radio buttons.
     *
     * Omitted settings are inherited from the [`input`](#input) property.
     * @since 3.0.0
     */
    radioInput?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to radio buttons in read-only mode.
     *
     * Omitted settings are inherited according to the following chain:
     *
     * `radioInputReadOnly` <= [`inputReadonly`](#inputReadonly) <= [`radioInput`](#radioInput) <= [`input`](#input)
     * @since 3.0.0
     */
    radioInputReadOnly?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to checked radio buttons in read-only mode.
     *
     * Omitted settings are inherited according to the following chain:
     *
     * `radioInputReadonlyChecked` <= [`inputReadOnlyChecked`](#inputReadOnlyChecked) <= [`radioInputReadOnly`](#radioInputReadOnly) <= [`inputReadonly`](#inputReadonly) <= [`radioInput`](#radioInput) <= [`input`](#input)
     * @since 3.0.0
     */
    radioInputReadOnlyChecked?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to checkboxes.
     *
     * Omitted settings are inherited from the [`input`](#input) property.
     * @since 3.0.0
     */
    checkboxInput?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to checkboxes in read-only mode.
     *
     * Omitted settings are inherited according to the following chain:
     *
     * `checkboxInputReadOnly` <= [`inputReadonly`](#inputReadonly) <= [`checkboxInput`](#checkboxInput) <= [`input`](#input)
     * @since 3.0.0
     */
    checkboxInputReadOnly?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to checked checkboxes in read-only mode.
     *
     * Omitted settings are inherited according to the following chain:
     *
     * `checkboxInputReadOnlyChecked` <= [`inputReadOnlyChecked`](#inputReadOnlyChecked) <= [`checkboxInputReadOnly`](#checkboxInputReadOnly) <= [`inputReadonly`](#inputReadonly) <= [`checkboxInput`](#checkboxInput) <= [`input`](#input)
     * @since 3.0.0
     */
    checkboxInputReadOnlyChecked?: ISelectionInputStyle;
    /**
     * Specifies spacing values applied to matrix UI elements.
     * @since 3.0.0
     */
    spacing?: IQuestionMatrixSpacing;
}

/**
 * A base interface extended by other interfaces that define visual styles for UI elements within Multi-Select Matrix and Dynamic Matrix questions in an exported PDF document.
 * @since 3.0.0
 */
export interface IMatrixDropdownBaseStyle extends IMatrixBaseStyle {
    /**
     * Specifies the visual style applied to list item titles. Applies only to matrices [rendered as lists](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#matrixRenderAs).
     * @since 3.0.0
     */
    listItemTitle?: ITextStyle;
}
/**
 * Defines the visual style applied to UI elements within [Multi-Select Matrix](https://surveyjs.io/form-library/documentation/api-reference/matrix-table-with-dropdown-list) questions in an exported PDF document.
 *
 * [PDF Appearance Customization - Styles Config](/pdf-generator/documentation/pdf-appearance-customization#styles-config (linkStyle))
 * @since 3.0.0
 */
export interface IQuestionMatrixDropdownStyle extends IMatrixDropdownBaseStyle {
    /**
     * Specifies the visual style applied to the containers in which item section titles are rendered. Applies only to matrices [rendered as lists](https://surveyjs.io/pdf-generator/documentation/api-reference/idocoptions#matrixRenderAs).
     * @since 3.0.0
     */
    listSectionTitleContainer?: IContainerStyle;
}
/**
 * Defines the visual style applied to UI elements within [Dynamic Matrix](https://surveyjs.io/form-library/documentation/api-reference/dynamic-matrix-table-question-model) questions in an exported PDF document.
 *
 * [PDF Appearance Customization - Styles Config](/pdf-generator/documentation/pdf-appearance-customization#styles-config (linkStyle))
 * @since 3.0.0
 */
export interface IQuestionMatrixDynamicStyle extends IMatrixDropdownBaseStyle {}

/**
 * Defines spacing values applied to UI elements within [Multiple Textboxes](https://surveyjs.io/form-library/documentation/api-reference/multiple-text-entry-question-model) questions in an exported PDF document.
 * @since 3.0.0
 */
export interface IQuestionMultipleTextSpacing extends IQuestionSpacing {
    /**
     * Specifies the horizontal gap between item columns, in points.
     * @since 3.0.0
     */
    itemColumnGap?: number;
    /**
     * Specifies the vertical gap between items, in points.
     * @since 3.0.0
     */
    itemGap?: number;
    /**
     * Specifies the horizontal gap between item titles and text boxes, in points.
     * @since 3.0.0
     */
    itemTitleGap?: number;
}
/**
 * Defines the visual style applied to UI elements within [Multiple Textboxes](https://surveyjs.io/form-library/documentation/api-reference/multiple-text-entry-question-model) questions in an exported PDF document.
 *
 * [PDF Appearance Customization - Styles Config](/pdf-generator/documentation/pdf-appearance-customization#styles-config (linkStyle))
 * @since 3.0.0
 */
export interface IQuestionMultipleTextStyle extends IQuestionStyle {
    /**
     * Specifies the width percentage allocated to item titles.
     *
     * Possible values: from 0 to 1 (for example, `0.25`)
     * @since 3.0.0
     */
    itemTitleWidthPercentage?: number;
    /**
     * Specifies the visual style applied to item titles.
     * @since 3.0.0
     */
    itemTitle?: ITextStyle;
    /**
     * Specifies the visual style applied to table cells that contain items titles or text boxes.
     * @since 3.0.0
     */
    itemCell?: IContainerStyle;
    /**
     * Specifies spacing values applied to question UI elements.
     * @since 3.0.0
     */
    spacing?: IQuestionMultipleTextSpacing;
}

/**
 * Defines the visual style applied to UI elements within [Rating Scale](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model) questions in an exported PDF document.
 *
 * [PDF Appearance Customization - Styles Config](/pdf-generator/documentation/pdf-appearance-customization#styles-config (linkStyle))
 * @since 3.0.0
 */
export interface IQuestionRatingStyle extends IQuestionStyle {
    /**
     * Specifies the minimum width of a choice item, in points.
     * @since 3.0.0
     */
    choiceMinWidth?: number;
    /**
     * Specifies the visual style applied to choice text elements.
     * @since 3.0.0
     */
    choiceText?: ITextStyle;
    /**
     * Specifies the visual style applied to selection inputs (radio buttons).
     * @since 3.0.0
     */
    input?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to selection inputs (radio buttons) in read-only mode.
     *
     * Omitted settings are inherited from the [`input`](#input) property.
     * @since 3.0.0
     */
    inputReadOnly?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to checked selection inputs (radio buttons) in read-only mode.
     *
     * Omitted settings are inherited according to the following chain:
     *
     * `inputReadOnlyChecked` <= [`inputReadonly`](#inputReadonly) <= [`input`](#input)
     * @since 3.0.0
     */
    inputReadOnlyChecked?: ISelectionInputStyle;
    /**
     * Specifies spacing values applied to question UI elements.
     * @since 3.0.0
     */
    spacing?: ISelectBaseSpacing;
}
/**
 * Defines the visual style applied to UI elements within [Ranking](https://surveyjs.io/form-library/documentation/api-reference/ranking-question-model) questions in an exported PDF document.
 *
 * [PDF Appearance Customization - Styles Config](/pdf-generator/documentation/pdf-appearance-customization#styles-config (linkStyle))
 * @since 3.0.0
 */
export interface IQuestionRankingStyle extends IQuestionStyle {
    /**
     * Specifies the visual style applied to the question input.
     * @since 3.0.0
     */
    input?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to the separator line between the ranked and unranked areas. Applies only to questions with [`selectToRankEnabled`](https://surveyjs.io/form-library/documentation/api-reference/ranking-question-model#selectToRankEnabled) set to `true`.
     * @since 3.0.0
     */
    selectToRankAreaSeparator?: ISeparatorStyle;
    /**
     * Specifies the visual style applied to choice text elements.
     * @since 3.0.0
     */
    choiceText?: ITextStyle;
    /**
     * Specifies spacing values applied to question UI elements.
     * @since 3.0.0
     */
    spacing?: ISelectBaseSpacing;
}
/**
 * Defines spacing values applied to UI elements within [Slider](https://surveyjs.io/form-library/documentation/api-reference/questionslidermodel) questions in an exported PDF document.
 * @since 3.0.0
 */
export interface IQuestionSliderSpacing extends IQuestionSpacing {
    /**
     * Specifies the horizontal gap between the two input elements representing a value range, in points. Applies only to questions with [`sliderType`](https://surveyjs.io/form-library/documentation/api-reference/questionslidermodel#sliderType) set to `"range"`.
     * @since 3.0.0
     */
    inputRangeGap?: number;
}
/**
 * Defines the visual style applied to UI elements within [Slider](https://surveyjs.io/form-library/documentation/api-reference/questionslidermodel) questions in an exported PDF document.
 *
 * [PDF Appearance Customization - Styles Config](/pdf-generator/documentation/pdf-appearance-customization#styles-config (linkStyle))
 * @since 3.0.0
 */
export interface IQuestionSliderStyle extends IQuestionStyle {
    /**
     * Specifies the visual style applied to input elements.
     * @since 3.0.0
     */
    input?: IInputStyle;
    /**
     * Specifies the visual style applied to input elements in read-only mode.
     *
     * Omitted settings are inherited from the [`input`](#input) property.
     * @since 3.0.0
     */
    inputReadOnly?: IInputStyle;
    /**
     * Specifies the visual style applied to the separator line between the minimum and maximum values in a range. Applies only to questions with [`sliderType`](https://surveyjs.io/form-library/documentation/api-reference/questionslidermodel#sliderType) set to `"range"`.
     * @since 3.0.0
     */
    rangeSeparator?: ISeparatorStyle;
    /**
     * Specifies spacing values applied to question UI elements.
     * @since 3.0.0
     */
    spacing?: IQuestionSliderSpacing;
}
/**
 * Defines the visual style applied to UI elements within [Dropdown](https://surveyjs.io/form-library/documentation/api-reference/dropdown-menu-model) questions in an exported PDF document.
 *
 * [PDF Appearance Customization - Styles Config](/pdf-generator/documentation/pdf-appearance-customization#styles-config (linkStyle))
 * @since 3.0.0
 */
export interface IQuestionDropdownStyle extends IQuestionStyle {
    /**
     * Specifies the visual style applied to the input element in read-only mode.
     *
     * Omitted settings are inherited from the [`input`](#input) property.
     * @since 3.0.0
     */
    inputReadOnly?: IInputStyle;
}
/**
 * Defines the visual style applied to UI elements within [Multi-Select Dropdown (Tag Box)](https://surveyjs.io/form-library/documentation/api-reference/dropdown-tag-box-model) questions in an exported PDF document.
 *
 * [PDF Appearance Customization - Styles Config](/pdf-generator/documentation/pdf-appearance-customization#styles-config (linkStyle))
 * @since 3.0.0
 */
export interface IQuestionTagboxStyle extends IQuestionCheckboxStyle {}

/**
 * Defines spacing values applied to UI elements within [File Upload](https://surveyjs.io/form-library/documentation/api-reference/file-model) questions in an exported PDF document.
 * @since 3.0.0
 */
export interface IQuestionFileSpacing extends IQuestionSpacing {
    /**
     * Specifies the vertical gap between image previews and file names, in points.
     * @since 3.0.0
     */
    imageFileNameGap?: number;
    /**
     * Specifies the horizontal gap between file item columns, in points.
     * @since 3.0.0
     */
    fileItemColumnGap?: number;
    /**
     * Specifies the vertical gap between file items, in points.
     * @since 3.0.0
     */
    fileItemGap?: number;
}
/**
 * Defines the visual style applied to UI elements within [File Upload](https://surveyjs.io/form-library/documentation/api-reference/file-model) questions in an exported PDF document.
 *
 * [PDF Appearance Customization - Styles Config](/pdf-generator/documentation/pdf-appearance-customization#styles-config (linkStyle))
 * @since 3.0.0
 */
export interface IQuestionFileStyle extends IQuestionStyle {
    /**
     * Specifies the minimum width allocated to render a file item (file name and preview), in points.
     * @since 3.0.0
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
     * @since 3.0.0
     */
    defaultImageFit?: string;
    /**
     * Specifies the visual style applied to file names.
     * @since 3.0.0
     */
    fileName?: ITextStyle;
    /**
     * Specifies spacing values applied to question UI elements.
     * @since 3.0.0
     */
    spacing?: IQuestionFileSpacing;
}
/**
 * Defines spacing values applied to UI elements within [Dynamic Panels](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model) in an exported PDF document.
 * @since 3.0.0
 */
export interface IQuestionPanelDynamicSpacing extends IQuestionSpacing {
    /**
     * Specifies the vertical gap between panels, in points.
     * @since 3.0.0
     */
    panelGap?: number;
}
/**
 * Defines the visual style applied to UI elements within [Dynamic Panels](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model) in an exported PDF document.
 *
 * [PDF Appearance Customization - Styles Config](/pdf-generator/documentation/pdf-appearance-customization#styles-config (linkStyle))
 * @since 3.0.0
 */
export interface IQuestionPanelDynamicStyle extends IQuestionStyle {
    /**
     * Specifies spacing values applied to the Dynamic Panel UI elements.
     * @since 3.0.0
     */
    spacing?: IQuestionPanelDynamicSpacing;
}
/**
 * Defines spacing values applied to UI elements within [Yes/No (Boolean)](https://surveyjs.io/form-library/documentation/api-reference/boolean-question-model) questions in an exported PDF document.
 * @since 3.0.0
 */
export interface IQuestionBooleanSpacing extends IQuestionSpacing {
    /**
     * Specifies the horizontal gap between choice columns, in points.
     * @since 3.0.0
     */
    choiceColumnGap?: number;
    /**
     * Specifies the horizontal gap between the selection input (checkbox or radio button) and the choice text, in points.
     * @since 3.0.0
     */
    choiceTextGap?: number;
}
/**
 * Defines the visual style applied to UI elements within [Yes/No (Boolean)](https://surveyjs.io/form-library/documentation/api-reference/boolean-question-model) questions in an exported PDF document.
 *
 * [PDF Appearance Customization - Styles Config](/pdf-generator/documentation/pdf-appearance-customization#styles-config (linkStyle))
 * @since 3.0.0
 */
export interface IQuestionBooleanStyle extends IQuestionStyle {
    /**
     * Specifies the visual style applied to choice text elements.
     * @since 3.0.0
     */
    choiceText?: ITextStyle;
    /**
     * Specifies the visual style applied to selection inputs (checkboxes and radio buttons).
     * @since 3.0.0
     */
    input?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to selection inputs (checkboxes and radio buttons) in read-only mode.
     *
     * Omitted settings are inherited from the [`input`](#input) property.
     * @since 3.0.0
     */
    inputReadOnly?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to checked selection inputs (checkboxes and radio buttons) in read-only mode.
     *
     * Omitted settings are inherited according to the following chain:
     *
     * `inputReadOnlyChecked` <= [`inputReadonly`](#inputReadonly) <= [`input`](#input)
     * @since 3.0.0
     */
    inputReadOnlyChecked?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to radio buttons.
     *
     * Omitted settings are inherited from the [`input`](#input) property.
     * @since 3.0.0
     */
    radioInput?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to radio buttons in read-only mode.
     *
     * Omitted settings are inherited according to the following chain:
     *
     * `radioInputReadOnly` <= [`inputReadonly`](#inputReadonly) <= [`radioInput`](#radioInput) <= [`input`](#input)
     * @since 3.0.0
     */
    radioInputReadOnly?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to checked radio buttons in read-only mode.
     *
     * Omitted settings are inherited according to the following chain:
     *
     * `radioInputReadonlyChecked` <= [`inputReadOnlyChecked`](#inputReadOnlyChecked) <= [`radioInputReadOnly`](#radioInputReadOnly) <= [`inputReadonly`](#inputReadonly) <= [`radioInput`](#radioInput) <= [`input`](#input)
     * @since 3.0.0
     */
    radioInputReadOnlyChecked?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to checkboxes.
     *
     * Omitted settings are inherited from the [`input`](#input) property.
     * @since 3.0.0
     */
    checkboxInput?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to checkboxes in read-only mode.
     *
     * Omitted settings are inherited according to the following chain:
     *
     * `checkboxInputReadOnly` <= [`inputReadonly`](#inputReadonly) <= [`checkboxInput`](#checkboxInput) <= [`input`](#input)
     * @since 3.0.0
     */
    checkboxInputReadOnly?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to checked checkboxes in read-only mode.
     *
     * Omitted settings are inherited according to the following chain:
     *
     * `checkboxInputReadOnlyChecked` <= [`inputReadOnlyChecked`](#inputReadOnlyChecked) <= [`checkboxInputReadOnly`](#checkboxInputReadOnly) <= [`inputReadonly`](#inputReadonly) <= [`checkboxInput`](#checkboxInput) <= [`input`](#input)
     * @since 3.0.0
     */
    checkboxInputReadOnlyChecked?: ISelectionInputStyle;
    /**
     * Specifies spacing values applied to matrix UI elements.
     * @since 3.0.0
     */
    spacing?: IQuestionBooleanSpacing;
}
/**
 * Defines spacing values applied to UI elements within [Image Picker](https://surveyjs.io/form-library/documentation/api-reference/image-picker-question-model) questions in an exported PDF document.
 * @since 3.0.0
 */
export interface IQuestionImagePickerSpacing extends ISelectBaseSpacing {
    /**
     * Specifies the vertical gap between the image preview and the input element, in points.
     * @since 3.0.0
     */
    imageInputGap?: number;
}
/**
 * Defines the visual style applied to UI elements within [Image Picker](https://surveyjs.io/form-library/documentation/api-reference/image-picker-question-model) questions in an exported PDF document.
 *
 * [PDF Appearance Customization - Styles Config](/pdf-generator/documentation/pdf-appearance-customization#styles-config (linkStyle))
 * @since 3.0.0
 */
export interface IQuestionImagePickerStyle extends ISelectBaseStyle {
    /**
     * Specifies the aspect ratio of images.
     * @since 3.0.0
     */
    imageRatio?: number;
    /**
     * Specifies the minimum width of images, in points.
     * @since 3.0.0
     */
    imageMinWidth?: number;
    /**
     * Specifies the maximum width of images, in points.
     * @since 3.0.0
     */
    imageMaxWidth?: number;
    /**
     * Specifies the visual style applied to radio buttons.
     *
     * Omitted settings are inherited from the [`input`](#input) property.
     * @since 3.0.0
     */
    radioInput?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to radio buttons in read-only mode.
     *
     * Omitted settings are inherited according to the following chain:
     *
     * `radioInputReadOnly` <= [`inputReadonly`](#inputReadonly) <= [`radioInput`](#radioInput) <= [`input`](#input)
     * @since 3.0.0
     */
    radioInputReadOnly?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to checked radio buttons in read-only mode.
     *
     * Omitted settings are inherited according to the following chain:
     *
     * `radioInputReadonlyChecked` <= [`inputReadOnlyChecked`](#inputReadOnlyChecked) <= [`radioInputReadOnly`](#radioInputReadOnly) <= [`inputReadonly`](#inputReadonly) <= [`radioInput`](#radioInput) <= [`input`](#input)
     * @since 3.0.0
     */
    radioInputReadOnlyChecked?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to checkboxes.
     *
     * Omitted settings are inherited from the [`input`](#input) property.
     * @since 3.0.0
     */
    checkboxInput?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to checkboxes in read-only mode.
     *
     * Omitted settings are inherited according to the following chain:
     *
     * `checkboxInputReadOnly` <= [`inputReadonly`](#inputReadonly) <= [`checkboxInput`](#checkboxInput) <= [`input`](#input)
     * @since 3.0.0
     */
    checkboxInputReadOnly?: ISelectionInputStyle;
    /**
     * Specifies the visual style applied to checked checkboxes in read-only mode.
     *
     * Omitted settings are inherited according to the following chain:
     *
     * `checkboxInputReadOnlyChecked` <= [`inputReadOnlyChecked`](#inputReadOnlyChecked) <= [`checkboxInputReadOnly`](#checkboxInputReadOnly) <= [`inputReadonly`](#inputReadonly) <= [`checkboxInput`](#checkboxInput) <= [`input`](#input)
     * @since 3.0.0
     */
    checkboxInputReadOnlyChecked?: ISelectionInputStyle;
    /**
     * Specifies spacing values applied to matrix UI elements.
     * @since 3.0.0
     */
    spacing?: IQuestionImagePickerSpacing;
}
/**
 * A base interface extended by other interfaces that define visual styles for UI elements within text questions in an exported PDF document.
 * @since 3.0.0
 */
export interface ITextBaseStyle extends IQuestionStyle {
    /**
     * Specifies the visual style applied to the question input in read-only mode.
     *
     * Omitted settings are inherited from the [`input`](#input) property.
     * @since 3.0.0
     */
    inputReadOnly?: IInputStyle;
}
/**
 * Defines the visual style applied to UI elements within [Single-Line Input](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model) questions in an exported PDF document.
 *
 * [PDF Appearance Customization - Styles Config](/pdf-generator/documentation/pdf-appearance-customization#styles-config (linkStyle))
 * @since 3.0.0
 */
export interface IQuestionTextStyle extends ITextBaseStyle {}
/**
 * Defines the visual style applied to UI elements within [Long Text](https://surveyjs.io/form-library/documentation/api-reference/comment-field-model) questions in an exported PDF document.
 *
 * [PDF Appearance Customization - Styles Config](/pdf-generator/documentation/pdf-appearance-customization#styles-config (linkStyle))
 * @since 3.0.0
 */
export interface IQuestionCommentStyle extends ITextBaseStyle {}
/**
 * Defines the visual style applied to [Expression](https://surveyjs.io/form-library/documentation/api-reference/expression-model) survey elements in an exported PDF document.
 *
 * [PDF Appearance Customization - Styles Config](/pdf-generator/documentation/pdf-appearance-customization#styles-config (linkStyle))
 * @since 3.0.0
 */
export interface IQuestionExpressionStyle extends IQuestionStyle {}
/**
 * Defines the visual style applied to [HTML](https://surveyjs.io/form-library/documentation/api-reference/add-custom-html-to-survey) survey elements in an exported PDF document.
 *
 * [PDF Appearance Customization - Styles Config](/pdf-generator/documentation/pdf-appearance-customization#styles-config (linkStyle))
 * @since 3.0.0
 */
export interface IQuestionHtmlStyle extends IQuestionStyle {
    /**
     * Specifies the visual style applied to textual content.
     * @since 3.0.0
     */
    text?: ITextStyle;
}
/**
 * Defines the visual style applied to UI elements in an exported PDF document.
 *
 * [PDF Appearance Customization - Styles Config](/pdf-generator/documentation/pdf-appearance-customization#styles-config (linkStyle))
 * @since 3.0.0
 */
export interface IDocStyle {
    /**
     * Defines the visual style applied to [survey](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model) UI elements in an exported PDF document.
     * @since 3.0.0
     */
    survey?: ISurveyStyle;
    /**
     * Defines the visual style applied to [page](https://surveyjs.io/form-library/documentation/api-reference/page-model) UI elements in an exported PDF document.
     * @since 3.0.0
     */
    page?: IPageStyle;
    /**
     * Defines the visual style applied to [panel](https://surveyjs.io/form-library/documentation/api-reference/panel-model) UI elements in an exported PDF document.
     * @since 3.0.0
     */
    panel?: IPanelStyle;
    /**
     * Defines the visual style applied to UI elements within [Dynamic Panels](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model) in an exported PDF document.
     * @since 3.0.0
     */
    paneldynamic?: IQuestionPanelDynamicStyle;
    matrixbase?: IMatrixBaseStyle;
    /**
     * Defines the visual style applied to UI elements within [Single-Select Matrix](https://surveyjs.io/form-library/documentation/api-reference/matrix-table-question-model) questions in an exported PDF document.
     * @since 3.0.0
     */
    matrix?: IQuestionMatrixStyle;
    matrixdropdownbase?: IMatrixDropdownBaseStyle;
    /**
     * Defines the visual style applied to UI elements within [Multi-Select Matrix](https://surveyjs.io/form-library/documentation/api-reference/matrix-table-with-dropdown-list) questions in an exported PDF document.
     * @since 3.0.0
     */
    matrixdropdown?: IQuestionMatrixDropdownStyle;
    /**
     * Defines the visual style applied to UI elements within [Dynamic Matrix](https://surveyjs.io/form-library/documentation/api-reference/dynamic-matrix-table-question-model) questions in an exported PDF document.
     * @since 3.0.0
     */
    matrixdynamic?: IQuestionMatrixDynamicStyle;
    textbase?: ITextBaseStyle;
    /**
     * Defines the visual style applied to UI elements within [Single-Line Input](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model) questions in an exported PDF document.
     * @since 3.0.0
     */
    text?: IQuestionTextStyle;
    /**
     * Defines the visual style applied to UI elements within [Long Text](https://surveyjs.io/form-library/documentation/api-reference/comment-field-model) questions in an exported PDF document.
     * @since 3.0.0
     */
    comment?: IQuestionCommentStyle;
    /**
     * Defines the visual style applied to UI elements within [Multiple Textboxes](https://surveyjs.io/form-library/documentation/api-reference/multiple-text-entry-question-model) questions in an exported PDF document.
     * @since 3.0.0
     */
    multipletext?: IQuestionMultipleTextStyle;
    /**
     * Defines the visual style applied to [question](https://surveyjs.io/form-library/documentation/api-reference/question) UI elements in an exported PDF document.
     * @since 3.0.0
     */
    question?: IQuestionStyle;
    selectbase?: ISelectBaseStyle;
    /**
     * Defines the visual style applied to UI elements within [Checkboxes](https://surveyjs.io/form-library/documentation/api-reference/checkbox-question-model) questions in an exported PDF document.
     * @since 3.0.0
     */
    checkbox?: IQuestionCheckboxStyle;
    /**
     * Defines the visual style applied to UI elements within [Radio Button Group](https://surveyjs.io/form-library/documentation/api-reference/radio-button-question-model) questions in an exported PDF document.
     * @since 3.0.0
     */
    radiogroup?: IQuestionRadiogroupStyle;
    /**
     * Defines the visual style applied to UI elements within [Image Picker](https://surveyjs.io/form-library/documentation/api-reference/image-picker-question-model) questions in an exported PDF document.
     * @since 3.0.0
     */
    imagepicker?: IQuestionImagePickerStyle;
    /**
     * Defines the visual style applied to UI elements within [Dropdown](https://surveyjs.io/form-library/documentation/api-reference/dropdown-menu-model) questions in an exported PDF document.
     * @since 3.0.0
     */
    dropdown?: IQuestionDropdownStyle;
    /**
     * Defines the visual style applied to UI elements within [Multi-Select Dropdown (Tag Box)](https://surveyjs.io/form-library/documentation/api-reference/dropdown-tag-box-model) questions in an exported PDF document.
     * @since 3.0.0
     */
    tagbox?: IQuestionTagboxStyle;
    /**
     * Defines the visual style applied to UI elements within [Yes/No (Boolean)](https://surveyjs.io/form-library/documentation/api-reference/boolean-question-model) questions in an exported PDF document.
     * @since 3.0.0
     */
    boolean?: IQuestionBooleanStyle;
    /**
     * Defines the visual style applied to UI elements within [Rating Scale](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model) questions in an exported PDF document.
     * @since 3.0.0
     */
    rating?: IQuestionRatingStyle;
    /**
     * Defines the visual style applied to UI elements within [Ranking](https://surveyjs.io/form-library/documentation/api-reference/ranking-question-model) questions in an exported PDF document.
     * @since 3.0.0
     */
    ranking?: IQuestionRankingStyle;
    /**
     * Defines the visual style applied to [Expression](https://surveyjs.io/form-library/documentation/api-reference/expression-model) survey elements in an exported PDF document.
     * @since 3.0.0
     */
    expression?: IQuestionExpressionStyle;
    /**
     * Defines the visual style applied to [HTML](https://surveyjs.io/form-library/documentation/api-reference/add-custom-html-to-survey) survey elements in an exported PDF document.
     * @since 3.0.0
     */
    html?: IQuestionHtmlStyle;
    /**
     * Defines the visual style applied to UI elements within [File Upload](https://surveyjs.io/form-library/documentation/api-reference/file-model) questions in an exported PDF document.
     * @since 3.0.0
     */
    file?: IQuestionFileStyle;
    /**
     * Defines the visual style applied to UI elements within [Slider](https://surveyjs.io/form-library/documentation/api-reference/questionslidermodel) questions in an exported PDF document.
     * @since 3.0.0
     */
    slider?: IQuestionSliderStyle;
}