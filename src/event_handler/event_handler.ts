import { SurveyPDF } from '../survey';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { DrawCanvas } from './draw_canvas';
import { SurveyHelper } from '../helper_survey';

export class EventHandler {
    public static process_events(survey: SurveyPDF, packs: IPdfBrick[][]): void {
        for (let i: number = 0; i < packs.length; i++) {
            survey.onRenderHeader.fire(this, new DrawCanvas(packs[i], survey.controller,
                    SurveyHelper.createHeaderRect(survey.controller), packs.length, i + 1));
            survey.onRenderFooter.fire(this, new DrawCanvas(packs[i], survey.controller,
                    SurveyHelper.createFooterRect(survey.controller), packs.length, i + 1));
        }
    }
}