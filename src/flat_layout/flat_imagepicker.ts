import { IQuestion, QuestionImagePickerModel } from 'survey-core';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPoint, IRect, DocController } from "../doc_controller";
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { TextBoxBrick } from '../pdf_render/pdf_textbox';
import { SurveyHelper } from '../helper_survey';

export class FlatImagePicker extends FlatQuestion {
    protected question: QuestionImagePickerModel;
    constructor(question: IQuestion, controller: DocController) {
        super(question, controller);
        this.question = <QuestionImagePickerModel>question;
    }
    generateFlatsContent(point: IPoint): IPdfBrick[] {
        return null;
    }
}

FlatRepository.getInstance().register('imagepicker', FlatImagePicker);