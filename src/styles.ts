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
            fontStyle: "normal",
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
            inputBorderColor: '#000',
            inputBorderWidth: 0,
            inputFontColor: '#000',
            inputFontSize: baseSize * 2.5,
            commentBorderColor: '#000',
            commentBorderWidth: 0,
            commentFontColor: '#000',
            commentFontSize: baseSize * 2.5,
            commentLineHeight: baseSize * 3,
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
            inputWidth: baseSize * 2,
            inputHeight: baseSize * 2,
            label: {
                fontSize: baseSize * 2.5,
                lineHeight: baseSize * 3,
                fontStyle: 'normal',
                fontColor: '#000'
            },
            inputBorderWidth: baseSize * 0.125,
            inputFontSize: baseSize * 1.25,
            inputFont: 'zapfdingbats',
        },
        checkbox: {
            inputSymbol: '3',
        },
        radiogroup: {
            inputSymbol: 'l',
        },
        matrixbase: {
            title: {
                fontStyle: "bold"
            },
            columnMinWidth: baseSize * 12.5,
            cellBorderWidth: baseSize * 0.125,
            cellBorderColor: '#000',
            cellPadding: [baseSize * 0.5, baseSize],
            contentGapVertical: 0,
            gapBetweenColumns: 0,
            gapBetweenRows: 0,
            inputHeight: baseSize * 2,
            inputWidth: baseSize * 2,
            verticalGapBetweenItems: baseSize,
            verticalGapBetweenRowTitleQuestion: baseSize * 0.5,
            verticalCellRowTitleBackgroundColor: '#E5E5E5',
            header: {
                borderWidth: baseSize * 0.125,
                padding: [baseSize * 0.5, baseSize],
                backgroundColor: '#E5E5E5',
                borderColor: '#000',
            },
            wrapper: {
                padding: 0,
                borderWidth: 0
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
                fontStyle: 'bold',
                textAlign: 'left'
            },
        },
        matrix: {
            inputBorderWidth: baseSize * 0.125,
            inputFontSize: baseSize * 1.25,
            radiomarkSymbol: 'l',
            radiomarkFont: 'zapfdingbats',
            checkmarkSymbol: '3',
            checkmarkFont: 'zapfdingbats',
            verticalGapBetweenItemText: baseSize,
            verticalRowTitle: {
                fontStyle: 'normal',
            },
            verticalColumnTitle: {
                fontSize: baseSize * 2.5
            }
        },
        multipletext: {
            itemTitleWidthPers: Math.E / 10.0,
            gapBetweenColumns: 1.5,
            rowsGap: baseSize * 0.195,
            label: {
                fontSize: baseSize * 2.5,
                lineHeight: baseSize * 3,
                fontStyle: 'normal',
                fontColor: '#000',
            },
        },
        rating: {
            inputHeight: baseSize * 2,
            inputWidth: baseSize * 2,
            inputBorderWidth: baseSize * 0.125,
            inputFontSize: baseSize * 1.25,
            inputFont: 'zapfdingbats',
            inputSymbol: 'l',
            itemMinWidth: baseSize * 3,
            gapBetweenColumns: baseSize * 0.25,
            gapBetweenRows: baseSize * 0.25,
            gapBetweenItemText: baseSize,
            gapBetweenItemTextVertical: 0,
            radiomarkFont: 'zapfdingbats',
            label: {
                fontSize: baseSize * 2.5,
                lineHeight: baseSize * 3,
                fontStyle: 'normal',
                fontColor: '#000',
            },
        },
        ranking: {
            inputHeight: baseSize * 2,
            inputWidth: baseSize * 2,
            gapBetweenColumns: baseSize * 1.5,
            gapBetweenRows: baseSize * 0.25,
            checkmarkFontSize: baseSize * 2,
        },
        slider: {
            inputFontSize: baseSize * 2.5,
            inputLineHeight: baseSize * 3,
            gapBetweenColumns: baseSize * 1.5,
        },
        dropdown: {
            contentGapVertical: baseSize * 0.5,
            gapBetweenRows: baseSize * 0.25,
            inputFontSize: baseSize * 2.5,
            inputLineHeight: baseSize * 3,
            inputBorderWidth: baseSize * 0
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
            inputWidth: baseSize * 2,
            inputHeight: baseSize * 2,
            inputBorderWidth: baseSize * 0.125,
            inputFontSize: baseSize * 1.25,
            radiomarkSymbol: 'l',
            radiomarkFont: 'zapfdingbats',
            checkmarkSymbol: '3',
            checkmarkFont: 'zapfdingbats',
            gapBetweenItemText: baseSize,
            label: {
                fontSize: baseSize * 2.5,
                lineHeight: baseSize * 3,
                fontStyle: 'normal',
                fontColor: '#000',
            },
        },
        imagepicker: {
            checkmarkFont: 'zapfdingbats',
            checkmarkSymbol: '3',
            radiomarkSymbol: 'l',
            radiomarkFont: 'zapfdingbats',
            inputHeight: baseSize * 2,
            gapBetweenColumns: baseSize * 1.5,
            gapBetweenRows: baseSize * 1.5,
            imageRatio: 4 / 3,
            imageMinWidth: baseSize * 12.5,
            imageMaxWidth: baseSize * 37.5
        },
        textbase: {
            inputFontSize: baseSize * 2.5,
            inputLineHeight: baseSize * 3
        },
        expression: {
            inputFontSize: baseSize * 2.5,
            inputLineHeight: baseSize * 3
        },
        html: {
            fontSize: baseSize * 2,
            fontColor: '#000',
            lineHeight: baseSize * 3.5,
        }
    };
}

