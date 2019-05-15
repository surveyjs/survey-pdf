import { IQuestion, QuestionTextModel } from 'survey-core';
import { IRect, DocController } from '../doc_controller';
import { TextFieldBrick } from './pdf_textfield';
import { SurveyHelper } from '../helper_survey';

export class TextBoxBrick extends TextFieldBrick {
    constructor(question: IQuestion, controller: DocController, rect: IRect,
        protected isQuestion: boolean = true, protected isMultiline: boolean = false) {
        super(question, controller, rect, isQuestion, 
            (<QuestionTextModel>question).id + (isQuestion ? '' : '_comment'),
            question.value || (<QuestionTextModel>question).defaultValue || '',
            isQuestion ? SurveyHelper.getLocString((<QuestionTextModel>question).locPlaceHolder) : '',
            question.isReadOnly, isMultiline,
            (<QuestionTextModel>question).inputType === 'password');
    }
}