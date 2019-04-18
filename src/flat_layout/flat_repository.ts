import { IQuestion } from 'survey-core';
import { DocController } from '../docController';
import { IFlatQuestion, FlatQuestion } from './flat_question';

export type FlatConstructor = new (
    question: IQuestion,
    controller: DocController
) => IFlatQuestion;

export class FlatRepository {
    private questions: { [index: string]: FlatConstructor } = {};
    private static instance = new FlatRepository();
    static getInstance(): FlatRepository {
        return FlatRepository.instance;
    }
    register(modelType: string, rendererConstructor: FlatConstructor) {
        this.questions[modelType] = rendererConstructor;
    }
    create(question: IQuestion, docController: DocController): IFlatQuestion {
        let rendererConstructor =
            this.questions[question.getType()] || FlatQuestion;
        return new rendererConstructor(question, docController);
    }
}