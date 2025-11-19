(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { SurveyPDF } from '../src/survey';
import { DocController } from '../src/doc_controller';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';

import * as Survey from 'survey-core';
import { TextFieldBrick } from '../src/pdf_render/pdf_textfield';
import { checkFlatSnapshot } from './snapshot_helper';
import '../src/flat_layout/flat_comment';
import '../src/flat_layout/flat_checkbox';

test('Comment point, title location top', async () => {
    const json = {
        questions: [
            {
                titleLocation: 'top',
                name: 'checkbox',
                type: 'checkbox',
                hasComment: 'true',
                title: 'test'
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'question_title_location_top_with_comment_empty_content'
    });
});
test('Comment point, title location bottom', async () => {
    const json = {
        questions: [
            {
                titleLocation: 'bottom',
                name: 'checkbox',
                type: 'checkbox',
                hasComment: 'true',
                title: 'test'
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'question_title_location_bottom_with_comment_empty_content'
    });
});
test('Comment point, title location left', async () => {
    const json = {
        questions: [
            {
                titleLocation: 'left',
                name: 'checkbox',
                type: 'checkbox',
                hasComment: 'true',
                title: 'test'
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'question_title_location_left_with_comment_empty_content'
    });
});
test('Comment point, title location hidden', async () => {
    const json = {
        questions: [
            {
                titleLocation: 'hidden',
                name: 'checkbox',
                type: 'checkbox',
                hasComment: 'true',
                title: 'test'
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'question_title_location_hidden_with_comment_empty_content'
    });
});
test('Comment point after choice, title location: top', async () => {
    const json: any = {
        showQuestionNumbers: 'false',
        questions: [
            {
                titleLocation: 'top',
                name: 'checkbox',
                type: 'checkbox',
                hasComment: 'true',
                title: 'test',
                choices: ['test']
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'question_title_location_top_with_comment_after_choice'
    });
});
test('Comment point after choice, title location: bottom', async () => {
    const json: any = {
        showQuestionNumbers: 'false',
        questions: [
            {
                titleLocation: 'bottom',
                name: 'checkbox',
                type: 'checkbox',
                hasComment: 'true',
                title: 'test',
                choices: ['test']
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'question_title_location_bottom_with_comment_after_choice'
    });
});
test('Comment point after choice, title location: hidden', async () => {
    const json: any = {
        showQuestionNumbers: 'false',
        questions: [
            {
                titleLocation: 'hidden',
                name: 'checkbox',
                type: 'checkbox',
                hasComment: 'true',
                title: 'test',
                choices: ['test']
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'question_title_location_hidden_with_comment_after_choice'
    });
});
test('Comment point after choice, title location: left', async () => {
    const json: any = {
        showQuestionNumbers: 'false',
        questions: [
            {
                titleLocation: 'left',
                name: 'checkbox',
                type: 'checkbox',
                hasComment: 'true',
                title: 'test',
                choices: ['test']
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'question_title_location_left_with_comment_after_choice'
    });
});
test('Check comment boundaries title hidden', async () => {
    const json: any = {
        questions: [
            {
                type: 'comment',
                name: 'comment',
                title: 'No comments',
                titleLocation: 'hidden'
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'comment'
    });
});
test('Check question comment', async () => {
    const json: any = {
        questions: [
            {
                commentText: 'test',
                type: 'checkbox',
                hasComment: true,
                name: 'comment',
                titleLocation: 'hidden'
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'question_with_comment'
    });
});
test('Check readonly comment', async () => {
    const json: any = {
        questions: [
            {
                type: 'comment',
                name: 'comment_readonly',
                readOnly: true,
                titleLocation: 'hidden',
                defaultValue: ''
            }
        ]
    };

    await checkFlatSnapshot(json, {
        snapshotName: 'comment_readonly'
    });
});
test('Check readonly comment with long text', async () => {
    const json: any = {
        questions: [
            {
                type: 'comment',
                name: 'comment_readonly_long_text',
                readOnly: true,
                defaultValue: 'Loooooooooooooooooooooooooooooooooooooo' +
                    'ooooooooooooooooooooooooooooooooooooooooooooooooo' +
                    'ooooooooooooooooooooooooooooooooooooooooooooooooo' +
                    'ooooooooooooooooooooooooooooooooooooooooooooooooo' +
                    'ooooooooooooooooooooooooooooooooooooooooooooooooo' +
                    'ooooooooooooooooooooooooooooooooooooooooooooooooo' +
                    'ooooooooooooooooooooooooooooooooooooooooooooooooo' +
                    'ooooooooooooooooooooooooooooooooooooooooooooooooo' +
                    'ooooooooooooooooooooooooooooooooooooooooooooooooo' +
                    'ooooooooooooooooooooooooooooooooooooooooooooooooo' +
                    'ooooooooooooooooooooooooooooooooooooooooooooooooo' +
                    'ooooooooooooooooooooooooooooooooooooooooooooooooo' +
                    'ooooooooooooooooooooooooooooooooooooooooooooooong',
                titleLocation: 'hidden'
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'comment_readonly_long_text'
    });
});
class SurveyPDFTester extends SurveyPDF {
    public get haveCommercialLicense(): boolean { return true; }
}
test('Check readonly text with readOnlyTextRenderMode set to div', async () => {
    const oldRenderMode = Survey.settings.readOnlyCommentRenderMode;
    Survey.settings.readOnlyCommentRenderMode = 'div';
    try {
        const json: any = {
            questions: [
                {
                    type: 'comment',
                    name: 'text_readonly',
                    readOnly: true,
                    titleLocation: 'hidden'
                }
            ]
        };
        const survey: SurveyPDF = new SurveyPDFTester(json, TestHelper.defaultOptions);
        const pdfAsString = await survey.raw();
        // Stream in result PDF document should be small - in this example 14
        expect(pdfAsString.indexOf('/Length 567\n') > 0).toBeTruthy();

    } finally {
        Survey.settings.readOnlyCommentRenderMode = oldRenderMode;
    }
});

test('Check readOnly comment flat is moving text brick inside', async () => {
    const json: any = {
        questions: [
            {
                type: 'comment',
                name: 'text_readonly',
                readOnly: true,
                titleLocation: 'hidden'
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const question = survey.getAllQuestions()[0];
    const comment = <TextFieldBrick>await SurveyHelper.createCommentFlat({ xLeft: 0, yTop: 0 }, question, controller, { isMultiline: true, value: question.value, rows: question.rows });
    const textBrick = comment['textBrick'];
    expect(textBrick).toBeDefined();
    const initialXLeft = textBrick.xLeft;
    const initialXRight = textBrick.xRight;
    const initialYTop = textBrick.yTop;
    const initialYBot = textBrick.yBot;
    comment.xLeft += 20;
    comment.xRight += 25;
    comment.yTop +=10;
    comment.yBot +=15;
    expect(textBrick.xLeft - initialXLeft).toBeCloseTo(20);
    expect(textBrick.xRight - initialXRight).toBeCloseTo(25);
    expect(textBrick.yTop - initialYTop).toBeCloseTo(10);
    expect(textBrick.yBot - initialYBot).toBeCloseTo(15);
});