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
        rect: IRect, private itemValue: string, private сhecked: boolean, private readOnly: boolean,
        private radioGroupWrap: RadioGroupWrap, private isFirst: boolean = false) {
        super(question, controller, rect);
        this.question = <QuestionRadiogroupModel>question;
    }
    render(): void {
        if (this.isFirst) {
            this.radioGroupWrap.addToPdf();
        }
        let name = this.question.id + 'value' + this.itemValue;
        let radioButton = this.radioGroupWrap.radioGroup.createOption(name);
        radioButton.Rect = SurveyHelper.createAcroformRect(this);
        radioButton.readOnly = this.readOnly;
        if (this.сhecked) {
            radioButton.AS = '/' + name;
        }
        this.radioGroupWrap.radioGroup.setAppearance(this.controller.doc.AcroForm.Appearance.RadioButton.Circle);
    }
}