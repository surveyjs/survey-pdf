(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};
import { checkFlatSnapshot } from './snapshot_helper';
import { IDocOptions, DocOptions, DocController } from '../src/doc_controller';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
import '../src/entries/pdf-base';

test('Check multiple text one item', async () => {
    const json: any = {
        elements: [
            {
                type: 'multipletext',
                name: 'multi one item',
                titleLocation: 'hidden',
                items: [
                    {
                        name: 'Input me'
                    }
                ]
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'multipletext_one_item'
    });
});
test('Check multiple text two items', async () => {
    const json: any = {
        elements: [
            {
                type: 'multipletext',
                name: 'multi',
                titleLocation: 'hidden',
                items: [
                    {
                        name: 'Input me'
                    },
                    {
                        name: 'Oh eee'
                    }
                ]
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'multipletext_two_items'
    });
});
test('Check multiple text with colCount and long text', async () => {
    const sign: string = '|';
    const json = {
        elements: [
            {
                type: 'multipletext',
                name: 'multi',
                titleLocation: 'hidden',
                colCount: 2,
                items: [
                    {
                        name: sign
                    },
                    {
                        name: sign + sign
                    },
                    {
                        name: sign
                    }
                ]
            }
        ]
    };
    const options: IDocOptions = TestHelper.defaultOptions;
    const signWidth: number = new DocController(options).measureText(
        sign, { fontStyle: 'bold' }).width / DocOptions.MM_TO_PT;
    await checkFlatSnapshot(json, {
        snapshotName: 'multipletext_colCount_2_long_text',
        controllerOptions: {
            format: [options.margins.left + options.margins.right +
        2.5 * signWidth / 0.4 +
        new DocController(options).unitWidth /
            0.4, 297.0
            ] }
    });
});
test('Check multiple text where columns in last row fewer than columns in colCount', async () => {
    const json = {
        questions: [
            {
                type: 'multipletext',
                name: 'question1',
                titleLocation: 'hidden',
                items: [
                    {
                        name: 'text1',
                        title: 'A'
                    },
                    {
                        name: 'text2',
                        title: 'B'
                    },
                    {
                        name: 'text3',
                        title: 'C'
                    }
                ],
                colCount: 2
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'multipletext_three_items_colCount_2'
    });
});