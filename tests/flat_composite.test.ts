(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};
import { test } from 'vitest';
import { checkFlatSnapshot } from './snapshot_helper';
import { ComponentCollection } from 'survey-core';
import '../src/flat_layout/flat_textbox';

test('Comment point, title location top', async () => {
    ComponentCollection.Instance.add({
        name: 'composite_test',
        elementsJSON: [
            {
                type: 'text',
                name: 'q1',
                titleLocation: 'hidden',
            },
            {
                type: 'text',
                name: 'q2',
                titleLocation: 'hidden',
                startWithNewLine: false
            },
        ]
    });
    const json = {
        questions: [
            {
                titleLocation: 'top',
                name: 'composite',
                type: 'composite_test',
                title: 'Composite title',
                description: 'Composite description',
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'composite',
        isCorrectEvent: (options:any) => {
            return options.question.name === 'composite';
        }
    });
    ComponentCollection.Instance.clear();
});