import {DocController} from "./doc_controller";
import {IQuestion, Question} from 'survey-core';

export class RadioGroupWrap {
    private __radioGroup: any;

    constructor(question: IQuestion, protected controller: DocController) {
        this.__radioGroup = new controller.doc.AcroFormRadioButton();
        this.__radioGroup.value = (<Question>question).id;
        this.__radioGroup.readOnly = question.isReadOnly;
    }

    addToPdf() {
        this.controller.doc.addField(this.__radioGroup);
    }

    get radioGroup() {
        return this.__radioGroup;
    }


}
