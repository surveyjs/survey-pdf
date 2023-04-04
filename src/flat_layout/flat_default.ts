import { IPoint } from '../doc_controller';
import { SurveyHelper } from '../helper_survey';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { TextBrick } from '../pdf_render/pdf_text';
import { FlatQuestion } from './flat_question';

export class FlatQuestionDefault extends FlatQuestion {
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        const valueBrick = await SurveyHelper.createTextFlat(point, this.question, this.controller, `${this.question.displayValue}`, TextBrick);
        return [valueBrick];
    }
}