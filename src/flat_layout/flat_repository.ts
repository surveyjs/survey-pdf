import { IQuestion } from 'survey-core';
import { DocController } from '../doc_controller';
import { IFlatQuestion, FlatQuestion } from './flat_question';

export type FlatConstructor = new (
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
    public create(question: IQuestion, docController: DocController, type?: string): IFlatQuestion {
        let questionType: string = typeof type === 'undefined' ? question.getType() : type;
        let rendererConstructor: FlatConstructor = this.questions[questionType] || FlatQuestion;
        return new rendererConstructor(question, docController);
    }
}