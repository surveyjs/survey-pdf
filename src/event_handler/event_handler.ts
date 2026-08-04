import { SurveyPDF } from '../survey';
import { DocController } from '../doc_controller';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { DrawCanvas } from './draw_canvas';
import { SurveyHelper } from '../helper_survey';
import { FlatLicense } from '../flat_layout/flat_license';

export class EventHandler {
    public static async process_header_events(survey: SurveyPDF,
        controller: DocController, packs: IPdfBrick[][]): Promise<void> {
        if (!survey.haveCommercialLicense) {
            const licenseFlats = new FlatLicense(survey, controller).generateFlats({ xLeft: controller.margins.left ?? 0, yTop: 5 });
            survey.onRenderHeader.add((_, canvas) => {
                canvas.packs.push(...licenseFlats);
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