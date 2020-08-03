import { IRect, ISize, DocController } from '../doc_controller';
import { IQuestion } from 'survey-core';
import { SurveyHelper } from '../helper_survey';

export interface IPdfBrick extends IRect, ISize {
    render(): Promise<void>;
    unfold(): IPdfBrick[];
    isAddPage(): boolean;
}
export class PdfBrick implements IPdfBrick {
    public xLeft: number;
    public xRight: number;
    public yTop: number;
    public yBot: number;
    public textColor: string = SurveyHelper.TEXT_COLOR;
    public formBorderColor: string = SurveyHelper.FORM_BORDER_COLOR;
    public constructor(protected question: IQuestion,
        protected controller: DocController, rect: IRect) {
        this.xLeft = rect.xLeft;
        this.xRight = rect.xRight;
        this.yTop = rect.yTop;
        this.yBot = rect.yBot;
    }
    public get width(): number {
        return this.xRight - this.xLeft;
    }
    public get height(): number {
        return this.yBot - this.yTop;
    }
    public async render(): Promise<void> {
        if (!!this.question && this.question.isReadOnly) {
            await this.renderReadOnly();
        }
        else await this.renderInteractive();
    }
    public async renderInteractive(): Promise<void> { }
    public async renderReadOnly(): Promise<void> {
        await this.renderInteractive();
    }
    public unfold(): IPdfBrick[] {
        return [this];
    }
    public isAddPage(): boolean {
        return true;
    }
}
