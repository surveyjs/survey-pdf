import { IRect, DocController } from '../doc_controller';
import { IPdfBrickOptions, PdfBrick } from './pdf_brick';
import { SurveyHelper } from '../helper_survey';
import { IInputStyle } from '../style/types';

export interface IDropdownBrickOptions extends IPdfBrickOptions {
    fieldName: string;
    isReadOnly: boolean;
    items: Array<string>;
    showOptionsCaption: boolean;
    optionsCaption: string;
    value: string;
}

export class DropdownBrick extends PdfBrick {
    public constructor(protected controller: DocController, rect: IRect, protected options: IDropdownBrickOptions, protected style: IInputStyle) {
        super(controller, rect);
    }
    public async renderInteractive(): Promise<void> {
        const { color: fontColor } = SurveyHelper.parseColor(this.style.fontColor);
        const { color: backgroundColor } = SurveyHelper.parseColor(this.style.backgroundColor);
        const comboBox = new this.controller.AcroFormComboBox();
        comboBox.backgroundColor = backgroundColor;
        comboBox.fieldName = this.options.fieldName;
        comboBox.Rect = SurveyHelper.createAcroformRect(
            SurveyHelper.scaleRect(this.contentRect,
                SurveyHelper.getRectBorderScale(this.contentRect, this.style.borderWidth ?? 0)));
        comboBox.edit = false;
        comboBox.color = fontColor;
        const options: string[] = [];
        if (this.options.showOptionsCaption) {
            options.push(this.getCorrectedText(this.options.optionsCaption));
        }
        this.options.items.forEach((item: string) => {
            options.push(this.getCorrectedText(item));
        });
        comboBox.setOptions(options);
        comboBox.fontName = this.style.fontName;
        comboBox.fontSize = this.style.fontSize;
        comboBox.readOnly = this.options.isReadOnly;
        comboBox.isUnicode = SurveyHelper.isCustomFont(
            this.controller, comboBox.fontName);
        comboBox.V = this.getCorrectedText(this.options.value);
        this.controller.doc.addField(comboBox);
        SurveyHelper.renderFlatBorders(this.controller, this.contentRect, this.style);
    }
}