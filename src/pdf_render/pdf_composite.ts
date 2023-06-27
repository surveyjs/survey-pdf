import { IPdfBrick, TranslateXFunction } from './pdf_brick';
import { SurveyHelper } from '../helper_survey';

export class CompositeBrick implements IPdfBrick {
    private bricks: IPdfBrick[] = [];
    private _xLeft: number;
    private _xRight: number;
    private _yTop: number;
    private _yBot: number;
    public isPageBreak: boolean = false;
    public constructor(...bricks: IPdfBrick[]) {
        this._xLeft = 0.0;
        this._xRight = 0.0;
        this._yTop = 0.0;
        this._yBot = 0.0;
        this.addBrick(...bricks);
    }
    get xLeft(): number { return this._xLeft; }
    set xLeft(xLeft: number) {
        this.shift(xLeft - this.xLeft, 0.0, 0.0, 0.0);
        this._xLeft = xLeft;
    }
    get xRight(): number { return this._xRight; }
    set xRight(xRight: number) {
        this.shift(0.0, xRight - this.xRight, 0.0, 0.0);
        this._xRight = xRight;
    }
    get yTop(): number { return this._yTop; }
    set yTop(yTop: number) {
        this.shift(0.0, 0.0, yTop - this.yTop, 0.0);
        this._yTop = yTop;
    }
    get yBot(): number { return this._yBot; }
    set yBot(yBot: number) {
        this.shift(0.0, 0.0, 0.0, yBot - this.yBot);
        this._yBot = yBot;
    }
    private shift(leftShift: number, rightShift: number,
        topShift: number, botShift: number) {
        this.bricks.forEach((brick: IPdfBrick) => {
            brick.xLeft += leftShift;
            brick.xRight += rightShift;
            brick.yTop += topShift;
            brick.yBot += botShift;
        });
    }
    public get width(): number {
        return this.xRight - this.xLeft;
    }
    public get height(): number {
        return this.yBot - this.yTop;
    }
    public async render(): Promise<void> {
        for (let i: number = 0; i < this.bricks.length; i++) {
            await this.bricks[i].render();
        }
    }
    public get isEmpty(): boolean {
        return this.bricks.length === 0;
    }
    public addBrick(...bricks: IPdfBrick[]) {
        if (bricks.length != 0) {
            this.bricks.push(...bricks);
            let mergeRect = SurveyHelper.mergeRects(...this.bricks);
            this._xLeft = mergeRect.xLeft;
            this._xRight = mergeRect.xRight;
            this._yTop = mergeRect.yTop;
            this._yBot = mergeRect.yBot;
        }
    }
    public unfold(): IPdfBrick[] {
        const unfoldBricks: IPdfBrick[] = [];
        this.bricks.forEach((brick: IPdfBrick) => {
            unfoldBricks.push(...brick.unfold());
        });
        return unfoldBricks;
    }
    translateX(func: TranslateXFunction): void {
        this.bricks.forEach(brick => brick.translateX(func));
        const res = func(this.xLeft, this.xRight);
        this._xLeft = res.xLeft;
        this._xRight = res.xRight;
    }
}