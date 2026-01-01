(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { DocOptions, DocController } from '../src/doc_controller';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
import { checkFlatSnapshot } from './snapshot_helper';
import { AdornersOptions } from '../src/event_handler/adorners';
import '../src/entries/pdf-base';

test('Check matrix dynamic one column no rows', async () => {
    await checkFlatSnapshot({
        elements: [
            {
                type: 'matrixdynamic',
                name: 'madin',
                titleLocation: 'hidden',
                columns: [
                    {
                        name: 'Sky'
                    }
                ],
                rowCount: 0
            }
        ]
    }, {
        snapshotName: 'matrixdynamic_no_rows',
        isCorrectEvent: (options: AdornersOptions) => {
            return options.question.getType() == 'matrixdynamic';
        }
    });
});
test('Check matrix dynamic no columns one row', async () => {
    await checkFlatSnapshot({
        elements: [
            {
                type: 'matrixdynamic',
                name: 'madin empty',
                titleLocation: 'hidden',
                rowCount: 1
            }
        ]
    }, {
        snapshotName: 'matrixdynamic_no_rows_no_columns',
        isCorrectEvent: (options: AdornersOptions) => {
            return options.question.getType() == 'matrixdynamic';
        }
    });
});
test('Check matrix dynamic one column no rows show header off', async () => {
    await checkFlatSnapshot({
        elements: [
            {
                type: 'matrixdynamic',
                name: 'oh these headers',
                titleLocation: 'hidden',
                showHeader: false,
                columns: [
                    {
                        name: 'Ninja'
                    }
                ],
                rowCount: 0
            }
        ]
    }, {
        snapshotName: 'matrixdynamic_one_column_no_rows_header_off',
        isCorrectEvent: (options: AdornersOptions) => {
            return options.question.getType() == 'matrixdynamic';
        }
    });
});
test('Check matrix dynamic one column one row show header off', async () => {
    await checkFlatSnapshot({
        elements: [
            {
                type: 'matrixdynamic',
                name: 'I\'m just a list',
                titleLocation: 'hidden',
                showHeader: false,
                columns: [
                    {
                        name: 'Not forget me'
                    }
                ],
                rowCount: 1
            }
        ]
    }, {
        snapshotName: 'matrixdynamic_one_column_one_row_header_off',
        isCorrectEvent: (options: AdornersOptions) => {
            return options.question.getType() == 'matrixdynamic';
        }
    });
});
test('Check matrix dynamic one column one row', async () => {
    await checkFlatSnapshot({
        elements: [
            {
                type: 'matrixdynamic',
                name: 'I\'m just a list',
                titleLocation: 'hidden',
                columns: [
                    {
                        name: 'I\'m alive'
                    }
                ],
                rowCount: 1
            }
        ]
    }, {
        snapshotName: 'matrixdynamic_one_colum_one_row',
        isCorrectEvent: (options: AdornersOptions) => {
            return options.question.getType() == 'matrixdynamic';
        }
    });
});
test('Check matrix dynamic one column one row vertical layout show header off', async () => {
    await checkFlatSnapshot({
        elements: [
            {
                type: 'matrixdynamic',
                name: 'Still the same list',
                titleLocation: 'hidden',
                showHeader: false,
                columns: [
                    {
                        name: 'Not forget me'
                    }
                ],
                columnLayout: 'vertical',
                rowCount: 1
            }
        ]
    }, {
        snapshotName: 'matrixdynamic_vertical_one_column_one_row_header_off',
        isCorrectEvent: (options: AdornersOptions) => {
            return options.question.getType() == 'matrixdynamic';
        }
    });
});
test('Check matrix dynamic one column one row vertical layout', async () => {
    let json: any = {
        elements: [
            {
                type: 'matrixdynamic',
                name: 'Not the same list',
                titleLocation: 'hidden',
                columns: [
                    {
                        name: 'Left front'
                    }
                ],
                columnLayout: 'vertical',
                rowCount: 1
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'matrixdynamic_vertical_one_column_one_row',
        isCorrectEvent: (options: AdornersOptions) => {
            return options.question.getType() == 'matrixdynamic';
        }
    });
});
test('Check matrix dynamic two columns one row vertical layout show header off', async () => {
    let json: any = {
        elements: [
            {
                type: 'matrixdynamic',
                name: 'matrix not multiple text',
                titleLocation: 'hidden',
                showHeader: false,
                columns: [
                    {
                        name: 'First'
                    },
                    {
                        name: 'Second'
                    }
                ],
                columnLayout: 'vertical',
                rowCount: 1
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'matrixdynamic_vertical_two_columns_one_row_show_headers_off',
        isCorrectEvent: (options: AdornersOptions) => {
            return options.question.getType() == 'matrixdynamic';
        }
    });
});
test('Check matrix dynamic one column no rows narrow width', async () => {
    let json: any = {
        elements: [
            {
                type: 'matrixdynamic',
                name: 'madinar',
                titleLocation: 'hidden',
                columns: [
                    {
                        name: 'Prop'
                    }
                ],
                rowCount: 0
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'matrixdynamic_one_column_no_rows_narrow_width',
        isCorrectEvent: (options: AdornersOptions) => {
            return options.question.getType() == 'matrixdynamic';
        },
        controllerOptions: {
            format: [50, 297]
        }
    });
});
test('Check matrix dynamic one column one row verical layout narrow width', async () => {
    let json: any = {
        elements: [
            {
                type: 'matrixdynamic',
                name: 'madivertnar',
                titleLocation: 'hidden',
                columns: [
                    {
                        name: 'Boop'
                    }
                ],
                columnLayout: 'vertical',
                rowCount: 1
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'matrixdynamic_vertical_one_column_one_row_narrow_width',
        isCorrectEvent: (options: AdornersOptions) => {
            return options.question.getType() == 'matrixdynamic';
        },
        controllerOptions: {
            format: [50, 297]
        }
    });
});
test('Check matrix dynamic two columns one row narrow width', async () => {
    let json: any = {
        elements: [
            {
                type: 'matrixdynamic',
                name: 'madinartwocol',
                titleLocation: 'hidden',
                columns: [
                    {
                        name: 'Boop'
                    },
                    {
                        name: 'Moop'
                    }
                ],
                rowCount: 1
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'matrixdynamic_two_columns_one_row_narrow_width',
        isCorrectEvent: (options: AdornersOptions) => {
            return options.question.getType() == 'matrixdynamic';
        },
        controllerOptions: {
            format: [50, 297]
        }
    });
});
test('Check matrixdynamic with totals', async () => {
    await checkFlatSnapshot(
        {
            showQuestionNumbers: 'off',
            elements: [
                {

                    type: 'matrixdynamic',
                    name: 'madintotals',
                    showHeader: false,
                    rowCount: 1,
                    titleLocation: 'hidden',
                    columns: [
                        {
                            totalType: 'sum',
                            totalFormat: 'test',
                            name: 'id'
                        }
                    ]
                }
            ]
        }, {
            snapshotName: 'matrixdynamic_with_totals',
            isCorrectEvent: (options: AdornersOptions) => {
                return options.question.getType() == 'matrixdynamic';
            } });
});
test('Check matrix dynamic column width', async () => {
    let json: any = {
        elements: [
            {
                type: 'matrixdynamic',
                name: 'madincolwidth',
                titleLocation: 'hidden',
                columns: [
                    {
                        name: 'One',
                        width: '25%'
                    },
                    {
                        name: 'Two'
                    }
                ],
                rowCount: 1
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'matrixdynamic_column_width',
        isCorrectEvent: (options: AdornersOptions) => {
            return options.question.getType() == 'matrixdynamic';
        }
    });
});
test('Check matrixdynamic with showInMultipleColumns', async () => {
    let json: any = {
        showQuestionNumbers: 'off',
        elements: [
            {
                type: 'matrixdynamic',
                name: 'madintotalsshowmulcol',
                titleLocation: 'hidden',
                hideNumber: true,
                columns: [
                    {
                        cellType: 'checkbox',
                        showInMultipleColumns: true,
                        choices: ['MulCol1', 'MulCol2']
                    }
                ],
                rowCount: 1
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'matrixdynamic_showInMultipleColumns',
        isCorrectEvent: (options: AdornersOptions) => {
            return options.question.getType() == 'matrixdynamic';
        }
    });
});
test('Check matrixdynamic with detailPanel', async () => {
    const json: any = {
        showQuestionNumbers: 'off',
        elements: [
            {
                type: 'matrixdynamic',
                name: 'detailPanelChecker',
                titleLocation: 'hidden',
                hideNumber: true,
                columns: [
                    {
                        cellType: 'input',
                    }
                ],
                detailElements: [
                    {
                        type: 'comment',
                        name: 'commentInPanel',
                        titleLocation: 'hidden',
                    }
                ],
                rowCount: 1,
                detailPanelMode: 'underRow',
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'matrixdynamic_detail_panel',
        isCorrectEvent: (options: AdornersOptions) => {
            return options.question.getType() == 'matrixdynamic';
        }
    });
});

test('Check matrixdynamic with empty detail panel', async () => {
    const json: any = {
        showQuestionNumbers: 'off',
        elements: [
            {
                type: 'matrixdynamic',
                name: 'detailPanelChecker',
                titleLocation: 'hidden',
                hideNumber: true,
                columns: [
                    {
                        cellType: 'input',
                    }
                ],
                rowCount: 1,
                detailPanelMode: 'underRow',
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'matrixdynamic_empty_detail_panel',
        isCorrectEvent: (options: AdornersOptions) => {
            return options.question.getType() == 'matrixdynamic';
        }
    });
});

test('Check matrixdynamic with allowRowsDragAndDrop', async () => {
    const json: any = {
        showQuestionNumbers: 'off',
        elements: [
            {
                type: 'matrixdynamic',
                name: 'panel',
                titleLocation: 'hidden',
                hideNumber: true,
                columns: [
                    {
                        cellType: 'input',
                    }
                ],
                allowRowsDragAndDrop: true,
                rowCount: 1,
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'matrixdynamic_allowDragAndDrop',
        isCorrectEvent: (options: AdornersOptions) => {
            return options.question.getType() == 'matrixdynamic';
        }
    });
});
test('Check matrixdynamic with allowRowsDragAndDrop list', async () => {
    const json: any = {
        showQuestionNumbers: 'off',
        elements: [
            {
                type: 'matrixdynamic',
                name: 'panel',
                titleLocation: 'hidden',
                hideNumber: true,
                columns: [
                    {
                        cellType: 'input',
                    },
                    {
                        cellType: 'input',
                    },
                    {
                        cellType: 'input',
                    },
                    {
                        cellType: 'input',
                    },
                    {
                        cellType: 'input',
                    },
                    {
                        cellType: 'input',
                    }
                ],
                allowRowsDragAndDrop: true,
                rowCount: 1,
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'matrixdynamic_allowDragAndDrop_list',
        isCorrectEvent: (options: AdornersOptions) => {
            return options.question.getType() == 'matrixdynamic';
        }
    });
});