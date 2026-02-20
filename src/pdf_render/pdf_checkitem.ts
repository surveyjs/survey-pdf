import { IRect, ISize, DocController, IPoint } from '../doc_controller';
import { IPdfBrick, IPdfBrickOptions, PdfBrick } from './pdf_brick';
import { BorderRect, SurveyHelper } from '../helper_survey';
import { ISelectionInputStyle } from '../style/types';
export interface ICheckItemBrickOptions extends IPdfBrickOptions {
    checked: boolean;
    readOnly: boolean;
    fieldName: string;
    updateOptions: (options: any) => void;
}

export class CheckItemBrick extends PdfBrick {
    private static readonly FONT_SIZE_SCALE: number = 0.7;
    public constructor(controller: DocController,
        rect: IRect, protected options: ICheckItemBrickOptions, protected style: ISelectionInputStyle) {
        super(controller, rect);
    }
    public async renderInteractive(): Promise<void> {
        const checkBox: any = new this.controller.AcroFormCheckBox();
        const formScale = SurveyHelper.getRectBorderScale(this.contentRect, this.style.borderWidth ?? 0);
        const scaledAcroformRect = SurveyHelper.createAcroformRect(SurveyHelper.scaleRect(this.contentRect, formScale));
        const { color: fontColor } = SurveyHelper.parseColor(this.style.fontColor);
        if(this.style.backgroundColor) {
            this.controller.setFillColor(this.style.backgroundColor);
            this.controller.doc.rect(...scaledAcroformRect, 'F');
            this.controller.restoreFillColor();
        }
        const options: any = {};
        options.maxFontSize = this.contentRect.height * formScale.scaleY * CheckItemBrick.FONT_SIZE_SCALE;
        options.caption = this.style.checkMark;
        options.textAlign = 'center';
        options.fieldName = this.options.fieldName;
        options.readOnly = this.options.readOnly;
        options.color = fontColor;
        options.value = this.options.checked ? 'On' : false;
        options.AS = this.options.checked ? '/On' : '/Off';
        options.Rect = scaledAcroformRect;
        this.controller.doc.addField(checkBox);
        this.options.updateOptions(options);
        checkBox.maxFontSize = options.maxFontSize;
        checkBox.caption = options.caption;
        checkBox.textAlign = options.textAlign;
        checkBox.fieldName = options.fieldName;
        checkBox.readOnly = options.readOnly;
        checkBox.color = options.color;
        checkBox.fillColor = [0, 0, 0];
        checkBox.value = options.value;
        checkBox.AS = options.AS;
        checkBox.Rect = options.Rect;

        SurveyHelper.renderFlatBorders(this.controller, this.contentRect, this.style);
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
            const checkmarkPoint: IPoint = SurveyHelper.createPoint(this.contentRect, true, true);
            const textOptions = {
                fontName: this.style.fontName,
                fontSize: this.style.fontSize,
                fontColor: this.style.fontColor
            };
            const checkmarkSize: ISize = this.controller.measureText(
                this.style.checkMark, textOptions);
            checkmarkPoint.xLeft += this.contentRect.width / 2.0 - checkmarkSize.width / 2.0;
            checkmarkPoint.yTop += this.contentRect.height / 2.0 - checkmarkSize.height / 2.0;
            const checkmarkFlat: IPdfBrick = await SurveyHelper.createTextFlat(
                checkmarkPoint, this.controller,
                this.style.checkMark, textOptions);
            await checkmarkFlat.render();
        }
    }
}