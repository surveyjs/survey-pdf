(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { checkFlatSnapshot } from './snapshot_helper';
import '../src/flat_layout/flat_textbox';
import '../src/flat_layout/flat_checkbox';

test('Calc textbox boundaries title top', async () => {
    const json: any = {
        questions: [
            {
                type: 'text',
                name: 'textbox',
                title: 'Title top'
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'question_title_top'
    });
});
test('Calc textbox boundaries title bottom', async () => {
    const json: any = {
        questions: [
            {
                type: 'text',
                name: 'textbox',
                title: 'Title bottom',
                titleLocation: 'bottom'
            }
        ]
    };

    await checkFlatSnapshot(json, {
        snapshotName: 'question_title_bottom'
    });
});
test('Calc textbox boundaries title left', async () => {
    const json: any = {
        showQuestionNumbers: 'false',
        questions: [
            {
                type: 'text',
                name: 'textbox left bound',
                title: 'Title',
                titleLocation: 'left'
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'question_title_left'
    });
});
test('Calc textbox boundaries title hidden', async () => {
    const json: any = {
        questions: [
            {
                type: 'text',
                name: 'textbox',
                title: 'Title hidden',
                titleLocation: 'hidden'
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'question_title_hidden'
    });
});
test('Calc boundaries with space between questions', async () => {
    const json: any = {
        questions: [{
            type: 'text',
            name: 'textbox1',
            title: 'What have we here?'
        },
        {
            type: 'text',
            name: 'textbox2',
            title: 'Space between questions!'
        }]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'two_questions',
        eventName: 'onRenderSurvey'
    });
});
test('Calc textbox boundaries title without number', async () => {
    const json: any = {
        questions: [{
            type: 'text',
            name: 'textbox',
            title: 'I do not need a number'
        }]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'question_without_number',
        onSurveyCreated: (survey) => {
            survey.showQuestionNumbers = 'off';
        }
    });
});
test('Calc textbox boundaries required', async () => {
    const json: any = {
        questions: [{
            type: 'text',
            name: 'textbox',
            title: 'Please enter your name:',
            isRequired: true
        }]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'question_required',
    });
});
test('Calc boundaries title top longer than description', async () => {
    const json: any = {
        questions: [
            {
                type: 'text',
                name: 'box',
                title: 'My title is so interesting',
                description: 'But the description is not enough'
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'question_big_title_top_short_description',
    });
});
test('Calc boundaries title top shorter than description', async () => {
    const json: any = {
        questions: [
            {
                type: 'text',
                name: 'box',
                title: 'Tiny title',
                description: 'The description is so long, very long, very'
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'question_short_title_top_big_description',
    });
});
test('Calc boundaries title bottom longer than description', async () => {
    const json: any = {
        questions: [
            {
                type: 'text',
                name: 'box',
                title: 'What a gorgeous title',
                titleLocation: 'bottom',
                description: 'Who reads the descriptions?'
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'question_big_title_bottom_short_description',
    });
});
test('Calc boundaries title bottom shorter than description', async () => {
    const json: any = {
        questions: [
            {
                type: 'text',
                name: 'box',
                title: 'Piece of title',
                titleLocation: 'bottom',
                description: 'Very important information: required to read'
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'question_short_title_bottom_big_description',
    });
});
test('Calc boundaries title left longer than description', async () => {
    const json: any = {
        showQuestionNumbers: 'false',
        questions: [
            {
                type: 'text',
                name: 'box',
                title: 'Pain',
                titleLocation: 'left',
                description: 'pan'
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'question_big_title_left_short_description',
    });
});
test('Calc boundaries title left shorter than description', async () => {
    const json: any = {
        showQuestionNumbers: 'false',
        questions: [
            {
                type: 'text',
                name: 'box',
                title: 'A',
                titleLocation: 'left',
                description: 'Major Pain'
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'question_short_title_left_big_description',
    });
});
test('Calc boundaries title hidden with description', async () => {
    const json: any = {
        questions: [
            {
                type: 'text',
                name: 'textbox',
                title: 'Ninja',
                titleLocation: 'hidden',
                description: 'Under cover of night'
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'question_no_title_description',
    });
});
test('Calc boundaries with indent', async () => {
    for (let i: number = 0; i < 9; i++) {
        const json: any = {
            questions: [
                {
                    type: 'checkbox',
                    name: 'checkbox_cycle_indent',
                    title: 'I stand straight',
                    indent: i,
                    choices: [
                        'Right choice'
                    ]
                }
            ]
        };
        await checkFlatSnapshot(json, {
            snapshotName: `question_indent_${i}`
        });
    }
});
test('Not visible question and visible question', async () => {
    const json: any = {
        showQuestionNumbers: 'on',
        questions: [
            {
                type: 'checkbox',
                name: 'invisible',
                visible: false
            },
            {
                type: 'checkbox',
                name: 'visible',
                visible: true
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'two_questions_first_invisible',
        eventName: 'onRenderSurvey'
    });
});
test('VisibleIf row', async () => {
    const json: any = {
        questions: [
            {
                type: 'text',
                name: 'Look at visible me'
            },
            {
                type: 'text',
                name: 'Please! Don\'t look!',
                visibleIf: 'false'
            },
            {
                type: 'text',
                name: 'I\'m here'
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'three_questions_second_invisible_by_visibleIf',
        eventName: 'onRenderSurvey'
    });
});
test('Check title with number next raw position', async () => {
    const json: any = {
        showQuestionNumbers: 'on',
        questions: [
            {
                type: 'checkbox',
                name: 'Eeeeeeeeeemmmmmmmmmmmptttttyyyy chhhheeeckbox',
                isRequired: false
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'question_title_with_number',
    });
});
test('Check equality of margins.left and contentPoint.xLeft with titleLocation: left', async () => {
    const json: any = {
        showQuestionNumbers: 'on',
        questions: [
            {
                type: 'checkbox',
                choices: [
                    '', ''
                ],
                titleLocation: 'left',
                colCount: 0,
                title: 'Sex'
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'question_title_location_left',
    });
});
test('Check questions width with startWithNewLine: false property', async () => {
    const json: any = {
        questions: [
            {
                type: 'text',
                name: 'startWithNewLineFlase1',
                titleLocation: 'hidden',
                startWithNewLine: 'false'
            },
            {
                type: 'text',
                name: 'startWithNewLineFlase2',
                titleLocation: 'hidden',
                startWithNewLine: 'false',
                width: '15%'
            },
            {
                type: 'text',
                name: 'startWithNewLineFlase3',
                titleLocation: 'hidden',
                startWithNewLine: 'false'
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'three_questions_in_one_line',
        eventName: 'onRenderSurvey'
    });
});
test('Check question\'s content indent with CONTENT_INDENT_SCALE', async () => {
    const json: any = {
        questions: [
            {
                type: 'text',
                name: 'q1',
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'question_content_indent_scale_0',
        onSurveyCreated(survey) {
            survey.applyStyle({
                question: {
                    spacing: {
                        contentIndentStart: 0
                    }
                }
            });
        },
    });
});

test('Check description under input', async () => {
    const json = {
        showQuestionNumbers: 'on',
        elements: [
            {
                type: 'text',
                name: 'q1',
                titleLocation: 'top',
                description: 'description',
                descriptionLocation: 'underInput'
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'question_title_top_description_under_input'
    });
    await checkFlatSnapshot(json, {
        onSurveyCreated: (survey) => {
            survey.getAllQuestions()[0].titleLocation = 'left';
        },
        snapshotName: 'question_title_left_description_under_input'
    });
    await checkFlatSnapshot(json, {
        onSurveyCreated: (survey) => {
            survey.getAllQuestions()[0].titleLocation = 'hidden';
        },
        snapshotName: 'question_title_hidden_description_under_input'
    });
    await checkFlatSnapshot(json, {
        onSurveyCreated: (survey) => {
            survey.getAllQuestions()[0].titleLocation = 'bottom';
        },
        snapshotName: 'question_title_bottom_description_under_input'
    });
});