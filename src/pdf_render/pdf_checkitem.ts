import { IQuestion, QuestionCheckboxModel } from 'survey-core';
import { IRect, DocController } from '../doc_controller';
import { PdfBrick } from './pdf_brick';
import { SurveyHelper } from '../helper_survey';
export class CheckItemBrick extends PdfBrick {
    private static readonly FONT_SIZE_SCALE: number = 0.8;
    protected question: QuestionCheckboxModel;
    public constructor(question: IQuestion, controller: DocController,
        rect: IRect, protected fieldName: string,
        protected readonly: boolean, protected checked: boolean) {
        super(question, controller, rect);
        this.question = <QuestionCheckboxModel>question;
    }
    public async render(): Promise<void> {
        this.controller.doc.setFillColor(255, 255, 255);
        let checkBox = new (<any>this.controller.doc.AcroFormCheckBox)();
        checkBox.fontSize = this.height * SurveyHelper.BORDER_SCALE * CheckItemBrick.FONT_SIZE_SCALE;
        checkBox.maxFontSize = this.height * SurveyHelper.BORDER_SCALE * CheckItemBrick.FONT_SIZE_SCALE;
        checkBox.caption = '3';
        checkBox.textAlign = 'center';
        checkBox.fieldName = this.fieldName;
        checkBox.Rect = SurveyHelper.createAcroformRect(SurveyHelper.scaleRect(this, SurveyHelper.BORDER_SCALE));
        checkBox.readOnly = this.readonly;
        checkBox.AS = this.checked ? '/On' : '/Off';
        let blackWidth: number = SurveyHelper.BLACK_BORDER_SCALE * this.width * (1.0 - SurveyHelper.BORDER_SCALE) / 2;
        let blackScale: number = SurveyHelper.BORDER_SCALE + blackWidth / this.width;
        let whiteWidth: number = SurveyHelper.WHITE_BORDER_SCALE * this.width * (1.0 - SurveyHelper.BORDER_SCALE) / 2;
        let whiteScale: number = 1 - whiteWidth / this.width;
        let whiteRadius: number = SurveyHelper.RADIUS_SCALE * whiteWidth;
        this.controller.doc.addField(checkBox);
        this.controller.doc.setDrawColor('black');
        this.controller.doc.setLineWidth(blackWidth);
        this.controller.doc.rect(...SurveyHelper.createAcroformRect(SurveyHelper.scaleRect(this, blackScale)));
        this.controller.doc.setDrawColor('white');
        this.controller.doc.setLineWidth(whiteWidth);
        this.controller.doc.roundedRect(...SurveyHelper.createAcroformRect(SurveyHelper.scaleRect(this, whiteScale)), whiteRadius, whiteRadius);
    }
}