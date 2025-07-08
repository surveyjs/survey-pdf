import { IQuestion, QuestionTextModel, settings } from 'survey-core';
import { SurveyPDF } from '../survey';
import { IPoint, IRect, DocController } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { SurveyHelper } from '../helper_survey';
import { ITextFieldBrickOptions, TextFieldBrick } from '../pdf_render/pdf_textfield';

export class FlatTextbox extends FlatQuestion {
    public static readonly MULTILINE_TEXT_ROWS_COUNT: number = 1;
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        const options: Omit<ITextFieldBrickOptions, 'isMultiline'> = {
            fieldName: this.question.id,
            inputType: this.question.inputType,
            value: this.question.inputValue,
            isReadOnly: this.question.isReadOnly,
            shouldRenderBorders: settings.readOnlyTextRenderMode === 'input',
            placeholder: SurveyHelper.getLocString(this.question.locPlaceHolder)
        };
        if (!this.shouldRenderAsComment) {
            const rect: IRect = SurveyHelper.createTextFieldRect(point, this.controller);
            return [new TextFieldBrick(this.question, this.controller, rect, { ...options })];
        }
        return [await SurveyHelper.createCommentFlat(point, this.question,
            this.controller, { rows: FlatTextbox.MULTILINE_TEXT_ROWS_COUNT, isMultiline: true, ...options })];
    }
}

FlatRepository.getInstance().register('text', FlatTextbox);