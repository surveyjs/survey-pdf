import { PDFFormFiller } from '../src/pdf_forms/forms';
import FormMap from '../src/pdf_forms/map';

// Mock URL.createObjectURL
const mockBlobUrl = 'blob:mock-url-123';
(global as any).URL = {
    createObjectURL: jest.fn().mockReturnValue(mockBlobUrl),
    revokeObjectURL: jest.fn()
};

// Mock document methods
const mockClick = jest.fn();
const mockLink = {
    href: '',
    download: '',
    click: mockClick
};
document.createElement = jest.fn().mockReturnValue(mockLink);
document.body.appendChild = jest.fn();
document.body.removeChild = jest.fn();

// Mock fs.writeFile for Node.js tests
const mockWriteFile = jest.fn();
jest.mock('fs', () => ({
    writeFile: (path: string, data: any, callback: (err: Error | null) => void) => mockWriteFile(path, data, callback)
}));

// Import Node.js version of PDFFormFiller
import { PDFFormFiller as NodePDFFormFiller } from '../src/pdf_forms/forms-node';

test('Check constructor with no options', async () => {
    const mockPDFBytes = new Uint8Array([1, 2, 3, 4]);
    const formFiller = new PDFFormFiller();
    formFiller.fieldMap = {};
    formFiller.data = {};
    formFiller.pdfTemplate = 'test-template';
    const mockGetPDFBytes = jest.spyOn(formFiller as any, 'getPDFBytes').mockResolvedValue(mockPDFBytes);

    const result = await formFiller.raw();
    expect(result).toBe(mockPDFBytes);
    expect(mockGetPDFBytes).toHaveBeenCalledTimes(1);
});

test('Check raw method returns PDF bytes when no type specified', async () => {
    const mockPDFBytes = new Uint8Array([1, 2, 3, 4]);
    const formFiller = new PDFFormFiller({
        fieldMap: {},
        data: {},
        pdfTemplate: 'test-template',
        pdfLibraryAdapter: null as any
    });
    const mockGetPDFBytes = jest.spyOn(formFiller as any, 'getPDFBytes').mockResolvedValue(mockPDFBytes);

    const result = await formFiller.raw();
    expect(result).toBe(mockPDFBytes);
    expect(mockGetPDFBytes).toHaveBeenCalledTimes(1);
});

test('Check raw method returns blob when type is "blob"', async () => {
    const mockPDFBytes = new Uint8Array([1, 2, 3, 4]);
    const formFiller = new PDFFormFiller({
        fieldMap: {},
        data: {},
        pdfTemplate: 'test-template',
        pdfLibraryAdapter: null as any
    });
    const mockGetPDFBytes = jest.spyOn(formFiller as any, 'getPDFBytes').mockResolvedValue(mockPDFBytes);

    const result = await formFiller.raw('blob');
    expect(result).toBeInstanceOf(Blob);
    expect(result.type).toBe('application/pdf');
    expect(mockGetPDFBytes).toHaveBeenCalledTimes(1);
});

test('Check raw method returns blob URL when type is "bloburl"', async () => {
    const mockPDFBytes = new Uint8Array([1, 2, 3, 4]);
    const formFiller = new PDFFormFiller({
        fieldMap: {},
        data: {},
        pdfTemplate: 'test-template',
        pdfLibraryAdapter: null as any
    });
    const mockGetPDFBytes = jest.spyOn(formFiller as any, 'getPDFBytes').mockResolvedValue(mockPDFBytes);

    const result = await formFiller.raw('bloburl');
    expect(typeof result).toBe('string');
    expect(result).toBe(mockBlobUrl);
    expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(mockGetPDFBytes).toHaveBeenCalledTimes(1);
});

test('Check raw method returns data URL string when type is "dataurlstring"', async () => {
    const mockPDFBytes = new Uint8Array([1, 2, 3, 4]);
    const formFiller = new PDFFormFiller({
        fieldMap: {},
        data: {},
        pdfTemplate: 'test-template',
        pdfLibraryAdapter: null as any
    });
    const mockGetPDFBytes = jest.spyOn(formFiller as any, 'getPDFBytes').mockResolvedValue(mockPDFBytes);

    const result = await formFiller.raw('dataurlstring');
    expect(typeof result).toBe('string');
    expect(result).toBe('data:application/pdf;base64,AQIDBA==');
    expect(mockGetPDFBytes).toHaveBeenCalledTimes(1);
});

test('Check raw method handles errors from getPDFBytes', async () => {
    const formFiller = new PDFFormFiller({
        fieldMap: {},
        data: {},
        pdfTemplate: 'test-template',
        pdfLibraryAdapter: null as any
    });
    const mockGetPDFBytes = jest.spyOn(formFiller as any, 'getPDFBytes').mockRejectedValue(new Error('PDF generation failed'));

    await expect(formFiller.raw()).rejects.toThrow('PDF generation failed');
});

