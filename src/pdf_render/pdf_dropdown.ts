import { IRect, DocController } from '../doc_controller';
import { IPdfBrickOptions, PdfBrick } from './pdf_brick';
import { IInputAppearanceOptions, SurveyHelper } from '../helper_survey';

export interface IDropdownBrickOptions extends IPdfBrickOptions {
    fieldName: string;
    isReadOnly: boolean;
    items: Array<string>;
    showOptionsCaption: boolean;
    optionsCaption: string;
    value: string;
}

export class DropdownBrick extends PdfBrick {
    public constructor(protected controller: DocController, rect: IRect, protected options: IDropdownBrickOptions, protected appearance: IInputAppearanceOptions) {
        super(controller, rect);
    }
    public async renderInteractive(): Promise<void> {
        const comboBox = new (<any>this.controller.doc.AcroFormComboBox)();
        comboBox.fieldName = this.options.fieldName;
        comboBox.Rect = SurveyHelper.createAcroformRect(
            SurveyHelper.scaleRect(this.contentRect,
                SurveyHelper.getRectBorderScale(this.contentRect, this.appearance.borderWidth)));
        comboBox.edit = false;
        comboBox.color = this.appearance.fontColor;
        const options: string[] = [];
        if (this.options.showOptionsCaption) {
            options.push(this.getCorrectedText(this.options.optionsCaption));
        }
        this.options.items.forEach((item: string) => {
            options.push(this.getCorrectedText(item));
        });
        comboBox.setOptions(options);
        comboBox.fontName = this.appearance.fontName;
        comboBox.fontSize = this.appearance.fontSize;
        comboBox.readOnly = this.options.isReadOnly;
        comboBox.isUnicode = SurveyHelper.isCustomFont(
            this.controller, comboBox.fontName);
        comboBox.V = this.getCorrectedText(this.options.value);
        this.controller.doc.addField(comboBox);
        SurveyHelper.renderFlatBorders(this.controller, this.contentRect, this.appearance);
    }
}