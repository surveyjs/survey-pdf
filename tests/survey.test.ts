(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
    return {};
};

import { SurveyPDF } from '../src/survey';
import { FlatTextbox } from '../src/flat_layout/flat_textbox';
import { TestHelper } from '../src/helper_test';
import { DocController, DocOptions } from '../src/doc_controller';
import { FlatRepository } from '../src/flat_layout/flat_repository';
import { checkPDFSnapshot } from './snapshot_helper';
import { TextBrick } from '../src/pdf_render/pdf_text';
import '../src/flat_layout/flat_checkbox';
import '../src/flat_layout/flat_radiogroup';
import { IDocStyles } from '../src/styles/types';
let __dummy_tx = new FlatTextbox(null, null, null);

test('Check raw method', async () => {
    let json: any = {
        questions: [
            {
                type: 'text',
                name: 'survey_raw',
                titleLocation: 'hidden'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let raw: string = await survey.raw();
    expect(raw.lastIndexOf('%PDF', 0) === 0).toBe(true);
});
test('Check raw method with dataurlstring parameter', async () => {
    let json: any = {
        questions: [
            {
                type: 'text',
                name: 'survey_rawdataurl',
                titleLocation: 'hidden'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let raw: string = await survey.raw('dataurlstring');
    expect(raw.lastIndexOf('data:application/pdf', 0) === 0).toBe(true);
});

test('check that default font name is set correct in DocOptions', async () => {
    let opt = new DocOptions({});
    expect(opt.fontName).toEqual('helvetica');
    DocOptions.SEGOE_BOLD = 'seqoe_bold';
    DocOptions.SEGOE_NORMAL = 'seqoe_normal';
    opt = new DocOptions({});
    expect(opt.fontName).toEqual('segoe');
    opt = new DocOptions({ fontName: 'custom_font' });
    expect(opt.fontName).toEqual('custom_font');
    DocOptions.SEGOE_BOLD = undefined;
    DocOptions.SEGOE_NORMAL = undefined;
});

class Log {
    public log: string = '';
}
class SurveyPDFSaveTester extends SurveyPDF {
    private logger: Log;
    public setLog(logger: Log) {
        this.logger = logger;
    }
    protected async renderSurvey(controller: DocController) {
        this.logger.log += '->rendered';
        controller.doc.save = async () => {
            let promise = new Promise((resolve) => {
                this.logger.log += '->saving';
                resolve('saved');
            });
            promise.then(() => {
                this.logger.log += '->saved';
            });
            return promise;
        };
    }
}
test('check that save functions called sync if use correctly', async () => {
    const surveyPDF = new SurveyPDFSaveTester({});
    const logger = new Log();
    surveyPDF.setLog(logger);
    expect(await surveyPDF.save()).toBe('saved');
    expect(await surveyPDF.save()).toBe('saved');
    expect(await surveyPDF.save()).toBe('saved');
    expect(logger.log).toEqual('->rendered->saving->saved->rendered->saving->saved->rendered->saving->saved');
});

test('check that save functions called sync', (done) => {
    const surveyPDF = new SurveyPDFSaveTester({});
    const logger = new Log();
    surveyPDF.setLog(logger);
    surveyPDF.save();
    surveyPDF.save();
    surveyPDF.save();
    setTimeout(() => {
        expect(logger.log).toEqual('->rendered->saving->saved->rendered->saving->saved->rendered->saving->saved');
        done();
    }, 1000);
});

test('Check surveyPDF onDocControllerCreated event', (done) => {
    const surveyPDF = new SurveyPDF({});
    surveyPDF.onDocControllerCreated.add((sender, options) => {
        expect(sender).toBe(surveyPDF);
        expect(options.controller instanceof DocController).toBeTruthy();
        done();
    });
    surveyPDF.save();

});

test('Check surveyPDF isRTL options', (done) => {
    let surveyPDF = new SurveyPDF({
        showQuestionNumbers: 'off',
        elements: [{
            type: 'text',
            name: 'q1'
        }]
    }, {
        isRTL: true
    });
    surveyPDF.showQuestionNumbers = 'off';
    let originalXLeft: number;
    let originalXRight: number;
    surveyPDF.onRenderQuestion.add((sender, options) => {
        const titleBrick = options.bricks[0].unfold()[0];
        originalXLeft = titleBrick.xLeft;
        originalXRight = titleBrick.xRight;
    });
    surveyPDF.onRenderHeader.add((sender, options) => {
        const titleBrick = <TextBrick>(options.packs[0].unfold()[0]);
        expect(titleBrick.xLeft).toBeCloseTo(options.controller.paperWidth - originalXRight);
        expect(titleBrick.xRight).toBeCloseTo(options.controller.paperWidth - originalXLeft);
        expect(titleBrick['align']).toEqual({ 'align': 'right', 'baseline': 'middle', 'isInputRtl': false, 'isOutputRtl': true, 'lineHeightFactor': 1.15 });
        done();
    });
    surveyPDF.raw();
});

test('Check FlatRepository static methods', () => {
    expect(FlatRepository.getRenderer('text')).toBe(FlatTextbox);
    FlatRepository.register('custom-question', FlatRepository.getRenderer('text'));
    expect(FlatRepository.getRenderer('custom-question')).toBe(FlatTextbox);
});

test('Check questionsOnPageMode: "inputPerPage"', async () => {
    const survey = new SurveyPDF(
        {
            'questionsOnPageMode': 'inputPerPage',
            'pages': [
                {
                    'name': 'page1',
                    'elements': [
                        {
                            type: 'text',
                            name: 'q1'
                        },
                        {
                            type: 'text',
                            name: 'q2'
                        }
                    ]
                },
                {
                    'name': 'page3',
                    'elements': [
                        {
                            type: 'text',
                            name: 'q3'
                        },
                        {
                            type: 'text',
                            name: 'q4'
                        }
                    ]
                }
            ],
        }
    );
    expect(survey.visiblePages.length).toBe(2);
    survey.visiblePages.forEach(page => page.onFirstRendering());
    expect(survey.visiblePages[0].visibleQuestions.length).toBe(2);
    expect(survey.visiblePages[0].rows.length).toBe(2);
    expect(survey.visiblePages[0].rows[0].elements.length).toBe(1);
    expect(survey.visiblePages[0].rows[0].elements[0].name).toBe('q1');
    expect(survey.visiblePages[0].rows[1].elements.length).toBe(1);
    expect(survey.visiblePages[0].rows[1].elements[0].name).toBe('q2');

    expect(survey.visiblePages[1].visibleQuestions.length).toBe(2);
    expect(survey.visiblePages[1].rows.length).toBe(2);
    expect(survey.visiblePages[1].rows[0].elements.length).toBe(1);
    expect(survey.visiblePages[1].rows[0].elements[0].name).toBe('q3');
    expect(survey.visiblePages[1].rows[1].elements.length).toBe(1);
    expect(survey.visiblePages[1].rows[1].elements[0].name).toBe('q4');
});

test('check rendered navigation for survey', async () => {
    checkPDFSnapshot({
        pages: [{
            title: 'Page1',
            elements: [
                {
                    type: 'checkbox',
                    name: 'Checkbox',
                    title: 'Checkbox',
                    choices: ['Item1', 'Item2', 'Item3', 'Item4', 'Item5', 'Item6', 'Item7', 'Item8', 'Item9', 'Item10', 'Item11', 'Item12', 'Item13', 'Item14', 'Item15'],
                },
                {
                    type: 'radiogroup',
                    name: 'radiogroup',
                    title: 'Radiogroup',
                    choices: ['Item1', 'Item2', 'Item3', 'Item4', 'Item5', 'Item6', 'Item7', 'Item8', 'Item9', 'Item10', 'Item11', 'Item12', 'Item13', 'Item14', 'Item15'],
                },
                {
                    type: 'panel',
                    title: 'Panel',
                    elements: [
                        {
                            type: 'text',
                            name: 'question1',
                            title: 'Question 1'
                        },
                        {
                            type: 'text',
                            name: 'question2',
                            title: 'Question 2'
                        },
                    ]
                },
            ]
        },
        {
            title: 'Page2',
            elements: [
                {
                    type: 'text',
                    name: 'question1',
                    title: 'Question 3'
                },
                {
                    type: 'text',
                    name: 'question2',
                    title: 'Question 4'
                },
            ]
        }
        ]
    }, {
        snapshotName: 'toc.pdf',
        controllerOptions: {
            showNavigation: true
        }
    });
});

test('check applyStyles method', async () => {
    const survey = new SurveyPDF({});
    expect((survey.styles as any).test).toBe(undefined);
    expect((survey.styles as any).test2).toBe(undefined);
    survey.applyStyles({ test: 'testValue' } as IDocStyles);
    expect((survey.styles as any).test).toBe('testValue');
    expect((survey.styles as any).test2).toBe(undefined);
    survey.applyStyles(() => { return { test2: 'testValue2' } as IDocStyles; });
    expect((survey.styles as any).test).toBe('testValue');
    expect((survey.styles as any).test2).toBe('testValue2');
});