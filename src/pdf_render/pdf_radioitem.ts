import { IQuestion, Question, QuestionRadiogroupModel, ItemValue } from 'survey-core';
import { IRect, DocController } from '../doc_controller';
import { PdfBrick } from './pdf_brick';
import { SurveyHelper } from '../helper_survey';

export class RadioGroupWrap {
    private _radioGroup: any;
    constructor(private question: IQuestion, private controller: DocController) {
    }
    addToPdf() {
        this._radioGroup = new this.controller.doc.AcroFormRadioButton();
        this._radioGroup.value = (<Question>this.question).id;
        this._radioGroup.readOnly = this.question.isReadOnly;
        this.controller.doc.addField(this._radioGroup);
    }
    get radioGroup() {
        return this._radioGroup;
    }
}
export class RadioItemBrick extends PdfBrick {
    protected question: QuestionRadiogroupModel;
    constructor(question: IQuestion, controller: DocController,
        rect: IRect, protected itemValue: ItemValue, protected index: number,
        private radioGroupWrap: RadioGroupWrap) {
        super(question, controller, rect);
        this.question = <QuestionRadiogroupModel>question;
    }
    render(): void {
        if (this.index == 0) {
            this.radioGroupWrap.addToPdf();
        }
        let name = this.question.id + 'index' + this.index;
        let radioButton = this.radioGroupWrap.radioGroup.createOption(name);
        radioButton.Rect = SurveyHelper.createAcroformRect(this);
        if (this.itemValue.value == this.question.value) {
            radioButton.AS = '/' + name;
        }
        this.radioGroupWrap.radioGroup.setAppearance(this.controller.doc.AcroForm.Appearance.RadioButton.Circle);
    }
}