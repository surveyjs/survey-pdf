import { IQuestion, PanelModel, QuestionPanelDynamicModel } from 'survey-core';
import { FlatSurvey } from './flat_survey';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPoint, DocController } from '../doc_controller';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { SurveyHelper } from '../helper_survey';

export class FlatPanelDynamic extends FlatQuestion {
    protected question: QuestionPanelDynamicModel;
    public static readonly GAP_BETWEEN_PANELS: number = 0.75;
    public constructor(question: IQuestion, protected controller: DocController) {
        super(question, controller);
        this.question = <QuestionPanelDynamicModel>question;
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        let flats: IPdfBrick[] = [];
        let currPoint: IPoint = SurveyHelper.clone(point);
        for (let panel of this.question.panels) {
            let panelFlats: IPdfBrick[] = await FlatSurvey.generateFlatsPanel(
                this.controller, panel, currPoint);
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