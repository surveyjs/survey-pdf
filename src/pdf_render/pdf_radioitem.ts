import { IPoint, IRect, ISize, DocController } from '../doc_controller';
import { IPdfBrick, IPdfBrickOptions, PdfBrick } from './pdf_brick';
import { BorderRect, SurveyHelper } from '../helper_survey';
import { ISelectionInputStyle } from '../style/types';
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
        this._radioGroup = new this.controller.AcroFormRadioButton();
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
        rect: IRect, private radioGroupWrap: RadioGroupWrap, protected options: IRadioItemBrickOptions, protected style: ISelectionInputStyle) {
        super(controller, rect);
    }
    public async renderInteractive(): Promise<void> {
        const formScale = SurveyHelper.getRectBorderScale(this.contentRect, this.style.borderWidth ?? 0);
        const scaledAcroformRect = SurveyHelper.createAcroformRect(SurveyHelper.scaleRect(this.contentRect, formScale));
        const { color: fontColor } = SurveyHelper.parseColor(this.style.fontColor);
        if (this.options.index == 0) {
            this.radioGroupWrap.addToPdf(fontColor);
        }
        if(this.style.backgroundColor) {
            this.controller.setFillColor(this.style.backgroundColor);
            this.controller.doc.rect(...scaledAcroformRect, 'F');
            this.controller.restoreFillColor();

        }
        const options: any = {};
        options.fieldName = this.radioGroupWrap.fieldName + 'index' + this.options.index;
        options.Rect = scaledAcroformRect;
        options.color = fontColor;
        options.multiSelect = true;
        options.style = this.controller.doc.AcroForm.Appearance.RadioButton.Circle;
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

        SurveyHelper.renderFlatBorders(this.controller, this.contentRect, this.style);
        this.radioGroupWrap.radioGroup.setAppearance(
            options.style
        );
    }
    public async renderReadOnly(): Promise<void> {
        if(!!this.style.backgroundColor) {
            const { lines, point } = SurveyHelper.getRoundedShape(this.contentRect, { ...this.style, borderRect: BorderRect.All });
            this.controller.setFillColor(this.style.backgroundColor);
            this.controller.doc.lines(lines, point.xLeft, point.yTop, [1, 1], 'F');
            this.controller.restoreFillColor();
        }
        SurveyHelper.renderFlatBorders(this.controller, this.contentRect, this.style);
        if (this.options.checked) {
            const textOptions = {
                fontName: this.style.fontName,
                fontSize: this.style.fontSize,
                fontColor: this.style.fontColor,
                lineHeight: this.style.lineHeight
            };
            const radiomarkerPoint: IPoint = SurveyHelper.createPoint(this.contentRect, true, true);
            const radiomarkerSize: ISize = this.controller.measureText(
                this.style.checkMark, textOptions);
            radiomarkerPoint.xLeft += this.contentRect.width / 2.0 - radiomarkerSize.width / 2.0;
            radiomarkerPoint.yTop += this.contentRect.height / 2.0 - radiomarkerSize.height / 2.0;
            let radiomarkerFlat: IPdfBrick = await SurveyHelper.createTextFlat(
                radiomarkerPoint, this.controller,
                this.style.checkMark, textOptions);
            await radiomarkerFlat.render();
        }
    }
}