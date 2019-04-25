import { IPdfBrick } from './pdf_brick';
import { SurveyHelper } from '../helper_survey';

export class CompositeBrick implements IPdfBrick {
    private pdfBricks: IPdfBrick[] = [];
    xLeft: number;
    xRight: number;
    yTop: number;
    yBot: number;
    constructor(...pdfBricks: IPdfBrick[]) {
        this.addBrick(...pdfBricks);
    }
    render(): void {
        this.pdfBricks.forEach((pdfBrick: IPdfBrick) => {
            pdfBrick.render();
        });
    }
    addBrick(...pdfBricks: IPdfBrick[]) {
        if (pdfBricks.length != 0) {
            this.pdfBricks.push(...pdfBricks);
            let mergeRect = SurveyHelper.mergeRects(...this.pdfBricks);
            this.xLeft = mergeRect.xLeft;
            this.xRight = mergeRect.xRight;
            this.yTop = mergeRect.yTop;
            this.yBot = mergeRect.yBot;
        }
    }
} 