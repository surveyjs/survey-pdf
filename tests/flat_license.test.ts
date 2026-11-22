import { SurveyPDF } from '../src/survey';
import { DocController } from '../src/doc_controller';
import { TestHelper } from '../src/helper_test';
import { FlatLicense } from '../src/flat_layout/flat_license';
import { EventHandler } from '../src/event_handler/event_handler';
import { test, expect } from 'vitest';

test('Check flat license getLicenseParts method', async () => {
    const survey: SurveyPDF = new SurveyPDF({ }, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flatLicense = new FlatLicense(survey, controller);
    let textParts = flatLicense['getLicenseParts']('some text');
    expect(textParts).toEqual([
        { text: 'some text' },
    ]);
    textParts = flatLicense['getLicenseParts']('[url text](url)');
    expect(textParts).toEqual([
        { text: 'url text', isLink: true, url: 'url' },
    ]);
    textParts = flatLicense['getLicenseParts']('some text [url text](url)');
    expect(textParts).toEqual([
        { text: 'some text ' },
        { text: 'url text', isLink: true, url: 'url' },
    ]);
    textParts = flatLicense['getLicenseParts']('some text [url text](url) another text');
    expect(textParts).toEqual([
        { text: 'some text ' },
        { text: 'url text', isLink: true, url: 'url' },
        { text: ' another text' },
    ]);
    textParts = flatLicense['getLicenseParts']('some text [url text](url) another text [url text2](url2)');
    expect(textParts).toEqual([
        { text: 'some text ' },
        { text: 'url text', isLink: true, url: 'url' },
        { text: ' another text ' },
        { text: 'url text2', isLink: true, url: 'url2' },
    ]);
    textParts = flatLicense['getLicenseParts']('some text [url text](url) another text [url text2](url2) something');
    expect(textParts).toEqual([
        { text: 'some text ' },
        { text: 'url text', isLink: true, url: 'url' },
        { text: ' another text ' },
        { text: 'url text2', isLink: true, url: 'url2' },
        { text: ' something' },
    ]);
});

test('Check flat license splitPartsToFit method', async () => {
    const survey: SurveyPDF = new SurveyPDF({ }, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    controller.fontSize = 10;
    const flatLicense = new FlatLicense(survey, controller, {
        text: { fontSize: 10,
            lineHeight: 12,
            fontStyle: 'normal',
            fontName: 'helvetica',
            fontColor: '#000000'
        } });
    let lines = flatLicense['splitPartsToFit']([
        { text: 'Big first text to split' },
        { text: ' url', isLink: true, url: 'url' },
    ], 60);
    expect(lines).toEqual([[{
        'text': 'Big first text',
    }
    ],
    [
        {
            'text': 'to split',
        },
        {
            'isLink': true,
            'text': ' url',
            'url': 'url',
        },
    ]
    ]);
    lines = flatLicense['splitPartsToFit']([
        { text: 'Text' },
        { text: 'Big second text to split', isLink: true, url: 'url' },
        { text: 'Third text' }
    ], 60);
    expect(lines).toEqual([
        [
            { 'text': 'Text' },
            { 'isLink': true, 'text': 'Big', 'url': 'url' },
        ],
        [
            { 'isLink': true, 'text': 'second text', 'url': 'url' },
        ],
        [
            { 'isLink': true, 'text': 'to split', 'url': 'url' },
            { 'text': 'Third' },
        ],
        [
            { 'text': 'text' },
        ],
    ]);
});
test('Check license banner reserves space with a gap before the content', async () => {
    const survey: SurveyPDF = new SurveyPDF({ }, TestHelper.defaultOptions);
    expect(survey.haveCommercialLicense).toBeFalsy();
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    const licenseFlats = EventHandler.process_license(survey, controller);
    expect(licenseFlats.length).toBe(1);
    expect(licenseFlats[0].yTop).toBe(EventHandler.LICENSE_BANNER_TOP);
    expect(controller.margins.top).toBeCloseTo(licenseFlats[0].yBot + EventHandler.LICENSE_BANNER_CONTENT_GAP);

    const options = TestHelper.defaultOptions;
    options.margins.top = 200;
    controller = new DocController(options);
    EventHandler.process_license(survey, controller);
    expect(controller.margins.top).toBe(200);
});

test('Check license banner does not change margins with a commercial license', async () => {
    class SurveyPDFLicensed extends SurveyPDF {
        public get haveCommercialLicense(): boolean { return true; }
    }
    const survey: SurveyPDF = new SurveyPDFLicensed({ }, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    expect(EventHandler.process_license(survey, controller)).toEqual([]);
    expect(controller.margins.top).toBe(10);
});
