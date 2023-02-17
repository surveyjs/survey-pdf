import { IRect, ISize, DocController } from '../doc_controller';
import { IQuestion, Question } from 'survey-core';
import { SurveyHelper } from '../helper_survey';

export interface IPdfBrick extends IRect, ISize {
    render(): Promise<void>;
    unfold(): IPdfBrick[];
    isPageBreak: boolean;
}
/**
 * An object that describes a PDF brick&mdash;a simple element with specified content, size, and location. Bricks are fundamental elements used to construct a PDF document.
 * 
 * You can access `PdfBrick` objects within functions that handle the `SurveyPDF`'s [`onRenderQuestion`](https://surveyjs.io/pdf-generator/documentation/api-reference/surveypdf#onRenderQuestion), [`onRenderPanel`](https://surveyjs.io/pdf-generator/documentation/api-reference/surveypdf#onRenderPanel), and [`onRenderPage`](https://surveyjs.io/pdf-generator/documentation/api-reference/surveypdf#onRenderPage) events.
 * 
 * [View Demo](https://surveyjs.io/pdf-generator/examples/add-markup-to-customize-pdf-forms/ (linkStyle))
 */
export class PdfBrick implements IPdfBrick {
    /**
     * An X-coordinate for the left brick edge.
     */
    public xLeft: number;
    /**
     * An X-coordinate for the right brick edge.
     */
    public xRight: number;
    /**
     * A Y-coordinate for the top brick edge.
     */
    public yTop: number;
    /**
     * A Y-coordinate for the bottom brick edge.
     */
    public yBot: number;
    /**
     * Font size in points.
     * 
     * Default value: 14 (inherited from the parent PDF document)
     */
    public fontSize: number;
    public textColor: string = SurveyHelper.TEXT_COLOR;
    public formBorderColor: string = SurveyHelper.FORM_BORDER_COLOR;
    public isPageBreak: boolean = false;
    public constructor(protected question: IQuestion,
        protected controller: DocController, rect: IRect) {
        this.xLeft = rect.xLeft;
        this.xRight = rect.xRight;
        this.yTop = rect.yTop;
        this.yBot = rect.yBot;
        this.fontSize = !!controller ?
            controller.fontSize : DocController.FONT_SIZE;
    }
    /**
     * The brick's width in pixels.
     */
    public get width(): number {
        return this.xRight - this.xLeft;
    }
    /**
     * The brick's height in pixels.
     */
    public get height(): number {
        return this.yBot - this.yTop;
    }
    public async render(): Promise<void> {
        if (!!this.question && this.question.isReadOnly && SurveyHelper.getReadonlyRenderAs(
            <Question>this.question, this.controller) !== 'acroform') {
            await this.renderReadOnly();
        }
        else await this.renderInteractive();
    }
    public async renderInteractive(): Promise<void> { }
    public async renderReadOnly(): Promise<void> {
        await this.renderInteractive();
    }
    /**
     * Allows you to get a flat array of nested PDF bricks.
     * @returns A flat array of nested PDF bricks.
     */
    public unfold(): IPdfBrick[] {
        return [this];
    }
}
