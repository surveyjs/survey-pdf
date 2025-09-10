(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
    return {};
};
import { checkFlatSnapshot } from './snapshot_helper';
import '../src/flat_layout/flat_matrix';

test('Matrix simple hasRows true columns', async () => {
    await checkFlatSnapshot({
        questions: [
            {
                titleLocation: 'hidden',
                type: 'matrix',
                name: 'matsimp_hasrowstrue',
                columns: [
                    {
                        value: 1,
                        text: 'test1'
                    }
                ],
                rows: [
                    {
                        value: 1,
                        text: 'test2'
                    }
                ]
            }]
    }, {
        snapshotName: 'matrix_with_rows'
    });
});
test('Matrix simple hasRows false columns', async () => {
    await checkFlatSnapshot({
        questions: [
            {
                titleLocation: 'hidden',
                type: 'matrix',
                name: 'matsimp_hasrowsfalse',
                columns: [
                    {
                        value: 1,
                        text: 'test1'
                    }
                ]
            }]
    }, {
        snapshotName: 'matrix_without_rows'
    });

});
test('Matrix simple vertical', async () => {
    await checkFlatSnapshot({
        questions: [
            {
                titleLocation: 'hidden',
                type: 'matrix',
                name: 'matsimp_vertical',
                columns: [
                    {
                        value: 1,
                        text: 'test1'
                    }, {
                        value: 2,
                        text: 'test2'
                    }, {
                        value: 3,
                        text: 'test3'
                    }, {
                        value: 4,
                        text: 'test4'
                    }
                ]
            }]
    }, {
        snapshotName: 'matrix_vertical'
    });

});
test('Matrix simple hidden header', async () => {
    await checkFlatSnapshot({
        questions: [
            {
                titleLocation: 'hidden',
                showHeader: false,
                type: 'matrix',
                name: 'matsimp_hiddenheader',
                title: 'Please indicate if you agree or disagree with the following statements',
                columns: [
                    {
                        value: 1,
                        text: 'test1'
                    }, {
                        value: 2,
                        text: 'test2'
                    }, {
                        value: 3,
                        text: 'test3'
                    }
                ],
                rows: ['Row1']
            }]
    }, {
        snapshotName: 'matrix_hidden_header',
        controllerOptions: {
            format: [400, 297.0]
        }
    });
});
test('Matrix simple check horisontally', async () => {
    await checkFlatSnapshot({
        questions: [
            {
                type: 'matrix',
                titleLocation: 'hidden',
                name: 'matsimp_horisontal',
                showHeader: false,
                columns: [
                    'column1'
                ],
                rows: [
                    {
                        value: 'row1',
                        text: 'row1'
                    }
                ],
                cells:
                {
                    'row1': {
                        'column1': 'test1'
                    }

                }
            }
        ]
    }, {
        snapshotName: 'matrix_horizontal'
    });

});
test('Matrix simple check vertical rows', async () => {
    await checkFlatSnapshot({
        questions: [
            {
                type: 'matrix',
                titleLocation: 'hidden',
                name: 'matsimp_verticalrows',
                showHeader: false,
                columns: [
                    'column1', 'column2', 'column3'
                ],
                rows: [
                    {
                        value: 'row1',
                        text: 'row1'
                    }
                ],
                cells:
                {
                    'row1': {
                        'column1': 'test1',
                        'column2': 'test2',
                        'column3': 'test3',
                    }

                }
            }
        ]
    }, { snapshotName: 'matrix_vertical_rows' });
});
test('Matrix simple check matrixRenderAs list', async () => {
    await checkFlatSnapshot({
        questions: [
            {
                type: 'matrix',
                name: 'matsimp_renderaslist',
                titleLocation: 'hidden',
                showHeader: false,
                columns: [
                    'Column 1',
                    'Column 2'
                ],
                rows: ['Row']
            }
        ]
    }, {
        snapshotName: 'matrix_render_as_list',
        controllerOptions: {
            matrixRenderAs: 'list'
        }
    });
});

test('Matrix check rowTitleWidth', async () => {
    const json: any = {
        questions: [
            {
                type: 'matrix',
                name: 'matrix',
                titleLocation: 'hidden',
                showHeader: true,
                rowTitleWidth: '40px',
                columns: [
                    'Column 1',
                    'Column 2'
                ],
                rows: ['Row']
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'matrix_row_title_width_40',
        controllerOptions: {
            fontSize: 14
        }
    });
    await checkFlatSnapshot(json, {
        snapshotName: 'matrix_row_title_width_50',
        onSurveyCreated: (survey)=>{
            survey.getAllQuestions()[0].rowTitleWidth = '50px';
        },
        controllerOptions: {
            fontSize: 14
        } });
});

test('Check matrix with cellType: checkbox', async() => {
    const options = {
        onSurveyCreated(survey) {
            survey.data = {
                'matrix': {
                    'row1': 'col1',
                    'row2': ['col1', 'col2']
                }
            };
        }

    };
    const json = {
        'elements': [
            {
                'type': 'matrix',
                'name': 'matrix',
                titleLocation: 'hidden',
                cellType: 'checkbox',
                'columns': [{
                    'value': 'col1',
                    'text': 'Column 1'
                }, {
                    'value': 'col2',
                    'text': 'Column 2'
                }],
                'rows': [
                    {
                        'value': 'row1',
                        'text': 'Row 1'
                    },
                    {
                        'value': 'row2',
                        'text': 'Row 2'
                    },
                ],
            }
        ]
    };

    await checkFlatSnapshot(json, { snapshotName: 'matrix_checkbox', controllerOptions: {
        fontSize: 11
    }, ...options });
    await checkFlatSnapshot(json, { snapshotName: 'matrix_checkbox_list', controllerOptions: {
        fontSize: 11,
        matrixRenderAs: 'list'
    }, ...options });
});