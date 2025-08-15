import { SurveyPDF } from '../survey';
import { DocController } from '../doc_controller';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { DrawCanvas } from './draw_canvas';
import { SurveyHelper } from '../helper_survey';
export class EventHandler {
    public static async process_header_events(survey: SurveyPDF,
        controller: DocController, packs: IPdfBrick[][]): Promise<void> {
        if (!survey.haveCommercialLicense) {
            survey.onRenderHeader.add((_, canvas) => {
                canvas.drawText({
                    text: 'SurveyJS PDF | Please purchase a SurveyJS PDF developer license to use it in your app | https://surveyjs.io/Buy',
                    fontSize: 10
                });
            });
        }
        for (let i: number = 0; i < packs.length; i++) {
            await survey.onRenderHeader.fire(survey, new DrawCanvas(packs[i], controller,
                SurveyHelper.createHeaderRect(controller), packs.length, i + 1));
            await survey.onRenderFooter.fire(survey, new DrawCanvas(packs[i], controller,
                SurveyHelper.createFooterRect(controller), packs.length, i + 1));
        }
    }
}