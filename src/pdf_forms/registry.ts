export class PDFFormAdapterFactory {
    public static Instance: PDFFormAdapterFactory = new PDFFormAdapterFactory();
    private adapters: any = {};

    public registerAdapter(id: string, adapter: any): void {
        this.adapters[id] = adapter;
    }

    public getAdapterIdsList() {
        return Object.keys(this.adapters);
    }

    public createAdapter(id: string): any {
        const adapterClass = this.adapters[id];
        if (!adapterClass) {
            throw new Error(`Adapter with id "${id}" is not registered`);
        }
        return new adapterClass();
    }
}
