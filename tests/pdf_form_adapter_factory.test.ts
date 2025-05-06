(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
    return {};
};

import { PDFFormAdapterFactory } from '../src/pdf_forms/registry';
import { IPDFFormAdapter } from '../src/pdf_forms/adapters/adapter';

class MockAdapter implements IPDFFormAdapter {
    public async fillForm(template: string, data: any): Promise<Uint8Array> {
        return new Uint8Array([1, 2, 3, 4]);
    }
}

test('Check registerAdapter adds adapter to registry', () => {
    const factory = new PDFFormAdapterFactory();
    const adapter = new MockAdapter();

    factory.registerAdapter('test-adapter', MockAdapter);
    const adapterIds = factory.getAdapterIdsList();

    expect(adapterIds).toContain('test-adapter');
});

test('Check getAdapterIdsList returns all registered adapter ids', () => {
    const factory = new PDFFormAdapterFactory();

    factory.registerAdapter('adapter1', MockAdapter);
    factory.registerAdapter('adapter2', MockAdapter);

    const adapterIds = factory.getAdapterIdsList();
    expect(adapterIds).toHaveLength(2);
    expect(adapterIds).toContain('adapter1');
    expect(adapterIds).toContain('adapter2');
});

test('Check createAdapter returns new instance of registered adapter', () => {
    const factory = new PDFFormAdapterFactory();
    factory.registerAdapter('test-adapter', MockAdapter);

    const adapter = factory.createAdapter('test-adapter');
    expect(adapter).toBeInstanceOf(MockAdapter);
});

test('Check createAdapter throws error for unregistered adapter', () => {
    const factory = new PDFFormAdapterFactory();

    expect(() => factory.createAdapter('non-existent')).toThrow('Adapter with id "non-existent" is not registered');
});