import { IQuestion } from 'survey-core';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPoint, DocController } from "../doc_controller";
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { HTMLBrick } from '../pdf_render/pdf_html';
import { SurveyHelper } from '../helper_survey';

export class FlatHTML extends FlatQuestion {
    constructor(question: IQuestion, controller: DocController) {
        super(question, controller);
    }
    generateFlatsContent(point: IPoint): IPdfBrick[] {
        return [new HTMLBrick(this.question, this.controller,
            SurveyHelper.createRect(point, 50, 50), `
                <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg"
                        width="50"
                        height="50"
                        />
                `)];
    }
}

FlatRepository.getInstance().register('html', FlatHTML);