import { IQuestion, ItemValue, Question } from 'survey-core';
import { IPoint, IRect, ISize, DocController } from '../doc_controller';
import { IPdfBrick, PdfBrick } from './pdf_brick';
import { TextBrick } from './pdf_text';
import { SurveyPDF } from '../survey';
import { SurveyHelper } from '../helper_survey';

export interface IRadiogroupWrapContext {
    question: IQuestion;
    readOnly: boolean;
}
export class RadioGroupWrap {
    private _radioGroup: any;
    public constructor(public name: string,
        private controller: DocController,
        private context: IRadiogroupWrapContext) {
    }
    public addToPdf(color: string) {
        this._radioGroup = new this.controller.doc.AcroFormRadioButton();
        const options: any = {};
        options.fieldName = this.name;
        options.readOnly = this.readOnly;
        options.color = color;
        options.context = this.context;
        (<SurveyPDF>this.context.question.survey)?.getUpdatedRadioGroupWrapOptions(options);
        this._radioGroup.fieldName = options.fieldName;
        this._radioGroup.readOnly = options.readOnly;
        this._radioGroup.color = options.color;

        this._radioGroup.value = '';
        this.controller.doc.addField(this._radioGroup);
    }
    get radioGroup(): any {
        return this._radioGroup;
    }
    get readOnly(): boolean {
        return this.context.readOnly;
    }
}

export interface IRadioGroupItemBrickContext {
    question: IQuestion;
    checked: boolean;
    index: number;
    item: ItemValue;
}

export class RadioItemBrick extends PdfBrick {
    private static readonly RADIOMARKER_READONLY_SYMBOL: string = '•';
    private static readonly RADIOMARKER_READONLY_FONT_SIZE_SCALE: number = 1.575;
    public constructor(controller: DocController,
        rect: IRect, private context: IRadioGroupItemBrickContext,
        private radioGroupWrap: RadioGroupWrap) {
        super(context.question, controller, rect);
        this.textColor = this.formBorderColor;
    }
    protected getShouldRenderReadOnly(): boolean {
        return this.radioGroupWrap.readOnly && SurveyHelper.getReadonlyRenderAs(
            <Question>this.question, this.controller) !== 'acroform' || this.controller.compress;
    }
    public async renderInteractive(): Promise<void> {
        if (this.context.index == 0) {
            this.radioGroupWrap.addToPdf(this.formBorderColor);
        }
        const options: any = {};
        options.fieldName = this.radioGroupWrap.name + 'index' + this.context.index;
        let formScale: number = SurveyHelper.formScale(this.controller, this);
        options.Rect = SurveyHelper.createAcroformRect(
            SurveyHelper.scaleRect(this, formScale));
        options.color = this.formBorderColor;
        options.appearance = this.controller.doc.AcroForm.Appearance.RadioButton.Circle;
        options.radioGroup = this.radioGroupWrap.radioGroup;
        options.context = this.context;

        (<SurveyPDF>this.context.question.survey)?.getUpdatedRadioItemAcroformOptions(options);
        let radioButton: any = this.radioGroupWrap.radioGroup.createOption(options.fieldName);

        if (this.context.checked) {
            if(!options.AS) {
                radioButton.AS = '/' + options.fieldName;
            }
            if(!this.radioGroupWrap.radioGroup.value) {
                this.radioGroupWrap.radioGroup.value = options.fieldName;
            }
        }
        else {
            if(!options.AS) {
                options.AS = '/Off';
            }
        }
        radioButton.Rect = options.Rect;
        radioButton.color = options.color;

        SurveyHelper.renderFlatBorders(this.controller, this);
        this.radioGroupWrap.radioGroup.setAppearance(
            options.appearance
        );
    }
    public async renderReadOnly(): Promise<void> {
        SurveyHelper.renderFlatBorders(this.controller, this);
        if (this.context.checked) {
            let radiomarkerPoint: IPoint = SurveyHelper.createPoint(this, true, true);
            let oldFontSize: number = this.controller.fontSize;
            this.controller.fontSize = oldFontSize *
                RadioItemBrick.RADIOMARKER_READONLY_FONT_SIZE_SCALE;
            let radiomarkerSize: ISize = this.controller.measureText(
                RadioItemBrick.RADIOMARKER_READONLY_SYMBOL);
            radiomarkerPoint.xLeft += this.width / 2.0 - radiomarkerSize.width / 2.0;
            radiomarkerPoint.yTop += this.height / 2.0 - radiomarkerSize.height / 1.925;
            let radiomarkerFlat: IPdfBrick = await SurveyHelper.createTextFlat(
                radiomarkerPoint, this.question, this.controller,
                RadioItemBrick.RADIOMARKER_READONLY_SYMBOL, TextBrick);
            (<any>radiomarkerFlat.unfold()[0]).textColor = this.textColor;
            this.controller.fontSize = oldFontSize;
            await radiomarkerFlat.render();
        }
    }
}