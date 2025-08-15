(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { SurveyPDF } from '../src/survey';
import { IDocOptions, DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { TestHelper } from '../src/helper_test';
import { checkFlatSnapshot } from './snapshot_helper';
import '../src/flat_layout/flat_textbox';

test('Check panel wihtout title', async () => {
    let json: any = {
        elements: [
            {
                type: 'panel',
                name: 'Simple Panel',
                elements: [
                    {
                        type: 'text',
                        name: 'I am in the panel'
                    }
                ]
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'panel_without_title',
        eventName: 'onRenderPanel'
    });
});
test('Check panel with title', async () => {
    const json: any = {
        elements: [
            {
                type: 'panel',
                name: 'Simple Panel',
                title: 'Panel Title',
                elements: [
                    {
                        type: 'text',
                        name: 'I am in the panel'
                    }
                ]
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'panel_with_title',
        eventName: 'onRenderPanel'
    });
});
test('Check panel with title and number', async () => {
    const json: any = {
        showQuestionNumbers: 'on',
        elements: [
            {
                type: 'panel',
                name: 'Simple Panel',
                title: 'Panel Title',
                showNumber: true,
                elements: [
                    {
                        type: 'text',
                        name: 'I am in the panel'
                    }
                ]
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'panel_with_title_number',
        eventName: 'onRenderPanel'
    });
});
test('Check panel with title and description', async () => {
    const json: any = {
        elements: [
            {
                type: 'panel',
                name: 'Simple Panel',
                title: 'Panel Title',
                description: 'Panel description',
                elements: [
                    {
                        type: 'text',
                        name: 'I am in the panel'
                    }
                ]
            }
        ]
    };

    await checkFlatSnapshot(json, {
        snapshotName: 'panel_with_title_description',
        eventName: 'onRenderPanel'
    });
});
test('Check panel with inner indent', async () => {
    let json: any = {
        elements: [
            {
                type: 'panel',
                name: 'Simple Panel',
                innerIndent: 3,
                elements: [
                    {
                        type: 'text',
                        name: 'I am in the panel'
                    }
                ]
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'panel_inner_indent',
        eventName: 'onRenderPanel'
    });
});
test('Check question title location in panel', async () => {
    let json: any = {
        elements: [
            {
                type: 'panel',
                name: 'Simple Panel',
                questionTitleLocation: 'bottom',
                elements: [
                    {
                        type: 'text',
                        name: 'At the very bottom'
                    }
                ]
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'panel_questionTitleLocation_bottom',
        eventName: 'onRenderPanel'
    });
});
test('Check not rendering invisible questions', async () => {
    const json: any = {
        elements: [
            {
                type: 'panel',
                name: 'Simple Panel',
                title: 'Panel Title',
                elements: [
                    {
                        type: 'text',
                        name: 'I am in the panel'
                    },
                    {
                        type: 'text',
                        name: 'I am invisible',
                        visible: false,
                        startWithNewLine: false
                    }
                ]
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'panel_with_invisible_questions',
        eventName: 'onRenderPanel'
    });
});
test('Check', async () => {
    const json = {
        pages: [
            {
                name: 'page1',
                elements: [
                    {
                        type: 'text',
                        name: 'question1'
                    },
                    {
                        type: 'text',
                        name: 'question2',
                        startWithNewLine: false
                    }
                ],
                title: 'A\nA\nA\nA\nA\nA\nA\nA'
            }
        ]
    };
    const options: IDocOptions = TestHelper.defaultOptions;
    options.format = [210.0, 117.0];
    const survey: SurveyPDF = new SurveyPDF(json, options);
    const controller: DocController = new DocController(options);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
});
