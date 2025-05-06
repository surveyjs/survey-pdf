(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
    return {};
};

import { PDFFormFiller } from '../src/forms';
import { TestHelper } from '../src/helper_test';
import { PDFFormAdapterFactory } from '../src/pdf_forms/registry';
import FormMap from '../src/pdf_forms/map';

let __dummy_ff = new PDFFormFiller({ fieldMap: {}, data: {}, pdfTemplate: '' });

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
        pdfTemplate: 'test-template'
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
        pdfTemplate: 'test-template'
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
        pdfTemplate: 'test-template'
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
        pdfTemplate: 'test-template'
    });
    const mockGetPDFBytes = jest.spyOn(formFiller as any, 'getPDFBytes').mockResolvedValue(mockPDFBytes);

    const result = await formFiller.raw('dataurlstring');
    expect(typeof result).toBe('string');
    expect(result.startsWith('data:text/plain;base64,')).toBe(true);
    expect(mockGetPDFBytes).toHaveBeenCalledTimes(1);
});

test('Check raw method handles errors from getPDFBytes', async () => {
    const formFiller = new PDFFormFiller({
        fieldMap: {},
        data: {},
        pdfTemplate: 'test-template'
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
    const formFiller = new PDFFormFiller({
        fieldMap,
        data,
        pdfTemplate: 'test-template'
    });

    // Mock FormMap
    const mockMapData = jest.spyOn(FormMap.prototype, 'mapData').mockReturnValue({
        field1: 'answer1',
        field2: 'value1'
    });

    // Mock adapter
    const mockAdapter = {
        fillForm: jest.fn().mockResolvedValue(mockPDFBytes)
    };
    const mockCreateAdapter = jest.spyOn(PDFFormAdapterFactory.Instance, 'createAdapter').mockReturnValue(mockAdapter);
    const mockGetAdapterIdsList = jest.spyOn(PDFFormAdapterFactory.Instance, 'getAdapterIdsList').mockReturnValue(['test-adapter']);

    const result = await (formFiller as any).getPDFBytes();
    expect(result).toBe(mockPDFBytes);
    expect(mockMapData).toHaveBeenCalledWith(data);
    expect(mockCreateAdapter).toHaveBeenCalledWith('test-adapter');
    expect(mockAdapter.fillForm).toHaveBeenCalledWith('test-template', {
        field1: 'answer1',
        field2: 'value1'
    });
});

test('Check getPDFBytes tries next adapter if first fails', async () => {
    const mockPDFBytes = new Uint8Array([1, 2, 3, 4]);
    const formFiller = new PDFFormFiller({
        fieldMap: {},
        data: {},
        pdfTemplate: 'test-template'
    });

    // Mock FormMap
    const mockMapData = jest.spyOn(FormMap.prototype, 'mapData').mockReturnValue({});

    // Mock adapters
    const mockAdapter1 = {
        fillForm: jest.fn().mockResolvedValue(null)
    };
    const mockAdapter2 = {
        fillForm: jest.fn().mockResolvedValue(mockPDFBytes)
    };
    const mockCreateAdapter = jest.spyOn(PDFFormAdapterFactory.Instance, 'createAdapter')
        .mockImplementation((id) => id === 'adapter1' ? mockAdapter1 : mockAdapter2);
    const mockGetAdapterIdsList = jest.spyOn(PDFFormAdapterFactory.Instance, 'getAdapterIdsList')
        .mockReturnValue(['adapter1', 'adapter2']);

    const result = await (formFiller as any).getPDFBytes();
    expect(result).toBe(mockPDFBytes);
    expect(mockAdapter1.fillForm).toHaveBeenCalled();
    expect(mockAdapter2.fillForm).toHaveBeenCalled();
});

test('Check getPDFBytes returns null if no adapter succeeds', async () => {
    const formFiller = new PDFFormFiller({
        fieldMap: {},
        data: {},
        pdfTemplate: 'test-template'
    });

    // Mock FormMap
    const mockMapData = jest.spyOn(FormMap.prototype, 'mapData').mockReturnValue({});

    // Mock adapters
    const mockAdapter = {
        fillForm: jest.fn().mockResolvedValue(null)
    };
    const mockCreateAdapter = jest.spyOn(PDFFormAdapterFactory.Instance, 'createAdapter').mockReturnValue(mockAdapter);
    const mockGetAdapterIdsList = jest.spyOn(PDFFormAdapterFactory.Instance, 'getAdapterIdsList')
        .mockReturnValue(['adapter1']);

    const result = await (formFiller as any).getPDFBytes();
    expect(result).toBeNull();
    expect(mockAdapter.fillForm).toHaveBeenCalled();
});

test('Check save method downloads PDF with default filename', async () => {
    const mockPDFBytes = new Uint8Array([1, 2, 3, 4]);
    const formFiller = new PDFFormFiller({
        fieldMap: {},
        data: {},
        pdfTemplate: 'test-template'
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
        pdfTemplate: 'test-template'
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