import { IQuestion, QuestionRadiogroupModel, ItemValue } from 'survey-core';
import { IRect, DocController } from '../doc_controller';
import { PdfBrick } from './pdf_brick';
import { SurveyHelper } from '../helper_survey';

export class RadioItemBrick extends PdfBrick {
    protected question: QuestionRadiogroupModel;
    constructor(question: IQuestion, controller: DocController,
        rect: IRect, protected itemValue: ItemValue, protected index: number,
        private radioGroup: any, private isLast: boolean) {
        super(question, controller, rect);
        this.question = <QuestionRadiogroupModel>question;
    }
    render(): void {
        let name = this.question.id + 'index' + this.index;
        let radioButton = this.radioGroup.createOption(name);
        radioButton.Rect = SurveyHelper.createAcroformRect(this);
        if (this.itemValue.value == this.question.value) {
            radioButton.AS = '/' + name;
        }
        this.radioGroup.setAppearance(this.controller.doc.AcroForm.Appearance.RadioButton.Circle);
    }
}