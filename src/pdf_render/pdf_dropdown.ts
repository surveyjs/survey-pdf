import { IQuestion, QuestionDropdownModel, ItemValue } from 'survey-core';
import { IRect, DocController } from '../doc_controller';
import { PdfBrick } from './pdf_brick';
import { SurveyHelper } from '../helper_survey';

export class DropdownBrick extends PdfBrick {
    protected question: QuestionDropdownModel;
    protected isQuestion: boolean;
    protected isMultiline: boolean;
    public constructor(question: IQuestion,
        protected controller: DocController, rect: IRect) {
        super(question, controller, rect);
        this.question = <QuestionDropdownModel>question;
    }
    public async renderInteractive(): Promise<void> {
        const comboBox = new (<any>this.controller.doc.AcroFormComboBox)();
        comboBox.fieldName = this.question.id;
        comboBox.Rect = SurveyHelper.createAcroformRect(
            SurveyHelper.scaleRect(this,
                SurveyHelper.formScale(this.controller, this)));
        comboBox.edit = false;
        comboBox.color = this.textColor;
        const options: string[] = [];
        if (this.question.showOptionsCaption) {
            options.push(this.getCorrectedText(this.question.optionsCaption));
        }
        this.question.visibleChoices.forEach((item: ItemValue) => {
            options.push(this.getCorrectedText(SurveyHelper.getLocString(item.locText)));
        });
        comboBox.setOptions(options);
        comboBox.fontName = this.controller.fontName;
        comboBox.fontSize = this.fontSize;
        comboBox.readOnly = this.question.isReadOnly;
        comboBox.isUnicode = SurveyHelper.isCustomFont(
            this.controller, comboBox.fontName);
        comboBox.V = this.getCorrectedText(SurveyHelper.getDropdownQuestionValue(this.question));
        this.controller.doc.addField(comboBox);
        SurveyHelper.renderFlatBorders(this.controller, this);
    }
}