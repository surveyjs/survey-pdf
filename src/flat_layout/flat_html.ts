import { IQuestion } from 'survey-core';
import { SurveyPDF } from '../survey';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPoint, DocController } from '../doc_controller';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { QuestionHtmlModel } from 'survey-core'
import { SurveyHelper } from '../helper_survey';

export class FlatHTML extends FlatQuestion {
    protected question: QuestionHtmlModel;
    public constructor(protected survey: SurveyPDF,
        question: IQuestion, controller: DocController) {
        super(survey, question, controller);
        this.question = <QuestionHtmlModel>question;
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        let html: string = SurveyHelper.createDivBlock(this.question.locHtml.renderedHtml, this.controller);
        return [SurveyHelper.splitHtmlRect(this.controller, await SurveyHelper.createHTMLFlat(
            point, this.question, this.controller, html))];
    }
}

FlatRepository.getInstance().register('html', FlatHTML);