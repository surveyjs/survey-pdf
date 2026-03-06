(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { checkFlatSnapshot } from './snapshot_helper';
import { DocOptions, DocController } from '../src/doc_controller';
import { TestHelper } from '../src/helper_test';
import { FlatRating } from '../src/flat_layout/flat_rating';
import { QuestionRatingModel } from 'survey-core';
import { SurveyPDF } from '../src/survey';
import '../src/flat_layout/flat_rating';

test('Check rating two elements', async () => {
    const json: any = {
        elements: [
            {
                type: 'rating',
                name: 'rateme',
                titleLocation: 'hidden',
                rateMax: 2
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'rating_two_items',
    });
});
test('Check rating two elements with min rate description', async () => {
    let json: any = {
        elements: [
            {
                type: 'rating',
                name: 'rating_min_desc',
                titleLocation: 'hidden',
                rateMax: 2,
                minRateDescription: 'Littleee'
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'rating_min_rate_description',
    });
});
test('Check rating two elements with max rate description', async () => {
    let json: any = {
        elements: [
            {
                type: 'rating',
                name: 'rateme',
                titleLocation: 'hidden',
                rateMax: 2,
                maxRateDescription: 'High rate!'
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'rating_max_rate_description',
    });
});
test('Check rating many elements', async () => {
    let json: any = {
        elements: [
            {
                type: 'rating',
                name: 'rateme',
                titleLocation: 'hidden',
                rateMax: 6
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'rating_many_elements',
        controllerOptions: {
            format: [50, 297.0
            ]
        }
    });
});
test('Check rating two elements with long min rate description', async () => {
    let json: any = {
        elements: [
            {
                type: 'rating',
                name: 'rateme',
                titleLocation: 'hidden',
                rateMax: 2,
                minRateDescription: '12345678'
            }
        ]
    };
    let dummyController: DocController = new DocController(TestHelper.defaultOptions);
    let longRateDesc: number = (dummyController.measureText(
        json.elements[0].minRateDescription + ' 1', 'bold').width +
        dummyController.unitWidth) / DocOptions.MM_TO_PT;
    await checkFlatSnapshot(json, {
        snapshotName: 'rating_with_long_min_rate_description',
        controllerOptions: {
            format: [TestHelper.defaultOptions.margins.left + dummyController.unitWidth / DocOptions.MM_TO_PT +
        TestHelper.defaultOptions.margins.right + longRateDesc, 297.0]
        }
    });
});
test('Check rating vertical layout composite', async () => {
    let json: any = {
        questions: [
            {
                type: 'rating',
                name: 'satisfaction',
                titleLocation: 'hidden',
                rateMax: 1,
                mininumRateDescription: 'Not Satisfied',
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'rating_vertical_layout_composite',
    });
});

test('Check rating getRows method', async () => {
    let json: any = {
        elements: [
            {
                type: 'rating',
                name: 'rating_get_rows',
                titleLocation: 'hidden',
                rateMax: 10
            }
        ]
    };
    const survey = new SurveyPDF(json);
    const controller = new DocController(TestHelper.defaultOptions);
    const question = survey.getAllQuestions()[0] as QuestionRatingModel;
    const flat = new FlatRating(survey, question, controller, { spacing: { choiceColumnGap: 15 }, choiceMinWidth: 18 });
    let getRows = flat['getRows'].bind(flat);
    let rows = getRows();
    expect(rows.length).toBe(1);
    expect(rows[0].length).toBe(10);

    question.rateMax = 5;
    rows = getRows();
    expect(rows.length).toBe(1);
    expect(rows[0].length).toBe(5);

    question.rateMax = 17;
    rows = getRows();
    expect(rows.length).toBe(2);
    expect(rows[0].length).toBe(16);
    expect(rows[1].length).toBe(1);

    question.rateMax = 20;
    rows = getRows();
    expect(rows.length).toBe(2);
    expect(rows[0].length).toBe(16);
    expect(rows[1].length).toBe(4);

    flat.style.spacing.choiceColumnGap = 30;

    question.rateMax = 5;
    rows = getRows();
    expect(rows.length).toBe(1);
    expect(rows[0].length).toBe(5);

    question.rateMax = 12;
    rows = getRows();
    expect(rows.length).toBe(2);
    expect(rows[0].length).toBe(11);
    expect(rows[1].length).toBe(1);

    question.rateMax = 20;
    rows = getRows();
    expect(rows.length).toBe(2);
    expect(rows[0].length).toBe(11);
    expect(rows[1].length).toBe(9);
});
