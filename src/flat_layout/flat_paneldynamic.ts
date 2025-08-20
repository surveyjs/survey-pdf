import { QuestionPanelDynamicModel } from 'survey-core';
import { IPoint } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { SurveyHelper } from '../helper_survey';

export class FlatPanelDynamic extends FlatQuestion<QuestionPanelDynamicModel> {
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        const flats: IPdfBrick[] = [];
        const currPoint: IPoint = SurveyHelper.clone(point);
        for (const panel of this.question.panels) {
            const panelFlats: IPdfBrick[] = await SurveyHelper.generatePanelFlats(this.survey, this.controller, panel, currPoint, this.survey.getStylesForElement(panel));

            if (panelFlats.length !== 0) {
                currPoint.yTop = SurveyHelper.mergeRects(...panelFlats).yBot;
                currPoint.yTop += SurveyHelper.getScaledVerticalSize(this.controller, this.styles.gapBetweenPanels);
                flats.push(...panelFlats);
            }
        }
        return flats;
    }
}

FlatRepository.getInstance().register('paneldynamic', FlatPanelDynamic);