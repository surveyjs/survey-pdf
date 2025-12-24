export interface ITextStyle {
    fontColor?: string;
    fontName?: string;
    fontSize?: number;
    fontStyle?: string;
    lineHeight?: number;
}

export interface IAlignedTextStyle extends ITextStyle {
    textAlign?: 'center' | 'left' | 'right';
}

export interface IBorderStyle {
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number;
}

export interface IInputStyle extends IBorderStyle, ITextStyle {
    backgroundColor?: string;
}

export interface IContainerStyle extends IBorderStyle {
    backgroundColor?: string;
    padding?: number | number[];
}
export interface ISelectionInputStyle extends IInputStyle {
    checkMark?: string;
    width?: number;
    height?: number;
}

export interface ISeparatorStyle {
    width?: number;
    height?: number;
    color?: string;
}

export interface ISurveySpacing {
    headerContentGap?: number;
    titleDescriptionGap?: number;
}

export interface ISurveyStyle {
    title?: ITextStyle;
    description?: ITextStyle;
    backgroundColor?: string;
    padding?: number[] | number;
    spacing?: ISurveySpacing;
}
export interface IPanelSpacing {
    headerContentGap?: number;
    elementGap?: number;
    inlineElementGap?: number;
    titleDescriptionGap?: number;
}
export interface IPanelStyle {
    title?: ITextStyle;
    description?: ITextStyle;
    header?: IContainerStyle;
    container?: IContainerStyle;
    minWidth?: number;
    spacing?: IPanelSpacing;
}

export interface IPageStyle extends IPanelStyle {}

export interface IQuestionSpacing {
    titleRequiredMarkGap?: number;
    titleNumberGap?: number;
    headerContentGap?: number;
    inlineHeaderContentGap?: number;
    contentIndentStart?: number;
    contentCommentGap?: number;
    contentDescriptionGap?: number;
    titleDescriptionGap?: number;
}
export interface IQuestionStyle {
    title?: ITextStyle;
    //added this props (required and number are used to render asterix and number for question)
    required?: ITextStyle;
    number?: ITextStyle;
    header?: IContainerStyle;
    //
    description?: ITextStyle;
    minWidth?: number;
    inlineHeaderWidthPercentage?: number;
    container?: IContainerStyle;
    comment?: IInputStyle;
    commentReadOnly?: IInputStyle;
    input?: IInputStyle;
    spacing?: IQuestionSpacing;
}
export interface ISelectBaseSpacing extends IQuestionSpacing {
    choiceColumnGap?: number;
    choiceGap?: number;
    choiceTextGap?: number;
}
export interface ISelectBaseStyle extends IQuestionStyle {
    columnMinWidth?: number;
    choiceText?: ITextStyle;
    input?: ISelectionInputStyle;
    inputReadOnly?: ISelectionInputStyle;
    inputReadOnlyChecked?: ISelectionInputStyle;
    spacing?: ISelectBaseSpacing;
}

export interface IQuestionCheckboxStyle extends ISelectBaseStyle {}
export interface IQuestionRadiogroupStyle extends ISelectBaseStyle {}

export interface IMatrixBaseSpacing extends IQuestionSpacing {
    tableColumnGap?: number;
    tableRowGap?: number;
    listSectionGap?: number;
    listItemGap?: number; // distance between questions in a matrix rendered as a list
    listItemTitleContentGap?: number;
}
export interface IMatrixBaseStyle extends IQuestionStyle {
    minWidth?: number;
    columnMinWidth?: number;
    cell?: IContainerStyle;
    rowTitle?: IAlignedTextStyle;
    columnTitle?: ITextStyle;
    listSectionTitle?: IAlignedTextStyle;
    spacing?: IMatrixBaseSpacing;
}
export interface IQuestionMatrixSpacing extends IMatrixBaseSpacing {
    gapBetweenItemText?: number; // remove this property
    listChoiceGap?: number;
    listChoiceTextGap?: number;
}
export interface IQuestionMatrixStyle extends IMatrixBaseStyle {
    listChoiceText?: ITextStyle;
    input?: ISelectionInputStyle;
    inputReadOnly?: ISelectionInputStyle;
    inputReadOnlyChecked?: ISelectionInputStyle;
    radioInput?: ISelectionInputStyle;
    radioInputReadOnly?: ISelectionInputStyle;
    radioInputReadOnlyChecked?: ISelectionInputStyle;
    checkboxInput?: ISelectionInputStyle;
    checkboxInputReadOnly?: ISelectionInputStyle;
    checkboxInputReadOnlyChecked?: ISelectionInputStyle;
    spacing?: IQuestionMatrixSpacing;
}

