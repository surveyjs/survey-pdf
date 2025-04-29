export class FormAdaptersFactory {
    public static Instance: FormAdaptersFactory = new FormAdaptersFactory();
    private adapters: any = {};

    public registerAdapter(id: string, adapter: any): void {
        this.adapters[id] = adapter;
    }

    public createAdapter(id: string): any {
        const adapterClass = this.adapters[id];
        if (!adapterClass) {
            throw new Error(`Adapter with id "${id}" is not registered`);
        }
        return new adapterClass();
    }
}
