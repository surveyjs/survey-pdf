import { settings } from 'survey-core';
import { IPoint } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { SurveyHelper } from '../helper_survey';
import { ITextFieldBrickOptions } from '../pdf_render/pdf_textfield';

export class FlatTextbox extends FlatQuestion {
    public static readonly MULTILINE_TEXT_ROWS_COUNT: number = 1;
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        const shouldRenderReadOnly = SurveyHelper.shouldRenderReadOnly(this.question, this.controller, this.question.isReadOnly);
        const appearance = SurveyHelper.getPatchedTextAppearanceOptions(this.controller, SurveyHelper.mergeObjects({}, this.styles.input, shouldRenderReadOnly ? this.styles.inputReadOnly : undefined));
        const options: Omit<ITextFieldBrickOptions, 'isMultiline'> = {
            fieldName: this.question.id,
            inputType: this.question.inputType,
            value: this.question.inputValue,
            isReadOnly: this.question.isReadOnly,
            shouldRenderReadOnly: shouldRenderReadOnly,
            shouldRenderBorders: settings.readOnlyTextRenderMode === 'input',
            placeholder: SurveyHelper.getLocString(this.question.locPlaceHolder)
        };
        return [await SurveyHelper.createCommentFlat(point,
            this.controller, { shouldRenderReadOnly, rows: FlatTextbox.MULTILINE_TEXT_ROWS_COUNT, ...options }, appearance)];
    }
}

FlatRepository.getInstance().register('text', FlatTextbox);