export interface IMatrixDropdownBaseStyle extends IMatrixBaseStyle {
    listItemTitle?: ITextStyle;
}
export interface IQuestionMatrixDropdownStyle extends IMatrixDropdownBaseStyle {
    listSectionTitleContainer?: IContainerStyle;
    listSectionTitle?: IAlignedTextStyle;
}
export interface IQuestionMatrixDynamicStyle extends IMatrixDropdownBaseStyle {}

export interface IQuestionMultipleTextSpacing extends IQuestionSpacing {
    itemColumnGap?: number;
    itemGap?: number;
    itemTitleGap?: number;
}
export interface IQuestionMultipleTextStyle extends IQuestionStyle {
    itemTitleWidthPercentage?: number;
    itemTitle?: ITextStyle;
    cell?: IContainerStyle;
    spacing?: IQuestionMultipleTextSpacing;
}

export interface IQuestionRatingSpacing extends IQuestionSpacing {
    choiceColumnGap?: number;
    choiceGap?: number;
    choiceTextGap?: number;
}

export interface IQuestionRatingStyle extends IQuestionStyle {
    choiceMinWidth?: number;
    choiceText?: ITextStyle;
    input?: ISelectionInputStyle;
    inputReadOnly?: ISelectionInputStyle;
    inputReadOnlyChecked?: ISelectionInputStyle;
    spacing?: IQuestionRatingSpacing;
}
export interface IQuestionRankingSpacing extends IQuestionSpacing {
    choiceColumnGap?: number;
    choiceGap?: number;
    choiceTextGap?: number;
}
export interface IQuestionRankingStyle extends IQuestionStyle {
    input?: ISelectionInputStyle;
    selectToRankAreaSeparator?: ISeparatorStyle;
    choiceText?: ITextStyle;
    spacing?: IQuestionRankingSpacing;
}
export interface IQuestionSliderSpacing extends IQuestionSpacing {
    inputRangeGap?: number;
}
export interface IQuestionSliderStyle extends IQuestionStyle {
    input?: IInputStyle;
    inputReadOnly?: IInputStyle;
    rangeSeparator?: ISeparatorStyle;
    spacing?: IQuestionSliderSpacing;
}
export interface IQuestionDropdownStyle extends IQuestionStyle {
    inputReadOnly?: IInputStyle;
}
export interface IQuestionTagboxStyle extends IQuestionCheckboxStyle {}
export interface IQuestionFileSpacing extends IQuestionSpacing {
    imageFileNameGap?: number;
    fileItemColumnGap?: number;
    fileItemGap?: number;
}
export interface IQuestionFileStyle extends IQuestionStyle {
    fileItemMinWidth?: number;
    defaultImageFit?: string;
    fileName?: ITextStyle;
    spacing?: IQuestionFileSpacing;
}
export interface IQuestionPanelDynamicSpacing extends IQuestionSpacing {
    panelGap?: number;
}
export interface IQuestionPanelDynamicStyle extends IQuestionStyle {
    spacing?: IQuestionPanelDynamicSpacing;
}
export interface IQuestionBooleanSpacing extends IQuestionSpacing {
    choiceColumnGap?: number;
    choiceTextGap?: number;
}
export interface IQuestionBooleanStyle extends IQuestionStyle {
    choiceText?: ITextStyle;
    input?: ISelectionInputStyle;
    inputReadOnly?: ISelectionInputStyle;
    inputReadOnlyChecked?: ISelectionInputStyle;
    radioInput?: ISelectionInputStyle;
    radioInputReadOnly?: ISelectionInputStyle;
    //added this property
    radioInputReadOnlyChecked?: ISelectionInputStyle;
    checkboxInput?: ISelectionInputStyle;
    checkboxInputReadOnly?: ISelectionInputStyle;
    //added this property
    checkboxInputReadOnlyChecked?: ISelectionInputStyle;
    spacing?: IQuestionBooleanSpacing;
}
export interface IQuestionImagePickerSpacing extends ISelectBaseSpacing {
    imageInputGap?: number;
}
export interface IQuestionImagePickerStyle extends ISelectBaseStyle {
    imageRatio?: number;
    imageMinWidth?: number;
    imageMaxWidth?: number;
    radioInput?: ISelectionInputStyle;
    radioInputReadOnly?: ISelectionInputStyle;
    //added this property
    radioInputReadOnlyChecked?: ISelectionInputStyle;
    checkboxInput?: ISelectionInputStyle;
    checkboxInputReadOnly?: ISelectionInputStyle;
    //added this property
    checkboxInputReadOnlyChecked?: ISelectionInputStyle;
    spacing?: IQuestionImagePickerSpacing;
}
export interface ITextBaseStyle extends IQuestionStyle {
    inputReadOnly?: IInputStyle;
}
export interface IQuestionTextStyle extends ITextBaseStyle {}
export interface IQuestionCommentStyle extends ITextBaseStyle{}
export interface IQuestionExpressionStyle extends IQuestionStyle {}
export interface IQuestionHtmlStyle extends IQuestionStyle {
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