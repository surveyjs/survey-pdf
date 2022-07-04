(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { ComponentCollection } from 'survey-core';
import { SurveyPDF } from '../src/survey';
import { IRect, IPoint, DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatRanking } from '../src/flat_layout/flat_ranking';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { TextBrick } from '../src/pdf_render/pdf_text';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
const __dummy_rn: FlatRanking = new FlatRanking(null, null, null);

test('Check ranking in custom component', async () => {
    ComponentCollection.Instance.add(<any>{ name: 'comp', questionJSON: { type: 'rating', choices: ['A', 'B'] } });
    const json: any = {
        questions: [
            {
                titleLocation: 'hidden',
                name: 'comp',
                type: 'comp'
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    ComponentCollection.Instance.clear();
});