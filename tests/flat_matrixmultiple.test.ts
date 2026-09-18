(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};
import { test, expect } from 'vitest';
import { SurveyPDF } from '../src/survey';
import { IDocOptions, DocController } from '../src/doc_controller';
import { FlatMatrixMultiple } from '../src/flat_layout/flat_matrixmultiple';
import { TestHelper } from '../src/helper_test';
import { QuestionMatrixDropdownModel } from 'survey-core';
import { checkFlatSnapshot } from './snapshot_helper';
import { AdornersOptions } from '../src/event_handler/adorners';
import '../src/entries/pdf-base';

test('Check matrix multiple one column no rows', async () => {
    const json: any = {
        elements: [
            {
                type: 'matrixdropdown',
                name: 'matrixmultiple_onecolumnnorows',
                titleLocation: 'hidden',
                columns: [
                    {
                        name: 'First power'
                    }
                ]
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'matrixdropdown_one_column_no_rows',
        isCorrectEvent: (options: AdornersOptions) => {
            return options.question.getType() == 'matrixdropdown';
        }
    });
});
test('Check matrix multiple one column no rows vertical layout', async () => {
    const json: any = {
        elements: [
            {
                type: 'matrixdropdown',
                name: 'matrixmultiple_onecolumnnorows_vertical',
                titleLocation: 'hidden',
                columns: [
                    {
                        name: 'First power'
                    }
                ],
                columnLayout: 'vertical'
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'matrixdropdown_vertical_one_column_no_rows',
        isCorrectEvent: (options: AdornersOptions) => {
            return options.question.getType() == 'matrixdropdown';
        }
    });
});
test('Check matrix multiple one column one row', async () => {
    const json: any = {
        elements: [
            {
                type: 'matrixdropdown',
                name: 'matrixmultiple_onecolumnonerow',
                titleLocation: 'hidden',
                columns: [
                    {
                        name: 'First power'
                    }
                ],
                rows: [
                    'Arrow'
                ]
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'matrixdropdown_one_column_one_row',
        isCorrectEvent: (options: AdornersOptions) => {
            return options.question.getType() == 'matrixdropdown';
        }
    });
});
test('Check matrix multiple two columns one row vertical layout', async () => {
    const json: any = {
        elements: [
            {
                type: 'matrixdropdown',
                name: 'matrixmultiple_onecolumnonerow_vertical',
                titleLocation: 'hidden',
                columns: [
                    {
                        name: 'First power'
                    },
                    {
                        name: 'Second choice'
                    }
                ],
                columnLayout: 'vertical',
                rows: [
                    'Cap'
                ]
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'matrixdropdown_vertical_two_columns_one_row',
        isCorrectEvent: (options: AdornersOptions) => {
            return options.question.getType() == 'matrixdropdown';
        }
    });
});
test('Check matrix multiple two columns one row horizontal layout narrow width', async () => {
    const json: any = {
        elements: [
            {
                type: 'matrixdropdown',
                name: 'matrixmultiple_twocolumnsonerow_horizontal_narrow',
                titleLocation: 'hidden',
                columns: [
                    {
                        name: 'First power'
                    },
                    {
                        name: 'Second choice'
                    }
                ],
                rows: [
                    'Cap'
                ]
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'matrixdropdown_two_columns_one_row_narrow_width',
        isCorrectEvent: (options: AdornersOptions) => {
            return options.question.getType() == 'matrixdropdown';
        },
        controllerOptions: {
            format: [50, 297],
            margins: {
                top: 10,
                bot: 10,
                left: 10,
                right: 10
            }
        }
    });
});
test('Check matrix multiple two columns one row vertical layout narrow width', async () => {
    const json = {
        elements: [
            {
                type: 'matrixdropdown',
                name: 'matrixmultiple_twocolumnsonerow_vertical_narrow',
                titleLocation: 'hidden',
                columns: [
                    {
                        name: 'First power'
                    },
                    {
                        name: 'Second choice'
                    }
                ],
                columnLayout: 'vertical',
                rows: [
                    'Cap'
                ]
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'matrixdropdown_vertical_two_columns_one_row_narrow_width',
        isCorrectEvent: (options: AdornersOptions) => {
            return options.question.getType() == 'matrixdropdown';
        },
        controllerOptions: {
            format: [50, 297],
            margins: {
                top: 10,
                bot: 10,
                left: 10,
                right: 10
            }
        }
    });
});
test('Check matrix multiple with showInMultipleColumns option and none choice', async () => {
    const json: any = {
        elements: [
            {
                type: 'matrixdropdown',
                name: 'matrixmultiple_showinmultiplecolumns_hasnonechoice',
                titleLocation: 'hidden',
                showHeader: false,
                columns: [
                    {
                        cellType: 'radiogroup',
                        showInMultipleColumns: true,
                        choices: [
                            {
                                value: 'choice1'
                            }
                        ],
                        hasNone: true,
                        noneText: 'None'
                    }
                ],
                rows: [
                    'row1'
                ]
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'matrixdropdown_showInMultipleColumns_none_choice',
        isCorrectEvent: (options: AdornersOptions) => {
            return options.question.getType() == 'matrixdropdown';
        }
    });
});
test('Check matrix multiple column widths', async () => {
    let json: any = {
        elements: [
            {
                type: 'matrixdropdown',
                name: 'matrixdropdown',
                titleLocation: 'hidden',
                rowTitleWidth: '500px',
                showHeader: false,
                columns: [
                    {
                        cellType: 'text',
                        name: 'Col1',
                    },
                    {
                        cellType: 'text',
                        name: 'Col1',
                        width: '150px'
                    },
                    {
                        cellType: 'text',
                        name: 'Col1',
                    }
                ],
                rows: ['Row1']
            }
        ]
    };
    const options: IDocOptions = TestHelper.defaultOptions;
    let survey: SurveyPDF = new SurveyPDF(json, options);
    let question = <QuestionMatrixDropdownModel>survey.getAllQuestions()[0];
    const controller: DocController = new DocController(options);
    let flat = new FlatMatrixMultiple(survey, question, controller, survey.getElementStyle(question));
    let widths = flat['calculateColumnWidth'](flat['getPredefinedColumnWidts']());
    let restWidth = flat['style'].columnMinWidth;
    expect(widths).toEqual([375, restWidth, 112.5, restWidth]);
    expect(flat['calculateIsList'](widths, 4)).toBeTruthy();

    json = {
        elements: [
            {
                type: 'matrixdropdown',
                name: 'matrixdropdown',
                titleLocation: 'hidden',
                rowTitleWidth: '100px',
                showHeader: false,
                columns: [
                    {
                        cellType: 'text',
                        name: 'Col1',
                    },
                    {
                        cellType: 'text',
                        name: 'Col1',
                        width: '50px'
                    },
                    {
                        cellType: 'text',
                        name: 'Col1',
                    }
                ],
                rows: ['Row1']
            }
        ]
    };
    survey = new SurveyPDF(json, options);
    survey.applyStyle({
        matrixdropdown: {
            columnMinWidth: 20
        }
    });
    question = <QuestionMatrixDropdownModel>survey.getAllQuestions()[0];
    flat = new FlatMatrixMultiple(survey, question, controller, survey.getElementStyle(question));
    widths = flat['calculateColumnWidth'](flat['getPredefinedColumnWidts']());
    restWidth = (flat['getColumnsAvalableWidth'](4) - 75 - 37.5) / 2;
    expect(widths).toEqual([75, restWidth, 37.5, restWidth]);
    expect(flat['calculateIsList'](widths, 4)).toBeFalsy();
});
test('Check matrix dynamic column min widths', async () => {
    let json: any = {
        elements: [
            {
                type: 'matrixdynamic',
                name: 'matrixdropdown',
                titleLocation: 'hidden',
                showHeader: false,
                rowCount: 2,
                columns: [
                    {
                        cellType: 'text',
                        minWidth: '150px',
                        name: 'Col1',
                    },
                    {
                        cellType: 'text',
                        name: 'Col2',
                        width: '0px'
                    },
                    {
                        cellType: 'text',
                        name: 'Col3',
                        minWidth: '300px',
                    },
                    {
                        cellType: 'text',
                        name: 'Col4',
                        width: '0px'
                    },
                ],
                rows: ['Row1']
            }
        ]
    };
    const options: IDocOptions = TestHelper.defaultOptions;
    let survey: SurveyPDF = new SurveyPDF(json, options);
    let question = <QuestionMatrixDropdownModel>survey.getAllQuestions()[0];
    let flat = new FlatMatrixMultiple(survey, question, survey.docController, survey.getElementStyle(question));
    let widths = flat['calculateColumnWidth'](flat['getPredefinedColumnWidts']());
    let restWidth = (flat['getColumnsAvalableWidth'](4) - 112.5 - 225) / 2;
    expect(widths).toEqual([112.5, restWidth, 225, restWidth]);
});
test('Check matrix dynamic column min widths with detailPanel', async () => {
    let json: any = {
        elements: [
            {
                type: 'matrixdynamic',
                name: 'matrixdropdown',
                titleLocation: 'hidden',
                showHeader: false,
                rowCount: 1,
                columns: [
                    {
                        cellType: 'text',
                        minWidth: '150px',
                        name: 'Col1',
                    },
                    {
                        cellType: 'text',
                        name: 'Col2',
                        width: '0px'
                    },
                    {
                        cellType: 'text',
                        name: 'Col3',
                        minWidth: '300px',
                    },
                    {
                        cellType: 'text',
                        name: 'Col4',
                        width: '0px'
                    },
                ],
                detailElements: [
                    {
                        'type': 'text',
                        'name': 'text',
                    }
                ],
                detailPanelMode: 'underRow',
            }
        ]
    };
    const options: IDocOptions = TestHelper.defaultOptions;
    let survey: SurveyPDF = new SurveyPDF(json, options);
    let question = <QuestionMatrixDropdownModel>survey.getAllQuestions()[0];
    let flat = new FlatMatrixMultiple(survey, question, survey.docController, survey.getElementStyle(question));
    let widths = flat['calculateColumnWidth'](flat['getPredefinedColumnWidts']());
    let restWidth = (flat['getColumnsAvalableWidth'](4) - 112.5 - 225) / 2;
    expect(widths).toEqual([112.5, restWidth, 225, restWidth]);
});

test('Check column render width is always not less than minWidth', async () => {
    const json = {
        elements: [
            {
                type: 'matrixdropdown',
                name: 'matrixdropdown',
                titleLocation: 'hidden',
                rowTitleWidth: '150px',
                showHeader: false,
                columns: [
                    {
                        cellType: 'text',
                        name: 'Col1',
                    },
                    {
                        cellType: 'text',
                        name: 'Col1',
                        width: '50px'
                    },
                    {
                        cellType: 'text',
                        name: 'Col1',
                    }
                ],
                rows: ['Row1']
            }
        ]
    };
    const options: IDocOptions = TestHelper.defaultOptions;
    const controller: DocController = new DocController(options);
    const survey = new SurveyPDF(json, options);
    const question = <QuestionMatrixDropdownModel>survey.getAllQuestions()[0];
    const flat = new FlatMatrixMultiple(survey, question, controller, survey.getElementStyle(question));
    const widths = flat['calculateColumnWidth'](flat['getPredefinedColumnWidts']());
    const columnMinWidth = flat['style'].columnMinWidth;
    const restWidth = (flat['getColumnsAvalableWidth'](4) - columnMinWidth - 112.5) / 2;
    expect(widths).toEqual([112.5, restWidth, columnMinWidth, restWidth]);
    expect(flat['calculateIsList'](widths, 4)).toBeFalsy();
});

test('Check matrix multiple one column one row with detailPanel', async () => {
    const json: any = {
        showQuestionNumbers: 'off',
        elements: [
            {
                type: 'matrixdropdown',
                name: 'detailPanelChecker',
                titleLocation: 'hidden',
                hideNumber: true,
                columns: [
                    {
                        name: 'Col1',
                    }
                ],
                detailElements: [
                    {
                        type: 'comment',
                        name: 'commentInPanel',
                        titleLocation: 'hidden',
                    }
                ],
                rows: ['Row1'],
                detailPanelMode: 'underRow',
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'matrixdropdown_one_column_one_row_detailPanel',
        isCorrectEvent: (options: AdornersOptions) => {
            return options.question.getType() == 'matrixdropdown';
        }
    });
});

test('Check matrix multiple zero columns one row with detailPanel', async () => {
    const json: any = {
        showQuestionNumbers: 'off',
        elements: [
            {
                type: 'matrixdropdown',
                name: 'detailPanelChecker',
                titleLocation: 'hidden',
                hideNumber: true,
                columns: [],
                detailElements: [
                    {
                        type: 'comment',
                        name: 'commentInPanel',
                        titleLocation: 'hidden',
                    }
                ],
                rows: ['Row1'],
                detailPanelMode: 'underRow',
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'matrixdropdown_no_columns_one_row_detailPanel',
        isCorrectEvent: (options: AdornersOptions) => {
            return options.question.getType() == 'matrixdropdown';
        }
    });
});
test('Check matrix multiple with showInMulipleColumns - list mode', async () => {
    const controllerOptions = TestHelper.defaultOptions;
    controllerOptions.matrixRenderAs = 'list';
    await checkFlatSnapshot({
        questions: [
            {
                'type': 'matrixdropdown',
                'name': 'matrix',
                titleLocation: 'hidden',
                'columns': [
                    {
                        'name': 'choices',
                        'cellType': 'radiogroup',
                        'showInMultipleColumns': true,
                        'choices': [
                            {
                                'value': '1',
                            },
                            {
                                'value': '2',
                            },
                        ],
                    },
                ],
                'rows': [
                    {
                        'value': 'Row 1',
                    },
                ]
            }
        ]
    }, {
        controllerOptions,
        snapshotName: 'matrixmultiple_showInMultipleColumns_list_mode',
        isCorrectEvent: (options: AdornersOptions) => {
            return options.question.getType() == 'matrixdropdown';
        } });
});
test('Check matrix multiple with showInMulipleColumns and totals - wide mode', async () => {
    const controllerOptions = TestHelper.defaultOptions;
    controllerOptions.format = 'a3';
    await checkFlatSnapshot({
        questions: [
            {
                'type': 'matrixdropdown',
                'name': 'matrix',
                titleLocation: 'hidden',
                'columns': [
                    {
                        'name': 'choices',
                        'cellType': 'radiogroup',
                        'totalType': 'sum',
                        'showInMultipleColumns': true,
                        'choices': [
                            {
                                'value': '1',
                            },
                            {
                                'value': '2',
                            },
                        ],
                    },
                ],
                'rows': [
                    {
                        'value': 'Row 1',
                    },
                ]
            }
        ]
    }, {
        controllerOptions,
        snapshotName: 'matrixmultiple_showInMultipleColumns_totals_wide_mode',
        isCorrectEvent: (options: AdornersOptions) => {
            return options.question.getType() == 'matrixdropdown';
        } });
});
test('Check matrix multiple with showInMulipleColumns and totals - list mode', async () => {
    const controllerOptions = TestHelper.defaultOptions;
    controllerOptions.matrixRenderAs = 'list';
    await checkFlatSnapshot({
        questions: [
            {
                'type': 'matrixdropdown',
                'name': 'matrix',
                titleLocation: 'hidden',
                'columns': [
                    {
                        'name': 'choices',
                        'cellType': 'radiogroup',
                        'totalType': 'sum',
                        'showInMultipleColumns': true,
                        'choices': [
                            {
                                'value': '1',
                            },
                            {
                                'value': '2',
                            },
                        ],
                    },
                ],
                'rows': [
                    {
                        'value': 'Row 1',
                    },
                ]
            }
        ]
    }, {
        controllerOptions,
        snapshotName: 'matrixmultiple_showInMultipleColumns_totals_list_mode',
        isCorrectEvent: (options: AdornersOptions) => {
            return options.question.getType() == 'matrixdropdown';
        } });
});
test('Check matrix multiple with empty totals - list mode', async () => {
    const controllerOptions = TestHelper.defaultOptions;
    controllerOptions.matrixRenderAs = 'list';
    await checkFlatSnapshot({
        questions: [
            {
                'type': 'matrixdropdown',
                'name': 'matrix',
                titleLocation: 'hidden',
                choices: [1],
                'columns': [
                    {
                        'name': 'col1',
                    },
                    {
                        'name': 'col2',
                        'totalType': 'sum',
                    }
                ],
                'rows': [
                    {
                        'value': 'Row 1',
                    },
                ]
            }
        ]
    }, {
        controllerOptions,
        snapshotName: 'matrixmultiple_empty_totals_list_mode',
        isCorrectEvent: (options: AdornersOptions) => {
            return options.question.getType() == 'matrixdropdown';
        } });
});
test('Check matrix multiple with empty totals - wide mode', async () => {
    const controllerOptions = TestHelper.defaultOptions;
    controllerOptions.format = 'a3';
    await checkFlatSnapshot({
        questions: [
            {
                'type': 'matrixdropdown',
                'name': 'matrix',
                titleLocation: 'hidden',
                choices: [1],
                'columns': [
                    {
                        'name': 'col1',
                    },
                    {
                        'name': 'col2',
                        'totalType': 'sum',
                    }
                ],
                'rows': [
                    {
                        'value': 'Row 1',
                    },
                ]
            }
        ]
    }, {
        controllerOptions,
        snapshotName: 'matrixmultiple_empty_totals_wide_mode',
        isCorrectEvent: (options: AdornersOptions) => {
            return options.question.getType() == 'matrixdropdown';
        } });
});

test('columns visibility', async () => {
    const json = {
        questions: [
            {
                'type': 'matrixdropdown',
                'name': 'matrix',
                titleLocation: 'hidden',
                choices: [1],
                'columns': [
                    {
                        'name': 'col1',
                        visibleIf: 'false'
                    },
                    {
                        'name': 'col2',
                    },
                    {
                        'name': 'col3',
                        'visible': false
                    }
                ],
                'rows': [
                    {
                        'value': 'Row 1',
                        'visibleIf': 'false'
                    },
                    {
                        'value': 'Row 2',
                    },
                ]
            }
        ]
    };
    const survey = new SurveyPDF(json, {});
    const question = survey.getAllQuestions()[0] as QuestionMatrixDropdownModel;
    const controller = new DocController();
    const flat = new FlatMatrixMultiple(survey, question, controller, {});

    let rows = flat['getMatrixRows']();
    expect(rows.map(row => row.locText.renderedHtml)).toEqual(['Row 2']);
    expect(rows[0].cells.filter(cell => flat['isMatrixColumnVisible'](cell.column)).map(cell => cell.column.locTitle.renderedHtml)).toEqual(['col2']);

    controller.dynamicContent.conditionalMatrixColumns = true;
    rows = flat['getMatrixRows']();
    expect(rows.map(row => row.locText.renderedHtml)).toEqual(['Row 2']);
    expect(rows[0].cells.filter(cell => flat['isMatrixColumnVisible'](cell.column)).map(cell => cell.column.locTitle.renderedHtml)).toEqual(['col1', 'col2']);

    controller.dynamicContent.conditionalMatrixRows = true;
    rows = flat['getMatrixRows']();
    expect(rows.map(row => row.locText.renderedHtml)).toEqual(['Row 1', 'Row 2']);
    expect(rows[0].cells.filter(cell => flat['isMatrixColumnVisible'](cell.column)).map(cell => cell.column.locTitle.renderedHtml)).toEqual(['col1', 'col2']);

    controller.dynamicContent.conditionalMatrixColumns = false;
    rows = flat['getMatrixRows']();
    expect(rows.map(row => row.locText.renderedHtml)).toEqual(['Row 1', 'Row 2']);
    expect(rows[0].cells.filter(cell => flat['isMatrixColumnVisible'](cell.column)).map(cell => cell.column.locTitle.renderedHtml)).toEqual(['col2']);
});