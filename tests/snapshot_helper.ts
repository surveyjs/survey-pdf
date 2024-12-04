import { EventBase } from 'survey-core';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { DocController, IDocOptions } from '../src/doc_controller';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { SurveyPDFTester, TestHelper } from '../src/helper_test';
import { SurveyPDF } from '../src/survey';
import { readFileSync, writeFileSync } from 'fs';
import jsPDF from 'jspdf';
interface IPDFSnapshotOptions {
    snapshotName: string;
    controllerOptions?: IDocOptions;
    onSurveyCreated?: (survey: SurveyPDF) => void;
}

export async function checkPDFSnapshot(surveyJSON: any, snapshotOptions: IPDFSnapshotOptions): Promise<void> {
    const jsPdfVersion = jsPDF.version;
    jsPDF.version = 'test';
    const survey = new SurveyPDFTester(surveyJSON, snapshotOptions.controllerOptions ?? TestHelper.defaultOptions);
    snapshotOptions.onSurveyCreated && snapshotOptions.onSurveyCreated(survey);
    survey.onDocControllerCreated.add((_, options) => {
        options.controller.doc.setCreationDate(new Date(0));
        options.controller.doc.setFileId('00000000000000000000000000000000');
    });
    const actual = Buffer.from(await survey.raw('arraybuffer') as any as ArrayBuffer);
    const snapshotName = snapshotOptions.snapshotName;
    const fileName = `${__dirname}/pdf_snapshots/${snapshotName}.pdf`;
    if((global as any).updateSnapshots) {
        writeFileSync(fileName, actual);
    } else {
        const expected = readFileSync(fileName);
        expect(actual, `snapshot: "${snapshotName}" did not match`, { showMatcherMessage: false }).toEqual(expected);
    }
    jsPDF.version = jsPdfVersion;
}

interface IFlatSnaphotOptions {
    snapshotName: string;
    eventName?: string;
    isCorrectEvent?(options:any): boolean;
    controllerOptions?: IDocOptions;
    allowedPropertiesHash?: Array<string | { name: string, deep: boolean }>;
}

type PropertiesHash = {[index: string]: Array<string | { name: string, deep: boolean }>};

export const globalAllowedPropertiesHash: PropertiesHash = {
    'default': ['width', 'height', 'xLeft', 'xRight', 'yTop', 'yBot'],
    'CompositeBrick': [{ name: 'bricks', deep: true }],
    'TextBrick': ['text']
};

function processBrick(brick: IPdfBrick, propertiesHash: PropertiesHash): any {
    let allowedProperties = propertiesHash['default'];
    let currentProto = (brick as any)['__proto__'];
    while(currentProto !== Object.prototype) {
        allowedProperties = allowedProperties.concat(propertiesHash[currentProto.constructor.name] ?? []);
        currentProto = currentProto['__proto__'];
    }
    const res: any = {};
    res['brickType'] = (brick.constructor as any).name;
    for (const allowedProperty of allowedProperties) {
        if(allowedProperty) {
            if(typeof allowedProperty === 'string') {
                if((brick as any)[allowedProperty] !== undefined) {
                    res[allowedProperty] = (brick as any)[allowedProperty];
                }
            } else {
                if((brick as any)[allowedProperty.name] !== undefined) {
                    if(allowedProperty.deep) {
                        res[allowedProperty.name] = Array.isArray((brick as any)[allowedProperty.name]) ? processBricks((brick as any)[allowedProperty.name], propertiesHash) : processBrick((brick as any)[allowedProperty.name] as any, propertiesHash);
                    } else {
                        res[allowedProperty.name] = (brick as any)[allowedProperty.name];
                    }
                }
            }
        }
    }
    return res;
}

function processBricks(bricks: Array<IPdfBrick>, propertiesHash: PropertiesHash) {
    const res: Array<any> = [];
    bricks.forEach((brick) => {
        res.push(processBrick(brick, propertiesHash));
    });
    return res;
}

export async function checkFlatSnapshot(surveyJSON: any, snapshotOptions: IFlatSnaphotOptions): Promise<void> {
    const survey = new SurveyPDF(surveyJSON);
    const controller = new DocController(snapshotOptions.controllerOptions ?? TestHelper.defaultOptions);
    (survey[snapshotOptions.eventName || 'onRenderQuestion'] as EventBase<SurveyPDF, any>).add((_, options) => {
        if(!snapshotOptions.isCorrectEvent || snapshotOptions.isCorrectEvent(options)) {
            const allowedPropertiesHash = Object.assign({}, globalAllowedPropertiesHash, options.allowedPropertiesHash ?? {}) as PropertiesHash;
            const actual = processBricks(options.bricks, allowedPropertiesHash);
            const fileName = `${__dirname}/flat_snapshots/${snapshotOptions.snapshotName}.json`;
            //eslint-disable-next-line
            if((global as any).updateSnapshots) {
                writeFileSync(fileName, JSON.stringify(actual, null, '\t'));
            } else {
                const expected = JSON.parse(readFileSync(fileName, 'utf8'));
                expect(actual, `snapshot: "${snapshotOptions.snapshotName}" did not match`).toEqual(expected);
            }
        }
    });
    await FlatSurvey.generateFlats(survey, controller);
}