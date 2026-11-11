(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
    return {};
};
import { describe, test, expect } from 'vitest';
import '../src/entries/pdf';
import { QuestionCheckboxModel, QuestionPanelDynamicModel } from 'survey-core';
import { SurveyPDF } from '../src/survey';
import { DocController } from '../src/doc_controller';
import { TestHelper } from '../src/helper_test';

// survey-pdf reads every answer through the question model, so these tests guard that nested data
// (a panel's or a page's valueName, the survey's dataNesting) reaches the PDF unchanged.

async function renderSurvey(json: any, data: any, prepare?: (survey: SurveyPDF) => void) {
    const survey = new SurveyPDF(json, TestHelper.defaultOptions);
    if (prepare) prepare(survey);
    // survey-core keeps nested objects by reference: compare with a copy taken before the render.
    const expected = data === null ? {} : JSON.parse(JSON.stringify(data));
    if (data !== null) survey.data = data;
    const controller = new DocController(TestHelper.defaultOptions);
    await survey['renderSurvey'](controller);
    // The render writes nothing into the data.
    expect(survey.data).toStrictEqual(expected);
    return { survey, controller };
}
function getFields(controller: DocController): Array<any> {
    return controller.doc.internal.acroformPlugin.acroFormDictionaryRoot.Fields;
}
function getFieldValues(controller: DocController): Array<any> {
    return getFields(controller).map((field: any) => field.value);
}
function getFieldValue(controller: DocController, fieldName: string): any {
    const field = getFields(controller).find((f: any) => f.fieldName === fieldName);
    expect(field, fieldName).toBeDefined();
    return field.value;
}

const addressPanel = (extra: any = {}) => ({
    type: 'panel', name: 'panel1', ...extra,
    elements: [{ type: 'text', name: 'street' }, { type: 'text', name: 'city' }]
});
const addressJson = (surveyProps: any = {}) => ({
    ...surveyProps,
    elements: [addressPanel({ valueName: 'address' })]
});

