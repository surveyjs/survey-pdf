import { IQuestion, QuestionCheckboxModel, ItemValue } from 'survey-core';
import { IRect, DocController } from '../doc_controller';
import { PdfBrick } from './pdf_brick';
import { SurveyHelper } from '../helper_survey';

export class CheckItemBrick extends PdfBrick {
    protected question: QuestionCheckboxModel;
    constructor(question: IQuestion, controller: DocController,
        rect: IRect, protected itemValue: ItemValue, protected index: number) {
        super(question, controller, rect);
        this.question = <QuestionCheckboxModel>question;
    }
    render(): void {
        let checkBox = new (<any>this.controller.doc.AcroFormCheckBox)();
        checkBox.fieldName = this.question.id + 'index' + this.index;
        checkBox.Rect = SurveyHelper.createAcroformRect(this);
        checkBox.readOnly = this.question.isReadOnly || !this.itemValue.isEnabled;
        checkBox.AS = this.question.isItemSelected(this.itemValue) ? '/On' : '/Off';
        this.controller.doc.addField(checkBox);
    }
}