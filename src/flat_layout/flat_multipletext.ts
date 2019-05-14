import { IQuestion, QuestionMultipleTextModel, MultipleTextItemModel } from 'survey-core';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPoint, IRect, DocController } from "../doc_controller";
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { TextFieldBrick } from '../pdf_render/pdf_textfield';
import { SurveyHelper } from '../helper_survey';

export class FlatMultipleText extends FlatQuestion {
    protected question: QuestionMultipleTextModel;
    constructor(question: IQuestion, protected controller: DocController) {
        super(question, controller);
        this.question = <QuestionMultipleTextModel>question;
    }
    generateFlatsContent(point: IPoint): IPdfBrick[] {
        return null;
    }
}

FlatRepository.getInstance().register('multipletext', FlatMultipleText);