import { IQuestion, QuestionCheckboxModel, ItemValue } from 'survey-core';
import { IRect, DocController } from '../doc_controller';
import { PdfBrick } from './pdf_brick';
import { SurveyHelper } from '../helper_survey';
4
export class CheckItemBrick extends PdfBrick {
    protected question: QuestionCheckboxModel;
    constructor(question: IQuestion, controller: DocController,
        rect: IRect, protected fieldName: string,
        protected readonly: boolean, protected checked: boolean) {
        super(question, controller, rect);
        this.question = <QuestionCheckboxModel>question;
    }
    async render(): Promise<void> {
        let checkBox = new (<any>this.controller.doc.AcroFormCheckBox)();
        checkBox.fontSize = this.controller.fontSize * 0.5;
        checkBox.maxFontSize = this.controller.fontSize * 0.5;
        checkBox.caption = '1';
        checkBox.textAlign = 'center';
        checkBox.fieldName = this.fieldName;
        checkBox.Rect = SurveyHelper.createAcroformRect(this);
        checkBox.readOnly = this.readonly;
        checkBox.AS = this.checked ? '/On' : '/Off';
        this.controller.doc.addField(checkBox);
    }
}