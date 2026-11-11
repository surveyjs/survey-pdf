import FormsMap from '../src/pdf_forms/map';
import { PDFFormFiller } from '../src/pdf_forms/forms';
import { test, expect, vitest, describe } from 'vitest';
import { SurveyModel } from 'survey-core';

const testMap = {
    'question1': ['f1', 'f1_plus'],
    'question2': 'f2',
    'question3': 'f3',
    'question4': {
        'item1': {
            field: 'f4',
            value: 'f4_1'
        },
        'item2': {
            field: 'f4',
            value: 'f4_2'
        },
    },
    'question5': {
        'v1': {
            field: 'f5_1',
            value: true
        },
        'v2': {
            field: 'f5_2',
            value: true
        },
        'v3': {
            field: 'f5_3',
            value: true
        },
    },
    'question6': {
        'row1': {
            'column1': 'f6_1_1',
            'column2': {
                '1': {
                    field: 'f6_1_2A',
                    value: true
                },
                '2': {
                    field: '6_1_2B',
                    value: true
                },
            }
        },
        'row2': {
            'column1': 'f6_2_1',
            'column2': {
                '1': {
                    field: 'f6_2_2A',
                    value: true
                },
                '2': {
                    field: '6_2_B',
                    value: true
                },
            }
        }
    },
    'question7': [
        {
            'question8': 'f7_1_1',
            'question9': {
                'a': {
                    field: 'f7_1_2',
                    value: 'A'
                },
                'b': {
                    field: 'f7_1_2',
                    value: 'B'
                },
            }
        },
        {
            'question8': 'f7_2_1',
            'question9': {
                'a': {
                    field: 'f7_2_2',
                    value: 'A'
                },
                'b': {
                    field: 'f7_2_2',
                    value: 'B'
                },
            }
        }
    ]
};

test('FormsMap should map simple string values correctly', () => {
    const formsMap = new FormsMap(testMap);
    const data = {
        'question1': 'text1',
        'question2': 'text2',
        'question3': 'Option 2'
    };

    const result = formsMap.mapData(data);

    expect(result).toEqual({
        'f1': 'text1',
        'f1_plus': 'text1',
        'f2': 'text2',
        'f3': 'Option 2'
    });
});

test('FormsMap should map object with field-value mapping correctly', () => {
    const formsMap = new FormsMap(testMap);
    const data = {
        'question4': 'item2'
    };

    const result = formsMap.mapData(data);

    expect(result).toEqual({
        'f4': 'f4_2'
    });
});

test('FormsMap should map array values correctly', () => {
    const formsMap = new FormsMap(testMap);
    const data = {
        'question5': ['v1', 'v3']
    };

    const result = formsMap.mapData(data);

    expect(result).toEqual({
        'f5_1': true,
        'f5_3': true
    });
});

test('FormsMap should map nested object structure correctly', () => {
    const formsMap = new FormsMap(testMap);
    const data = {
        'question6': {
            'row1': {
                'column1': 'a',
                'column2': [1]
            },
            'row2': {
                'column1': 'b',
                'column2': [2]
            }
        }
    };

    const result = formsMap.mapData(data);

    expect(result).toEqual({
        'f6_1_1': 'a',
        'f6_1_2A': true,
        'f6_2_1': 'b',
        '6_2_B': true
    });
});

test('FormsMap should map array of objects correctly', () => {
    const formsMap = new FormsMap(testMap);
    const data = {
        'question7': [
            {
                'question8': 'b',
                'question9': 'b'
            },
            {
                'question8': 'a',
                'question9': 'a'
            }
        ]
    };

    const result = formsMap.mapData(data);

    expect(result).toEqual({
        'f7_1_1': 'b',
        'f7_1_2': 'B',
        'f7_2_1': 'a',
        'f7_2_2': 'A'
    });
});

test('FormsMap should handle undefined and null values', () => {
    const formsMap = new FormsMap(testMap);
    const data = {
        'question1': undefined,
        'question2': null
    };

    const result = formsMap.mapData(data);

    expect(result).toEqual({});
});

test('FormsMap should handle empty object', () => {
    const formsMap = new FormsMap(testMap);
    const data = {};

    const result = formsMap.mapData(data);

    expect(result).toEqual({});
});

test('FormsMap should handle complete example data correctly', () => {
    const formsMap = new FormsMap(testMap);
    const data = {
        'question1': 'text1',
        'question2': 'text2',
        'question3': 'Option 2',
        'question4': 'item2',
        'question5': ['v1', 'v3'],
        'question6': {
            'row1': {
                'column1': 'a',
                'column2': [1]
            },
            'row2': {
                'column1': 'b',
                'column2': [2]
            }
        },
        'question7': [
            {
                'question8': 'b',
                'question9': 'b'
            },
            {
                'question8': 'a',
                'question9': 'a'
            }
        ]
    };

    const result = formsMap.mapData(data);

    expect(result).toEqual({
        'f1': 'text1',
        'f1_plus': 'text1',
        'f2': 'text2',
        'f3': 'Option 2',
        'f4': 'f4_2',
        'f5_1': true,
        'f5_3': true,
        'f6_1_1': 'a',
        'f6_1_2A': true,
        'f6_2_1': 'b',
        '6_2_B': true,
        'f7_1_1': 'b',
        'f7_1_2': 'B',
        'f7_2_1': 'a',
        'f7_2_2': 'A'
    });
});

