import { IQuestion, QuestionCheckboxModel } from 'survey-core';
import { IRect, DocController } from '../doc_controller';
import { PdfBrick } from './pdf_brick';
import { SurveyHelper } from '../helper_survey';
export class CheckItemBrick extends PdfBrick {
    private static readonly FONT_SIZE_SCALE: number = 0.7;
    protected question: QuestionCheckboxModel;
    public constructor(question: IQuestion, controller: DocController,
        rect: IRect, protected fieldName: string,
        protected readonly: boolean, protected checked: boolean) {
        super(question, controller, rect);
        this.question = <QuestionCheckboxModel>question;
    }
    public async render(): Promise<void> {
        this.controller.doc.setFillColor(255, 255, 255);
        let checkBox = new (<any>this.controller.doc.AcroFormCheckBox)();
        checkBox.fontSize = this.height * SurveyHelper.FORM_SCALE * CheckItemBrick.FONT_SIZE_SCALE;
        checkBox.maxFontSize = this.height * SurveyHelper.FORM_SCALE * CheckItemBrick.FONT_SIZE_SCALE;
        checkBox.caption = '3';
        checkBox.textAlign = 'center';
        checkBox.fieldName = this.fieldName;
        checkBox.readOnly = this.readonly;
        checkBox.AS = this.checked ? '/On' : '/Off';
        checkBox.Rect = SurveyHelper.createAcroformRect(SurveyHelper.scaleRect(this, SurveyHelper.FORM_SCALE));
        this.controller.doc.addField(checkBox);
        SurveyHelper.wrapInBordersFlat(this.controller, this);
    }
}