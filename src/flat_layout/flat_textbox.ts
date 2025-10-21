import { settings } from 'survey-core';
import { IPoint, IRect } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { IInputAppearanceOptions, SurveyHelper } from '../helper_survey';
import { ITextFieldBrickAppearanceOptions, ITextFieldBrickOptions, TextFieldBrick } from '../pdf_render/pdf_textfield';

export class FlatTextbox extends FlatQuestion {
    public static readonly MULTILINE_TEXT_ROWS_COUNT: number = 1;
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        const appearance = SurveyHelper.getPatchedTextAppearanceOptions(this.controller, this.styles.input as IInputAppearanceOptions);
        const options: Omit<ITextFieldBrickOptions, 'isMultiline'> = {
            fieldName: this.question.id,
            inputType: this.question.inputType,
            value: this.question.inputValue,
            isReadOnly: this.question.isReadOnly,
            shouldRenderReadOnly: SurveyHelper.shouldRenderReadOnly(this.question, this.controller, this.question.isReadOnly),
            shouldRenderBorders: settings.readOnlyTextRenderMode === 'input',
            placeholder: SurveyHelper.getLocString(this.question.locPlaceHolder)
        };
        if (!this.shouldRenderAsComment) {
            const rect: IRect = SurveyHelper.createTextFieldRect(point, this.controller, 1, appearance.lineHeight);
            return [new TextFieldBrick(this.controller, rect, { ...options }, appearance)];
        }
        return [await SurveyHelper.createCommentFlat(point, this.question,
            this.controller, { rows: FlatTextbox.MULTILINE_TEXT_ROWS_COUNT, isMultiline: true, ...options }, appearance)];
    }
}

FlatRepository.getInstance().register('text', FlatTextbox);