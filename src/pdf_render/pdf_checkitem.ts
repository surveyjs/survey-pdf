import { IQuestion, QuestionCheckboxModel } from 'survey-core';
import { IRect, ISize, DocController, IPoint } from '../doc_controller';
import { IPdfBrick, PdfBrick } from './pdf_brick';
import { TextBrick } from './pdf_text';
import { SurveyHelper } from '../helper_survey';

export class CheckItemBrick extends PdfBrick {
    private static readonly FONT_SIZE_SCALE: number = 0.7;
    private static readonly CHECKMARK_READONLY_SYMBOL: string = 'X';
    private static readonly CHECKMARK_READONLY_FONT_SIZE_SCALE: number = 1.0 - Math.E / 10.0;
    protected question: QuestionCheckboxModel;
    public constructor(question: IQuestion, controller: DocController,
        rect: IRect, protected fieldName: string,
        protected readonly: boolean, protected checked: boolean) {
        super(question, controller, rect);
        this.question = <QuestionCheckboxModel>question;
        this.textColor = this.formBorderColor;
    }
    public async renderInteractive(): Promise<void> {
        if (this.readonly) {
            await this.renderReadOnly();
            return;
        }
        let checkBox = new (<any>this.controller.doc.AcroFormCheckBox)();
        let formScale = SurveyHelper.formScale(this.controller, this);
        checkBox.maxFontSize = this.height * formScale * CheckItemBrick.FONT_SIZE_SCALE;
        checkBox.caption = '3';
        checkBox.textAlign = 'center';
        checkBox.fieldName = this.fieldName;
        checkBox.readOnly = false;
        checkBox.color = this.formBorderColor;
        checkBox.AS = this.checked ? '/On' : '/Off';
        checkBox.Rect = SurveyHelper.createAcroformRect(
            SurveyHelper.scaleRect(this, formScale));
        this.controller.doc.addField(checkBox);
        SurveyHelper.renderFlatBorders(this.controller, this);
    }
    public async renderReadOnly(): Promise<void> {
        SurveyHelper.renderFlatBorders(this.controller, this);
        if (this.checked) {
            let checkmarkPoint: IPoint = SurveyHelper.createPoint(this, true, true);
            let oldFontSize = this.controller.fontSize;
            this.controller.fontSize = oldFontSize *
                CheckItemBrick.CHECKMARK_READONLY_FONT_SIZE_SCALE;
            let checkmarkSize: ISize = this.controller.measureText(
                CheckItemBrick.CHECKMARK_READONLY_SYMBOL);
            checkmarkPoint.xLeft += this.width / 2.0 - checkmarkSize.width / 2.0;
            checkmarkPoint.yTop += this.height / 2.0 - checkmarkSize.height / 2.0;
            let checkmarkFlat: IPdfBrick = await SurveyHelper.createTextFlat(
                checkmarkPoint, this.question, this.controller,
                CheckItemBrick.CHECKMARK_READONLY_SYMBOL, TextBrick);
            (<any>checkmarkFlat.unfold()[0]).textColor = this.textColor;
            this.controller.fontSize = oldFontSize;
            await checkmarkFlat.render();
        }
    }
}