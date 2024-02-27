(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
    return {};
};

import { SurveyPDF } from '../src/survey';
import { DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatFile } from '../src/flat_layout/flat_file';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
const __dummy_fl = new FlatFile(null, null, null);

test('Check file readonly with link', async () => {
    const json: any = {
        questions: [
            {
                type: 'file',
                name: 'file_readonly_withlink',
                titleLocation: 'hidden',
                readOnly: true,
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
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    await survey['renderSurvey'](controller);
    expect(controller.doc.internal.pages[1].join('').split('text.txt')).toHaveLength(3);
});
test('Check file readonly without link', async () => {
    const json: any = {
        questions: [
            {
                type: 'file',
                name: 'file_readonly_withlink',
                titleLocation: 'hidden',
                readOnly: true,
                readonlyRenderAs: 'text',
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
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    await survey['renderSurvey'](controller);
    expect(controller.doc.internal.pages[1].join('').split('text.txt')).toHaveLength(2);
});
test('Check hyperlink underline color', async () => {
    const json: any = {
        questions: [
            {
                type: 'file',
                name: 'file_link_underline_color',
                titleLocation: 'hidden',
                defaultValue: [
                    {
                        name: 'data.txt',
                        type: 'text/plain',
                        content: 'data:text/plain;base64,Lg=='
                    }
                ]
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    await survey['renderSurvey'](controller);
    const internal: any = controller.doc.internal;
    const colorInfo: string[] = internal.pages[1][4].split(/(\.| )/);
    expect(colorInfo[0]).toBe('0');
    expect(colorInfo[4]).toBe('0');
    expect(colorInfo[8]).toBe('0');
    expect(colorInfo[10]).toBe('93');
});
test('Check hyperlink underline position', async () => {
    const json: any = {
        questions: [
            {
                type: 'file',
                name: 'file_link_underline_position',
                titleLocation: 'hidden',
                defaultValue: [
                    {
                        name: 'data.txt',
                        type: 'text/plain',
                        content: 'data:text/plain;base64,Lg=='
                    }
                ]
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    await survey['renderSurvey'](controller);
    const internal: any = controller.doc.internal;
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    const moveInfo: string[] = internal.pages[1][5].split(' ');
    const assumeLeft: number = flats[0][0].xLeft;
    const actualLeft: number = +moveInfo[0];
    expect(actualLeft).toBe(assumeLeft);
    const lineInfo: string[] = internal.pages[1][6].split(' ');
    const assumeRight: number = flats[0][0].xRight;
    const actualRight: number = +lineInfo[0];
    expect(actualRight).toBe(assumeRight);
    const bottomMove: number = +moveInfo[1];
    const bottomLine: number = +lineInfo[1];
    expect(bottomLine).toBe(bottomMove);
});
class SurveyPDFTester extends SurveyPDF {
    public get haveCommercialLicense(): boolean { return true; }
}
test('Check that border does not exist when FORM_BORDER_VISIBLE is false', async () => {
    const json: any = {
        questions: [
            {
                type: 'text',
                readOnly: true,
                titleLocation: 'hidden',
                defaultValue: 'I\'m without border'
            }
        ]
    };
    (<any>SurveyHelper).FORM_BORDER_VISIBLE = false;
    const survey: SurveyPDF = new SurveyPDFTester(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    await survey['renderSurvey'](controller);
    const internal: any = controller.doc.internal;
    expect(internal.pages[1].length).toBe(3);
    const textDescription: string = internal.pages[1][2];
    const textPosition: number = textDescription.indexOf('I\'m without border', 0);
    expect(textPosition).toBeGreaterThan(-1);
    const actualEnd: string = textDescription.substring(textDescription.length - 2);
    expect(actualEnd).toBe('ET');
});