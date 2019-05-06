// import { IQuestion, ItemValue, QuestionMatrixModel, MatrixRowModel, QuestionCheckboxModel } from 'survey-core';
// import { DocController, IPoint, IRect } from "../doc_controller";
// import { IPdfBrick, PdfBrick } from '../pdf_render/pdf_brick'
// import { FlatRepository } from './flat_repository';
// import { FlatQuestion } from './flat_question';
// import { SurveyHelper } from '../helper_survey';
// import { TextBrick } from '../pdf_render/pdf_text';
// import { RadioGroupWrap, RadioItemBrick } from '../pdf_render/pdf_radioitem';


// export class FlatMatrix extends FlatQuestion {
//     protected question: QuestionCheckboxModel;
//     constructor(question: IQuestion, protected controller: DocController) {
//         super(question, controller);
//         this.question = <QuestionCheckboxModel>question;
//     }
//     private generateFlatsItem(point: IPoint, itemValue: ItemValue, index: number): IPdfBrick {
//         return null;
//     }
//     protected generateFlatsContent(): PdfBrick[] {
//         if (!this.question) return null;
//         let headers: PdfBrick[] = [];
//         //createText
//         let firstTH = this.question.hasRows ? '' : null;
//         for (let i = 0; i < this.question.visibleColumns.length; i++) {
//             let column = this.question.visibleColumns[i];
//             let columText = SurveyHelper.getLocString(column.locText);
//             //createText
//             headers.push();
//         }
//         let rows: IPdfBrick[][] = [];
//         let visibleRows = this.question.visibleRows;
//         for (let i = 0; i < visibleRows.length; i++) {
//             let row = visibleRows[i];
//             let key = "row" + i;
//             rows.push(
//                 new FlatMatrixRow(this.question, this.controller, row, key, i == 0).generateFlatsContent(curPoint)
//             );
//         }
//         let header = !this.question.showHeader ? null : headers;

//     }
// }

// export class FlatMatrixRow extends FlatQuestion {
//     protected question: QuestionMatrixModel;
//     constructor(question: IQuestion, protected controller: DocController, private row: MatrixRowModel, private key: string, protected isFirst: boolean) {
//         super(question, controller);
//         this.question = <QuestionMatrixModel>question;
//     }
//     private generateFlatsItem(point: IPoint, itemValue: ItemValue, index: number): IPdfBrick {
//         return null;
//     }
//     generateFlatsContent(point: IPoint): IPdfBrick[] {
//         if (!this.row) return null;
//         let cells: PdfBrick[];
//         if (this.question.hasRows) {
//             SurveyHelper.createTextFlat(point, this.question, this.controller, SurveyHelper.getLocString(this.row.locText), TextBrick);
//         }
//     }
//     generateHorizontallyCells(point: IPoint) {
//         let radioGroupWrap: RadioGroupWrap = new RadioGroupWrap(this.question.id + this.key, this.controller);
//         let cells: IPdfBrick[];
//         this.question.visibleColumns.forEach((column, index) => {
//             let checked = this.row.value == column.value;
//             if (this.question.hasCellText) {
//                 cells.push(SurveyHelper.createTextFlat(point, this.question, this.controller,
//                     SurveyHelper.getLocString(this.question.getCellDisplayLocText(this.row, column)), TextBrick));
//             }
//             else {
//                 let height: number = SurveyHelper.measureText().height;
//                 let itemRect: IRect = SurveyHelper.createRect(point, height, height);
//                 cells.push(new RadioItemBrick(this.question, this.controller, itemRect, '',
//                     checked, radioGroupWrap, index == 0));
//             }
//         });
//     }
//     getMargins(column: number) {
//         this.question.visibleColumns.values
//     }
    // generateVerticallyCells(point: IPoint) {
    //     let radioGroupWrap: RadioGroupWrap = new RadioGroupWrap(this.question, this.controller);
    //     let cells: IPdfBrick[];
    //     this.question.visibleColumns.forEach((column, index) => {
    //         let checked = this.row.value == column.value;
    //         if (this.question.hasCellText) {
    //             cells.push(SurveyHelper.createTextFlat(point, this.question, this.controller,
    //                 SurveyHelper.getLocString(this.question.getCellDisplayLocText(this.row, column)), TextBrick));
    //         }
    //         else {
    //             let height: number = SurveyHelper.measureText().height;
    //             let itemRect: IRect = SurveyHelper.createRect(point, height, height);
    //             let radioItem: RadioItemBrick = new RadioItemBrick(this.question, this.controller, itemRect, '', checked, false, radioGroupWrap, index == 0);
    //         }
    //     });
    // }
//}

//FlatRepository.getInstance().register('matrix', FlatMatrix);
