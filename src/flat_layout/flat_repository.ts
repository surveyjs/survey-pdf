import { IPage, IPanel, IQuestion, Question } from 'survey-core';
import { SurveyPDF } from '../survey';
import { DocController } from '../doc_controller';
import { IFlatQuestion, FlatQuestion } from './flat_question';
import { FlatQuestionDefault } from './flat_default';
import { IPanelStyle, IQuestionStyle } from '../style/types';
import { IFlatPanel } from './flat_panel';
import { IFlatPage, IFlatSurvey } from 'src/entries/pdf-base';

export type FlatConstructor = new (
    survey: SurveyPDF,
    question: IQuestion,
    controller: DocController,
    style: IQuestionStyle
) => IFlatQuestion;

export type FlatPanelConstructor = new (
    survey: SurveyPDF,
    panel: IPanel,
    controller: DocController,
    style: IPanelStyle
) => IFlatPanel;

export type FlatPageConstructor = new (
    survey: SurveyPDF,
    panel: IPage,
    controller: DocController,
    style: IPanelStyle
) => IFlatPage;

export type FlatSurveyConstructor = new (
    survey: SurveyPDF,
    controller: DocController,
    style: IPanelStyle
) => IFlatSurvey;

export class FlatRepository {
    private questions: { [index: string]: FlatConstructor } = {};
    private panel: FlatPanelConstructor;
    private page: FlatPageConstructor;
    private survey: FlatSurveyConstructor;
    private static instance: FlatRepository = new FlatRepository();
    public static getInstance(): FlatRepository {
        return FlatRepository.instance;
    }
    public register(modelType: string, rendererConstructor: FlatConstructor): void {
        this.questions[modelType] = rendererConstructor;
    }
    public registerPanel(rendererConstructor: FlatPanelConstructor): void {
        this.panel = rendererConstructor;
    }
    public registerPage(rendererConstructor: FlatPageConstructor): void {
        this.page = rendererConstructor;
    }
    public registerSurvey(rendererConstructor: FlatSurveyConstructor): void {
        this.survey = rendererConstructor;
    }
    public isTypeRegistered(type: string): boolean {
        return !!this.questions[type];
    }
    public getRenderer(type: string): FlatConstructor {
        return this.questions[type];
    }
    public create(survey: SurveyPDF, question: Question,
        docController: DocController, style: IQuestionStyle, type?: string): IFlatQuestion {
        const questionType: string = typeof type === 'undefined' ? question.getType() : type;
        let rendererConstructor = this.getRenderer(questionType);
        if(!rendererConstructor) {
            if(!!question.customWidget?.pdfRender) {
                rendererConstructor = FlatQuestion;
            } else {
                rendererConstructor = FlatQuestionDefault;
            }
        }
        return new rendererConstructor(survey, question, docController, style);
    }
    public createPanel(survey: SurveyPDF, panel: IPanel,
        docController: DocController, style: IPanelStyle) {
        return new this.panel(survey, panel, docController, style);
    }
    public createPage(survey: SurveyPDF, page: IPage,
        docController: DocController, style: IPanelStyle) {
        return new this.page(survey, page, docController, style);
    }
    public createSurvey(survey: SurveyPDF, docController: DocController, style: IPanelStyle) {
        return new this.survey(survey, docController, style);
    }
    public static registerPanel(rendererConstructor: FlatPanelConstructor): void {
        this.getInstance().registerPanel(rendererConstructor);
    }
    public static registerPage(rendererConstructor: FlatPageConstructor): void {
        this.getInstance().registerPage(rendererConstructor);
    }
    public static registerSurvey(rendererConstructor: FlatSurveyConstructor): void {
        this.getInstance().registerSurvey(rendererConstructor);
    }
    public static register(type: string, rendererConstructor: FlatConstructor): void {
        this.getInstance().register(type, rendererConstructor);
    }
    public static getRenderer(type: string): FlatConstructor {
        return this.getInstance().getRenderer(type);
    }
}