import { IQuestion, QuestionDropdownModel, ItemValue } from 'survey-core';
import { IPoint, IRect, DocController } from '../doc_controller';
import { PdfBrick, IPdfBrick } from './pdf_brick';
import { TextBrick } from './pdf_text';
import { CompositeBrick } from './pdf_composite';
import { SurveyHelper } from '../helper_survey';

export class DropdownBrick extends PdfBrick {
    private static readonly VALUE_READONLY_VERT_SCALE: number = 0.63;
    private static readonly VALUE_READONLY_HOR_SCALE: number = 0.3;
    protected question: QuestionDropdownModel;
    protected isQuestion: boolean;
    protected isMultiline: boolean;
    public constructor(question: IQuestion,
        protected controller: DocController, rect: IRect) {
        super(question, controller, rect);
        this.question = <QuestionDropdownModel>question;
    }
    private getValue(): string {
        if (!!this.question.displayValue) {
            return this.question.displayValue;
        }
        else if (this.question.showOptionsCaption) {
            return this.question.optionsCaption;
        }
        return '';
    }
    public async renderInteractive(): Promise<void> {
        let comboBox = new (<any>this.controller.doc.AcroFormComboBox)();
        comboBox.fieldName = this.question.id;
        comboBox.Rect = SurveyHelper.createAcroformRect(
            SurveyHelper.scaleRect(this,
            SurveyHelper.formScale(this.controller, this)));
        comboBox.edit = false;
        comboBox.color = SurveyHelper.TEXT_COLOR;
        let options: string[] = [];
        if (this.question.showOptionsCaption) {
            options.push(this.question.optionsCaption);
        }
        this.question.visibleChoices.forEach((item: ItemValue) => {
            options.push(SurveyHelper.getLocString(item.locText));
        });
        comboBox.setOptions(options);
        comboBox.fontName = this.controller.fontName;
        comboBox.readOnly = this.question.isReadOnly;
        comboBox.isUnicode = SurveyHelper.isCustomFont(
            this.controller, comboBox.fontName);
        comboBox.V = this.getValue();
        this.controller.doc.addField(comboBox);
        SurveyHelper.wrapFlatInBorders(this.controller, this);
    }
    public async renderReadOnly(): Promise<void> {
        SurveyHelper.wrapFlatInBorders(this.controller, this);
        let oldFontSize = this.controller.fontSize;
        this.controller.fontSize = oldFontSize *
            DropdownBrick.VALUE_READONLY_VERT_SCALE;
        let point: IPoint = SurveyHelper.createPoint(this, true, true);
        point.yTop += this.height *
            (1.0 - DropdownBrick.VALUE_READONLY_VERT_SCALE) / 2.0;
        let horIndent: number = this.controller.unitWidth *
            DropdownBrick.VALUE_READONLY_HOR_SCALE;
        this.controller.pushMargins(this.xLeft + horIndent,
            this.controller.margins.right + horIndent);
        point.xLeft += horIndent;
        let composite: CompositeBrick = SurveyHelper.createPlainTextFlat(
            point, this.question, this.controller, this.getValue(), TextBrick);
        let firstLine: IPdfBrick = composite.unfold()[0];
        await firstLine.render();
        this.controller.popMargins();
        this.controller.fontSize = oldFontSize;
    }
}