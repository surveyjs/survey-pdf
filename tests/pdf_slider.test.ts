import { TestHelper } from '../src/helper_test';
import { checkFlatSnapshot, checkPDFSnapshot } from './snapshot_helper';

var json = {
    elements: [
        {
            name: 'q1',
            type: 'slider',
            sliderType: 'single',
            defaultValue: 50
        },
        {
            name: 'q2',
            type: 'slider',
            sliderType: 'range',
            defaultValue: [30, 60]
        }
    ]
};

test.skip('Check Sliders', async () => {
    await checkPDFSnapshot(json, {
        controllerOptions: {
            fontSize: 20
        },
        onSurveyCreated: (survey) => {
            survey.mode = 'display';
        },
        snapshotName: 'sliders',
    });
});