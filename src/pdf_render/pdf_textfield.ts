import { IQuestion, QuestionTextModel } from 'survey-core';
import { IRect, DocController } from '../doc_controller';
import { PdfBrick } from './pdf_brick';
import { SurveyHelper } from '../helper_survey';

export class TextFieldBrick extends PdfBrick {
    protected question: QuestionTextModel;
    public constructor(question: IQuestion, controller: DocController, rect: IRect,
        protected isQuestion: boolean, protected fieldName: string,
        protected value: string, protected placeholder: string,
        protected isReadOnly: boolean, protected isMultiline: boolean,
        protected isPassword: boolean) {
        super(question, controller, rect);
        this.question = <QuestionTextModel>question;
    }
    public async render(): Promise<void> {
        let inputField = this.isPassword ?
            new (<any>this.controller.doc.AcroFormPasswordField)() :
            new (<any>this.controller.doc.AcroFormTextField)();
        inputField.fieldName = this.fieldName;
        if (!this.isPassword) {
            inputField.value = this.value;
            inputField.defaultValue = this.placeholder;
        }
        else inputField.value = '';
        inputField.multiline = this.isMultiline;
        inputField.readOnly = this.isReadOnly;
        let formScale = SurveyHelper.formScale(this.controller, this);
        inputField.maxFontSize = this.controller.fontSize * formScale;
        inputField.Rect = SurveyHelper.createAcroformRect(SurveyHelper.scaleRect(this, formScale));
        this.controller.doc.addField(inputField);
        SurveyHelper.wrapInBordersFlat(this.controller, this);
    }
}