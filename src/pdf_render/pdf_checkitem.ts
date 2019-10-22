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
    public async renderInteractive(): Promise<void> {
        this.controller.doc.setFillColor(255, 255, 255);
        let checkBox = new (<any>this.controller.doc.AcroFormCheckBox)();
        let formScale = SurveyHelper.formScale(this.controller, this);
        checkBox.maxFontSize = this.height * formScale * CheckItemBrick.FONT_SIZE_SCALE;
        checkBox.caption = '3';
        checkBox.textAlign = 'center';
        checkBox.fieldName = this.fieldName;
        checkBox.readOnly = this.readonly;
        checkBox.color = SurveyHelper.FORM_BORDER_COLOR;
        checkBox.AS = this.checked ? '/On' : '/Off';
        checkBox.Rect = SurveyHelper.createAcroformRect(SurveyHelper.scaleRect(this, formScale));
        this.controller.doc.addField(checkBox);
        SurveyHelper.wrapFlatInBorders(this.controller, this);
    }
}