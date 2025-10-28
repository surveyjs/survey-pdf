export type IStyles = { [index: string]: any }
export function getDefaultStyles (baseSize: number) {
    return {
        title: {
            fontSize: baseSize * 4,
            fontStyle: 'bold',
            fontColor: '#000',
            lineHeight: baseSize * 5,
        },
        description: {
            fontSize: baseSize * 2,
            lineHeight: baseSize * 3,
            fontStyle: 'normal',
            fontColor: '#000',
        },
        descriptionGap: baseSize * 1.5,
        contentGap: baseSize * 4.0,
        question: {
            titleLeftWidthPers: Math.E / 10.0,
            contentGapVertical: baseSize * 0.5,
            contentGapHorizontal: baseSize * 1.0,
            contentIndent: 0,
            descriptionGap: baseSize * 0.0625,
            gapBetweenItemText: baseSize * 0.25,
            gapBetweenColumns: baseSize * 1.5,
            gapBetweenRows: baseSize * 0.25,
            wrapper: {
                padding: [baseSize * 0.5, baseSize],
                borderWidth: baseSize * 0.125,
                borderColor: '#000'
            },
            title: {
                lineHeight: baseSize * 3,
                fontSize: baseSize * 2,
                fontStyle: 'normal',
                fontColor: '#000',
            },
            description: {
                fontSize: baseSize * 2,
            },
            comment: {
                borderColor: '#000',
                borderWidth: 0,
                fontColor: '#000',
                fontSize: baseSize * 2.5,
                lineHeight: baseSize * 3,
            },
            input: {
                borderColor: '#000',
                borderWidth: 0,
                fontColor: '#000',
                fontSize: baseSize * 2.5,
            }
        },
        panel: {
            gapBetweenRows: 0,
            gapBetweenElements: 0,
            contentGap: 0,
            panelDescriptionGap: baseSize * 0.25,
            descriptionGap: baseSize * 0.5,
            wrapper: {
                padding: 0,
                borderWidth: 0
            },
            header: {
                padding: [baseSize * 0.5, baseSize],
                borderWidth: baseSize * 0.125,
                borderColor: '#000',
                backgroundColor: '#E5E5E5'
            },
            title: {
                fontSize: baseSize * 2,
                fontStyle: 'bold',
                fontColor: '#000',
                lineHeight: baseSize * 3.5,
            },
            description: {
                fontSize: baseSize * 2,
            },
        },
        page: {
            contentGap: baseSize * 2,
            gapBetweenRows: 0,
            gapBetweenElements: 0,
            header: {
                borderWidth: 0,
                padding: 0,
                backgroundColor: '#fff'
            }
        },
        selectbase: {
            columnMinWidth: baseSize * 5,
            gapBetweenColumns: 1.5,
            gapBetweenRows: baseSize,
            gapBetweenItemText: baseSize,
            contentGapVertical: baseSize * 1,
            label: {
                fontSize: baseSize * 2.5,
                lineHeight: baseSize * 3,
                fontStyle: 'normal',
                fontColor: '#000'
            },
            input: {
                width: baseSize * 2,
                height: baseSize * 2,
                borderWidth: baseSize * 0.125,
                fontSize: baseSize * 1.25,
                fontName: 'zapfdingbats',
            }
        },
        checkbox: {
            input: {
                checkMark: '3'
            }
        },
        radiogroup: {
            input: {
                checkMark: 'l'
            }
        },
        matrixbase: {
            columnMinWidth: baseSize * 15,
            contentGapVertical: 0,
            gapBetweenColumns: 0,
            gapBetweenRows: 0,
            verticalGapBetweenItems: baseSize,
            verticalGapBetweenRowTitleQuestion: baseSize * 0.5,
            wrapper: {
                padding: 0,
                borderWidth: 0
            },
            header: {
                borderWidth: baseSize * 0.125,
                padding: [baseSize * 0.5, baseSize],
                backgroundColor: '#E5E5E5',
                borderColor: '#000',
            },
            title: {
                fontStyle: 'bold'
            },
            cell: {
                borderWidth: baseSize * 0.125,
                borderColor: '#000',
                padding: [baseSize * 0.5, baseSize]
            },
            rowTitle: {
                fontSize: baseSize * 2,
                lineHeight: baseSize * 3,
                fontStyle: 'normal',
                fontColor: '#000',
                textAlign: 'right'
            },
            columnTitle: {
                fontSize: baseSize * 2,
                lineHeight: baseSize * 3,
                fontStyle: 'normal',
                fontColor: '#000',
            },
            verticalRowTitle: {
                textAlign: 'left'
            },
            input: {
                height: baseSize * 2,
                width: baseSize * 2,
            }
        },
        matrix: {
            verticalGapBetweenItemText: baseSize,
            verticalColumnTitle: {
                fontSize: baseSize * 2.5
            },
            input: {
                fontName: 'zapfdingbats',
                borderWidth: baseSize * 0.125,
                fontSize: baseSize * 1.25,
            },
            radioInput: {
                checkMark: 'l'
            },
            checkboxInput: {
                checkMark: '3',
            }
        },
        matrixdropdownbase: {
            cellDetail: {
                borderMode: 1,
                padding: 0
            },
        },
        matrixdropdown: {
            cellVerticalRowTitle: {
                backgroundColor: '#E5E5E5'
            },
            verticalRowTitle: {
                fontStyle: 'bold',
            },
        },
        multipletext: {
            contentGapVertical: 0,
            itemTitleWidthPers: 0.4,
            gapBetweenColumns: 0,
            gapBetweenRows: 0,
            wrapper: {
                padding: 0,
                borderWidth: 0
            },
            header: {
                borderWidth: baseSize * 0.125,
                padding: [baseSize * 0.5, baseSize],
                backgroundColor: '#E5E5E5',
                borderColor: '#000',
            },
            title: {
                fontStyle: 'bold'
            },
            label: {
                fontSize: baseSize * 2.5,
                lineHeight: baseSize * 3,
                fontStyle: 'normal',
                fontColor: '#000',
            },
            cell: {
                borderWidth: baseSize * 0.125,
                borderColor: '#000',
                padding: [baseSize * 0.5, baseSize]
            },
        },
        rating: {
            itemMinWidth: baseSize * 3,
            gapBetweenColumns: baseSize * 0.25,
            gapBetweenRows: baseSize * 0.25,
            gapBetweenItemText: baseSize,
            gapBetweenItemTextVertical: 0,
            label: {
                fontSize: baseSize * 2.5,
                lineHeight: baseSize * 3,
                fontStyle: 'normal',
                fontColor: '#000',
            },
            input: {
                height: baseSize * 2,
                width: baseSize * 2,
                borderWidth: baseSize * 0.125,
                fontSize: baseSize * 1.25,
                fontName: 'zapfdingbats',
                checkMark: 'l',
            },
        },
        ranking: {
            input: {
                height: baseSize * 2,
                width: baseSize * 2,
                fontSize: baseSize * 2
            },
            gapBetweenColumns: baseSize * 1.5,
            gapBetweenRows: baseSize * 0.25,
        },
        slider: {
            gapBetweenColumns: baseSize * 1.5,
            input: {
                fontSize: baseSize * 2.5,
                lineHeight: baseSize * 3
            }
        },
        dropdown: {
            contentGapVertical: baseSize * 0.5,
            gapBetweenRows: baseSize * 0.25,
            input: {
                fontSize: baseSize * 2.5,
                lineHeight: baseSize * 3,
                borderWidth: baseSize * 0,
                fontName: undefined as any
            }
        },
        file: {
            imageGap: baseSize * 0.195,
            itemMinWidth: baseSize * 5,
            defaultImageFit: 'contain',
            label: {
                fontColor: '#0000EE',
                fontStyle: 'normal',
                fontSize: baseSize * 2.5,
                lineHeight: baseSize * 3,
            },
        },
        paneldynamic: {
            contentGapVertical: 0,
            gapBetweenPanels: 0,
            wrapper: {
                padding: 0,
                borderWidth: 0
            },
            header: {
                borderWidth: baseSize * 0.125,
                padding: [baseSize * 0.5, baseSize],
                backgroundColor: '#E5E5E5',
                borderColor: '#000',
            },
            title: {
                fontStyle: 'bold'
            },
        },
        boolean: {
            gapBetweenItemText: baseSize,
            label: {
                fontSize: baseSize * 2.5,
                lineHeight: baseSize * 3,
                fontStyle: 'normal',
                fontColor: '#000',
            },
            input: {
                fontName: 'zapfdingbats',
                width: baseSize * 2,
                height: baseSize * 2,
                borderWidth: baseSize * 0.125,
                fontSize: baseSize * 1.25,
            },
            radioInput: {
                checkMark: 'l'
            },
            checkboxInput: {
                checkMark: '3'
            }
        },
        imagepicker: {
            gapBetweenColumns: baseSize * 1.5,
            gapBetweenRows: baseSize * 1.5,
            imageRatio: 4 / 3,
            imageMinWidth: baseSize * 12.5,
            imageMaxWidth: baseSize * 37.5,
            input: {
                fontName: 'zapfdingbats',
                height: baseSize * 2,
            },
            radioInput: {
                checkMark: 'l'
            },
            checkboxInput: {
                checkMark: '3'
            }
        },
        textbase: {
            input: {
                fontSize: baseSize * 2.5,
                lineHeight: baseSize * 3
            }
        },
        expression: {
            input: {
                fontSize: baseSize * 2.5,
                lineHeight: baseSize * 3
            }
        },
        html: {
            fontSize: baseSize * 2,
            fontColor: '#000',
            lineHeight: baseSize * 3.5,
        }
    };
}

