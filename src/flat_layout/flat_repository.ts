import { IQuestion, Question } from 'survey-core';
import { SurveyPDF } from '../survey';
import { DocController } from '../doc_controller';
import { IFlatQuestion, FlatQuestion } from './flat_question';
import { FlatQuestionDefault } from './flat_default';

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
    public getRenderer(type: string): FlatConstructor {
        return this.questions[type];
    }
    public create(survey: SurveyPDF, question: Question,
        docController: DocController, type?: string): IFlatQuestion {
        const questionType: string = typeof type === 'undefined' ? question.getType() : type;
        let rendererConstructor = this.getRenderer(questionType);
        if(!rendererConstructor) {
            if(!!question.customWidget?.pdfRender) {
                rendererConstructor = FlatQuestion;
            } else {
                rendererConstructor = FlatQuestionDefault;
            }
        }
        return new rendererConstructor(survey, question, docController);
    }
    public static register(type: string, rendererConstructor: FlatConstructor): void {
        this.getInstance().register(type, rendererConstructor);
    }
    public static getRenderer(type: string): FlatConstructor {
        return this.getInstance().getRenderer(type);
    }
}