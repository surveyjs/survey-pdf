import { IPdfBrick } from './pdf_brick';
import { SurveyHelper } from '../helper_survey';

export class CompositeBrick implements IPdfBrick {
    private bricks: IPdfBrick[] = [];
    private _xLeft: number;
    private _xRight: number;
    private _yTop: number;
    private _yBot: number;
    constructor(...bricks: IPdfBrick[]) {
        this._xLeft = 0.0;
        this._xRight = 0.0;
        this._yTop = 0.0;
        this._yBot = 0.0;
        this.addBrick(...bricks);
    }
    get xLeft(): number { return this._xLeft; }
    get xRight(): number { return this._xRight; }
    get yTop(): number { return this._yTop; }
    get yBot(): number { return this._yBot; }
    private shift(leftShift: number, rightShift: number,
        topShift: number, botShift: number) {
        this.bricks.forEach((brick: IPdfBrick) => {
            brick.xLeft += leftShift;
            brick.xRight += rightShift;
            brick.yTop += topShift;
            brick.yBot += botShift;
        });
    }
    set xLeft(xLeft: number) {
        this.shift(xLeft - this.xLeft, 0.0, 0.0, 0.0);
        this._xLeft = xLeft;
    }
    set xRight(xRight: number) {
        this.shift(0.0, xRight - this.xRight, 0.0, 0.0);
        this._xRight = xRight;
    }
    set yTop(yTop: number) {
        this.shift(0.0, 0.0, yTop - this.yTop, 0.0);
        this._yTop = yTop;
    }
    set yBot(yBot: number) {
        this.shift(0.0, 0.0, 0.0, yBot - this.yBot);
        this._yBot = yBot;
    }

    async render(): Promise<void> {
        for (let i: number = 0; i < this.bricks.length; i++) {
            await this.bricks[i].render();
        }
    }
    addBrick(...bricks: IPdfBrick[]) {
        if (bricks.length != 0) {
            this.bricks.push(...bricks);
            let mergeRect = SurveyHelper.mergeRects(...this.bricks);
            this._xLeft = mergeRect.xLeft;
            this._xRight = mergeRect.xRight;
            this._yTop = mergeRect.yTop;
            this._yBot = mergeRect.yBot;
        }
    }
    unfold(): IPdfBrick[] {
        let unfoldBricks: IPdfBrick[] = new Array<IPdfBrick>();
        this.bricks.forEach((brick: IPdfBrick) => {
            unfoldBricks.push(...brick.unfold());
        });
        return unfoldBricks;
    }
    unfoldOnce(): IPdfBrick[] {
        let unfoldBricks: IPdfBrick[] = new Array<IPdfBrick>();
        this.bricks.forEach((brick: IPdfBrick) => {
            unfoldBricks.push(brick);
        });
        return unfoldBricks;
    }
} 