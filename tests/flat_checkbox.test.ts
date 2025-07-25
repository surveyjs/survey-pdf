(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { DocOptions, DocController } from '../src/doc_controller';
import { TestHelper } from '../src/helper_test';
import { checkFlatSnapshot } from './snapshot_helper';
import { settings } from 'survey-core';

import '../src/flat_layout/flat_textbox';
import '../src/flat_layout/flat_checkbox';
import { FlatCheckbox } from '../src/flat_layout/flat_checkbox';
import { SurveyPDF } from '../src/survey';

test('Check other checkbox place ', async () => {
    const json: any = {
        questions: [
            {
                titleLocation: 'hidden',
                name: 'checkbox',
                type: 'checkbox',
                hasOther: true,
                defaultValue: 'other',
                otherText: 'Other(describe)'
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'checkbox_other',
        controllerOptions: {
            format: [40.0, 297.0]
        }
    });
});
test('Check checkbox with colCount 4 with small font size 12', async () => {
    const json: any = {
        questions: [
            {
                titleLocation: 'hidden',
                name: 'checkbox',
                type: 'checkbox',
                choices: ['item1', 'item2', 'item3', 'item4', 'item5'],
                colCount: 4
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'checkbox_colCount_4_font_size_12',
        controllerOptions: {
            fontSize: 12
        }
    });
});
test('Check checkbox with colCount 4 with big font size 30', async () => {
    const json: any = {
        questions: [
            {
                titleLocation: 'hidden',
                name: 'checkbox',
                type: 'checkbox',
                choices: ['item1', 'item2', 'item3', 'item4', 'item5'],
                colCount: 4
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'checkbox_colCount_4_font_size_30'
    });
});
test('Check checkbox with colCount 0 with big font size 30', async () => {
    const json: any = {
        questions: [
            {
                titleLocation: 'hidden',
                name: 'checkbox',
                type: 'checkbox',
                choices: ['item1', 'item2', 'item3', 'item4'],
                colCount: 0
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'checkbox_colCount_0_font_size_30',
        controllerOptions: {
            format: [210.0 + new DocController(TestHelper.defaultOptions).unitWidth / DocOptions.MM_TO_PT, 297.0]
        }
    });
});
test('Check checkbox with colCount 0 with small font size 12', async () => {
    const json: any = {
        questions: [
            {
                titleLocation: 'hidden',
                name: 'checkbox',
                type: 'checkbox',
                choices: ['item1', 'item2', 'item3', 'item4'],
                colCount: 0
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'checkbox_colCount_0_font_size_12',
        controllerOptions: {
            fontSize: 12
        }
    });
});
test('Check tagbox', async () => {
    const json: any = {
        questions: [
            {
                titleLocation: 'hidden',
                name: 'tagbox',
                type: 'tagbox',
                choices: ['item1', 'item2', 'item3', 'item4'],
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'tagbox'
    });
});

test('Tagbox: print selected choices', async () => {
    const json: any = {
        questions: [
            {
                titleLocation: 'hidden',
                name: 'tagbox',
                type: 'tagbox',
                defaultValue: ['item2', 'item3'],
                choices: ['item1', 'item2', 'item3', 'item4'],
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'tagbox_selected_choices',
        controllerOptions: {
            tagboxSelectedChoicesOnly: true
        }
    });
});

test('Check columns 5 with itemFlowDirection', async() => {
    const oldItemFlowDirection = settings.itemFlowDirection;
    settings.itemFlowDirection = 'row';
    await checkFlatSnapshot({
        elements: [
            {
                name: 'q1',
                type: 'checkbox',
                colCount: 5,
                choices: [
                    'item1',
                    'item2',
                    'item3',
                    'item4',
                    'item5',
                    'item6',
                    'item7',
                    'item8'
                ]
            }
        ]
    }, { snapshotName: 'checkbox-col-count-5-row-flow', controllerOptions: { fontSize: 10 } });
    settings.itemFlowDirection = oldItemFlowDirection;
});

test('Check columns 5 with itemFlowDirection:row', async() => {
    const oldItemFlowDirection = settings.itemFlowDirection;
    settings.itemFlowDirection = 'column';
    checkFlatSnapshot({
        elements: [
            {
                name: 'q1',
                type: 'checkbox',
                colCount: 5,
                choices: [
                    'item1',
                    'item2',
                    'item3',
                    'item4',
                    'item5',
                    'item6',
                    'item7',
                    'item8'
                ]
            }
        ]
    }, { snapshotName: 'checkbox-col-count-5-column-flow', controllerOptions: { fontSize: 10 } });
    settings.itemFlowDirection = oldItemFlowDirection;
});

test('Check columns 4 with itemFlowDirection', async() => {
    const oldItemFlowDirection = settings.itemFlowDirection;
    settings.itemFlowDirection = 'row';
    await checkFlatSnapshot({
        elements: [
            {
                name: 'q1',
                type: 'checkbox',
                colCount: 4,
                choices: [
                    'item1',
                    'item2',
                    'item3',
                    'item4',
                    'item5',
                    'item6',
                    'item7',
                    'item8'
                ]
            }
        ]
    }, { snapshotName: 'checkbox-col-count-4-row-flow', controllerOptions: { fontSize: 10 } });
    settings.itemFlowDirection = oldItemFlowDirection;
});

test('Check columns 4 with itemFlowDirection:row', async() => {
    const oldItemFlowDirection = settings.itemFlowDirection;
    settings.itemFlowDirection = 'column';
    checkFlatSnapshot({
        elements: [
            {
                name: 'q1',
                type: 'checkbox',
                colCount: 4,
                choices: [
                    'item1',
                    'item2',
                    'item3',
                    'item4',
                    'item5',
                    'item6',
                    'item7',
                    'item8'
                ]
            }
        ]
    }, { snapshotName: 'checkbox-col-count-4-column-flow', controllerOptions: { fontSize: 10 } });
    settings.itemFlowDirection = oldItemFlowDirection;
});

test('Check margins are correct after generating content', async() => {
    const json = {
        elements: [
            {
                name: 'q1',
                type: 'checkbox',
                colCount: 4,
                titleLocation: 'left',
                choices: [
                    'item1',
                    'item2',
                    'item3',
                    'item4',
                    'item5',
                    'item6',
                    'item7',
                    'item8'
                ]
            }
        ]
    };
    const options = TestHelper.defaultOptions;
    options.fontSize = 14;
    const survey: SurveyPDF = new SurveyPDF(json, options);
    const controller: DocController = new DocController(options);
    const oldMarginLeft: number = controller.margins.left as number;
    const oldMarginRight: number = controller.margins.right as number;
    await new FlatCheckbox(survey, survey.getAllQuestions()[0], controller, {}).generateFlats({ xLeft: oldMarginLeft, yTop: controller.margins.top as number });
    expect(controller.margins.left).toBe(oldMarginLeft);
    expect(controller.margins.right).toBe(oldMarginRight);
});