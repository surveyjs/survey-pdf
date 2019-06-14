import { IRect, DocController } from './doc_controller';
import { IPdfBrick } from './pdf_render/pdf_brick';
import { TextBrick } from './pdf_render/pdf_text';
import { SurveyHelper } from './helper_survey';

export class DrawCanvas {
    public constructor(protected packs: IPdfBrick[],
        protected controller: DocController,
        protected rect: IRect) {}
    public get absoluteRect(): IRect {
        return SurveyHelper.clone(this.rect);
    }
    public get relativeRect(): IRect {
        return {
            xLeft: 0.0,
            xRight: this.rect.xRight - this.rect.xLeft,
            yTop: 0.0,
            yBot: this.rect.yBot - this.rect.yTop
        }
    }
    public drawText(options: any): void {
        this.packs.push(new TextBrick(null, this.controller,
            this.rect, 'Hello'));
    }
    public drawImage(options: any): void {

    }
}