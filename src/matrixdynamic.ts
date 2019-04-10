// import { Rect, QuestionRepository, ICoordinates } from "./survey";
// import { PdfQuestionRenderer } from "./PdfQuestionRenderer";
// import { IQuestion } from "../base";
// import { QuestionMatrixDynamicModel } from "../question_matrixdynamic";
// import {
//   MatrixDropdownRowModelBase,
//   MatrixDropdownCell
// } from "../question_matrixdropdownbase";

// export class MatrixDynamicQuestion extends PdfQuestionRenderer {
//   constructor(question: IQuestion, doc: any) {
//     super(question, doc);
//   }
//   getBoundaries(coordinates: ICoordinates): Rect {
//     //TODO
//     return null;
//   }
//   render(coordinates: ICoordinates) {
//     debugger;
//     var nextCoordinates = super.render(coordinates);
//     var question: QuestionMatrixDynamicModel = this.getQuestion<
//       QuestionMatrixDynamicModel
//     >();
//     var x = nextCoordinates.x + 10;
//     var y = nextCoordinates.y + 20;
//     question.visibleRows.forEach((row: MatrixDropdownRowModelBase) => {
//       row.cells.forEach((cell: MatrixDropdownCell) => {
//         let coordinates = QuestionRepository.instance
//           .create(cell.question, this.doc)
//           .render({
//             x,
//             y
//           });
//       });
//     });
//     return { x: nextCoordinates.x, y: y + 20 };
//   }
// }

// QuestionRepository.instance.register("matrixdynamic", MatrixDynamicQuestion);