test('Check getPDFBytes maps data correctly', async () => {
    const mockPDFBytes = new Uint8Array([1, 2, 3, 4]);
    const fieldMap = {
        question1: 'field1',
        question2: {
            option1: {
                field: 'field2',
                value: 'value1'
            }
        }
    };
    const data = {
        question1: 'answer1',
        question2: 'option1'
    };

    // Mock FormMap
    const mockMapData = jest.spyOn(FormMap.prototype, 'mapData').mockReturnValue({
        field1: 'answer1',
        field2: 'value1'
    });

    // Mock adapter
    const mockAdapter = {
        fillForm: jest.fn().mockResolvedValue(mockPDFBytes)
    };

    const formFiller = new PDFFormFiller({
        fieldMap,
        data,
        pdfTemplate: 'test-template',
        pdfLibraryAdapter: mockAdapter
    });

    const result = await (formFiller as any).getPDFBytes();
    expect(result).toBe(mockPDFBytes);
    expect(mockMapData).toHaveBeenCalledWith(data);

    expect(mockAdapter.fillForm).toHaveBeenCalledWith('test-template', {
        field1: 'answer1',
        field2: 'value1'
    });
});

test('Check save method downloads PDF with default filename', async () => {
    const mockPDFBytes = new Uint8Array([1, 2, 3, 4]);
    const formFiller = new PDFFormFiller({
        fieldMap: {},
        data: {},
        pdfTemplate: 'test-template',
        pdfLibraryAdapter: null as any
    });
    const mockGetPDFBytes = jest.spyOn(formFiller as any, 'getPDFBytes').mockResolvedValue(mockPDFBytes);

    await formFiller.save();

    expect(mockGetPDFBytes).toHaveBeenCalledTimes(1);
    expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(mockLink.href).toBe(mockBlobUrl);
    expect(mockLink.download).toBe('survey_result.pdf');
    expect(mockClick).toHaveBeenCalled();
    expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);
    expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith(mockBlobUrl);
});

test('Check save method downloads PDF with custom filename', async () => {
    const mockPDFBytes = new Uint8Array([1, 2, 3, 4]);
    const formFiller = new PDFFormFiller({
        fieldMap: {},
        data: {},
        pdfTemplate: 'test-template',
        pdfLibraryAdapter: null as any
    });
    const mockGetPDFBytes = jest.spyOn(formFiller as any, 'getPDFBytes').mockResolvedValue(mockPDFBytes);
    const customFilename = 'custom-survey.pdf';

    await formFiller.save(customFilename);

    expect(mockGetPDFBytes).toHaveBeenCalledTimes(1);
    expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(mockLink.href).toBe(mockBlobUrl);
    expect(mockLink.download).toBe(customFilename);
    expect(mockClick).toHaveBeenCalled();
    expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);
    expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith(mockBlobUrl);
});

describe('Node.js PDFFormFiller save method', () => {
    beforeEach(() => {
        mockWriteFile.mockClear();
    });

    test('Check save method writes PDF to file with default filename', async () => {
        const mockPDFBytes = new Uint8Array([1, 2, 3, 4]);
        const formFiller = new NodePDFFormFiller({
            fieldMap: {},
            data: {},
            pdfTemplate: 'test-template',
            pdfLibraryAdapter: null as any
        });
        const mockGetPDFBytes = jest.spyOn(formFiller as any, 'getPDFBytes').mockResolvedValue(mockPDFBytes);

        // Mock successful file write
        mockWriteFile.mockImplementation((path, data, callback) => callback(null));

        await formFiller.save();

        expect(mockGetPDFBytes).toHaveBeenCalledTimes(1);
        expect(mockWriteFile).toHaveBeenCalledWith(
            'survey_result.pdf',
            mockPDFBytes,
            expect.any(Function)
        );
    });

    test('Check save method writes PDF to file with custom filename', async () => {
        const mockPDFBytes = new Uint8Array([1, 2, 3, 4]);
        const formFiller = new NodePDFFormFiller({
            fieldMap: {},
            data: {},
            pdfTemplate: 'test-template',
            pdfLibraryAdapter: null as any
        });
        const mockGetPDFBytes = jest.spyOn(formFiller as any, 'getPDFBytes').mockResolvedValue(mockPDFBytes);
        const customFilename = 'custom-survey.pdf';

        // Mock successful file write
        mockWriteFile.mockImplementation((path, data, callback) => callback(null));

        await formFiller.save(customFilename);

        expect(mockGetPDFBytes).toHaveBeenCalledTimes(1);
        expect(mockWriteFile).toHaveBeenCalledWith(
            customFilename,
            mockPDFBytes,
            expect.any(Function)
        );
    });

    test('Check save method handles file write errors', async () => {
        const mockPDFBytes = new Uint8Array([1, 2, 3, 4]);
        const formFiller = new NodePDFFormFiller({
            fieldMap: {},
            data: {},
            pdfTemplate: 'test-template',
            pdfLibraryAdapter: null as any
        });
        const mockGetPDFBytes = jest.spyOn(formFiller as any, 'getPDFBytes').mockResolvedValue(mockPDFBytes);

        // Mock file write error
        const writeError = new Error('Failed to write file');
        mockWriteFile.mockImplementation((path, data, callback) => callback(writeError));

        await expect(formFiller.save()).rejects.toThrow('Failed to write file');
        expect(mockGetPDFBytes).toHaveBeenCalledTimes(1);
        expect(mockWriteFile).toHaveBeenCalledWith(
            'survey_result.pdf',
            mockPDFBytes,
            expect.any(Function)
        );
    });
});