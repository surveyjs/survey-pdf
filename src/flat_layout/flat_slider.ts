import { IQuestion, QuestionSliderModel, QuestionTextModel } from 'survey-core';
import { SurveyPDF } from '../survey';
import { IPoint, IRect, DocController } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { TextBoxBrick } from '../pdf_render/pdf_textbox';
import { SurveyHelper } from '../helper_survey';
import { FlatTextbox } from './flat_textbox';

export class FlatSlider extends FlatQuestion {
    protected question: QuestionSliderModel;
    public constructor(protected survey: SurveyPDF,
        question: IQuestion, protected controller: DocController) {
        super(survey, question, controller);
        this.question = <QuestionSliderModel>question;
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        if (this.question.sliderType === 'single') {
            const rect: IRect = SurveyHelper.createTextFieldRect(point, this.controller);
            return [new TextBoxBrick(this.question, this.controller, rect)];
        }

        if (this.question.sliderType === 'range') {
            return;
        }
    }
}

FlatRepository.getInstance().register('slider', FlatSlider);