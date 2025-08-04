import { IQuestion } from 'survey-core';
import { IPoint, IRect, ISize, DocController } from '../doc_controller';
import { IPdfBrick, IPdfBrickOptions, PdfBrick } from './pdf_brick';
import { SurveyPDF } from '../survey';
import { IBorderAppearanceOptions, SurveyHelper } from '../helper_survey';
import { ITextAppearanceOptions } from './pdf_text';

export type IRadioItemBrickAppearanceOptions = ITextAppearanceOptions & IBorderAppearanceOptions & {
    checkMark: string,
}
export interface IRadioItemBrickOptions extends IPdfBrickOptions {
    checked: boolean;
    index: number;
    updateOptions: (options: any) => void;
}

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

export class RadioItemBrick extends PdfBrick {
    private static readonly RADIOMARKER_READONLY_SYMBOL: string = 'l';
    public constructor(controller: DocController,
        rect: IRect, private radioGroupWrap: RadioGroupWrap, protected options: IRadioItemBrickOptions, protected appearance: IRadioItemBrickAppearanceOptions) {
        super(controller, rect);
    }
    public async renderInteractive(): Promise<void> {
        if (this.options.index == 0) {
            this.radioGroupWrap.addToPdf(this.appearance.fontColor);
        }
        const options: any = {};
        options.fieldName = this.radioGroupWrap.name + 'index' + this.options.index;
        let formScale: number = SurveyHelper.formScale(this.controller, this);
        options.Rect = SurveyHelper.createAcroformRect(
            SurveyHelper.scaleRect(this, formScale));
        options.color = this.appearance.fontColor;
        options.appearance = this.controller.doc.AcroForm.Appearance.RadioButton.Circle;
        options.radioGroup = this.radioGroupWrap.radioGroup;

        this.options.updateOptions(options);
        let radioButton: any = this.radioGroupWrap.radioGroup.createOption(options.fieldName);

        if (this.options.checked) {
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

        SurveyHelper.renderFlatBorders(this.controller, this, this.appearance);
        this.radioGroupWrap.radioGroup.setAppearance(
            options.appearance
        );
    }
    public async renderReadOnly(): Promise<void> {
        SurveyHelper.renderFlatBorders(this.controller, this, this.appearance);
        if (this.options.checked) {
            const textOptions = {
                fontName: this.appearance.fontName,
                fontSize: this.appearance.fontSize,
                fontColor: this.appearance.fontColor
            };
            const radiomarkerPoint: IPoint = SurveyHelper.createPoint(this, true, true);
            const radiomarkerSize: ISize = this.controller.measureText(
                this.appearance.checkMark, textOptions);
            radiomarkerPoint.xLeft += this.width / 2.0 - radiomarkerSize.width / 2.0;
            radiomarkerPoint.yTop += this.height / 2.0 - radiomarkerSize.height / 2.0;
            let radiomarkerFlat: IPdfBrick = await SurveyHelper.createTextFlat(
                radiomarkerPoint, this.controller,
                RadioItemBrick.RADIOMARKER_READONLY_SYMBOL, textOptions);
            await radiomarkerFlat.render();
        }
    }
}