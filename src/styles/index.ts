import { getColorVariable, getSizeVariable } from './utils';
import { ITheme } from 'survey-core';
export type IStyles = { [index: string]: any }

export function createStylesFromTheme(theme: ITheme, callback: (options: { cssVariables: { [index: string]: string }, getColorVariable: (varName: string) => string, getSizeVariable:(varName: string) => number }) => IStyles) {
    const hash = {};
    const { cssVariables } = theme;
    return callback({ cssVariables: cssVariables, getColorVariable: getColorVariable.bind(this, cssVariables, hash), getSizeVariable: getSizeVariable.bind(this, cssVariables, hash) });
}
export function getDefaultStylesFromTheme (theme: ITheme) {
    return createStylesFromTheme(theme, ({ getSizeVariable, getColorVariable }) => {
        const baseSize = getSizeVariable('--sjs2-base-unit-size');
        return {
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
            backgroundColor: getColorVariable('--sjs2-color-utility-body'),
            padding: [getSizeVariable('--sjs2-pdf-layout-page-padding-top'), getSizeVariable('--sjs2-pdf-layout-page-padding-right'), getSizeVariable('--sjs2-pdf-layout-page-padding-bottom'), getSizeVariable('--sjs2-pdf-layout-page-padding-left')],
            descriptionGap: getSizeVariable('--sjs2-pdf-layout-title-large-gap'),
            contentGap: getSizeVariable('--sjs2-pdf-layout-page-gap-vertical') + getSizeVariable('--sjs2-pdf-layout-title-large-padding-bottom'),
            question: {
                titleLeftWidthPers: Math.E / 10.0,
                titleRequiredGap: baseSize / 2,
                titleNumberGap: baseSize / 2,
                contentGapVertical: getSizeVariable('--sjs2-pdf-layout-question-gap'),
                //TODO: need variable
                contentGapHorizontal: baseSize * 1.0,
                contentIndent: 0,
                descriptionGap: getSizeVariable('--sjs2-pdf-layout-question-labels-gap-vertical'),
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
                    fontColor: getColorVariable('--sjs2-color-fg-basic-primary'),
                    fontSize: getSizeVariable('--sjs2-typography-font-size-default'),
                    lineHeight: getSizeVariable('--sjs2-typography-line-height-default'),
                },
                input: {
                    fontColor: getColorVariable('--sjs2-color-fg-basic-primary'),
                    fontSize: getSizeVariable('--sjs2-typography-font-size-default'),
                    lineHeight: getColorVariable('--sjs2-typography-line-height-default')
                }
            },
            panel: {
                gapBetweenRows: getSizeVariable('--sjs2-pdf-layout-page-questions-gap-vertical'),
                gapBetweenElements: getSizeVariable('--sjs2-pdf-layout-page-questions-gap-horizontal'),
                contentGap: getSizeVariable('--sjs2-pdf-layout-page-questions-gap-vertical'),
                descriptionGap: getSizeVariable('--sjs2-pdf-layout-title-default-gap'),
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
            },
            page: {
                contentGap: getSizeVariable('--sjs2-pdf-layout-page-gap-vertical') + getSizeVariable('--sjs2-pdf-layout-title-medium-padding-bottom'),
                gapBetweenRows: getSizeVariable('--sjs2-pdf-layout-page-gap-vertical'),
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
                }
            },
            selectbase: {
                columnMinWidth: baseSize * 5,
                gapBetweenColumns: getSizeVariable('--sjs2-pdf-layout-question-items-gap-horizontal'),
                gapBetweenRows: getSizeVariable('--sjs2-pdf-layout-question-items-gap-vertical'),
                gapBetweenItemText: getSizeVariable('--sjs2-pdf-layout-check-gap'),
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
                    fontColor: getColorVariable('--sjs2-color-fg-basic-primary'),
                    backgroundColor: getColorVariable('--sjs2-color-control-check-false-default-bg'),
                },
                inputReadOnly: {
                    fontColor: getColorVariable('--sjs2-color-control-check-true-default-icon'),
                    backgroundColor: getColorVariable('--sjs2-color-control-check-false-default-bg'),
                },
                inputReadOnlyChecked: {
                    borderColor: getColorVariable('--sjs2-color-control-check-true-default-border'),
                    backgroundColor: getColorVariable('--sjs2-color-control-check-true-default-bg')
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
                descriptionGap: getSizeVariable('--sjs2-pdf-layout-title-default-gap'),
                columnMinWidth: baseSize * 15,
                contentGapVertical: getSizeVariable('--sjs2-pdf-layout-page-questions-gap-vertical'),
                gapBetweenColumns: getSizeVariable('--sjs2-pdf-layout-page-matrix-gap-horizontal'),
                gapBetweenRows: getSizeVariable('--sjs2-pdf-layout-page-matrix-gap-vertical'),
                verticalGapBetweenRows: getSizeVariable('--sjs2-pdf-layout-page-questions-gap-vertical'),
                verticalGapBetweenRowTitleQuestion: getSizeVariable('--sjs2-pdf-layout-question-gap'),
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
                    textAlign: 'left'
                }
            },
            matrix: {
                gapBetweenItemText: getSizeVariable('--sjs2-pdf-layout-check-gap'),
                verticalGapBetweenItems: getSizeVariable('--sjs2-pdf-layout-question-items-gap-vertical'),
                verticalGapBetweenItemText: getSizeVariable('--sjs2-pdf-layout-check-gap'),
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
                    fontColor: getColorVariable('--sjs2-color-fg-basic-primary'),
                    backgroundColor: getColorVariable('--sjs2-color-control-check-false-default-bg'),
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
                }
            },
            matrixdropdownbase: {
                cellDetail: {
                    borderMode: 1,
                    padding: 0
                },
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
                descriptionGap: getSizeVariable('--sjs2-pdf-layout-title-default-gap'),
                contentGapVertical: getSizeVariable('--sjs2-pdf-layout-page-questions-gap-vertical'),
                gapBetweenColumns: getSizeVariable('--sjs2-pdf-layout-page-matrix-gap-horizontal'),
                gapBetweenRows: getSizeVariable('--sjs2-pdf-layout-page-matrix-gap-vertical'),
                gapBetweenItemText: getSizeVariable('--sjs2-pdf-layout-page-matrix-gap-horizontal'),
                itemTitleWidthPers: 0.4,
                wrapper: {
                    padding: 0,
                    borderWidth: 0,
                    backgroundColor: null as any
                },
                header: {
                    padding: [getSizeVariable('--sjs2-pdf-layout-section-padding-vertical'), getColorVariable('--sjs2-pdf-layout-section-padding-horizontal')],
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
            },
            rating: {
                gapBetweenColumns: getSizeVariable('--sjs2-pdf-layout-question-items-gap-horizontal'),
                gapBetweenRows: getSizeVariable('--sjs2-pdf-layout-question-items-gap-vertical'),
                gapBetweenItemText: getSizeVariable('--sjs2-pdf-layout-check-gap'),
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
                    fontColor: getColorVariable('--sjs2-color-fg-basic-primary'),
                    backgroundColor: getColorVariable('--sjs2-color-control-check-false-default-bg'),
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
                }
            },
            ranking: {
                gapBetweenItemText: baseSize * 0.25,
                gapBetweenColumns: baseSize * 1.5,
                gapBetweenRows: baseSize * 0.25,
                input: {
                    height: baseSize * 2,
                    width: baseSize * 2,
                    fontSize: baseSize * 2
                },
            },
            slider: {
                gapBetweenColumns: baseSize * 8,
                input: {
                    fontSize: baseSize * 2.5,
                    lineHeight: baseSize * 3
                },
                rangeSeparator: {
                    width: baseSize * 3,
                    height: baseSize * 0.125,
                    backgroundColor: getColorVariable('--sjs2-color-fg-basic-primary')
                },
            },
            dropdown: {
                input: {
                    borderWidth: 0,
                    fontName: undefined as any,
                    fontColor: getColorVariable('--sjs2-color-fg-basic-primary'),
                    backgroundColor: getColorVariable('--sjs2-color-control-check-false-default-bg'),
                    fontSize: getSizeVariable('--sjs2-typography-font-size-default'),
                    lineHeight: getColorVariable('--sjs2-typography-line-height-default')
                },
                inputReadOnly: {
                    backgroundColor: undefined
                }
            },
            file: {
                imageGap: getSizeVariable('--sjs2-pdf-layout-question-items-gap-vertical'),
                itemMinWidth: baseSize * 5,
                defaultImageFit: 'contain',
                gapBetweenColumns: getSizeVariable('--sjs2-pdf-layout-question-items-gap-horizontal'),
                gapBetweenRows: getSizeVariable('--sjs2-pdf-layout-question-items-gap-vertical'),
                label: {
                    fontColor: getColorVariable('--sjs2-color-fg-note-primary'),
                    fontSize: getSizeVariable('--sjs2-typography-font-size-default'),
                    lineHeight: getSizeVariable('--sjs2-typography-line-height-default')
                },
            },
            paneldynamic: {
                contentGapVertical: getSizeVariable('--sjs2-pdf-layout-page-questions-gap-vertical'),
                descriptionGap: getSizeVariable('--sjs2-pdf-layout-title-default-gap'),
                gapBetweenPanels: getSizeVariable('--sjs2-pdf-layout-page-questions-gap-vertical'),
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
                }
            },
            boolean: {
                gapBetweenColumns: getSizeVariable('--sjs2-pdf-layout-question-items-gap-horizontal'),
                gapBetweenItemText: getSizeVariable('--sjs2-pdf-layout-check-gap'),
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
                    fontColor: getColorVariable('--sjs2-color-fg-basic-primary'),
                    backgroundColor: getColorVariable('--sjs2-color-control-check-false-default-bg'),
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
                }
            },
            imagepicker: {
                imageRatio: 4 / 3,
                imageMinWidth: baseSize * 12.5,
                imageMaxWidth: baseSize * 37.5,
                gapBetweenImageInput: getSizeVariable('--sjs2-pdf-layout-image-picker-items-gap-image-check'),
                inputReadOnly: {
                    borderRadius: getSizeVariable('--sjs2-pdf-radius-checkbox'),
                },
                radioInput: {
                    checkMark: 'l'
                },
                checkboxInput: {
                    checkMark: '3'
                },
            },
            textbase: {
                input: {
                    fontColor: getColorVariable('--sjs2-color-fg-basic-primary'),
                    fontSize: getSizeVariable('--sjs2-typography-font-size-default'),
                    lineHeight: getColorVariable('--sjs2-typography-line-height-default')
                }
            },
            expression: {
                input: {
                    fontColor: getColorVariable('--sjs2-color-fg-basic-primary'),
                    fontSize: getSizeVariable('--sjs2-typography-font-size-default'),
                    lineHeight: getColorVariable('--sjs2-typography-line-height-default')
                }
            },
            html: {
                fontColor: getColorVariable('--sjs2-color-fg-basic-primary'),
                fontSize: getSizeVariable('--sjs2-typography-font-size-default'),
                lineHeight: getSizeVariable('--sjs2-typography-line-height-default')
            }
        };
    });
}