import { IQuestion, Question, QuestionRadiogroupModel, ItemValue } from 'survey-core';
import { IRect, DocController } from '../doc_controller';
import { PdfBrick } from './pdf_brick';
import { SurveyHelper } from '../helper_survey';

export class RadioGroupWrap {
    private _radioGroup: any;
    constructor(private name: string, private controller: DocController, private readOnly: boolean = false) {
    }
    addToPdf() {
        this._radioGroup = new this.controller.doc.AcroFormRadioButton();
        this._radioGroup.value = this.name;
        this._radioGroup.readOnly = this.readOnly;
        this.controller.doc.addField(this._radioGroup);
    }
    get radioGroup() {
        return this._radioGroup;
    }
}

export class RadioItemBrick extends PdfBrick {
    constructor(question: IQuestion, controller: DocController,
        rect: IRect, private name: string, private сhecked: Boolean,
        private radioGroupWrap: RadioGroupWrap, private isFirst: boolean = false) {
        super(question, controller, rect);
    }
    render(): void {
        if (this.isFirst) {
            this.radioGroupWrap.addToPdf();
        }
        let name = this.radioGroupWrap.radioGroup.value + 'value' + this.name;
        let radioButton = this.radioGroupWrap.radioGroup.createOption(name);
        radioButton.Rect = SurveyHelper.createAcroformRect(this);
        if (this.сhecked) {
            radioButton.AS = '/' + name;
        }
        this.radioGroupWrap.radioGroup.setAppearance(this.controller.doc.AcroForm.Appearance.RadioButton.Circle);
    }
}