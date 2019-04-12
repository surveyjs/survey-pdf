import { IQuestion } from "survey-core";
import { DocController } from "./docController";
import { IPdfQuestion, PdfQuestion } from "./question";

export type RendererConstructor = new (
    question: IQuestion,
    docController: DocController
) => IPdfQuestion;

export class QuestionRepository {
    private questions: { [index: string]: RendererConstructor } = {};
    private static instance = new QuestionRepository();
    static getInstance(): QuestionRepository {
        return QuestionRepository.instance;
    }
    register(modelType: string, rendererConstructor: RendererConstructor) {
        this.questions[modelType] = rendererConstructor;
    }
    create(question: IQuestion, docController: DocController): IPdfQuestion {
        let rendererConstructor =
            this.questions[question.getType()] || PdfQuestion;
        return new rendererConstructor(question, docController);
    }
}

