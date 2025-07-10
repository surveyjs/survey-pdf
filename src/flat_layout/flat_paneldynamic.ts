import { QuestionPanelDynamicModel } from 'survey-core';
import { IPoint } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { SurveyHelper } from '../helper_survey';

export class FlatPanelDynamic extends FlatQuestion<QuestionPanelDynamicModel> {
    public static readonly GAP_BETWEEN_PANELS: number = 0.75;
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        const flats: IPdfBrick[] = [];
        const currPoint: IPoint = SurveyHelper.clone(point);
        for (const panel of this.question.panels) {
            const panelFlats: IPdfBrick[] = await SurveyHelper.generatePanelFlats(this.survey, this.controller, panel, currPoint);

            if (panelFlats.length !== 0) {
                currPoint.yTop = SurveyHelper.mergeRects(...panelFlats).yBot;
                currPoint.yTop += this.controller.unitHeight * FlatPanelDynamic.GAP_BETWEEN_PANELS;
                flats.push(...panelFlats);
            }
        }
        return flats;
    }
}

FlatRepository.getInstance().register('paneldynamic', FlatPanelDynamic);