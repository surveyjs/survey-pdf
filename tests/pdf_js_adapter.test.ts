import { PDFJSAdapter as PDFJSAdapter } from '../src/pdf_forms/adapters/pdfjs';

// Mock PDF bytes
const mockPDFBytes = new Uint8Array([1, 2, 3, 4]);

// Mock PDF.js document and page
interface MockPDFDocument {
    getPage: (pageNumber: number) => Promise<MockPDFPage>;
    annotationStorage: {
        setValue: (id: string, value: any) => void,
    };
    saveDocument: () => Promise<Uint8Array>;
}

interface MockPDFPage {
    getAnnotations: () => Promise<MockPDFAnnotation[]>;
}

interface MockPDFAnnotation {
    id: string;
    fieldName: string;
    fieldType: string;
    radioButton?: boolean;
    buttonValue?: string;
}

describe('PdfJsAdapter', () => {
    const template = 'test-template';
    const data = {
        textField: 'text value',
        checkbox: true,
        radio: 'option1',
        dropdown: 'option2'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        // Clean up pdfjsLib mock after each test
        (global as any).pdfjsLib = undefined;
    });

    test('Check fillForm loads PDF document', async () => {
        const mockSetValue = jest.fn();
        const mockGetAnnotations = jest.fn().mockResolvedValue([]);
        const mockGetPage = jest.fn().mockResolvedValue({ getAnnotations: mockGetAnnotations });
        const mockSaveDocument = jest.fn().mockResolvedValue(mockPDFBytes);

        const pdfjsLib = {
            getDocument: jest.fn().mockImplementation(() => ({
                promise: Promise.resolve({
                    getPage: mockGetPage,
                    annotationStorage: { setValue: mockSetValue },
                    saveDocument: mockSaveDocument
                })
            }))
        };
        let adapter: PDFJSAdapter = new PDFJSAdapter(pdfjsLib);

        await adapter.fillForm(template, data);
        expect(pdfjsLib.getDocument).toHaveBeenCalledWith(template);
    });

    test('Check fillForm handles text field', async () => {
        const mockSetValue = jest.fn();
        const mockAnnotation: MockPDFAnnotation = {
            id: '1',
            fieldName: 'textField',
            fieldType: 'text'
        };
        const mockGetAnnotations = jest.fn().mockResolvedValue([mockAnnotation]);
        const mockGetPage = jest.fn().mockResolvedValue({ getAnnotations: mockGetAnnotations });
        const mockSaveDocument = jest.fn().mockResolvedValue(mockPDFBytes);

        const pdfjsLib = {
            getDocument: jest.fn().mockImplementation(() => ({
                promise: Promise.resolve({
                    getPage: mockGetPage,
                    annotationStorage: { setValue: mockSetValue },
                    saveDocument: mockSaveDocument
                })
            }))
        };
        let adapter: PDFJSAdapter = new PDFJSAdapter(pdfjsLib);
        await adapter.fillForm(template, data);
        expect(mockSetValue).toHaveBeenCalledWith('1', { value: 'text value' });
    });

    test('Check fillForm handles radio button', async () => {
        const mockSetValue = jest.fn();
        const mockAnnotation: MockPDFAnnotation = {
            id: '1',
            fieldName: 'radio',
            fieldType: 'radio',
            radioButton: true,
            buttonValue: 'option1'
        };
        const mockGetAnnotations = jest.fn().mockResolvedValue([mockAnnotation]);
        const mockGetPage = jest.fn().mockResolvedValue({ getAnnotations: mockGetAnnotations });
        const mockSaveDocument = jest.fn().mockResolvedValue(mockPDFBytes);

        const pdfjsLib = {
            getDocument: jest.fn().mockImplementation(() => ({
                promise: Promise.resolve({
                    getPage: mockGetPage,
                    annotationStorage: { setValue: mockSetValue },
                    saveDocument: mockSaveDocument
                })
            }))
        };
        let adapter: PDFJSAdapter = new PDFJSAdapter(pdfjsLib);

        await adapter.fillForm(template, data);
        expect(mockSetValue).toHaveBeenCalledWith('1', { value: 'option1' });
    });

    test('Check fillForm skips radio button with different value', async () => {
        const mockSetValue = jest.fn();
        const mockAnnotation: MockPDFAnnotation = {
            id: '1',
            fieldName: 'radio',
            fieldType: 'radio',
            radioButton: true,
            buttonValue: 'different-option'
        };
        const mockGetAnnotations = jest.fn().mockResolvedValue([mockAnnotation]);
        const mockGetPage = jest.fn().mockResolvedValue({ getAnnotations: mockGetAnnotations });
        const mockSaveDocument = jest.fn().mockResolvedValue(mockPDFBytes);

        const pdfjsLib = {
            getDocument: jest.fn().mockImplementation(() => ({
                promise: Promise.resolve({
                    getPage: mockGetPage,
                    annotationStorage: { setValue: mockSetValue },
                    saveDocument: mockSaveDocument
                })
            }))
        };
        let adapter: PDFJSAdapter = new PDFJSAdapter(pdfjsLib);
        await adapter.fillForm(template, data);
        expect(mockSetValue).not.toHaveBeenCalled();
    });

    test('Check fillForm skips fields with null or undefined values', async () => {
        const mockSetValue = jest.fn();
        const mockAnnotation: MockPDFAnnotation = {
            id: '1',
            fieldName: 'emptyField',
            fieldType: 'text'
        };
        const mockGetAnnotations = jest.fn().mockResolvedValue([mockAnnotation]);
        const mockGetPage = jest.fn().mockResolvedValue({ getAnnotations: mockGetAnnotations });
        const mockSaveDocument = jest.fn().mockResolvedValue(mockPDFBytes);

        const pdfjsLib = {
            getDocument: jest.fn().mockImplementation(() => ({
                promise: Promise.resolve({
                    getPage: mockGetPage,
                    annotationStorage: { setValue: mockSetValue },
                    saveDocument: mockSaveDocument
                })
            }))
        };
        let adapter: PDFJSAdapter = new PDFJSAdapter(pdfjsLib);

        await adapter.fillForm(template, { emptyField: null });
        expect(mockSetValue).not.toHaveBeenCalled();
    });

    test('Check fillForm returns PDF bytes', async () => {
        const mockSetValue = jest.fn();
        const mockGetAnnotations = jest.fn().mockResolvedValue([]);
        const mockGetPage = jest.fn().mockResolvedValue({ getAnnotations: mockGetAnnotations });
        const mockSaveDocument = jest.fn().mockResolvedValue(mockPDFBytes);

        const pdfjsLib = {
            getDocument: jest.fn().mockImplementation(() => ({
                promise: Promise.resolve({
                    getPage: mockGetPage,
                    annotationStorage: { setValue: mockSetValue },
                    saveDocument: mockSaveDocument
                })
            }))
        };
        let adapter: PDFJSAdapter = new PDFJSAdapter(pdfjsLib);

        const result = await adapter.fillForm(template, data);
        expect(result).toBe(mockPDFBytes);
    });
});