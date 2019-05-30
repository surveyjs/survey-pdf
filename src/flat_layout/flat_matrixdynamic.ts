import { IQuestion } from 'survey-core';
import { FlatRepository } from './flat_repository';
import { DocController } from '../doc_controller';
import { FlatMatrixMultiple } from './flat_matrixmultiple';

export class FlatMatrixDynamic extends FlatMatrixMultiple {
    public constructor(question: IQuestion, controller: DocController) {
        super(question, controller, false);
    }
}

FlatRepository.getInstance().register('matrixdynamic', FlatMatrixDynamic);