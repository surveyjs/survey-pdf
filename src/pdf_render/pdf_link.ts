import { TextBrick } from './pdf_text';

export class LinkBrick extends TextBrick {
    static COLOR: string = '#0000EE';
    public constructor(textFlat: TextBrick, protected link: string) {
        super((<LinkBrick>textFlat).question,
            (<LinkBrick>textFlat).controller,
            textFlat, (<LinkBrick>textFlat).text);
    }
    public async render(): Promise<void> {
        let oldTextColor: string = this.controller.doc.getTextColor();
        this.controller.doc.setTextColor(LinkBrick.COLOR);
        let alignPoint = this.alignPoint(this);
        this.controller.doc.textWithLink(this.text, alignPoint.xLeft,
            alignPoint.yTop, {
                align: this.align.align,
                baseline: this.align.baseline,
                url: this.link
            });
        this.controller.doc.setTextColor(oldTextColor);
    }
}