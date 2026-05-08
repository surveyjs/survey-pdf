import { PDFJSAdapter as PDFJSAdapter } from '../src/pdf_forms/adapters/pdfjs';
import { test, expect, describe, beforeEach, afterEach, vitest } from 'vitest';

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
        vitest.clearAllMocks();
    });

    afterEach(() => {
        // Clean up pdfjsLib mock after each test
        (global as any).pdfjsLib = undefined;
    });

    test('Check fillForm loads PDF document', async () => {
        const mockSetValue = vitest.fn();
        const mockGetAnnotations = vitest.fn().mockResolvedValue([]);
        const mockGetPage = vitest.fn().mockResolvedValue({ getAnnotations: mockGetAnnotations });
        const mockSaveDocument = vitest.fn().mockResolvedValue(mockPDFBytes);

        const pdfjsLib = {
            getDocument: vitest.fn().mockImplementation(() => ({
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
        const mockSetValue = vitest.fn();
        const mockAnnotation: MockPDFAnnotation = {
            id: '1',
            fieldName: 'textField',
            fieldType: 'text'
        };
        const mockGetAnnotations = vitest.fn().mockResolvedValue([mockAnnotation]);
        const mockGetPage = vitest.fn().mockResolvedValue({ getAnnotations: mockGetAnnotations });
        const mockSaveDocument = vitest.fn().mockResolvedValue(mockPDFBytes);

        const pdfjsLib = {
            getDocument: vitest.fn().mockImplementation(() => ({
                promise: Promise.resolve({
                    numPages: 1,
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
        const mockSetValue = vitest.fn();
        const mockAnnotation: MockPDFAnnotation = {
            id: '1',
            fieldName: 'radio',
            fieldType: 'radio',
            radioButton: true,
            buttonValue: 'option1'
        };
        const mockGetAnnotations = vitest.fn().mockResolvedValue([mockAnnotation]);
        const mockGetPage = vitest.fn().mockResolvedValue({ getAnnotations: mockGetAnnotations });
        const mockSaveDocument = vitest.fn().mockResolvedValue(mockPDFBytes);

        const pdfjsLib = {
            getDocument: vitest.fn().mockImplementation(() => ({
                promise: Promise.resolve({
                    numPages: 1,
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
        const mockSetValue = vitest.fn();
        const mockAnnotation: MockPDFAnnotation = {
            id: '1',
            fieldName: 'radio',
            fieldType: 'radio',
            radioButton: true,
            buttonValue: 'different-option'
        };
        const mockGetAnnotations = vitest.fn().mockResolvedValue([mockAnnotation]);
        const mockGetPage = vitest.fn().mockResolvedValue({ getAnnotations: mockGetAnnotations });
        const mockSaveDocument = vitest.fn().mockResolvedValue(mockPDFBytes);

        const pdfjsLib = {
            getDocument: vitest.fn().mockImplementation(() => ({
                promise: Promise.resolve({
                    numPages: 1,
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
        const mockSetValue = vitest.fn();
        const mockAnnotation: MockPDFAnnotation = {
            id: '1',
            fieldName: 'emptyField',
            fieldType: 'text'
        };
        const mockGetAnnotations = vitest.fn().mockResolvedValue([mockAnnotation]);
        const mockGetPage = vitest.fn().mockResolvedValue({ getAnnotations: mockGetAnnotations });
        const mockSaveDocument = vitest.fn().mockResolvedValue(mockPDFBytes);

        const pdfjsLib = {
            getDocument: vitest.fn().mockImplementation(() => ({
                promise: Promise.resolve({
                    numPages: 1,
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
        const mockSetValue = vitest.fn();
        const mockGetAnnotations = vitest.fn().mockResolvedValue([]);
        const mockGetPage = vitest.fn().mockResolvedValue({ getAnnotations: mockGetAnnotations });
        const mockSaveDocument = vitest.fn().mockResolvedValue(mockPDFBytes);

        const pdfjsLib = {
            getDocument: vitest.fn().mockImplementation(() => ({
                promise: Promise.resolve({
                    numPages: 1,
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

    describe('Multi-page document handling', () => {
        test('Check fillForm processes all pages in multi-page document', async () => {
            const mockSetValue = vitest.fn();
            const mockPages = [
                {
                    getAnnotations: vitest.fn().mockResolvedValue([
                        { id: '1', fieldName: 'textField1', fieldType: 'text' },
                        { id: '2', fieldName: 'checkbox1', fieldType: 'checkbox' }
                    ])
                },
                {
                    getAnnotations: vitest.fn().mockResolvedValue([
                        {
                            id: '3',
                            fieldName: 'radio1',
                            fieldType: 'radio',
                            radioButton: true,
                            buttonValue: 'option1'
                        }
                    ])
                },
                {
                    getAnnotations: vitest.fn().mockResolvedValue([
                        { id: '4', fieldName: 'textField2', fieldType: 'text' }
                    ])
                }
            ];

            const mockGetPage = vitest.fn().mockImplementation((pageNum) =>
                Promise.resolve(mockPages[pageNum - 1])
            );

            const pdfjsLib = {
                getDocument: vitest.fn().mockImplementation(() => ({
                    promise: Promise.resolve({
                        numPages: 3,
                        getPage: mockGetPage,
                        annotationStorage: { setValue: mockSetValue },
                        saveDocument: vitest.fn().mockResolvedValue(mockPDFBytes)
                    })
                }))
            };

            const adapter = new PDFJSAdapter(pdfjsLib);
            const multiPageData = {
                textField1: 'value1',
                checkbox1: true,
                radio1: 'option1',
                textField2: 'value2'
            };

            const result = await adapter.fillForm(template, multiPageData);

            expect(result).toBe(mockPDFBytes);
            expect(mockGetPage).toHaveBeenCalledTimes(3);
            expect(mockGetPage).toHaveBeenNthCalledWith(1, 1);
            expect(mockGetPage).toHaveBeenNthCalledWith(2, 2);
            expect(mockGetPage).toHaveBeenNthCalledWith(3, 3);

            // Verify all pages were processed
            expect(mockPages[0].getAnnotations).toHaveBeenCalled();
            expect(mockPages[1].getAnnotations).toHaveBeenCalled();
            expect(mockPages[2].getAnnotations).toHaveBeenCalled();

            // Verify field values were set correctly
            expect(mockSetValue).toHaveBeenCalledWith('1', { value: 'value1' });
            expect(mockSetValue).toHaveBeenCalledWith('2', { value: true });
            expect(mockSetValue).toHaveBeenCalledWith('3', { value: 'option1' });
            expect(mockSetValue).toHaveBeenCalledWith('4', { value: 'value2' });
        });

        test('Check fillForm handles empty pages correctly', async () => {
            const mockSetValue = vitest.fn();
            const mockPages = [
                {
                    getAnnotations: vitest.fn().mockResolvedValue([
                        { id: '1', fieldName: 'textField1', fieldType: 'text' }
                    ])
                },
                {
                    getAnnotations: vitest.fn().mockResolvedValue([])
                }
            ];

            const mockGetPage = vitest.fn().mockImplementation((pageNum) =>
                Promise.resolve(mockPages[pageNum - 1])
            );

            const pdfjsLib = {
                getDocument: vitest.fn().mockImplementation(() => ({
                    promise: Promise.resolve({
                        numPages: 2,
                        getPage: mockGetPage,
                        annotationStorage: { setValue: mockSetValue },
                        saveDocument: vitest.fn().mockResolvedValue(mockPDFBytes)
                    })
                }))
            };

            const adapter = new PDFJSAdapter(pdfjsLib);
            const data = {
                textField1: 'value1'
            };

            const result = await adapter.fillForm(template, data);

            expect(result).toBe(mockPDFBytes);
            expect(mockGetPage).toHaveBeenCalledTimes(2);
            expect(mockPages[0].getAnnotations).toHaveBeenCalled();
            expect(mockPages[1].getAnnotations).toHaveBeenCalled();
            expect(mockSetValue).toHaveBeenCalledTimes(1);
            expect(mockSetValue).toHaveBeenCalledWith('1', { value: 'value1' });
        });

        test('Check fillForm handles pages with no form fields', async () => {
            const mockSetValue = vitest.fn();
            const mockPages = [
                {
                    getAnnotations: vitest.fn().mockResolvedValue([
                        { id: '1', fieldName: 'textField1', fieldType: 'text' }
                    ])
                },
                {
                    getAnnotations: vitest.fn().mockResolvedValue([
                        { id: '2', fieldType: undefined } // Field without fieldType
                    ])
                }
            ];

            const mockGetPage = vitest.fn().mockImplementation((pageNum) =>
                Promise.resolve(mockPages[pageNum - 1])
            );

            const pdfjsLib = {
                getDocument: vitest.fn().mockImplementation(() => ({
                    promise: Promise.resolve({
                        numPages: 2,
                        getPage: mockGetPage,
                        annotationStorage: { setValue: mockSetValue },
                        saveDocument: vitest.fn().mockResolvedValue(mockPDFBytes)
                    })
                }))
            };

            const adapter = new PDFJSAdapter(pdfjsLib);
            const data = {
                textField1: 'value1'
            };

            const result = await adapter.fillForm(template, data);

            expect(result).toBe(mockPDFBytes);
            expect(mockGetPage).toHaveBeenCalledTimes(2);
            expect(mockPages[0].getAnnotations).toHaveBeenCalled();
            expect(mockPages[1].getAnnotations).toHaveBeenCalled();
            expect(mockSetValue).toHaveBeenCalledTimes(1);
            expect(mockSetValue).toHaveBeenCalledWith('1', { value: 'value1' });
        });
    });
});