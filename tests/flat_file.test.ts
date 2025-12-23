(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { QuestionFileModel } from 'survey-core';
import { SurveyPDF } from '../src/survey';
import { ISize, DocController } from '../src/doc_controller';
import { FlatFile } from '../src/flat_layout/flat_file';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { TestHelper } from '../src/helper_test';
import { CompositeBrick } from '../src/pdf_render/pdf_composite';
import { LinkBrick } from '../src/pdf_render/pdf_link';
import { AdornersOptions } from '../src/event_handler/adorners';
import { checkFlatSnapshot } from './snapshot_helper';
import '../src/entries/pdf-base';
import { getImageUtils, registerImageUtils } from '../src/utils/image';

test('Check no files', async () => {
    const json: any = {
        elements: [
            {
                type: 'file',
                name: 'faque',
                titleLocation: 'hidden'
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'file_no_files'
    });
});
test('Check noFileChosen locale', async () => {
    let json: any = {
        elements: [
            {
                type: 'file',
                name: 'faque',
                titleLocation: 'hidden'
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'file_no_file_chosen_locale',
        onSurveyCreated: (survey) => {
            survey.getAllQuestions()[0].noFileChosenCaption = 'test';
        }
    });
});
test('Check one text file', async () => {
    let json: any = {
        elements: [
            {
                type: 'file',
                name: 'faqueonetxt',
                titleLocation: 'hidden',
                defaultValue: [
                    {
                        name: 'text.txt',
                        type: 'text/plain',
                        content: 'data:text/plain;base64,aGVsbG8='
                    }
                ]
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'file_one_text_file',
    });
});
test('Check two text files', async () => {
    let json: any = {
        elements: [
            {
                type: 'file',
                name: 'faquetwotxt',
                titleLocation: 'hidden',
                allowMultiple: true,
                defaultValue: [
                    {
                        name: 'text.txt',
                        type: 'text/plain',
                        content: 'data:text/plain;base64,aGVsbG8='
                    },
                    {
                        name: 'letter.txt',
                        type: 'text/plain',
                        content: 'data:text/plain;base64,dG8gaG9tZQ=='
                    }
                ]
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'file_two_text_files',
    });
});
test('Check one image 16x16px file', async () => {
    const imageSize: ISize = { width: 170, height: 50 };
    const oldImageUtils = getImageUtils();
    registerImageUtils({ getImageInfo: async (url) => { return { data: url, ...imageSize }; },
        applyImageFit: async (imageInfo) => { return imageInfo; }, clear: () => {} });
    const json: any = {
        elements: [
            {
                type: 'file',
                name: 'faqueoneimg',
                titleLocation: 'hidden',
                allowImagesPreview: true,
                defaultValue: [
                    {
                        name: 'cat.png',
                        type: 'image/png',
                        content: TestHelper.BASE64_IMAGE_16PX
                    }
                ]
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'file_one_image_16x16',
    });
    registerImageUtils(oldImageUtils);
});
test('Check one image 16x16px file shorter than text', async () => {
    const imageSize: ISize = { width: 50, height: 50 };
    const oldImageUtils = getImageUtils();
    registerImageUtils({ getImageInfo: async (url) => { return { data: url, ...imageSize }; },
        applyImageFit: async (imageInfo) => { return imageInfo; }, clear: () => {} });
    const json: any = {
        elements: [
            {
                type: 'file',
                name: 'faqueoneimgshrt',
                titleLocation: 'hidden',
                allowImagesPreview: true,
                defaultValue: [
                    {
                        name: 'cat.png',
                        type: 'image/png',
                        content: TestHelper.BASE64_IMAGE_16PX
                    }
                ]
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'file_one_image_16x16_big_text',
    });
    registerImageUtils(oldImageUtils);
});
test('Check one image 16x16px with set size', async () => {
    const imageSize: ISize = { width: 50, height: 50 };
    const oldImageUtils = getImageUtils();
    registerImageUtils({ getImageInfo: async (url) => { return { data: url, ...imageSize }; },
        applyImageFit: async (imageInfo) => { return imageInfo; }, clear: () => {} });
    const json: any = {
        elements: [
            {
                type: 'file',
                name: 'faqueoneimgwithsz',
                titleLocation: 'hidden',
                allowImagesPreview: true,
                defaultValue: [
                    {
                        name: 'cat.png',
                        type: 'image/png',
                        content: TestHelper.BASE64_IMAGE_16PX
                    }
                ],
                imageWidth: '160pt',
                imageHeight: '110pt',
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'file_one_image_16x16_set_size',
    });
    registerImageUtils(oldImageUtils);
});

test('Check one image 16x16px file server-side', async () => {
    const json: any = {
        elements: [
            {
                type: 'file',
                name: 'faqueoneimg',
                titleLocation: 'hidden',
                allowImagesPreview: true,
                defaultValue: [
                    {
                        name: 'cat.png',
                        type: 'image/png',
                        content: TestHelper.BASE64_IMAGE_16PX
                    }
                ]
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'file_one_image_16x16_server_side',
    });
});

test('Check one image 16x16px with set size server-side', async () => {
    const json: any = {
        elements: [
            {
                type: 'file',
                name: 'faqueoneimgwithsz',
                titleLocation: 'hidden',
                allowImagesPreview: true,
                defaultValue: [
                    {
                        name: 'cat.png',
                        type: 'image/png',
                        content: TestHelper.BASE64_IMAGE_16PX
                    }
                ],
                imageWidth: '160pt',
                imageHeight: '110pt',
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'file_one_image_16x16_set_size_server_side',
    });
});

test('Test file question getImagePreviewContentWidth ', async () => {
    const json: any = {
        elements: [
            {
                type: 'file',
                name: 'faqueoneimgwithsz',
                titleLocation: 'hidden',
                allowImagesPreview: true,
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const question = <QuestionFileModel>survey.getAllQuestions()[0];
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flatFile = new FlatFile(survey, question, controller, { itemMinWidth: 200 });

    let width = await flatFile['getImagePreviewContentWidth']({ content: '', type: 'image', name: 'file', imageSize: { width: 150, height: 50 } });
    expect(width).toBe(flatFile['styles'].itemMinWidth);

    width = await flatFile['getImagePreviewContentWidth']({ content: '', type: 'image', name: 'file', imageSize: { width: 300, height: 50 } });
    expect(width).toBe(300);
});

test('Test file question doesnt throw exception if could not load image preview', async () => {
    const oldImageUtils = getImageUtils();
    registerImageUtils({ getImageInfo: async (url) => { return { data: url, width: 0, height: 0 }; },
        applyImageFit: async (imageInfo) => { return imageInfo; }, clear: () => {} });
    const json: any = {
        elements: [
            {
                type: 'file',
                name: 'faqueoneimgwithsz',
                titleLocation: 'hidden',
                allowImagesPreview: true,
                defaultValue: [
                    {
                        name: 'cat.png',
                        type: 'image/png',
                        content: 'some url'
                    }
                ],
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'file_one_image_not_loaded',
    });
    registerImageUtils(oldImageUtils);
});

test('Test file question getImagePreviewContentWidth always return correct image width', async () => {
    const json: any = {
        elements: [
            {
                type: 'file',
                name: 'faqueoneimgwithsz',
                titleLocation: 'hidden',
                allowImagesPreview: true,
                imageWidth: '250px',
                defaultValue: [
                    {
                        name: 'cat.png',
                        type: 'image/png',
                        content: TestHelper.BASE64_IMAGE_16PX
                    },
                    {
                        name: 'cat.png',
                        type: 'image/png',
                        content: TestHelper.BASE64_IMAGE_16PX
                    },
                    {
                        name: 'cat.png',
                        type: 'image/png',
                        content: TestHelper.BASE64_IMAGE_16PX
                    },
                    {
                        name: 'cat.png',
                        type: 'image/png',
                        content: TestHelper.BASE64_IMAGE_16PX
                    },
                    {
                        name: 'cat.png',
                        type: 'image/png',
                        content: TestHelper.BASE64_IMAGE_16PX
                    },
                    {
                        name: 'cat.png',
                        type: 'image/png',
                        content: TestHelper.BASE64_IMAGE_16PX
                    }, {
                        name: 'cat.png',
                        type: 'image/png',
                        content: TestHelper.BASE64_IMAGE_16PX
                    }
                ],
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const question = <QuestionFileModel>survey.getAllQuestions()[0];
    const controller: DocController = new DocController(Object.assign(TestHelper.defaultOptions, { fontSize: 30 }));
    const flatFile = new FlatFile(survey, question, controller, { itemMinWidth: 20, spacing: { gapBetweenRows: 6, gapBetweenColumns: 6 } });
    const questionBricks = await flatFile.generateFlatsContent({ xLeft: controller.margins.left || 10, yTop: controller.margins.top || 10 });
    expect(questionBricks.length).toBe(3);
    //check all item bricks have the same width
    questionBricks.forEach((rowBrick: IPdfBrick) => {
        (<CompositeBrick>rowBrick)['bricks'].forEach((itemBrick: IPdfBrick) =>{
            if(itemBrick instanceof CompositeBrick) {
                expect(itemBrick.width).toBeCloseTo(187.5);
            }
        });
    });
});

test('Test file question inside paneldynamic waits preview loading', async () => {
    const json: any = {
        showQuestionNumbers: 'on',
        'logoPosition': 'right',
        'pages': [
            {
                'name': 'page1',
                'elements': [
                    {
                        'type': 'text',
                        'name': 'question1'
                    }
                ]
            },
            {
                'name': 'page2',
                'elements': [
                    {
                        'type': 'paneldynamic',
                        'name': 'pd',
                        'templateElements': [
                            {
                                'type': 'file',
                                'storeDataAsText': false,
                                'name': 'file'
                            }
                        ]
                    }
                ]
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    survey.onDownloadFile.add((_, options) => {
        setTimeout(() => {
            options.callback('success', 'data:image/jpeg;base64,FILECONTENT1');
        });
    });
    let fileBricks: IPdfBrick[];
    survey.onRenderQuestion.add((_, options) => {
        fileBricks = options.bricks;
    });
    survey.data = { 'pd': [{ 'file': {
        'name': 'name.jpeg',
        'type': 'image/jpeg',
        'content': 'url'
    } }] };
    await survey.raw();
    const unFoldedBricks = fileBricks[0].unfold();
    expect(unFoldedBricks.length).toBe(8);
    expect(unFoldedBricks[5]).toBeInstanceOf(LinkBrick);
    expect((<LinkBrick>unFoldedBricks[5])['options']['link']).toBe('data:image/jpeg;base64,FILECONTENT1');
});
test('Test file question with show preview false', async () => {
    await checkFlatSnapshot(
        {
            'elements': [
                {
                    'type': 'file',
                    'titleLocation': 'hidden',
                    'name': 'files',
                    'allowMultiple': true,
                    'showPreview': false,
                }
            ]
        }, {
            snapshotName: 'file-question-without-preview',
            isCorrectEvent: (options: AdornersOptions) => {
                return options.question.getType() == 'file';
            },
            allowedPropertiesHash: {
                'LinkBrick': ['options']
            },
            onSurveyCreated: (survey: SurveyPDF) => {
                survey.data = {
                    files: [
                        {
                            content: 'test_url',
                            name: 'test_name',
                            type: ''
                        },
                        {
                            content: 'test_url2',
                            name: 'test_name2',
                            type: ''
                        }
                    ]
                };
            }
        },
    );
});
