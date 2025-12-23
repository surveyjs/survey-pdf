import { getVariablesManager } from './utils';
import { ITheme } from 'survey-core';
import { IDocStyles } from './types';

export function createStylesFromTheme<T>(theme: ITheme, callback: (options: { getColorVariable: (varName: string) => string, getSizeVariable:(varName: string) => number }) => T) {
    const { cssVariables } = theme;
    const variablesManager = getVariablesManager();
    variablesManager.setup(cssVariables);
    variablesManager.startCollectingVariables();
    const res = callback({ getColorVariable: (name: string) => variablesManager.getColorVariable(name), getSizeVariable: (name: string) => variablesManager.getSizeVariable(name) });
    variablesManager.stopCollectingVariables();
    return res;
}

export function getDefaultStylesFromTheme (theme: ITheme): IDocStyles {
    return createStylesFromTheme(theme, ({ getSizeVariable, getColorVariable }) => {
        const baseSize = getSizeVariable('--sjs2-base-unit-size');
        return {
            survey: {
                title: {
                    fontSize: getSizeVariable('--sjs2-typography-font-size-large'),
                    lineHeight: getSizeVariable('--sjs2-typography-line-height-large'),
                    fontStyle: 'bold',
                    fontColor: getColorVariable('--sjs2-color-fg-basic-primary'),
                },
                description: {
                    //TODO:need variables
                    fontSize: baseSize * 2,
                    lineHeight: baseSize * 3,
                    fontStyle: 'normal',
                    fontColor: getColorVariable('--sjs2-color-fg-basic-secondary'),
                },
                spacing: {
                    titleDescriptionGap: getSizeVariable('--sjs2-pdf-layout-title-large-gap'),
                    contentGap: getSizeVariable('--sjs2-pdf-layout-page-gap-vertical') + getSizeVariable('--sjs2-pdf-layout-title-large-padding-bottom'),
                },
                backgroundColor: getColorVariable('--sjs2-color-utility-body'),
                padding: [getSizeVariable('--sjs2-pdf-layout-page-padding-top'), getSizeVariable('--sjs2-pdf-layout-page-padding-right'), getSizeVariable('--sjs2-pdf-layout-page-padding-bottom'), getSizeVariable('--sjs2-pdf-layout-page-padding-left')],
            },
            question: {
                minWidth: baseSize * 25,
                titleLeftWidthPers: Math.E / 10.0,
                //TODO: need variable
                wrapper: {
                    padding: [getSizeVariable('--sjs2-pdf-layout-question-padding-vertical'), getSizeVariable('--sjs2-pdf-layout-question-padding-horizontal')],
                    borderRadius: getSizeVariable('--sjs2-pdf-radius-question'),
                    borderWidth: getSizeVariable('--sjs2-pdf-border-width-question'),
                    borderColor: getColorVariable('--sjs2-color-border-basic-secondary'),
                    backgroundColor: getColorVariable('--sjs2-color-bg-basic-primary')
                },
                title: {
                    fontColor: getColorVariable('--sjs2-color-fg-basic-primary'),
                    fontSize: getSizeVariable('--sjs2-typography-font-size-small'),
                    lineHeight: getSizeVariable('--sjs2-typography-line-height-small'),
                    fontStyle: 'normal',
                },
                description: {
                    fontColor: getColorVariable('--sjs2-color-fg-basic-secondary'),
                    fontSize: getSizeVariable('--sjs2-typography-font-size-small'),
                    fontStyle: 'normal',
                    lineHeight: getSizeVariable('--sjs2-typography-line-height-small')
                },
                comment: {
                    fontSize: getSizeVariable('--sjs2-typography-font-size-default'),
                    lineHeight: getSizeVariable('--sjs2-typography-line-height-default'),
                    fontColor: getColorVariable('--sjs2-color-control-input-default-value'),
                    backgroundColor: getColorVariable('--sjs2-color-control-formbox-default-bg'),
                },
                commentReadOnly: {
                    backgroundColor: null as any,
                    fontColor: getColorVariable('--sjs2-color-fg-basic-primary'),
                },
                input: {
                    fontColor: getColorVariable('--sjs2-color-fg-basic-primary'),
                    fontSize: getSizeVariable('--sjs2-typography-font-size-default'),
                    lineHeight: getSizeVariable('--sjs2-typography-line-height-default')
                },
                spacing: {
                    contentGapVertical: getSizeVariable('--sjs2-pdf-layout-question-gap'),
                    contentGapHorizontal: baseSize * 1.0,
                    contentIndent: 0,
                    commentGap: getSizeVariable('--sjs2-pdf-layout-question-gap'),
                    contentDescriptionGap: getSizeVariable('--sjs2-pdf-layout-question-gap'),
                    titleDescriptionGap: getSizeVariable('--sjs2-pdf-layout-question-labels-gap-vertical'),
                    titleRequiredGap: baseSize / 2,
                    titleNumberGap: baseSize / 2,
                }
            },
            panel: {
                minWidth: baseSize * 75,
                header: {
                    padding: [getSizeVariable('--sjs2-pdf-layout-section-padding-vertical'), getSizeVariable('--sjs2-pdf-layout-section-padding-horizontal')],
                    borderRadius: getSizeVariable('--sjs2-pdf-radius-section'),
                    backgroundColor: getColorVariable('--sjs2-color-bg-basic-secondary'),
                    borderWidth: getSizeVariable('--sjs2-pdf-border-width-section'),
                    borderColor: getColorVariable('--sjs2-color-border-basic-secondary'),
                },
                title: {
                    fontSize: getSizeVariable('--sjs2-typography-font-size-default'),
                    fontColor: getColorVariable('--sjs2-color-fg-basic-primary'),
                    fontStyle: 'bold',
                    lineHeight: getSizeVariable('--sjs2-typography-line-height-default'),
                },
                description: {
                    fontColor: getColorVariable('--sjs2-color-fg-basic-secondary'),
                    fontSize: getSizeVariable('--sjs2-typography-font-size-small'),
                    lineHeight: getSizeVariable('--sjs2-typography-line-height-small'),
                },
                spacing: {
                    gapBetweenRows: getSizeVariable('--sjs2-pdf-layout-page-questions-gap-vertical'),
                    gapBetweenElements: getSizeVariable('--sjs2-pdf-layout-page-questions-gap-horizontal'),
                    contentGap: getSizeVariable('--sjs2-pdf-layout-page-questions-gap-vertical'),
                    titleDescriptionGap: getSizeVariable('--sjs2-pdf-layout-title-default-gap'),
                }
            },
            page: {
                header: {
                    borderWidth: 0,
                    padding: 0,
                    backgroundColor: null as any
                },
                title: {
                    fontColor: getColorVariable('--sjs2-color-fg-basic-primary'),
                    fontSize: getSizeVariable('--sjs2-typography-font-size-medium'),
                    fontStyle: 'bold',
                    lineHeight: getSizeVariable('--sjs2-typography-line-height-medium')
                },
                description: {
                    fontColor: getColorVariable('--sjs2-color-fg-basic-secondary'),
                    fontSize: getSizeVariable('--sjs2-typography-font-size-default'),
                    lineHeight: getSizeVariable('--sjs2-typography-line-height-default')
                },
                spacing: {
                    contentGap: getSizeVariable('--sjs2-pdf-layout-page-gap-vertical') + getSizeVariable('--sjs2-pdf-layout-title-medium-padding-bottom'),
                    gapBetweenRows: getSizeVariable('--sjs2-pdf-layout-page-gap-vertical'),
                }
            },
            selectbase: {
                columnMinWidth: baseSize * 20,
                label: {
                    fontColor: getColorVariable('--sjs2-color-fg-basic-primary'),
                    fontSize: getSizeVariable('--sjs2-typography-font-size-default'),
                    fontStyle: 'normal',
                    lineHeight: getSizeVariable('--sjs2-typography-line-height-default')
                },
                input: {
                //todo may be we need variable
                    width: baseSize * 2,
                    height: baseSize * 2,
                    fontSize: baseSize * 1.25,
                    borderColor: getColorVariable('--sjs2-color-control-check-false-default-border'),
                    borderWidth: getSizeVariable('--sjs2-pdf-border-width-check'),
                    fontName: 'zapfdingbats',
                    backgroundColor: getColorVariable('--sjs2-color-bg-basic-primary'),
                    fontColor: getColorVariable('--sjs2-color-fg-brand-primary'),
                },
                inputReadOnly: {
                    fontColor: getColorVariable('--sjs2-color-control-check-true-default-icon'),
                    backgroundColor: getColorVariable('--sjs2-color-control-check-false-default-bg'),
                },
                inputReadOnlyChecked: {
                    borderColor: getColorVariable('--sjs2-color-control-check-true-default-border'),
                    backgroundColor: getColorVariable('--sjs2-color-control-check-true-default-bg')
                },
                spacing: {
                    gapBetweenColumns: getSizeVariable('--sjs2-pdf-layout-question-items-gap-horizontal'),
                    gapBetweenRows: getSizeVariable('--sjs2-pdf-layout-question-items-gap-vertical'),
                    gapBetweenItemText: getSizeVariable('--sjs2-pdf-layout-check-gap'),
                }
            },
            checkbox: {
                input: {
                    checkMark: '3'
                },
                inputReadOnly: {
                    borderRadius: getSizeVariable('--sjs2-pdf-radius-checkbox'),
                }
            },
            radiogroup: {
                input: {
                    checkMark: 'l'
                },
                inputReadOnly: {
                    borderRadius: getSizeVariable('--sjs2-pdf-radius-radio')
                }
            },
            matrixbase: {
                minWidth: baseSize * 40,
                columnMinWidth: baseSize * 15,
                wrapper: {
                    padding: 0,
                    borderWidth: 0,
                    backgroundColor: null as any
                },
                header: {
                    padding: [getSizeVariable('--sjs2-pdf-layout-section-padding-vertical'), getSizeVariable('--sjs2-pdf-layout-section-padding-horizontal')],
                    borderRadius: getSizeVariable('--sjs2-pdf-radius-section'),
                    backgroundColor: getColorVariable('--sjs2-color-bg-basic-secondary'),
                    borderWidth: getSizeVariable('--sjs2-pdf-border-width-section'),
                    borderColor: getColorVariable('--sjs2-color-border-basic-secondary'),
                },
                title: {
                    fontSize: getSizeVariable('--sjs2-typography-font-size-default'),
                    fontColor: getColorVariable('--sjs2-color-fg-basic-primary'),
                    fontStyle: 'bold',
                    lineHeight: getSizeVariable('--sjs2-typography-line-height-default'),
                },
                description: {
                    fontColor: getColorVariable('--sjs2-color-fg-basic-secondary'),
                    fontSize: getSizeVariable('--sjs2-typography-font-size-small'),
                    lineHeight: getSizeVariable('--sjs2-typography-line-height-small'),
                },
                cell: {
                    padding: [getSizeVariable('--sjs2-pdf-layout-question-padding-vertical'), getSizeVariable('--sjs2-pdf-layout-question-padding-horizontal')],
                    borderRadius: getSizeVariable('--sjs2-pdf-radius-matrix'),
                    borderWidth: getSizeVariable('--sjs2-pdf-border-width-question'),
                    borderColor: getColorVariable('--sjs2-color-border-basic-secondary'),
                    backgroundColor: getColorVariable('--sjs2-color-bg-basic-primary'),
                },
                rowTitle: {
                    fontSize: getSizeVariable('--sjs2-typography-font-size-default'),
                    lineHeight: getSizeVariable('--sjs2-typography-line-height-default'),
                    fontColor: getColorVariable('--sjs2-color-fg-basic-secondary'),
                    fontStyle: 'normal',
                    textAlign: 'right'
                },
                columnTitle: {
                    fontSize: getSizeVariable('--sjs2-typography-font-size-default'),
                    lineHeight: getSizeVariable('--sjs2-typography-line-height-default'),
                    fontColor: getColorVariable('--sjs2-color-fg-basic-secondary'),
                    fontStyle: 'normal'
                },
                verticalRowTitle: {
                    textAlign: 'left',
                },
                spacing: {
                    titleDescriptionGap: getSizeVariable('--sjs2-pdf-layout-title-default-gap'),
                    contentGapVertical: getSizeVariable('--sjs2-pdf-layout-page-questions-gap-vertical'),
                    gapBetweenColumns: getSizeVariable('--sjs2-pdf-layout-page-matrix-gap-horizontal'),
                    gapBetweenRows: getSizeVariable('--sjs2-pdf-layout-page-matrix-gap-vertical'),
                    verticalGapBetweenRows: getSizeVariable('--sjs2-pdf-layout-page-questions-gap-vertical'),
                    verticalGapBetweenRowTitleQuestion: getSizeVariable('--sjs2-pdf-layout-question-gap'),
                }
            },
            matrix: {
                verticalColumnTitle: {
                    fontColor: getColorVariable('--sjs2-color-fg-basic-primary'),
                    fontSize: getSizeVariable('--sjs2-typography-font-size-default'),
                    fontStyle: 'normal',
                    lineHeight: getSizeVariable('--sjs2-typography-line-height-default')
                },
                verticalRowTitle: {
                    fontColor: getColorVariable('--sjs2-color-fg-basic-primary'),
                    fontSize: getSizeVariable('--sjs2-typography-font-size-small'),
                    lineHeight: getSizeVariable('--sjs2-typography-line-height-small'),
                    fontStyle: 'normal',
                },
                input: {
                //todo may be we need variable
                    width: baseSize * 2,
                    height: baseSize * 2,
                    fontSize: baseSize * 1.25,
                    borderColor: getColorVariable('--sjs2-color-control-check-false-default-border'),
                    borderWidth: getSizeVariable('--sjs2-pdf-border-width-check'),
                    backgroundColor: getColorVariable('--sjs2-color-bg-basic-primary'),
                    fontColor: getColorVariable('--sjs2-color-fg-brand-primary'),
                    fontName: 'zapfdingbats',
                },
                inputReadOnly: {
                    fontColor: getColorVariable('--sjs2-color-control-check-true-default-icon'),
                    backgroundColor: getColorVariable('--sjs2-color-control-check-false-default-bg'),
                },
                inputReadOnlyChecked: {
                    borderColor: getColorVariable('--sjs2-color-control-check-true-default-border'),
                    backgroundColor: getColorVariable('--sjs2-color-control-check-true-default-bg')
                },
                radioInput: {
                    checkMark: 'l'
                },
                radioInputReadOnly: {
                    borderRadius: getSizeVariable('--sjs2-pdf-radius-radio')
                },
                checkboxInput: {
                    checkMark: '3'
                },
                checkboxInputReadOnly: {
                    borderRadius: getSizeVariable('--sjs2-pdf-radius-checkbox'),
                },
                spacing: {
                    gapBetweenItemText: getSizeVariable('--sjs2-pdf-layout-check-gap'),
                    verticalGapBetweenItems: getSizeVariable('--sjs2-pdf-layout-question-items-gap-vertical'),
                    verticalGapBetweenItemText: getSizeVariable('--sjs2-pdf-layout-check-gap'),
                }
            },
            matrixdropdownbase: {
                verticalColumnTitle: {
                    fontColor: getColorVariable('--sjs2-color-fg-basic-primary'),
                    fontSize: getSizeVariable('--sjs2-typography-font-size-small'),
                    lineHeight: getSizeVariable('--sjs2-typography-line-height-small'),
                    fontStyle: 'normal',
                },
            },
            matrixdropdown: {
                cellVerticalRowTitle: {
                    padding: [getSizeVariable('--sjs2-pdf-layout-section-padding-vertical'), getSizeVariable('--sjs2-pdf-layout-section-padding-horizontal')],
                    borderRadius: getSizeVariable('--sjs2-pdf-radius-section'),
                    backgroundColor: getColorVariable('--sjs2-color-bg-basic-secondary'),
                    borderWidth: getSizeVariable('--sjs2-pdf-border-width-section'),
                    borderColor: getColorVariable('--sjs2-color-border-basic-secondary'),
                },
                verticalRowTitle: {
                    fontSize: getSizeVariable('--sjs2-typography-font-size-default'),
                    fontColor: getColorVariable('--sjs2-color-fg-basic-primary'),
                    fontStyle: 'bold',
                    lineHeight: getSizeVariable('--sjs2-typography-line-height-default'),
                },
            },
            multipletext: {
                itemTitleWidthPers: 0.4,
                wrapper: {
                    padding: 0,
                    borderWidth: 0,
                    backgroundColor: null as any
                },
                header: {
                    padding: [getSizeVariable('--sjgetColorVariables2-pdf-layout-section-padding-vertical'), getSizeVariable('--sjs2-pdf-layout-section-padding-horizontal')],
                    borderRadius: getSizeVariable('--sjs2-pdf-radius-section'),
                    backgroundColor: getColorVariable('--sjs2-color-bg-basic-secondary'),
                    borderWidth: getSizeVariable('--sjs2-pdf-border-width-section'),
                    borderColor: getColorVariable('--sjs2-color-border-basic-secondary'),
                },
                title: {
                    fontSize: getSizeVariable('--sjs2-typography-font-size-default'),
                    fontColor: getColorVariable('--sjs2-color-fg-basic-primary'),
                    fontStyle: 'bold',
                    lineHeight: getSizeVariable('--sjs2-typography-line-height-default'),
                },
                description: {
                    fontColor: getColorVariable('--sjs2-color-fg-basic-secondary'),
                    fontSize: getSizeVariable('--sjs2-typography-font-size-small'),
                    lineHeight: getSizeVariable('--sjs2-typography-line-height-small'),
                },
                label: {
                    fontSize: getSizeVariable('--sjs2-typography-font-size-default'),
                    lineHeight: getSizeVariable('--sjs2-typography-line-height-default'),
                    fontColor: getColorVariable('--sjs2-color-fg-basic-secondary'),
                    fontStyle: 'normal',
                },
                cell: {
                    padding: [getSizeVariable('--sjs2-pdf-layout-question-padding-vertical'), getSizeVariable('--sjs2-pdf-layout-question-padding-horizontal')],
                    borderRadius: getSizeVariable('--sjs2-pdf-radius-matrix'),
                    borderWidth: getSizeVariable('--sjs2-pdf-border-width-question'),
                    borderColor: getColorVariable('--sjs2-color-border-basic-secondary'),
                    backgroundColor: getColorVariable('--sjs2-color-bg-basic-primary'),
                },
                spacing: {
                    titleDescriptionGap: getSizeVariable('--sjs2-pdf-layout-title-default-gap'),
                    contentGapVertical: getSizeVariable('--sjs2-pdf-layout-page-questions-gap-vertical'),
                    gapBetweenColumns: getSizeVariable('--sjs2-pdf-layout-page-matrix-gap-horizontal'),
                    gapBetweenRows: getSizeVariable('--sjs2-pdf-layout-page-matrix-gap-vertical'),
                    gapBetweenItemText: getSizeVariable('--sjs2-pdf-layout-page-matrix-gap-horizontal'),
                }
            },
            rating: {
                itemMinWidth: baseSize * 3,
                label: {
                    fontColor: getColorVariable('--sjs2-color-fg-basic-primary'),
                    fontSize: getSizeVariable('--sjs2-typography-font-size-default'),
                    fontStyle: 'normal',
                    lineHeight: getSizeVariable('--sjs2-typography-line-height-default')
                },
                input: {
                //todo may be we need variable
                    width: baseSize * 2,
                    height: baseSize * 2,
                    fontSize: baseSize * 1.25,
                    borderColor: getColorVariable('--sjs2-color-control-check-false-default-border'),
                    borderWidth: getSizeVariable('--sjs2-pdf-border-width-check'),
                    backgroundColor: getColorVariable('--sjs2-color-bg-basic-primary'),
                    fontColor: getColorVariable('--sjs2-color-fg-brand-primary'),
                    fontName: 'zapfdingbats',
                    checkMark: 'l',
                },
                inputReadOnly: {
                    fontColor: getColorVariable('--sjs2-color-control-check-true-default-icon'),
                    backgroundColor: getColorVariable('--sjs2-color-control-check-false-default-bg'),
                    borderRadius: getSizeVariable('--sjs2-pdf-radius-checkbox'),
                },
                inputReadOnlyChecked: {
                    borderColor: getColorVariable('--sjs2-color-control-check-true-default-border'),
                    backgroundColor: getColorVariable('--sjs2-color-control-check-true-default-bg')
                },
                spacing: {
                    gapBetweenColumns: getSizeVariable('--sjs2-pdf-layout-question-items-gap-horizontal'),
                    gapBetweenRows: getSizeVariable('--sjs2-pdf-layout-question-items-gap-vertical'),
                    gapBetweenItemText: getSizeVariable('--sjs2-pdf-layout-check-gap'),
                }
            },
            ranking: {
                input: {
                //todo may be we need variable
                    width: baseSize * 2,
                    height: baseSize * 2,
                    fontSize: baseSize * 1.25,
                    lineHeight: baseSize * 1.25,
                    borderColor: getColorVariable('--sjs2-color-control-check-false-default-border'),
                    borderWidth: getSizeVariable('--sjs2-pdf-border-width-check'),
                    fontName: 'helvetica',
                    fontStyle: 'normal',
                    fontColor: getColorVariable('--sjs2-color-fg-basic-primary'),
                    backgroundColor: getColorVariable('--sjs2-color-control-check-false-default-bg'),
                },
                selectToRankSeparator: {
                    width: baseSize / 7,
                    color: getColorVariable('--sjs2-color-fg-basic-primary')
                },
                label: {
                    fontColor: getColorVariable('--sjs2-color-fg-basic-primary'),
                    fontSize: getSizeVariable('--sjs2-typography-font-size-default'),
                    fontStyle: 'normal',
                    lineHeight: getSizeVariable('--sjs2-typography-line-height-default')
                },
                spacing: {
                    gapBetweenColumns: getSizeVariable('--sjs2-pdf-layout-question-items-gap-horizontal'),
                    gapBetweenRows: getSizeVariable('--sjs2-pdf-layout-question-items-gap-vertical'),
                    gapBetweenItemText: getSizeVariable('--sjs2-pdf-layout-check-gap'),
                }
            },
            slider: {
                input: {
                    fontSize: getSizeVariable('--sjs2-typography-font-size-default'),
                    lineHeight: getSizeVariable('--sjs2-typography-line-height-default'),
                    backgroundColor: getColorVariable('--sjs2-color-control-formbox-default-bg'),
                    fontColor: getColorVariable('--sjs2-color-control-input-default-value'),
                },
                inputReadOnly: {
                    backgroundColor: null as any,
                    fontColor: getColorVariable('--sjs2-color-fg-basic-primary'),
                },
                rangeSeparator: {
                    width: baseSize * 3,
                    height: baseSize * 0.125,
                    backgroundColor: getColorVariable('--sjs2-color-fg-basic-primary')
                },
                spacing: {
                    gapBetweenColumns: baseSize * 8,
                }
            },
            dropdown: {
                input: {
                    borderWidth: 0,
                    fontName: undefined as any,
                    fontSize: getSizeVariable('--sjs2-typography-font-size-default'),
                    lineHeight: getSizeVariable('--sjs2-typography-line-height-default'),
                    fontColor: getColorVariable('--sjs2-color-control-input-default-value'),
                    backgroundColor: getColorVariable('--sjs2-color-control-formbox-default-bg'),

                },
                inputReadOnly: {
                    backgroundColor: null as any,
                    fontColor: getColorVariable('--sjs2-color-fg-basic-primary'),
                },
            },
            file: {
                itemMinWidth: baseSize * 5,
                defaultImageFit: 'contain',
                label: {
                    fontColor: getColorVariable('--sjs2-color-fg-note-primary'),
                    fontSize: getSizeVariable('--sjs2-typography-font-size-default'),
                    lineHeight: getSizeVariable('--sjs2-typography-line-height-default')
                },
                spacing: {
                    imageGap: getSizeVariable('--sjs2-pdf-layout-question-items-gap-vertical'),
                    gapBetweenColumns: getSizeVariable('--sjs2-pdf-layout-question-items-gap-horizontal'),
                    gapBetweenRows: getSizeVariable('--sjs2-pdf-layout-question-items-gap-vertical'),
                }
            },
            paneldynamic: {
                wrapper: {
                    padding: 0,
                    borderWidth: 0,
                    backgroundColor: null as any
                },
                header: {
                    padding: [getSizeVariable('--sjs2-pdf-layout-section-padding-vertical'), getSizeVariable('--sjs2-pdf-layout-section-padding-horizontal')],
                    borderRadius: getSizeVariable('--sjs2-pdf-radius-section'),
                    backgroundColor: getColorVariable('--sjs2-color-bg-basic-secondary'),
                    borderWidth: getSizeVariable('--sjs2-pdf-border-width-section'),
                    borderColor: getColorVariable('--sjs2-color-border-basic-secondary'),
                },
                title: {
                    fontSize: getSizeVariable('--sjs2-typography-font-size-default'),
                    fontColor: getColorVariable('--sjs2-color-fg-basic-primary'),
                    fontStyle: 'bold',
                    lineHeight: getSizeVariable('--sjs2-typography-line-height-default'),
                },
                description: {
                    fontColor: getColorVariable('--sjs2-color-fg-basic-secondary'),
                    fontSize: getSizeVariable('--sjs2-typography-font-size-small'),
                    lineHeight: getSizeVariable('--sjs2-typography-line-height-small'),
                },
                spacing: {
                    contentGapVertical: getSizeVariable('--sjs2-pdf-layout-page-questions-gap-vertical'),
                    titleDescriptionGap: getSizeVariable('--sjs2-pdf-layout-title-default-gap'),
                    gapBetweenPanels: getSizeVariable('--sjs2-pdf-layout-page-questions-gap-vertical'),
                }
            },
            boolean: {
                label: {
                    fontColor: getColorVariable('--sjs2-color-fg-basic-primary'),
                    fontSize: getSizeVariable('--sjs2-typography-font-size-default'),
                    fontStyle: 'normal',
                    lineHeight: getSizeVariable('--sjs2-typography-line-height-default')
                },
                input: {
                //todo may be we need variable
                    width: baseSize * 2,
                    height: baseSize * 2,
                    fontSize: baseSize * 1.25,
                    borderColor: getColorVariable('--sjs2-color-control-check-false-default-border'),
                    borderWidth: getSizeVariable('--sjs2-pdf-border-width-check'),
                    backgroundColor: getColorVariable('--sjs2-color-bg-basic-primary'),
                    fontColor: getColorVariable('--sjs2-color-fg-brand-primary'),
                    fontName: 'zapfdingbats',
                },
                inputReadOnly: {
                    fontColor: getColorVariable('--sjs2-color-control-check-true-default-icon'),
                    backgroundColor: getColorVariable('--sjs2-color-control-check-false-default-bg'),
                },
                inputReadOnlyChecked: {
                    borderColor: getColorVariable('--sjs2-color-control-check-true-default-border'),
                    backgroundColor: getColorVariable('--sjs2-color-control-check-true-default-bg')
                },
                radioInput: {
                    checkMark: 'l'
                },
                radioInputReadOnly: {
                    borderRadius: getSizeVariable('--sjs2-pdf-radius-radio')
                },
                checkboxInput: {
                    checkMark: '3'
                },
                checkboxInputReadOnly: {
                    borderRadius: getSizeVariable('--sjs2-pdf-radius-checkbox'),
                },
                spacing: {
                    gapBetweenColumns: getSizeVariable('--sjs2-pdf-layout-question-items-gap-horizontal'),
                    gapBetweenItemText: getSizeVariable('--sjs2-pdf-layout-check-gap'),
                }
            },
            imagepicker: {
                imageRatio: 4 / 3,
                imageMinWidth: baseSize * 12.5,
                imageMaxWidth: baseSize * 37.5,
                inputReadOnly: {
                    borderRadius: getSizeVariable('--sjs2-pdf-radius-checkbox'),
                },
                radioInput: {
                    checkMark: 'l'
                },
                checkboxInput: {
                    checkMark: '3'
                },
                spacing: {
                    gapBetweenImageInput: getSizeVariable('--sjs2-pdf-layout-image-picker-items-gap-image-check'),
                }
            },
            textbase: {
                input: {
                    fontSize: getSizeVariable('--sjs2-typography-font-size-default'),
                    lineHeight: getSizeVariable('--sjs2-typography-line-height-default'),
                    backgroundColor: getColorVariable('--sjs2-color-control-formbox-default-bg'),
                    fontColor: getColorVariable('--sjs2-color-control-input-default-value'),
                },
                inputReadOnly: {
                    backgroundColor: null as any,
                    fontColor: getColorVariable('--sjs2-color-fg-basic-primary'),
                }
            },
            expression: {
                input: {
                    fontColor: getColorVariable('--sjs2-color-fg-basic-primary'),
                    fontSize: getSizeVariable('--sjs2-typography-font-size-default'),
                    lineHeight: getSizeVariable('--sjs2-typography-line-height-default')
                }
            },
            html: {
                text: {
                    fontColor: getColorVariable('--sjs2-color-fg-basic-primary'),
                    fontSize: getSizeVariable('--sjs2-typography-font-size-default'),
                    lineHeight: getSizeVariable('--sjs2-typography-line-height-default')
                }
            }
        };
    });
}