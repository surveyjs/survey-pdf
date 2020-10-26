import { IQuestion, QuestionTextModel, Question } from 'survey-core';
import { IRect, DocController } from '../doc_controller';
import { TextFieldBrick } from './pdf_textfield';
import { SurveyHelper } from '../helper_survey';

export class TextBoxBrick extends TextFieldBrick {
    public constructor(question: IQuestion, controller: DocController,
        rect: IRect, protected isQuestion: boolean = true,
        protected isMultiline: boolean = false, index: number = 0) {
        super(question, controller, rect, isQuestion,
            (<QuestionTextModel>question).id + (isQuestion ? '' : '_comment' + index),
            isQuestion ? (question.value !== undefined && question.value !== null ? question.value : '') :
                ((<Question>question).comment !== undefined &&
                    (<Question>question).comment !== null ? (<Question>question).comment : ''),
            isQuestion ? SurveyHelper.getLocString((<QuestionTextModel>question).locPlaceHolder) : '',
            question.isReadOnly, isMultiline,
            (<QuestionTextModel>question).inputType);
    }
}