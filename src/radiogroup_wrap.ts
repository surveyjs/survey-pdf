import { DocController } from './doc_controller';
import { IQuestion, Question } from 'survey-core';

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
