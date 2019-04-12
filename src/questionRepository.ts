import { IQuestion } from "survey-core";
import { DocOptions } from "./docOptions";
import { IPdfQuestion, PdfQuestionRendererBase } from "./question";

export type RendererConstructor = new (
    question: IQuestion,
    docOptions: DocOptions
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
    create(question: IQuestion, docOptions: DocOptions): IPdfQuestion {
        let rendererConstructor =
            this.questions[question.getType()] || PdfQuestionRendererBase;
        return new rendererConstructor(question, docOptions);
    }
}

