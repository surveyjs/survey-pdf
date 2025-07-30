export type IStyles = { [index: string]: any }
export const styles: IStyles = {
    titleFontSizeScale: 1.7,
    titleFontStyle: 'bold',
    titleFontColor: '#404040',
    descriptionGapScale: 0.25,
    panelContGapScale: 1.0,
    question: {
        titleFontSizeScale: 1.1,
        titleFontStyle: 'bold',
        titleFontColor: '#404040',
        contentGapScaleVertical: 0.5,
        contentGapScaleHorizontal: 1.0,
        contentIndentScale: 1.0,
        descriptionGapScale: 0.0625,
        gapBetweenItemText: 0.25,
        gapBetweenColumns: 1.5,
        gapBetweenRows: 0.25
    },
    panel: {
        titleFontSizeScale: 1.3,
        titleFontStyle: 'bold',
        titleFontColor: '#404040',
        questionGapVerticalScale: 1.5,
        panelContGapScale: 1,
        panelDescriptionGapScale: 0.25
    },
    page: {
        titleFontSizeScale: 1.3,
        titleFontStyle: 'bold',
        titleFontColor: '#404040'
    },
    selectbase: {
        gapBetweenColumns: 1.5,
        gapBetweenRows: 0.25,
        formBorderColor: '#9f9f9f',
    },
    checkbox: {
        checkmarkFontSizeScale: 1.0 - Math.E / 10.0,
        checkmarkFont: 'zapfdingbats',
        checkmarkSymbol: '3',
        formBorderColor: '#9f9f9f',
    },
    radiogroup: {
        formBorderColor: '#9f9f9f',
    },
    matrixbase: {
        gapBetweenColumns: 1.5,
        gapBetweenRows: 0.5,
        formBorderColor: '#9f9f9f',
    },
    matrix: {
        gapBetweenRows: 0.5,
        vertivalGapBetweenCells: 0.25
    },
    multipletext: {
        gapBetweenColumns: 1.5,
        rowsGapScale: 0.195
    },
    rating: {
        gapBetweenRows: 0.25,
        formBorderColor: '#9f9f9f',
    },
    ranking: {
        gapBetweenColumns: 1.5,
        gapBetweenRows: 0.25,
        checkmarkFontSizeScale: 1.0 - Math.E / 10.0,
        formBorderColor: '#9f9f9f',
    },
    slider: {
        gapBetweenColumns: 1.5,
    },
    dropdown: {
        gapBetweenRows: 0.25
    },
    file: {
        imageGapScale: 0.195,
        textMinScale: 5,
        defaultImageFit: 'contain'
    },
    paneldynamic: {
        gapBetweenPanels: 0.75
    },
    boolean: {
        checkmarkFontSizeScale: 1.0 - Math.E / 10.0,
        checkmarkFont: 'zapfdingbats',
        checkmarkSymbol: '3',
        formBorderColor: '#9f9f9f',
    },
    imagepicker: {
        checkmarkFontSizeScale: 1.0 - Math.E / 10.0,
        checkmarkFont: 'zapfdingbats',
        checkmarkSymbol: '3',
        formBorderColor: '#9f9f9f',
    }
};