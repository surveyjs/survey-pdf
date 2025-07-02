import { PDFLibAdapter as PDFLibAdapter } from '../src/pdf_forms/adapters/pdf-lib';

// Mock PDFLib
const mockPDFBytes = new Uint8Array([1, 2, 3, 4]);

interface MockPDFDocument {
    getForm: () => {
        getFields: () => any[],
    };
    save: () => Promise<Uint8Array>;
}

const mockPDFDocument = {
    load: jest.fn().mockImplementation(() => Promise.resolve({
        getForm: jest.fn().mockReturnValue({
            getFields: jest.fn().mockReturnValue([])
        }),
        save: jest.fn().mockResolvedValue(mockPDFBytes)
    } as MockPDFDocument))
};

// Create mock classes for proper instanceof checks
class MockPDFTextField {
    getName() { return ''; }
    setText() {}
}

class MockPDFCheckBox {
    getName() { return ''; }
    check() {}
    uncheck() {}
}

class MockPDFRadioGroup {
    getName() { return ''; }
    select() {}
}

class MockPDFDropdown {
    getName() { return ''; }
    select() {}
}

describe('PdfLibAdapter', () => {
    let adapter: PDFLibAdapter;
    const template = 'test-template';
    const data = {
        textField: 'text value',
        checkbox: true,
        radio: 'option1',
        dropdown: 'option2'
    };

    beforeEach(() => {
        jest.clearAllMocks();
        // Reset PDFLib mock before each test
        const PDFLib = {
            PDFDocument: mockPDFDocument,
            PDFTextField: MockPDFTextField,
            PDFCheckBox: MockPDFCheckBox,
            PDFRadioGroup: MockPDFRadioGroup,
            PDFDropdown: MockPDFDropdown
        };
        adapter = new PDFLibAdapter(PDFLib);
    });

    afterEach(() => {
        // Clean up PDFLib mock after each test
        (global as any).PDFLib = undefined;
    });

    test('Check fillForm loads PDF document', async () => {
        await adapter.fillForm(template, data);
        expect(mockPDFDocument.load).toHaveBeenCalledWith(template);
    });

    test('Check fillForm handles text field', async () => {
        const mockField = new MockPDFTextField();
        mockField.getName = jest.fn().mockReturnValue('textField');
        mockField.setText = jest.fn();

        mockPDFDocument.load.mockImplementation(() => Promise.resolve({
            getForm: jest.fn().mockReturnValue({
                getFields: jest.fn().mockReturnValue([mockField])
            }),
            save: jest.fn().mockResolvedValue(mockPDFBytes)
        } as MockPDFDocument));

        await adapter.fillForm(template, data);
        expect(mockField.setText).toHaveBeenCalledWith('text value');
    });

    test('Check fillForm handles checkbox', async () => {
        const mockField = new MockPDFCheckBox();
        mockField.getName = jest.fn().mockReturnValue('checkbox');
        mockField.check = jest.fn();
        mockField.uncheck = jest.fn();

        mockPDFDocument.load.mockImplementation(() => Promise.resolve({
            getForm: jest.fn().mockReturnValue({
                getFields: jest.fn().mockReturnValue([mockField])
            }),
            save: jest.fn().mockResolvedValue(mockPDFBytes)
        } as MockPDFDocument));

        await adapter.fillForm(template, data);
        expect(mockField.check).toHaveBeenCalled();
    });

    test('Check fillForm handles radio group', async () => {
        const mockField = new MockPDFRadioGroup();
        mockField.getName = jest.fn().mockReturnValue('radio');
        mockField.select = jest.fn();

        mockPDFDocument.load.mockImplementation(() => Promise.resolve({
            getForm: jest.fn().mockReturnValue({
                getFields: jest.fn().mockReturnValue([mockField])
            }),
            save: jest.fn().mockResolvedValue(mockPDFBytes)
        } as MockPDFDocument));

        await adapter.fillForm(template, data);
        expect(mockField.select).toHaveBeenCalledWith('option1');
    });

    test('Check fillForm handles dropdown', async () => {
        const mockField = new MockPDFDropdown();
        mockField.getName = jest.fn().mockReturnValue('dropdown');
        mockField.select = jest.fn();

        mockPDFDocument.load.mockImplementation(() => Promise.resolve({
            getForm: jest.fn().mockReturnValue({
                getFields: jest.fn().mockReturnValue([mockField])
            }),
            save: jest.fn().mockResolvedValue(mockPDFBytes)
        } as MockPDFDocument));

        await adapter.fillForm(template, data);
        expect(mockField.select).toHaveBeenCalledWith('option2');
    });

    test('Check fillForm skips fields with null or undefined values', async () => {
        const mockField = new MockPDFTextField();
        mockField.getName = jest.fn().mockReturnValue('emptyField');
        mockField.setText = jest.fn();

        mockPDFDocument.load.mockImplementation(() => Promise.resolve({
            getForm: jest.fn().mockReturnValue({
                getFields: jest.fn().mockReturnValue([mockField])
            }),
            save: jest.fn().mockResolvedValue(mockPDFBytes)
        } as MockPDFDocument));

        await adapter.fillForm(template, { emptyField: null });
        expect(mockField.setText).not.toHaveBeenCalled();
    });

    test('Check fillForm returns PDF bytes', async () => {
        const result = await adapter.fillForm(template, data);
        expect(result).toBe(mockPDFBytes);
    });

    describe('Multi-page document handling', () => {
        test('Check fillForm processes fields from all pages', async () => {
            // Create mock fields for different pages
            const textField1 = new MockPDFTextField();
            textField1.getName = jest.fn().mockReturnValue('textField1');
            textField1.setText = jest.fn();

            const checkbox1 = new MockPDFCheckBox();
            checkbox1.getName = jest.fn().mockReturnValue('checkbox1');
            checkbox1.check = jest.fn();

            const radio1 = new MockPDFRadioGroup();
            radio1.getName = jest.fn().mockReturnValue('radio1');
            radio1.select = jest.fn();

            const textField2 = new MockPDFTextField();
            textField2.getName = jest.fn().mockReturnValue('textField2');
            textField2.setText = jest.fn();

            // Mock document with fields from multiple pages
            mockPDFDocument.load.mockImplementation(() => Promise.resolve({
                getForm: jest.fn().mockReturnValue({
                    getFields: jest.fn().mockReturnValue([
                        textField1,
                        checkbox1,
                        radio1,
                        textField2
                    ])
                }),
                save: jest.fn().mockResolvedValue(mockPDFBytes)
            } as MockPDFDocument));

            const multiPageData = {
                textField1: 'value1',
                checkbox1: true,
                radio1: 'option1',
                textField2: 'value2'
            };

            const result = await adapter.fillForm(template, multiPageData);

            expect(result).toBe(mockPDFBytes);
            expect(textField1.setText).toHaveBeenCalledWith('value1');
            expect(checkbox1.check).toHaveBeenCalled();
            expect(radio1.select).toHaveBeenCalledWith('option1');
            expect(textField2.setText).toHaveBeenCalledWith('value2');
        });

        test('Check fillForm handles documents with empty pages', async () => {
            const textField = new MockPDFTextField();
            textField.getName = jest.fn().mockReturnValue('textField1');
            textField.setText = jest.fn();

            // Mock document with only one field
            mockPDFDocument.load.mockImplementation(() => Promise.resolve({
                getForm: jest.fn().mockReturnValue({
                    getFields: jest.fn().mockReturnValue([textField])
                }),
                save: jest.fn().mockResolvedValue(mockPDFBytes)
            } as MockPDFDocument));

            const data = {
                textField1: 'value1'
            };

            const result = await adapter.fillForm(template, data);

            expect(result).toBe(mockPDFBytes);
            expect(textField.setText).toHaveBeenCalledWith('value1');
        });

        test('Check fillForm handles documents with mixed field types across pages', async () => {
            const textField = new MockPDFTextField();
            textField.getName = jest.fn().mockReturnValue('textField1');
            textField.setText = jest.fn();

            const checkbox = new MockPDFCheckBox();
            checkbox.getName = jest.fn().mockReturnValue('checkbox1');
            checkbox.check = jest.fn();

            const radio = new MockPDFRadioGroup();
            radio.getName = jest.fn().mockReturnValue('radio1');
            radio.select = jest.fn();

            const dropdown = new MockPDFDropdown();
            dropdown.getName = jest.fn().mockReturnValue('dropdown1');
            dropdown.select = jest.fn();

            // Mock document with different field types
            mockPDFDocument.load.mockImplementation(() => Promise.resolve({
                getForm: jest.fn().mockReturnValue({
                    getFields: jest.fn().mockReturnValue([
                        textField,
                        checkbox,
                        radio,
                        dropdown
                    ])
                }),
                save: jest.fn().mockResolvedValue(mockPDFBytes)
            } as MockPDFDocument));

            const mixedData = {
                textField1: 'value1',
                checkbox1: true,
                radio1: 'option1',
                dropdown1: 'option2'
            };

            const result = await adapter.fillForm(template, mixedData);

            expect(result).toBe(mockPDFBytes);
            expect(textField.setText).toHaveBeenCalledWith('value1');
            expect(checkbox.check).toHaveBeenCalled();
            expect(radio.select).toHaveBeenCalledWith('option1');
            expect(dropdown.select).toHaveBeenCalledWith('option2');
        });
    });
});