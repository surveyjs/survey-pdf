(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { checkFlatSnapshot } from './snapshot_helper';
import '../src/flat_layout/flat_textbox';

test('Check two pages start point', async () => {
    let json: any = {
        pages: [
            {
                name: 'First Page',
                elements: [
                    {
                        type: 'text',
                        name: 'Enter me'
                    }
                ]
            },
            {
                name: 'Second Page',
                elements: [
                    {
                        type: 'text',
                        name: 'Not, me'
                    }
                ]
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'two_pages',
        eventName: 'onRenderSurvey'
    });
});

test('Check no invisible page', async () => {
    let json: any = {
        pages: [
            {
                name: 'VisiblePage',
                elements: [
                    {
                        type: 'text',
                        name: 'VisibleQuestion'
                    }
                ]
            },
            {
                name: 'InvisiblePage',
                elements: [
                    {
                        type: 'text',
                        name: 'InvisibleQuestion'
                    }
                ],
                visibleIf: 'false'
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'two_pages_one_invisible',
        eventName: 'onRenderSurvey'
    });
});
test('Page with title', async () => {
    let json: any = {
        pages: [
            {
                name: 'namedpage',
                elements: [
                    {
                        type: 'text',
                        name: 'HiddenText',
                        titleLocation: 'hidden'
                    }
                ],
                title: 'So Page'
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'page_with_title',
        eventName: 'onRenderPage'
    });
});
test('Page with description', async () => {
    let json: any = {
        pages: [
            {
                name: 'describedpage',
                elements: [
                    {
                        type: 'text',
                        name: 'HiddenText',
                        titleLocation: 'hidden'
                    }
                ],
                description: 'So few words'
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'page_with_description',
        eventName: 'onRenderPage'
    });
});
test('Page with title and description', async () => {
    let json: any = {
        pages: [
            {
                name: 'songedpage',
                elements: [
                    {
                        type: 'text',
                        name: 'HiddenText',
                        titleLocation: 'hidden'
                    }
                ],
                title: 'The sun rises',
                description: 'Over the Huanghe river'
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'page_with_title_description',
        eventName: 'onRenderPage'
    });
});