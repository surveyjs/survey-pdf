export interface ITextStyle {
  fontColor?: string;
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
    contentGap?: number; // headerContentGap
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
    contentGap?: number; // headerContentGap
    gapBetweenRows?: number; // elementGap
    gapBetweenElements?: number; // inlineElementGap
    titleDescriptionGap?: number;
}
export interface IPanelStyle {
    title?: ITextStyle;
    description?: ITextStyle;
    header?: IContainerStyle;
    wrapper?: IContainerStyle; // container
    minWidth?: number;
    spacing?: IPanelSpacing;
}

export interface IPageStyle extends IPanelStyle {}

export interface IQuestionSpacing {
  titleRequiredGap?: number; // titleRequiredMarkGap
  titleNumberGap?: number;
  contentGapVertical?: number; // headerContentGap
  contentGapHorizontal?: number; // inlineHeaderContentGap
  contentIndent?: number; // contentIndentStart
  commentGap?: number; // contentCommentGap
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
    titleLeftWidthPers?: number; // inlineHeaderWidthPercentage
    wrapper?: IContainerStyle; // container
    comment?: IInputStyle;
    commentReadOnly?: IInputStyle;
    input?: IInputStyle;
    spacing?: IQuestionSpacing;
}
export interface ISelectBaseSpacing extends IQuestionSpacing {
  gapBetweenColumns?: number; // choiceColumnGap
  gapBetweenRows?: number; // choiceGap
  gapBetweenItemText?: number; // choiceTextGap
}
export interface ISelectBaseStyle extends IQuestionStyle {
  columnMinWidth?: number;
  label?: ITextStyle; // choiceText
  input?: ISelectionInputStyle;
  inputReadOnly?: ISelectionInputStyle;
  inputReadOnlyChecked?: ISelectionInputStyle;
  spacing?: ISelectBaseSpacing;
}

export interface IQuestionCheckboxStyle extends ISelectBaseStyle {}
export interface IQuestionRadiogroupStyle extends ISelectBaseStyle {}

export interface IMatrixBaseSpacing extends IQuestionSpacing {
    titleDescriptionGap?: number;
    contentGapVertical?: number; // headerContentGap
    gapBetweenColumns?: number; // tableColumnGap
    gapBetweenRows?: number; // tableRowGap
    verticalGapBetweenRows?: number; // listSectionGap
    listItemGap?: number; // distance between questions in a matrix rendered as a list
    verticalGapBetweenRowTitleQuestion?: number; // listItemTitleContentGap
}
export interface IMatrixBaseStyle extends IQuestionStyle {
    minWidth?: number;
    columnMinWidth?: number;
    cell?: IContainerStyle;
    rowTitle?: IAlignedTextStyle;
    columnTitle?: ITextStyle;
    verticalRowTitle?: IAlignedTextStyle; // listSectionTitle
    spacing?: IMatrixBaseSpacing;
}
export interface IQuestionMatrixSpacing extends IMatrixBaseSpacing {
    gapBetweenItemText?: number; // remove this property
    verticalGapBetweenItems?: number; // listChoiceGap
    verticalGapBetweenItemText?: number; // listChoiceTextGap
}
export interface IQuestionMatrixStyle extends IMatrixBaseStyle {
    verticalColumnTitle?: ITextStyle; // listChoiceText
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
    verticalColumnTitle?: ITextStyle; // listItemTitle
}
export interface IQuestionMatrixDropdownStyle extends IMatrixDropdownBaseStyle {
    cellVerticalRowTitle?: IContainerStyle; // listSectionTitleContainer
    verticalRowTitle?: IAlignedTextStyle; // listSectionTitle
}
export interface IQuestionMatrixDynamicStyle extends IMatrixDropdownBaseStyle {}

export interface IQuestionMultipleTextSpacing extends IQuestionSpacing {
    titleDescriptionGap?: number;
    contentGapVertical?: number; // headerContentGap
    gapBetweenColumns?: number; // itemColumnGap
    gapBetweenRows?: number; // itemGap
    gapBetweenItemText?: number; // itemTitleGap
}
export interface IQuestionMultipleTextStyle extends IQuestionStyle {
    itemTitleWidthPers?: number; // itemTitleWidthPercentage?
    label?: ITextStyle; // itemTitle
    cell?: IContainerStyle;
    spacing?: IQuestionMultipleTextSpacing;
}

export interface IQuestionRatingSpacing extends IQuestionSpacing {
    gapBetweenColumns?: number; // choiceColumnGap
    gapBetweenRows?: number; // choiceGap
    gapBetweenItemText?: number; // choiceTextGap
}

export interface IQuestionRatingStyle extends IQuestionStyle {
    itemMinWidth?: number; // choiceMinWidth
    label?: ITextStyle; // choiceText
    input?: ISelectionInputStyle;
    inputReadOnly?: ISelectionInputStyle;
    inputReadOnlyChecked?: ISelectionInputStyle;
    spacing?: IQuestionRatingSpacing;
}
export interface IQuestionRankingSpacing extends IQuestionSpacing {
    gapBetweenColumns?: number; // choiceColumnGap
    gapBetweenRows?: number; // choiceGap
    gapBetweenItemText?: number; // choiceTextGap
}
export interface IQuestionRankingStyle extends IQuestionStyle {
    input?: ISelectionInputStyle;
    selectToRankSeparator?: ISeparatorStyle; // selectToRankAreaSeparator
    label?: ITextStyle; // choiceText
    spacing?: IQuestionRankingSpacing;
}
export interface IQuestionSliderSpacing extends IQuestionSpacing {
    gapBetweenColumns?: number; // inputRangeGap
}
export interface IQuestionSliderStyle extends IQuestionStyle { // IQuestionSliderStyle
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
    imageGap?: number; // imageFileNameGap
    gapBetweenColumns?: number; // fileItemColumnGap
    gapBetweenRows?: number; // fileItemGap
}
export interface IQuestionFileStyle extends IQuestionStyle {
    itemMinWidth?: number; // fileItemMinWidth
    defaultImageFit?: string;
    label?: ITextStyle; // fileName
    spacing: IQuestionFileSpacing;
}
export interface IQuestionPanelDynamicSpacing extends IQuestionSpacing {
    gapBetweenPanels?: number; // panelGap
}
export interface IQuestionPanelDynamicStyle extends IQuestionStyle {
    spacing?: IQuestionPanelDynamicSpacing;
}
export interface IQuestionBooleanSpacing extends IQuestionSpacing {
    gapBetweenColumns?: number; // choiceColumnGap
    gapBetweenItemText?: number; // choiceTextGap
}
export interface IQuestionBooleanStyle extends IQuestionStyle {
    label?: ITextStyle; // choiceText
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
    gapBetweenImageInput?: number; // imageInputGap
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