import { IPoint, IRect, ISize, DocController } from '../doc_controller';
import { IPdfBrick, IPdfBrickOptions, PdfBrick } from './pdf_brick';
import { IInputAppearanceOptions, SurveyHelper } from '../helper_survey';

export type IRadioItemBrickAppearanceOptions = IInputAppearanceOptions & {
    checkMark: string,
}
export interface IRadioItemBrickOptions extends IPdfBrickOptions {
    checked: boolean;
    index: number;
    updateOptions?: (options: any) => void;
}

export interface IRadiogroupWrapContext {
    fieldName: string;
    readOnly: boolean;
    updateOptions: (options: any) => void;
}
export class RadioGroupWrap {
    private _radioGroup: any;
    public constructor(private controller: DocController, private options: IRadiogroupWrapContext) {
    }
    public addToPdf(color: string) {
        this._radioGroup = new this.controller.doc.AcroFormRadioButton();
        const options: any = {};
        options.fieldName = this.options.fieldName;
        options.readOnly = this.options.readOnly;
        options.color = color;
        this.options.updateOptions(options);
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
        return this.options.readOnly;
    }
    get fieldName(): string {
        return this.options.fieldName;
    }
}

export class RadioItemBrick extends PdfBrick {
    public constructor(controller: DocController,
        rect: IRect, private radioGroupWrap: RadioGroupWrap, protected options: IRadioItemBrickOptions, protected appearance: IRadioItemBrickAppearanceOptions) {
        super(controller, rect);
    }
    public async renderInteractive(): Promise<void> {
        if (this.options.index == 0) {
            this.radioGroupWrap.addToPdf(this.appearance.fontColor);
        }
        const options: any = {};
        options.fieldName = this.radioGroupWrap.fieldName + 'index' + this.options.index;
        let formScale = SurveyHelper.getRectBorderScale(this.contentRect, this.appearance.borderWidth);
        options.Rect = SurveyHelper.createAcroformRect(
            SurveyHelper.scaleRect(this.contentRect, formScale));
        options.color = this.appearance.fontColor;
        options.appearance = this.controller.doc.AcroForm.Appearance.RadioButton.Circle;
        options.radioGroup = this.radioGroupWrap.radioGroup;

        this.options.updateOptions && this.options.updateOptions(options);
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

        SurveyHelper.renderFlatBorders(this.controller, this.contentRect, this.appearance);
        this.radioGroupWrap.radioGroup.setAppearance(
            options.appearance
        );
    }
    public async renderReadOnly(): Promise<void> {
        SurveyHelper.renderFlatBorders(this.controller, this.contentRect, this.appearance);
        if (this.options.checked) {
            const textOptions = {
                fontName: this.appearance.fontName,
                fontSize: this.appearance.fontSize,
                fontColor: this.appearance.fontColor,
                lineHeight: this.appearance.lineHeight
            };
            const radiomarkerPoint: IPoint = SurveyHelper.createPoint(this.contentRect, true, true);
            const radiomarkerSize: ISize = this.controller.measureText(
                this.appearance.checkMark, textOptions);
            radiomarkerPoint.xLeft += this.contentRect.width / 2.0 - radiomarkerSize.width / 2.0;
            radiomarkerPoint.yTop += this.contentRect.height / 2.0 - radiomarkerSize.height / 2.0;
            let radiomarkerFlat: IPdfBrick = await SurveyHelper.createTextFlat(
                radiomarkerPoint, this.controller,
                this.appearance.checkMark, textOptions);
            await radiomarkerFlat.render();
        }
    }
}