describe('Render a survey with nested data (nested data, survey-library #12233)', () => {
    test('"auto": a panel with valueName (nested data, survey-library #12233)', async () => {
        const { controller } = await renderSurvey(addressJson(), { address: { street: 'Main', city: 'Oslo' } });
        expect(getFieldValues(controller)).toStrictEqual(['Main', 'Oslo']);
    });
    test('"panel": a panel without valueName nests under its name (nested data, survey-library #12233)', async () => {
        const json = { dataNesting: 'panel', elements: [addressPanel()] };
        const { controller } = await renderSurvey(json, { panel1: { street: 'Main', city: 'Oslo' } });
        expect(getFieldValues(controller)).toStrictEqual(['Main', 'Oslo']);
    });
    test('"page": a page nests under its name (nested data, survey-library #12233)', async () => {
        const json = { dataNesting: 'page', pages: [{ name: 'page1', elements: [addressPanel()] }] };
        const { controller } = await renderSurvey(json, { page1: { street: 'Main', city: 'Oslo' } });
        expect(getFieldValues(controller)).toStrictEqual(['Main', 'Oslo']);
    });
    test('"panelAndPage": a panel nests inside its page (nested data, survey-library #12233)', async () => {
        const json = { dataNesting: 'panelAndPage', pages: [{ name: 'page1', elements: [addressPanel()] }] };
        const { controller } = await renderSurvey(json, { page1: { panel1: { street: 'Main', city: 'Oslo' } } });
        expect(getFieldValues(controller)).toStrictEqual(['Main', 'Oslo']);
    });
    test('A nesting panel inside a nesting panel (nested data, survey-library #12233)', async () => {
        const json = {
            elements: [{
                type: 'panel', name: 'panel1', valueName: 'address',
                elements: [
                    { type: 'text', name: 'street' },
                    { type: 'panel', name: 'panel2', valueName: 'geo', elements: [{ type: 'text', name: 'lat' }] }
                ]
            }]
        };
        const { controller } = await renderSurvey(json, { address: { street: 'Main', geo: { lat: '1' } } });
        expect(getFieldValues(controller)).toStrictEqual(['Main', '1']);
    });
    test('"none": flat data fills the fields (nested data, survey-library #12233)', async () => {
        const { controller } = await renderSurvey(addressJson({ dataNesting: 'none' }), { street: 'Main', city: 'Oslo' });
        expect(getFieldValues(controller)).toStrictEqual(['Main', 'Oslo']);
    });
    test('"none": the container key is ignored, nested data leaves the fields empty (nested data, survey-library #12233)', async () => {
        const { controller } = await renderSurvey(addressJson({ dataNesting: 'none' }), { address: { street: 'Main' } });
        expect(getFieldValues(controller)).toStrictEqual(['', '']);
    });
    test('Other question types read their values from the object (nested data, survey-library #12233)', async () => {
        const json = {
            elements: [{
                type: 'panel', name: 'panel1', valueName: 'address',
                elements: [
                    { type: 'checkbox', name: 'kind', showOtherItem: true, choices: ['a', 'b'] },
                    { type: 'radiogroup', name: 'rg', choices: ['a', 'b'] },
                    { type: 'dropdown', name: 'dd', choices: ['a', 'b'] },
                    { type: 'boolean', name: 'bool' },
                    { type: 'multipletext', name: 'mt', items: [{ name: 'i1' }, { name: 'i2' }] },
                    { type: 'text', name: 'dotted', valueName: 'a.b' }
                ]
            }]
        };
        const data = {
            address: {
                kind: ['other'], 'kind-Comment': 'my other',
                rg: 'b', dd: 'b', bool: true,
                mt: { i1: 'x1', i2: 'x2' },
                'a.b': 'dot'
            }
        };
        const { survey, controller } = await renderSurvey(json, data);
        const q = (name: string) => survey.getQuestionByName(name);
        const kind = q('kind') as QuestionCheckboxModel;
        // Checkbox fields: one per item, "other" is the third.
        expect(getFieldValue(controller, kind.id + 'index0')).toBe('false');
        expect(getFieldValue(controller, kind.id + 'index1')).toBe('false');
        expect(getFieldValue(controller, kind.id + 'index2')).toBe('On');
        expect(getFieldValue(controller, kind.getCommentTextAreaModel(kind.otherItem).id)).toBe('my other');
        // Radio groups hold the field name of the checked option; "b" is the second choice.
        expect(getFieldValue(controller, q('rg').id)).toBe(q('rg').id + 'index1');
        expect(getFieldValue(controller, q('dd').id)).toBe('b');
        // A boolean renders the false item first, then the true item.
        expect(getFieldValue(controller, q('bool').id)).toBe(q('bool').id + 'index1');
        const mt = q('mt') as any;
        expect(getFieldValue(controller, mt.items[0].editor.id)).toBe('x1');
        expect(getFieldValue(controller, mt.items[1].editor.id)).toBe('x2');
        // N4: a dotted valueName is a literal key inside the object.
        expect(getFieldValue(controller, q('dotted').id)).toBe('dot');
    });
    test('A nesting panel inside a dynamic panel record (nested data, survey-library #12233)', async () => {
        const json = {
            elements: [{
                type: 'paneldynamic', name: 'items',
                templateElements: [
                    { type: 'text', name: 'title' },
                    { type: 'panel', name: 'panel1', valueName: 'address', elements: [{ type: 'text', name: 'street' }] }
                ]
            }]
        };
        const data = { items: [{ title: 'A', address: { street: 'S1' } }, { title: 'B', address: { street: 'S2' } }] };
        const { controller } = await renderSurvey(json, data);
        expect(getFieldValues(controller)).toStrictEqual(['A', 'S1', 'B', 'S2']);
    });
    test('A nesting panel inside a matrix detail panel (nested data, survey-library #12233)', async () => {
        const json = {
            elements: [{
                type: 'matrixdynamic', name: 'm', detailPanelMode: 'underRow', rowCount: 0,
                columns: [{ name: 'col1', cellType: 'text' }],
                detailElements: [
                    { type: 'panel', name: 'panel1', valueName: 'address', elements: [{ type: 'text', name: 'street' }] }
                ]
            }]
        };
        const { controller } = await renderSurvey(json, { m: [{ col1: 'x', address: { street: 'D1' } }] });
        expect(getFieldValues(controller)).toStrictEqual(['x', 'D1']);
    });
    test('The record panel itself never nests (nested data, survey-library #12233)', async () => {
        const json = { elements: [{ type: 'paneldynamic', name: 'items', templateElements: [{ type: 'text', name: 'title' }] }] };
        // The template is not a JSON panel, so its valueName is set in code (RN6: it is ignored).
        const { controller } = await renderSurvey(json, { items: [{ title: 'A' }] }, (survey) => {
            (survey.getQuestionByName('items') as QuestionPanelDynamicModel).template.valueName = 'rec';
        });
        expect(getFieldValues(controller)).toStrictEqual(['A']);
    });
    test('Read-only: "auto" prints the inner values as text (nested data, survey-library #12233)', async () => {
        const { controller } = await renderSurvey(addressJson({ mode: 'display' }), { address: { street: 'Main', city: 'Oslo' } });
        expect(controller.doc.internal.acroformPlugin).toBeUndefined();
        const output: string = controller.doc.output();
        expect(output).toContain('(Main)');
        expect(output).toContain('(Oslo)');
    });
    test('Read-only: "none" prints the flat values as text (nested data, survey-library #12233)', async () => {
        const { controller } = await renderSurvey(addressJson({ mode: 'display', dataNesting: 'none' }), { street: 'Main', city: 'Oslo' });
        expect(controller.doc.internal.acroformPlugin).toBeUndefined();
        const output: string = controller.doc.output();
        expect(output).toContain('(Main)');
        expect(output).toContain('(Oslo)');
    });
    const expressionJson = {
        elements: [
            {
                type: 'panel', name: 'panel1', valueName: 'address',
                elements: [
                    { type: 'text', name: 'street' },
                    { type: 'text', name: 'inner', visibleIf: '{address.street} notempty' }
                ]
            },
            { type: 'text', name: 'outside', title: '{address.street} / {street}' }
        ]
    };
    test('A title reads an inner value by path and by name (nested data, survey-library #12233)', async () => {
        const { controller } = await renderSurvey(expressionJson, { address: { street: 'Main' } });
        expect(controller.doc.output()).toContain('(Main / Main)');
    });
    test('visibleIf with a path to an inner value (nested data, survey-library #12233)', async () => {
        const withData = await renderSurvey(expressionJson, { address: { street: 'Main' } });
        const innerId = withData.survey.getQuestionByName('inner').id;
        expect(getFields(withData.controller).map((f: any) => f.fieldName)).toContain(innerId);

        const withoutData = await renderSurvey(expressionJson, null);
        const hiddenId = withoutData.survey.getQuestionByName('inner').id;
        expect(getFields(withoutData.controller).map((f: any) => f.fieldName)).not.toContain(hiddenId);
        expect(getFields(withoutData.controller)).toHaveLength(2);
    });
});
