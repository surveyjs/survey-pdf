import { IQuestion, QuestionDropdownModel } from 'survey-core';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPoint, IRect, DocController } from '../doc_controller';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { DropdownBrick } from '../pdf_render/pdf_dropdown';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';

export class FlatDropdown extends FlatQuestion {
    protected question: QuestionDropdownModel;
    constructor(question: IQuestion, protected controller: DocController) {
        super(question, controller);
        this.question = <QuestionDropdownModel>question;
    }
    generateFlatsContent(point: IPoint): IPdfBrick[] {
        let rect: IRect = SurveyHelper.createTextFieldRect(point, this.controller);
        let compositeFlat: CompositeBrick = new CompositeBrick(
            new DropdownBrick(this.question, this.controller, rect));
        if (this.question.hasOther) {
            compositeFlat.addBrick(SurveyHelper.createOtherFlat(
                SurveyHelper.createPoint(compositeFlat), this.question, this.controller));
        }
        return [compositeFlat];
    }
}

FlatRepository.getInstance().register('dropdown', FlatDropdown);