import { IQuestion, QuestionMultipleTextModel, MultipleTextItemModel, SurveyElement } from 'survey-core';
import { IRect, DocController } from '../doc_controller';
import { TextFieldBrick } from './pdf_textfield';
import { SurveyHelper } from '../helper_survey';

export class MultipleTextBoxBrick extends TextFieldBrick {
    public constructor(question: IQuestion, controller: DocController, rect: IRect,
        row_index: number, col_index: number, item: MultipleTextItemModel) {
        super(question, controller, rect, true,
            (<QuestionMultipleTextModel>question).name + 'row' + row_index + 'col' + col_index,
            item.value || '', SurveyHelper.getLocString(item.locPlaceHolder),
            question.isReadOnly, false, 'text');
    }
}