import { checkPDFSnapshot } from './snapshot_helper';
import '../src/entries/pdf-base';

var json = {
    'elements': [
        {
            'type': 'radiogroup',
            choices: ['Yes', 'No'],
            'name': 'radiogroup'
        }
    ]
};

test('Check radiogroup readonly', async () => {
    await checkPDFSnapshot(json, {
        onSurveyCreated: (survey) => {
            survey.mode = 'display';
            survey.data = { radiogroup: 'Yes' };
        },
        snapshotName: 'radiogroup_readonly',
    });
});

test('Check radiogroup interactive', async () => {
    await checkPDFSnapshot(json, {
        onSurveyCreated: (survey) => {
            survey.data = { radiogroup: 'Yes' };
        },
        snapshotName: 'radiogroup_interactive',
    });
});