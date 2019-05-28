import { IQuestion, QuestionMatrixDropdownModelBase } from 'survey-core';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPoint, IRect, DocController } from "../doc_controller";
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { TextBoxBrick } from '../pdf_render/pdf_textbox';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';

export class FlatMatrixMultiple extends FlatQuestion {
    protected question: QuestionMatrixDropdownModelBase;
    public constructor(question: IQuestion, controller: DocController) {
        super(question, controller);
        this.question = <QuestionMatrixDropdownModelBase>question;
    }
    private async generateFlatsHeader(point: IPoint): Promise<CompositeBrick> {
        let composite: CompositeBrick = new CompositeBrick();
        let currPoint: IPoint = SurveyHelper.clone(point);
        for (var i = 0; i < this.question.visibleColumns.length; i++) {
            this.controller.pushMargins();
            SurveyHelper.setColumnMargins(this.controller, i + 1, this.question.visibleColumns.length + 1);
            currPoint.xLeft = this.controller.margins.left;
            composite.addBrick(await SurveyHelper.createBoldTextFlat(
                currPoint, this.question, this.controller,
                this.question.visibleColumns[i].locTitle));
            this.controller.popMargins();
        }
        return composite;
    }
    private async generateFlatsRowsAsHeaders(point: IPoint): Promise<CompositeBrick> {
        return null;
    }
    private async generateFlatsRows(point: IPoint): Promise<CompositeBrick[]> {
        return null;
    }
    private async generateFlatsColumnsAsRows(point: IPoint): Promise<CompositeBrick[]> {
        return null;
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        let rowsFlats: CompositeBrick[] = [new CompositeBrick(
            this.question.isColumnLayoutHorizontal
                ? await this.generateFlatsHeader(point)
                : await this.generateFlatsRowsAsHeaders(point))];
        let rowsPoint: IPoint = SurveyHelper.createPoint(
            SurveyHelper.mergeRects(...rowsFlats));
        rowsPoint.xLeft = point.xLeft;
        rowsFlats.push(...this.question.isColumnLayoutHorizontal
            ? await this.generateFlatsRows(rowsPoint)
            : await this.generateFlatsColumnsAsRows(rowsPoint));
        return rowsFlats;
    }
}

FlatRepository.getInstance().register('matrixdropdown', FlatMatrixMultiple);