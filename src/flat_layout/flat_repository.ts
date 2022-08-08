import { IQuestion } from 'survey-core';
import { SurveyPDF } from '../survey';
import { DocController } from '../doc_controller';
import { IFlatQuestion, FlatQuestion } from './flat_question';

export type FlatConstructor = new (
    survey: SurveyPDF,
    question: IQuestion,
    controller: DocController
) => IFlatQuestion;
export class FlatRepository {
    private questions: { [index: string]: FlatConstructor } = {};
    private static instance: FlatRepository = new FlatRepository();
    public static getInstance(): FlatRepository {
        return FlatRepository.instance;
    }
    public register(modelType: string, rendererConstructor: FlatConstructor): void {
        this.questions[modelType] = rendererConstructor;
    }
    public isTypeRegistered(type: string): boolean {
        return !!this.questions[type];
    }
    public create(survey: SurveyPDF, question: IQuestion,
        docController: DocController, type?: string): IFlatQuestion {
        const questionType: string = typeof type === 'undefined' ? question.getType() : type;
        const rendererConstructor: FlatConstructor = this.questions[questionType] || FlatQuestion;
        return new rendererConstructor(survey, question, docController);
    }
}