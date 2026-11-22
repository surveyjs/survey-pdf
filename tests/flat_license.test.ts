import { SurveyPDF } from '../src/survey';
import { DocController } from '../src/doc_controller';
import { TestHelper } from '../src/helper_test';
import { FlatLicense } from '../src/flat_layout/flat_license';
import { CompositeBrick } from '../src/pdf_render/pdf_composite';
import { TextBrick } from '../src/pdf_render/pdf_text';
import { LinkBrick } from '../src/pdf_render/pdf_link';
import { setLicenseKey } from 'survey-core';
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
test('Check license text for the embedded license marker', async () => {
    const survey: SurveyPDF = new SurveyPDF({ }, TestHelper.defaultOptions);
    expect(survey.licenseText.indexOf('developer license') > -1).toBeTruthy();
    try {
        setLicenseKey('embedded-wordpress');
        expect(survey.licenseText).toBe('Powered by SurveyJS · [White-label options](https://surveyjs.io/wordpress#white-label)');
        setLicenseKey('embedded-studio');
        expect(survey.licenseText).toBe('Powered by SurveyJS · [White-label options](https://surveyjs.io/studio#white-label)');
        setLicenseKey('embedded-unknown');
        expect(survey.licenseText.indexOf('developer license') > -1).toBeTruthy();
    } finally {
        setLicenseKey('embedded-none');
    }
    expect(survey.licenseText.indexOf('developer license') > -1).toBeTruthy();
});

test('Check flat license bricks for the embedded license marker', async () => {
    const survey: SurveyPDF = new SurveyPDF({ }, TestHelper.defaultOptions);
    Object.defineProperty(survey, 'haveCommercialLicense', { get: () => false });
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flatLicense = new FlatLicense(survey, controller, {
        text: { fontSize: 10,
            lineHeight: 12,
            fontStyle: 'normal',
            fontName: 'helvetica',
            fontColor: '#000000'
        } });
    try {
        setLicenseKey('embedded-wordpress');
        const flats = flatLicense.generateFlats({ xLeft: 0, yTop: 0 });
        expect(flats.length).toBe(1);
        const lines = (flats[0] as CompositeBrick)['bricks'] as Array<CompositeBrick>;
        expect(lines.length).toBe(1);
        const parts = lines[0]['bricks'];
        expect(parts.length).toBe(2);
        expect(parts[0]).toBeInstanceOf(TextBrick);
        expect(parts[0]).not.toBeInstanceOf(LinkBrick);
        expect((parts[0] as TextBrick)['options'].text).toBe('Powered by SurveyJS · ');
        expect((parts[1] as LinkBrick).options.text).toBe('White-label options');
        expect(parts[1]).toBeInstanceOf(LinkBrick);
        expect((parts[1] as LinkBrick).options.link).toBe('https://surveyjs.io/wordpress#white-label');
    } finally {
        setLicenseKey('embedded-none');
    }
});
