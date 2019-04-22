import { IQuestion, QuestionTextModel } from 'survey-core';
import { IRect, DocController } from '../doc_controller';
import { PdfBrick } from './pdf_brick';
import { SurveyHelper } from '../helper_survey';

export class TextFieldBrick extends PdfBrick {
    protected question: QuestionTextModel;
    protected isQuestion: boolean;
    protected isMultiline: boolean;
    constructor(question: IQuestion,
        protected controller: DocController, rect: IRect) {
        super(question, controller, rect);
        this.question = <QuestionTextModel>question;
        this.isQuestion = true;
        this.isMultiline = false;
    }
    render(): void {
        let inputField = this.question.inputType !== 'password' ?
            new (<any>this.controller.doc.AcroFormTextField)() :
            new (<any>this.controller.doc.AcroFormPasswordField)();
        inputField.Rect = SurveyHelper.createAcroformRect(this);
        if (this.isQuestion && this.question.inputType !== 'password') {
            inputField.value = this.question.value || this.question.defaultValue || '';
            inputField.defaultValue = SurveyHelper.getLocString(this.question.locPlaceHolder);
        }
        else inputField.value = '';
        inputField.multiline = this.isMultiline;
        inputField.readOnly = this.question.isReadOnly;
        inputField.fieldName = this.question.id;
        this.controller.doc.addField(inputField);
    }
}