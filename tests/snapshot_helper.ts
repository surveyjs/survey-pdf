import { EventBase, PanelModel } from 'survey-core';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { DocController, IDocOptions } from '../src/doc_controller';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { SurveyPDFTester, TestHelper } from '../src/helper_test';
import { SurveyPDF } from '../src/survey';
import { readFileSync, writeFileSync } from 'fs';
import jsPDF from 'jspdf';

interface ISnapshotOptions {
    snapshotName: string;
    controllerOptions?: IDocOptions;
    onSurveyCreated?: (survey: SurveyPDF) => void;
}
interface IPDFSnapshotOptions extends ISnapshotOptions {}

function correctSurveyElementIds(survey: SurveyPDF) {
    survey.getAllQuestions().forEach((q) => {
        q.id = `testidquestion_${q.name}`;
        if (q.getType() === 'paneldynamic') {
            q.panels.forEach((p, i) => {
                p.id = `${q.id}_panel_${i}`;
                p.questions.forEach((pq)=> {
                    pq.id = `${p.id}_${q.name}`;
                });
            });
        }
        if (q.getType() === 'matrixdynamic' || q.getType() === 'matrixdropdown') {
            q.renderedTable.rows.forEach((row: any, rowIndex: number) => {
                if (row.row) {
                    row.row.idValue = `${q.id}row${rowIndex}`;
                }
                row.cells.forEach((cell: any, cellIndex: number) => {
                    if (cell.hasQuestion) {
                        cell.question.id = `${q.id}_row${rowIndex}_cell_${cellIndex}`;
                    }
                    if (cell.hasPanel) {
                        cell.panel.id = `${q.id}row${rowIndex}cell${cellIndex}detailPanel`;
                        cell.panel.questions.forEach((detailQuestion) => {
                            detailQuestion.id = `${q.id}_row${rowIndex}_cell${cellIndex}_detailPanelQuestion_${detailQuestion.name}`;
                        });
                    }
                });
            });
        }
        if (q.getType() === 'file') {
            q.pages.forEach((p, j) => {
                p.id = q.id + 'page' + j;
            });
        }
    });
    survey.getAllPanels().map((p: PanelModel) => {
        p.id = `testidpanel_${p.name}`;

    });
    survey.pages.map((p: PanelModel) => {
        p.id = `testidpage_${p.name}`;
    });
}

export async function checkPDFSnapshot(surveyJSON: any, snapshotOptions: IPDFSnapshotOptions): Promise<void> {
    const jsPdfVersion = jsPDF.version;
    jsPDF.version = 'test';
    const survey = new SurveyPDFTester(surveyJSON, snapshotOptions.controllerOptions ?? TestHelper.defaultOptions);
    snapshotOptions.onSurveyCreated && snapshotOptions.onSurveyCreated(survey);
    correctSurveyElementIds(survey);
    survey.onDocControllerCreated.add((_, options) => {
        options.controller.doc.setCreationDate(new Date(0));
        options.controller.doc.setFileId('00000000000000000000000000000000');
    });
    const actual = (await survey.raw()).replaceAll(/\r\n/g, '\n');
    const snapshotName = snapshotOptions.snapshotName;
    const fileName = `${__dirname}/pdf_snapshots/${snapshotName}.pdf`;
    const compare = () => {
        const expected = readFileSync(fileName, 'utf8').replaceAll(/\r\n/g, '\n');
        expect(actual, `snapshot: "${snapshotName}" did not match`, { showMatcherMessage: false }).toEqual(expected);
    };
    if((global as any).updateSnapshots) {
        try {
            compare();
        } catch {
            writeFileSync(fileName, actual);
        }
    } else {
        compare();
    }
    jsPDF.version = jsPdfVersion;
}

type PropertiesHash = {[index: string]: Array<string | { name: string, deep: boolean }>};
interface IFlatSnaphotOptions extends ISnapshotOptions {
    eventName?: string;
    isCorrectEvent?(options:any): boolean;
    allowedPropertiesHash?: PropertiesHash;
}

export const globalAllowedPropertiesHash: PropertiesHash = {
    'default': ['width', 'height', 'xLeft', 'xRight', 'yTop', 'yBot'],
    'PdfBrick': ['appearance', 'options'],
    'CompositeBrick': [{ name: 'bricks', deep: true }]
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

function processBricks(bricks: Array<Array<IPdfBrick>> | Array<IPdfBrick>, propertiesHash: PropertiesHash) {
    const res: Array<any> = [];
    bricks.forEach((bricks: Array<IPdfBrick> | IPdfBrick) => {
        if(Array.isArray(bricks)) {
            const result: Array<IPdfBrick> = [];
            bricks.forEach(brick => {
                result.push(processBrick(brick, propertiesHash));

            });
            res.push(result);
        } else {
            res.push(processBrick(bricks, propertiesHash));
        }
    });
    return res;
}

export async function checkFlatSnapshot(surveyJSON: any, snapshotOptions: IFlatSnaphotOptions): Promise<void> {
    const survey = new SurveyPDF(surveyJSON, snapshotOptions.controllerOptions ?? TestHelper.defaultOptions);
    snapshotOptions.onSurveyCreated && snapshotOptions.onSurveyCreated(survey);
    correctSurveyElementIds(survey);
    const controller = new DocController(snapshotOptions.controllerOptions ?? TestHelper.defaultOptions);
    const compareCallback = (bricks: Array<Array<IPdfBrick>> | Array<IPdfBrick>) => {
        const allowedPropertiesHash = Object.assign({}, globalAllowedPropertiesHash, snapshotOptions.allowedPropertiesHash ?? {}) as PropertiesHash;
        const actual = JSON.parse(JSON.stringify(processBricks(bricks, allowedPropertiesHash), null, '\t'));
        const fileName = `${__dirname}/flat_snapshots/${snapshotOptions.snapshotName}.json`;
        const compare = () => {
            const expected = JSON.parse(readFileSync(fileName, 'utf8'));
            expect(actual, `snapshot: "${snapshotOptions.snapshotName}" did not match`).toEqual(expected);
        };
        //eslint-disable-next-line
        if((global as any).updateSnapshots) {
            try {
                compare();
            } catch {
                writeFileSync(fileName, JSON.stringify(actual, null, '\t'));
            }
        } else {
            compare();
        }
    };
    if(snapshotOptions.eventName !== 'onRenderSurvey') {
        (survey[snapshotOptions.eventName || 'onRenderQuestion'] as EventBase<SurveyPDF, any>).add((_, options) => {
            if(!snapshotOptions.isCorrectEvent || snapshotOptions.isCorrectEvent(options)) {
                compareCallback(options.bricks);
            }
        });
    }
    const res = await FlatSurvey.generateFlats(survey, controller);
    if(snapshotOptions.eventName == 'onRenderSurvey') {
        compareCallback(res);

    }
}