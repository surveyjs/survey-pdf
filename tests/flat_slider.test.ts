import { checkFlatSnapshot } from './snapshot_helper';

var jsonSingle = {
    elements: [
        {
            name: 'q1',
            type: 'slider',
            sliderType: 'single',
            titleLocation: 'hidden',
            defaultValue: 50
        }
    ]
};

var jsonRange = {
    elements: [
        {
            name: 'q2',
            type: 'slider',
            sliderType: 'range',
            titleLocation: 'hidden',
            defaultValue: [30, 60]
        }
    ]
};

test('Slider Single', async () => {
    await checkFlatSnapshot(jsonSingle, {
        allowedPropertiesHash: {
            'TextFieldBrick': ['value']
        },
        snapshotName: 'slider-single',
    });
});

test('Slider Range', async () => {
    await checkFlatSnapshot(jsonRange, {
        allowedPropertiesHash: {
            'TextFieldBrick': ['value']
        },
        snapshotName: 'slider-range',
    });
});

test('Slider Single: Display Mode', async () => {
    await checkFlatSnapshot(jsonSingle, {
        onSurveyCreated: (survey) => {
            survey.mode = 'display';
        },
        allowedPropertiesHash: {
            'TextFieldBrick': ['value']
        },
        snapshotName: 'slider-single-display-mode',
    });
});

test('Slider Range: Display Mode', async () => {
    await checkFlatSnapshot(jsonRange, {
        onSurveyCreated: (survey) => {
            survey.mode = 'display';
        },
        allowedPropertiesHash: {
            'TextFieldBrick': ['value']
        },
        snapshotName: 'slider-range-display-mode',
    });
});