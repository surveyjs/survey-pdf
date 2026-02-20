(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};
import { checkFlatSnapshot } from './snapshot_helper';
import '../src/flat_layout/flat_ranking';

test('Check ranking ', async () => {
    const json: any = {
        questions: [
            {
                titleLocation: 'hidden',
                name: 'ranking',
                type: 'ranking',
                choices: ['A', 'B']
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'ranking_two_items'
    });
});

test('Check ranking with selectToRank', async () => {
    const json: any = {
        questions: [
            {
                titleLocation: 'hidden',
                name: 'ranking',
                type: 'ranking',
                selectToRankEnabled: true,
                choices: ['A', 'B', 'C']
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'ranking_select_to_rank',
        onSurveyCreated: (survey) => {
            survey.data = {
                ranking: [
                    'B', 'A'
                ],
            };
        }
    });
});

test('Check ranking with selectToRank vertical', async () => {
    const json: any = {
        questions: [
            {
                titleLocation: 'hidden',
                name: 'ranking',
                type: 'ranking',
                selectToRankEnabled: true,
                selectToRankAreasLayout: 'vertical',
                choices: ['A', 'B', 'C']
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'ranking_select_to_rank_vertical',
        onSurveyCreated: (survey) => {
            survey.data = {
                ranking: [
                    'B', 'A'
                ],
            };
        }
    });
});