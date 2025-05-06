import FormsMap from '../src/pdf_forms/map';

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