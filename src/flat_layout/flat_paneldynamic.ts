import { IQuestion, PanelModel, QuestionPanelDynamicModel } from 'survey-core';
import { FlatSurvey } from './flat_survey';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPoint, DocController } from '../doc_controller';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { SurveyHelper } from '../helper_survey';

export class FlatPanelDynamic extends FlatQuestion {
    protected question: QuestionPanelDynamicModel;
    constructor(question: IQuestion, protected controller: DocController) {
        super(question, controller);
        this.question = <QuestionPanelDynamicModel>question;
    }
    generateFlatsContent(point: IPoint): IPdfBrick[] {
        let flats: IPdfBrick[] = new Array<IPdfBrick>();
        let currPoint: IPoint = { xLeft: point.xLeft, yTop: point.yTop };
        this.question.panels.forEach((panel: PanelModel) => {
            let panelFlats: IPdfBrick[] = FlatSurvey.generateFlatsPanel(
                currPoint, panel, this.controller);
            if (panelFlats.length !== 0) {
                currPoint.yTop = SurveyHelper.mergeRects(...panelFlats).yBot;
                currPoint.yTop += SurveyHelper.measureText().height;
                flats.push(...panelFlats);
            }
        });
        return flats;
    }
}

FlatRepository.getInstance().register('paneldynamic', FlatPanelDynamic);