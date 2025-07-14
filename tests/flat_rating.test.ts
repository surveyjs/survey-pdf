(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { checkFlatSnapshot } from './snapshot_helper';
import { QuestionRatingModel } from 'survey-core';
import { SurveyPDF } from '../src/survey';
import { IRect, DocOptions, IDocOptions, DocController, ISize, IPoint } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatQuestion } from '../src/flat_layout/flat_question';
import { FlatRating } from '../src/flat_layout/flat_rating';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
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
            format: [
                TestHelper.defaultOptions.margins.left + TestHelper.defaultOptions.margins.right +
        SurveyHelper.getRatingMinWidth(new DocController(TestHelper.defaultOptions)) * 3 /
        DocOptions.MM_TO_PT + new DocController(TestHelper.defaultOptions).unitWidth /
        DocOptions.MM_TO_PT, 297.0
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