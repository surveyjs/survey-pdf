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
});