describe('FormsMap skips data keys without a map entry (unmapped keys)', () => {
    test('A primitive key without a map entry is skipped (unmapped keys)', () => {
        const result = new FormsMap(testMap).mapData({
            'question2': 'text2',
            'unmapped': 'w'
        });
        expect(result).toStrictEqual({ 'f2': 'text2' });
        expect(Object.keys(result)).not.toContain('undefined');
    });

    test('An object key without a map entry is skipped (unmapped keys)', () => {
        const result = new FormsMap(testMap).mapData({
            'question2': 'text2',
            'address': { 'street': 'Main' },
            'items': [{ 'name': 'a' }, { 'name': 'b' }]
        });
        expect(result).toStrictEqual({ 'f2': 'text2' });
    });

    test('An inner key without a map entry is skipped (unmapped keys)', () => {
        const result = new FormsMap({ 'address': { 'street': 'f_street' } }).mapData({
            'address': { 'street': 'Main', 'zip': '1' }
        });
        expect(result).toStrictEqual({ 'f_street': 'Main' });
    });

    test('An array item past the map length is skipped (unmapped keys)', () => {
        const result = new FormsMap(testMap).mapData({
            'question7': [
                { 'question8': 'b', 'question9': 'b' },
                { 'question8': 'a', 'question9': 'a' },
                { 'question8': 'c', 'question9': 'a' }
            ]
        });
        expect(result).toStrictEqual({
            'f7_1_1': 'b',
            'f7_1_2': 'B',
            'f7_2_1': 'a',
            'f7_2_2': 'A'
        });
    });

    test('A choice value without an entry in a choice map is skipped (unmapped keys)', () => {
        const result = new FormsMap(testMap).mapData({
            'question2': 'text2',
            'question4': 'item3',
            'question5': ['v1', 'v4']
        });
        expect(result).toStrictEqual({ 'f2': 'text2', 'f5_1': true });
        expect(new FormsMap(testMap).mapData({ 'question4': 'toString' })).toStrictEqual({});
    });

    test('A primitive array item past the map length is skipped (unmapped keys)', () => {
        const result = new FormsMap({ 'q': ['f1'] }).mapData({ 'q': ['a', 'b'] });
        expect(result).toStrictEqual({ 'f1': 'a' });
    });

    test('A null map entry or no map at all writes nothing (unmapped keys)', () => {
        expect(new FormsMap({ 'q': null }).mapData({ 'q': 'x', 'p': { 'a': 'b' } })).toStrictEqual({});
        expect(new FormsMap(undefined).mapData({ 'q': 'x' })).toStrictEqual({});
    });

    test('PDFFormFiller fills only the mapped fields (unmapped keys)', async () => {
        const mockPDFBytes = new Uint8Array([1, 2, 3, 4]);
        const mockAdapter = {
            fillForm: vitest.fn().mockResolvedValue(mockPDFBytes)
        };
        const formFiller = new PDFFormFiller({
            fieldMap: { 'q1': 'f1' },
            data: { 'q1': 'v', 'q2': 'w', 'address': { 'street': 'Main' } },
            pdfTemplate: 'test-template',
            pdfLibraryAdapter: mockAdapter
        });
        const result = await formFiller.raw();
        expect(result).toBe(mockPDFBytes);
        expect(mockAdapter.fillForm).toHaveBeenCalledTimes(1);
        expect(mockAdapter.fillForm).toHaveBeenCalledWith('test-template', { 'f1': 'v' });
        expect(mockAdapter.fillForm.mock.calls[0][1]).toStrictEqual({ 'f1': 'v' });
    });
});

describe('FormsMap with nested data (nested data, survey-library #12233)', () => {
    const addressMap = { 'address': { 'street': 'f_street', 'city': 'f_city' } };

    test('A nested fieldMap maps nested data (nested data, survey-library #12233)', () => {
        const result = new FormsMap(addressMap).mapData({ 'address': { 'street': 'Main', 'city': 'Oslo' } });
        expect(result).toStrictEqual({ 'f_street': 'Main', 'f_city': 'Oslo' });
    });

    test('Nested data inside records (nested data, survey-library #12233)', () => {
        const result = new FormsMap({
            'items': [{ 'address': { 'street': 'f1' } }, { 'address': { 'street': 'f2' } }]
        }).mapData({
            'items': [{ 'title': 'A', 'address': { 'street': 'S1' } }, { 'title': 'B', 'address': { 'street': 'S2' } }]
        });
        expect(result).toStrictEqual({ 'f1': 'S1', 'f2': 'S2' });
    });

    test('A map that covers one container and not another (nested data, survey-library #12233)', () => {
        const data = {
            'address': { 'street': 'Main', 'city': 'Oslo' },
            'billing': { 'street': 'Second', 'city': 'Bergen' }
        };
        let result: any;
        expect(() => { result = new FormsMap(addressMap).mapData(data); }).not.toThrow();
        expect(result).toStrictEqual({ 'f_street': 'Main', 'f_city': 'Oslo' });
    });

    test('The data of a real survey with a nesting panel (nested data, survey-library #12233)', () => {
        const survey = new SurveyModel({
            elements: [{
                type: 'panel', name: 'panel1', valueName: 'address',
                elements: [{ type: 'text', name: 'street' }, { type: 'text', name: 'city' }]
            }]
        });
        survey.getQuestionByName('street').value = 'Main';
        survey.getQuestionByName('city').value = 'Oslo';
        expect(survey.data).toStrictEqual({ 'address': { 'street': 'Main', 'city': 'Oslo' } });
        expect(new FormsMap(addressMap).mapData(survey.data)).toStrictEqual({ 'f_street': 'Main', 'f_city': 'Oslo' });
    });
});
