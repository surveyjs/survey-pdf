import { IQuestion } from 'survey-core';
import { IPoint, IRect, ISize, DocController } from '../doc_controller';
import { IPdfBrick, PdfBrick } from './pdf_brick';
import { TextBrick } from './pdf_text';
import { SurveyHelper } from '../helper_survey';

export class RadioGroupWrap {
    private _radioGroup: any;
    public constructor(private name: string,
        private controller: DocController,
        private _readOnly: boolean = false) {
    }
    public addToPdf() {
        this._radioGroup = new this.controller.doc.AcroFormRadioButton();
        this._radioGroup.value = this.name;
        this._radioGroup.readOnly = this.readOnly;
        this._radioGroup.color = SurveyHelper.FORM_BORDER_COLOR;
        this.controller.doc.addField(this._radioGroup);
    }
    get radioGroup(): any {
        return this._radioGroup;
    }
    get readOnly(): boolean {
        return this._readOnly;
    }
}

export class RadioItemBrick extends PdfBrick {
    private static readonly RADIOMARKER_READONLY_SYMBOL: string = '•';
    private static readonly RADIOMARKER_READONLY_FONT_SIZE_SCALE: number = 1.575;
    public constructor(question: IQuestion, controller: DocController,
        rect: IRect, private index: number, private checked: Boolean,
        private radioGroupWrap: RadioGroupWrap) {
        super(question, controller, rect);
    }
    public async renderInteractive(): Promise<void> {
        if (this.radioGroupWrap.readOnly) {
            await this.renderReadOnly();
            return;
        }
        if (this.index == 0) {
            this.radioGroupWrap.addToPdf();
        }
        let name = this.radioGroupWrap.radioGroup.value + 'index' + this.index;
        let radioButton = this.radioGroupWrap.radioGroup.createOption(name);
        radioButton.Rect = SurveyHelper.createAcroformRect(this);
        if (this.checked) {
            radioButton.AS = '/' + name;
        }
        let formScale = SurveyHelper.formScale(this.controller, this);
        radioButton.Rect = SurveyHelper.createAcroformRect(
            SurveyHelper.scaleRect(this, formScale));
        radioButton.color = SurveyHelper.FORM_BORDER_COLOR;
        SurveyHelper.renderFlatBorders(this.controller, this);
        this.radioGroupWrap.radioGroup.setAppearance(
            this.controller.doc.AcroForm.Appearance.RadioButton.Circle);
    }
    public async renderReadOnly(): Promise<void> {
        SurveyHelper.renderFlatBorders(this.controller, this);
        if (this.checked) {
            let radiomarkerPoint: IPoint = SurveyHelper.createPoint(this, true, true);
            let oldFontSize = this.controller.fontSize;
            this.controller.fontSize = oldFontSize *
                RadioItemBrick.RADIOMARKER_READONLY_FONT_SIZE_SCALE;
            let radiomarkerSize: ISize = this.controller.measureText(
                RadioItemBrick.RADIOMARKER_READONLY_SYMBOL);
            radiomarkerPoint.xLeft += this.width / 2.0 - radiomarkerSize.width / 2.0;
            radiomarkerPoint.yTop += this.height / 2.0 - radiomarkerSize.height / 1.9;
            let radiomarkerFlat: IPdfBrick = await SurveyHelper.createTextFlat(
                radiomarkerPoint, this.question, this.controller,
                RadioItemBrick.RADIOMARKER_READONLY_SYMBOL, TextBrick);
            (<any>radiomarkerFlat.unfold()[0]).textColor = SurveyHelper.FORM_BORDER_COLOR;
            this.controller.fontSize = oldFontSize;
            await radiomarkerFlat.render();
        }
    }
}