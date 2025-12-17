(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { SurveyPDF } from '../src/survey';
import { IDocOptions, DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { TestHelper } from '../src/helper_test';
import { checkFlatSnapshot } from './snapshot_helper';
import { FlatPanel } from '../src/flat_layout/flat_panel';
import '../src/flat_layout/flat_textbox';
import { PanelModel } from 'survey-core';
import { SurveyHelper } from '../src/helper_survey';

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

test('Check FlatPanel.getRows: two small elements stay in one row', async () => {
    const json: any = {
        elements: [
            {
                type: 'panel',
                name: 'panel1',
                elements: [
                    { type: 'text', name: 'q1', width: '50px' },
                    { type: 'text', name: 'q2', startWithNewLine: false, width: '50px' }
                ]
            }
        ]
    };
    const survey = new SurveyPDF(json, TestHelper.defaultOptions);
    const panel = survey.getAllPanels()[0] as PanelModel;
    const controller = new DocController(TestHelper.defaultOptions);
    const styles = survey.getStylesForElement(panel as PanelModel);
    const flatPanel = new FlatPanel(survey, panel, controller, styles);
    panel.onFirstRendering();
    const rows = (flatPanel as any).getRows(controller);

    expect(Array.isArray(rows)).toBe(true);
    expect(rows.length).toBeGreaterThanOrEqual(1);
    const row = rows[0];
    expect(row.length).toBe(2);
    expect(row[0].element.name).toBe('q1');
    expect(row[1].element.name).toBe('q2');
});

test('Check FlatPanel.getRows: very wide element forces wrapping', async () => {
    const json: any = {
        elements: [
            {
                type: 'panel',
                name: 'panel_wrap',
                elements: [
                    { type: 'text', name: 'qBig', width: '2000px' },
                    { type: 'text', name: 'qSmall', startWithNewLine: false, width: '50px' }
                ]
            }
        ]
    };
    const survey = new SurveyPDF(json, TestHelper.defaultOptions);
    const panel = survey.getAllPanels()[0] as PanelModel;
    panel.onFirstRendering();

    const controller = new DocController(TestHelper.defaultOptions);
    const styles = survey.getStylesForElement(panel);
    const flatPanel = new FlatPanel(survey, panel, controller, styles);
    const rows = flatPanel['getRows'](controller);

    expect(rows.length).toBeGreaterThanOrEqual(2);
    expect(rows[0].length).toBe(1);
    expect(rows[0][0].element.name).toBe('qBig');
    expect(rows[1].length).toBe(1);
    expect(rows[1][0].element.name).toBe('qSmall');

});

test('Check FlatPanel.getRows: respects minWidth and maxWidth constraints', async () => {
    const json: any = {
        elements: [
            {
                type: 'panel',
                name: 'panel_constraints',
                elements: [
                    { type: 'text', name: 'qA', minWidth: '10px', maxWidth: '500px', startWithNewLine: false },
                    { type: 'text', name: 'qB', minWidth: '50px', maxWidth: '60px', startWithNewLine: false }
                ]
            }
        ]
    };
    const survey = new SurveyPDF(json, TestHelper.defaultOptions);
    const panel = survey.getAllPanels()[0] as PanelModel;
    panel.onFirstRendering();

    const controller = new DocController({ ...TestHelper.defaultOptions, margins: { top: 0, left: 0, bot: 0, right: 0 } });
    controller.margins.left = 0;
    controller.margins.right = 0;
    const styles = survey.getStylesForElement(panel);
    const flatPanel = new FlatPanel(survey, panel, controller, styles);
    let rows = flatPanel['getRows'](controller);

    expect(rows.length).toBe(1);
    expect(rows[0].length).toBe(2);
    expect(rows[0][0].width).toBe(375);
    expect(rows[0][1].width).toBe(45);

    panel.elements[0].maxWidth = '6000px';
    rows = flatPanel['getRows'](controller);
    expect(rows.length).toBe(1);
    expect(rows[0].length).toBe(2);
    expect(rows[0][0].width).toBe(SurveyHelper.getPageAvailableWidth(controller) - 45);
    expect(rows[0][1].width).toBe(45);
});

test('Check FlatPanel.getRows: check with three elements', async () => {
    const json: any = {
        elements: [
            {
                type: 'panel',
                name: 'panel_constraints',
                elements: [
                    { type: 'text', name: 'qA', minWidth: '10px', maxWidth: '500px', startWithNewLine: false },
                    { type: 'text', name: 'qB', minWidth: '50px', maxWidth: '60px', startWithNewLine: false },
                    { type: 'text', name: 'qA', minWidth: '10px', maxWidth: '100px', startWithNewLine: false },
                ]
            }
        ]
    };
    const survey = new SurveyPDF(json, TestHelper.defaultOptions);
    const panel = survey.getAllPanels()[0] as PanelModel;
    panel.onFirstRendering();

    const controller = new DocController({ ...TestHelper.defaultOptions, margins: { top: 0, left: 0, bot: 0, right: 0 } });
    controller.margins.left = 0;
    controller.margins.right = 0;
    const styles = survey.getStylesForElement(panel);
    const flatPanel = new FlatPanel(survey, panel, controller, styles);
    let rows = flatPanel['getRows'](controller);

    expect(rows.length).toBe(1);
    expect(rows[0].length).toBe(3);
    expect(rows[0][0].width).toBe(375);
    expect(rows[0][1].width).toBe(45);
    expect(rows[0][2].width).toBe(75);

    panel.elements[0].minWidth = '800px';
    panel.elements[0].maxWidth = '100%';
    panel.elements[1].maxWidth = '100%';
    panel.elements[2].maxWidth = '100%';
    rows = flatPanel['getRows'](controller);
    expect(rows.length).toBe(2);
    expect(rows[0].length).toBe(1);
    expect(rows[1].length).toBe(2);
    expect(rows[0][0].width).toBe(SurveyHelper.getPageAvailableWidth(controller));
    expect(rows[1][0].width).toBe(50 * 3 /4 + (SurveyHelper.getPageAvailableWidth(controller) - 50 * 3 /4 - 10 * 3 /4) / 2);
    expect(rows[1][1].width).toBe(10 * 3 /4 + (SurveyHelper.getPageAvailableWidth(controller) - 50 * 3 /4 - 10 * 3 /4) / 2);
});
