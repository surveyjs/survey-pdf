(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { checkFlatSnapshot } from './snapshot_helper';
import '../src/flat_layout/flat_dropdown';

test('Check dropdown', async () => {
    const json: any = {
        elements: [
            {
                type: 'dropdown',
                name: 'expand me',
                choices: [
                    'right choice'
                ]
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'dropdown'
    });
});
test('Check dropdown with other not answered', async () => {
    const json: any = {
        showQuestionNumbers: 'false',
        elements: [
            {
                type: 'dropdown',
                name: 'dropdown_other_not_answered',
                choices: [
                    'right choice'
                ],
                hasOther: true
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'dropdown_other_not_answered'
    });
});
test('Check dropdown with other answered', async () => {
    const json: any = {
        showQuestionNumbers: 'false',
        elements: [
            {
                type: 'dropdown',
                name: 'dropdown_other_answered',
                choices: [
                    'right choice'
                ],
                hasOther: true,
                defaultValue: 'other'
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'dropdown_other_answered'
    });
});
test('Check readonly text expends when textFieldRenderAs option set', async () => {
    const json = {
        elements: [
            {
                type: 'dropdown',
                choices: [
                    {
                        value: 'item1',
                        text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"
                    }
                ],
                defaultValue: 'item1',
                titleLocation: 'hidden',
                readOnly: true
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'dropdown_readonly_big_text',
        controllerOptions: {
            textFieldRenderAs: 'multiLine',
            margins: {
                left: 10.0,
                right: 10.0,
                top: 10.0,
                bot: 10.0
            }
        }
    });
});
test('Check dropdown when survey mode is display and textFieldRenderAs is multiline', async () => {
    const json = {
        elements: [
            {
                type: 'dropdown',
                choices: [
                    {
                        value: 'item1',
                        text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s'
                    }
                ],
                defaultValue: 'item1',
                titleLocation: 'hidden'
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'dropdown_display_mode_big_text',
        onSurveyCreated: (survey) => {
            survey.mode = 'display';
        },
        controllerOptions: {
            textFieldRenderAs: 'multiLine',
            margins: {
                left: 10.0,
                right: 10.0,
                top: 10.0,
                bot: 10.0
            }
        }
    });
});

test('Check item comment', async () => {
    await checkFlatSnapshot({ 'elements': [{
        'type': 'dropdown',
        'name': 'question1',
        'choices': [
            {
                'value': 'Item 1',
                'showCommentArea': true
            },
            {
                'value': 'Item 2',
                'showCommentArea': true
            },
            {
                'value': 'Item 3',
                'showCommentArea': true
            },
            'Item 4',
            'Item 5',
            'Item 6',
            'Item 7'
        ]
    }]
    }, {
        snapshotName: 'dropdown_item_comment',
        allowedPropertiesHash: {
            'TextFieldBrick': ['options']
        },
        onSurveyCreated(survey) {
            survey.data = {
                'question1': {
                    'value': 'Item 2',
                    'comment': 'aaaaa'
                }
            };
        },
    });
});