import { IQuestion, ItemValue, QuestionCheckboxModel } from 'survey-core';
import { IRect, ISize, DocController, IPoint } from '../doc_controller';
import { IPdfBrick, PdfBrick } from './pdf_brick';
import { TextBrick } from './pdf_text';
import { SurveyHelper } from '../helper_survey';
import { SurveyPDF } from '../survey';

export interface ICheckItemBrickContext {
    question: IQuestion;
    readOnly: boolean;
    checked: boolean;
    item?: ItemValue;
    index?: number;
}
export class CheckItemBrick extends PdfBrick {
    private static readonly FONT_SIZE_SCALE: number = 0.7;
    private static readonly CHECKMARK_READONLY_SYMBOL: string = '3';
    private static readonly CHECKMARK_READONLY_FONT: string = 'zapfdingbats';
    public static readonly CHECKMARK_READONLY_FONT_SIZE_SCALE: number = 1.0 - Math.E / 10.0;
    protected question: QuestionCheckboxModel;
    public constructor(controller: DocController,
        rect: IRect, protected fieldName: string, protected context: ICheckItemBrickContext) {
        super(context.question, controller, rect);
        this.question = <QuestionCheckboxModel>this.context.question;
        this.textColor = this.formBorderColor;
    }
    protected getShouldRenderReadOnly(): boolean {
        return this.context.readOnly && SurveyHelper.getReadonlyRenderAs(
            this.question, this.controller) !== 'acroform' || this.controller.compress;
    }
    public async renderInteractive(): Promise<void> {
        const checkBox: any = new (<any>this.controller.doc.AcroFormCheckBox)();
        const formScale: number = SurveyHelper.formScale(this.controller, this);
        const options: any = {};
        options.maxFontSize = this.height * formScale * CheckItemBrick.FONT_SIZE_SCALE;
        options.caption = CheckItemBrick.CHECKMARK_READONLY_SYMBOL;
        options.textAlign = 'center';
        options.fieldName = this.fieldName;
        options.readOnly = this.context.readOnly;
        options.color = this.formBorderColor;
        options.value = this.context.checked ? 'On' : false;
        options.AS = this.context.checked ? '/On' : '/Off';
        options.context = this.context;

        options.Rect = SurveyHelper.createAcroformRect(
            SurveyHelper.scaleRect(this, formScale));
        this.controller.doc.addField(checkBox);
        (<SurveyPDF>this.question.survey)?.getUpdatedCheckItemAcroformOptions(options);

        checkBox.maxFontSize = options.maxFontSize;
        checkBox.caption = options.caption;
        checkBox.textAlign = options.textAlign;
        checkBox.fieldName = options.fieldName;
        checkBox.readOnly = options.readOnly;
        checkBox.color = options.color;
        checkBox.value = options.value;
        checkBox.AS = options.AS;
        checkBox.Rect = options.Rect;

        SurveyHelper.renderFlatBorders(this.controller, this);
    }
    public async renderReadOnly(): Promise<void> {
        SurveyHelper.renderFlatBorders(this.controller, this);
        if (this.context.checked) {
            const checkmarkPoint: IPoint = SurveyHelper.createPoint(this, true, true);
            const oldFontName: string = this.controller.fontName;
            this.controller.fontName = CheckItemBrick.CHECKMARK_READONLY_FONT;
            const oldFontSize: number = this.controller.fontSize;
            this.controller.fontSize = oldFontSize *
                CheckItemBrick.CHECKMARK_READONLY_FONT_SIZE_SCALE;
            const checkmarkSize: ISize = this.controller.measureText(
                CheckItemBrick.CHECKMARK_READONLY_SYMBOL);
            checkmarkPoint.xLeft += this.width / 2.0 - checkmarkSize.width / 2.0;
            checkmarkPoint.yTop += this.height / 2.0 - checkmarkSize.height / 2.0;
            const checkmarkFlat: IPdfBrick = await SurveyHelper.createTextFlat(
                checkmarkPoint, this.question, this.controller,
                CheckItemBrick.CHECKMARK_READONLY_SYMBOL, TextBrick);
            (<any>checkmarkFlat.unfold()[0]).textColor = this.textColor;
            this.controller.fontSize = oldFontSize;
            await checkmarkFlat.render();
            this.controller.fontName = oldFontName;
        }
    }
}