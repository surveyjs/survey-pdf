import { checkFlatSnapshot } from './snapshot_helper';
import '../src/flat_layout/flat_radiogroup';
test('Check radiogroup with item comment', async () => {
    await checkFlatSnapshot({ elements: [{
        'type': 'radiogroup',
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
        ],
        'colCount': 1
    }] },
    {
        snapshotName: 'radiogroup_item_comment',
        allowedPropertiesHash: {
            'TextFieldBrick': ['options']
        },
        onSurveyCreated(survey) {
            survey.data = survey.data = {
                'question1': {
                    'value': 'Item 2',
                    'comment': 'ccccc'
                },
            };
        },
    });
});