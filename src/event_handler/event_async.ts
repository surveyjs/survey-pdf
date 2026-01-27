import { EventBase } from 'survey-core';
export class EventAsync<Sender, Options> extends EventBase<Sender, Options> {
    private isProcessing: boolean = false;
    public unshift(func: (sender: Sender, options: Options) => any) {
        if (this.hasFunc(func)) return;
        if (this.callbacks == null) {
            this.callbacks = new Array<(sender: Sender, options: Options) => any>();
        }
        this.callbacks.unshift(func);
    }
    public async fire(sender: Sender, options: Options) {
        if (this.callbacks == null || this.isProcessing) return;
        this.isProcessing = true;
        for (var i = 0; i < this.callbacks.length; i++) {
            await this.callbacks[i](sender, options);
            this.isProcessing = false;
        }
    }
}