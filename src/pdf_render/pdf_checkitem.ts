import { IRect, ISize, DocController, IPoint } from '../doc_controller';
import { IPdfBrick, IPdfBrickOptions, PdfBrick } from './pdf_brick';
import { IInputAppearanceOptions, SurveyHelper } from '../helper_survey';
export interface ICheckItemBrickOptions extends IPdfBrickOptions {
    checked: boolean;
    readOnly: boolean;
    fieldName: string;
    updateOptions: (options: any) => void;
}

export type ICheckItemBrickAppearanceOptions = IInputAppearanceOptions & {
     checkMark: string,
}

export class CheckItemBrick extends PdfBrick {
    private static readonly FONT_SIZE_SCALE: number = 0.7;
    public constructor(controller: DocController,
        rect: IRect, protected options: ICheckItemBrickOptions, protected appearance: ICheckItemBrickAppearanceOptions) {
        super(controller, rect);
    }
    public async renderInteractive(): Promise<void> {
        const checkBox: any = new (<any>this.controller.doc.AcroFormCheckBox)();
        const formScale = SurveyHelper.getRectBorderScale(this, this.appearance.borderWidth);
        const options: any = {};
        options.maxFontSize = this.height * formScale.scaleY * CheckItemBrick.FONT_SIZE_SCALE;
        options.caption = this.appearance.checkMark;
        options.textAlign = 'center';
        options.fieldName = this.options.fieldName;
        options.readOnly = this.options.readOnly;
        options.color = this.appearance.fontColor;
        options.value = this.options.checked ? 'On' : false;
        options.AS = this.options.checked ? '/On' : '/Off';

        options.Rect = SurveyHelper.createAcroformRect(
            SurveyHelper.scaleRect(this, formScale));
        this.controller.doc.addField(checkBox);
        this.options.updateOptions(options);

        checkBox.maxFontSize = options.maxFontSize;
        checkBox.caption = options.caption;
        checkBox.textAlign = options.textAlign;
        checkBox.fieldName = options.fieldName;
        checkBox.readOnly = options.readOnly;
        checkBox.color = options.color;
        checkBox.value = options.value;
        checkBox.AS = options.AS;
        checkBox.Rect = options.Rect;

        SurveyHelper.renderFlatBorders(this.controller, this, this.appearance);
    }
    public async renderReadOnly(): Promise<void> {
        SurveyHelper.renderFlatBorders(this.controller, this, this.appearance);
        if (this.options.checked) {
            const checkmarkPoint: IPoint = SurveyHelper.createPoint(this, true, true);
            const textOptions = {
                fontName: this.appearance.fontName,
                fontSize: this.appearance.fontSize,
                fontColor: this.appearance.fontColor
            };
            const checkmarkSize: ISize = this.controller.measureText(
                this.appearance.checkMark, textOptions);
            checkmarkPoint.xLeft += this.width / 2.0 - checkmarkSize.width / 2.0;
            checkmarkPoint.yTop += this.height / 2.0 - checkmarkSize.height / 2.0;
            const checkmarkFlat: IPdfBrick = await SurveyHelper.createTextFlat(
                checkmarkPoint, this.controller,
                this.appearance.checkMark, textOptions);
            await checkmarkFlat.render();
        }
    }
}