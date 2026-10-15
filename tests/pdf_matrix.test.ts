import { test } from 'vitest';
import { checkPDFSnapshot } from './snapshot_helper';
import '../src/flat_layout/flat_textbox';
import '../src/flat_layout/flat_matrixmultiple';

test('Check matrix borders', async () => {
    await checkPDFSnapshot({
        'elements': [
            {
                'type': 'matrixdropdown',
                'name': 'matrix',
                titleLocation: 'hidden',
                'columns': [
                    { name: 'Column 1', cellType: 'text' },
                    { name: 'Column 2', cellType: 'text' }
                ],
                'rows': [
                    'Row 1', 'Row 2'
                ],
            }
        ]
    }, {
        snapshotName: 'matrixdropdown-borders',
        onSurveyCreated: (survey) => {
            survey.mode = 'display';
        }
    });
});