(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { SurveyPDF } from '../src/survey';
import { IPoint, IRect, DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatTextbox } from '../src/flat_layout/flat_textbox';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { HTMLBrick } from '../src/pdf_render/pdf_html';
import { RowlineBrick } from '../src/pdf_render/pdf_rowline';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
import { ImageBrick } from '../src/pdf_render/pdf_image';
import { ElementFactory, Question, Serializer } from 'survey-core';
import { FlatRepository } from '../src/flat_layout/flat_repository';
import { FlatQuestionDefault } from '../src/flat_layout/flat_default';
import { checkFlatSnapshot } from './snapshot_helper';
import '../src/flat_layout/flat_textbox';
test('Survey with title', async () => {
    const json: any = {
        title: 'One small step for man',
        elements: [
            {
                type: 'text',
                name: 'MissText',
                titleLocation: 'hidden'
            }
        ]
    };
    await checkFlatSnapshot(json, {
        eventName: 'onRenderSurvey',
        snapshotName: 'survey_with_title'
    });
});
test('Survey with description', async () => {
    const json: any = {
        description: 'One giant leap for mankind',
        elements: [
            {
                type: 'text',
                name: 'MissText',
                titleLocation: 'hidden'
            }
        ]
    };
    await checkFlatSnapshot(json, {
        eventName: 'onRenderSurvey',
        snapshotName: 'survey_with_description'
    });
});
test('Survey with title and description', async () => {
    const json: any = {
        title: 'One small step for man',
        description: 'One giant leap for mankind',
        elements: [
            {
                type: 'text',
                name: 'MissText',
                titleLocation: 'hidden'
            }
        ]
    };
    await checkFlatSnapshot(json, {
        eventName: 'onRenderSurvey',
        snapshotName: 'survey_with_title_description'
    });
});
test('Survey with logo', async () => {
    const json: any = {
        logo: TestHelper.BASE64_IMAGE_16PX,
        logoWidth: '300px',
        logoHeight: '200px',
        pages: []
    };
    await checkFlatSnapshot(json, {
        eventName: 'onRenderSurvey',
        snapshotName: 'survey_with_logo'
    });
});
test('Survey with left logo and title', async () => {
    const json: any = {
        title: 'TitleLogoLeft',
        logo: TestHelper.BASE64_IMAGE_16PX,
        logoPosition: 'left',
        logoWidth: '300px',
        logoHeight: '200px',
        questions: [
            {
                type: 'text',
                name: 'logoleft',
                titleLocation: 'hidden'
            }
        ]
    };
    await checkFlatSnapshot(json, {
        eventName: 'onRenderSurvey',
        snapshotName: 'survey_with_left_logo_title'
    });

});
test('Survey with left logo and big title', async () => {
    const json: any = {
        title: 'TitleLogoLeftBiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiig',
        logo: TestHelper.BASE64_IMAGE_16PX,
        logoPosition: 'left',
        logoWidth: '300px',
        logoHeight: '200px',
        questions: [
            {
                type: 'text',
                name: 'logoleftbig',
                titleLocation: 'hidden'
            }
        ]
    };
    await checkFlatSnapshot(json, {
        eventName: 'onRenderSurvey',
        snapshotName: 'survey_with_left_logo_big_title'
    });

});
test('Survey with right logo and title', async () => {
    const json: any = {
        title: 'TitleRight',
        logo: TestHelper.BASE64_IMAGE_16PX,
        logoPosition: 'right',
        logoWidth: '300px',
        logoHeight: '200px',
        questions: [
            {
                type: 'text',
                name: 'logoright',
                titleLocation: 'hidden'
            }
        ]
    };
    await checkFlatSnapshot(json, {
        eventName: 'onRenderSurvey',
        snapshotName: 'survey_with_right_logo_title',
    });

});
test('Survey with bottom logo and title', async () => {
    const json: any = {
        title: 'TitleLogoBottom',
        logo: TestHelper.BASE64_IMAGE_16PX,
        logoWidth: '300px',
        logoHeight: '200px',
        logoPosition: 'bottom',
        pages: []
    };

    await checkFlatSnapshot(json, {
        eventName: 'onRenderSurvey',
        snapshotName: 'survey_with_bottom_logo_title'
    });

});
test('Survey with botton logo without title', async () => {
    const json: any = {
        logo: TestHelper.BASE64_IMAGE_16PX,
        logoPosition: 'bottom',
        logoWidth: '300px',
        logoHeight: '200px',
        pages: []
    };
    await checkFlatSnapshot(json, {
        eventName: 'onRenderSurvey',
        snapshotName: 'survey_with_bottom_logo'
    });
});

test('Survey with logo server-side', async () => {
    const json: any = {
        logo: TestHelper.BASE64_IMAGE_16PX,
        logoWidth: '420px',
        logoHeight: '320px',
        pages: []
    };
    await checkFlatSnapshot(json, {
        eventName: 'onRenderSurvey',
        snapshotName: 'survey_with_logo_server_side'
    });
});

test('Survey with logo and pages', async () => {
    const json: any = {
        logo: TestHelper.BASE64_IMAGE_16PX,
        logoWidth: '300px',
        logoHeight: '200px',
        pages: [
            {
                name: 'page1',
                elements: [
                    {
                        type: 'text',
                        name: 'First page qw'
                    }
                ]
            },
            {
                name: 'page2',
                elements: [
                    {
                        type: 'text',
                        name: 'Second page qw'
                    }
                ]
            }
        ]
    };
    await checkFlatSnapshot(json, {
        eventName: 'onRenderSurvey',
        snapshotName: 'survey_with_logo_pages'
    });
});

test('Check default renderer for custom questions', async () => {
    const CUSTOM_TYPE = 'test';
    const json = {
        showQuestionNumbers: 'on',
        elements: [
            {
                type: CUSTOM_TYPE,
                name: 'q1'
            }
        ]
    };
    class CustomQuestionModel extends Question {
        getType() {
            return CUSTOM_TYPE;
        }
    }
    Serializer.addClass(
        CUSTOM_TYPE,
        [],
        function () {
            return new CustomQuestionModel('');
        },
        'question'
    );

    ElementFactory.Instance.registerElement(CUSTOM_TYPE, (name: string) => {
        return new CustomQuestionModel(name);
    });
    const survey = new SurveyPDF(json);
    survey.data = {
        'q1': 'test_value'
    };
    const question = survey.getAllQuestions()[0];
    const controller = new DocController();
    const questionFlat = FlatRepository.getInstance().create(survey, question, controller, 'test');
    expect(questionFlat).toBeInstanceOf(FlatQuestionDefault);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect((<any>flats[0][0].unfold()[3]).options.text).toBe('test_value');
});