import { DocController, IPoint } from '../doc_controller';
import { BorderMode, SurveyHelper } from '../helper_survey';
import { IPdfBrick } from './pdf_brick';
import { CompositeBrick } from './pdf_composite';
import { EmptyBrick } from './pdf_empty';

interface IContainerBrickAppearance {
    paddingTop: number;
    paddingLeft: number;
    paddingBottom: number;
    paddingRight: number;
    borderWidth: number;
    borderColor: string | null;
    backgroundColor: string | null;
    borderMode: BorderMode;
}

export enum InseparableBrickMode {
    FIRST = 1, LAST = 2, BOTH = 3
}

const defaultContainerOptions: IContainerBrickAppearance = {
    paddingTop: 0,
    paddingLeft: 0,
    paddingBottom: 0,
    paddingRight: 0,
    borderWidth: 0,
    backgroundColor: null,
    borderColor: null,
    borderMode: 1,
};

export class InseparableBrick extends CompositeBrick {
    constructor(private mode: InseparableBrickMode, ...bricks: Array<IPdfBrick>) {
        super(...bricks);
    }
    public unfold(): IPdfBrick[] {
        const unfoldedBricks = super.unfold();
        if(this.mode & InseparableBrickMode.FIRST && unfoldedBricks.length > 1) {
            const inseparableBricks = new InseparableBrick(this.mode, unfoldedBricks[0], unfoldedBricks[1]);
            unfoldedBricks.splice(0, 2, inseparableBricks);
        }
        if(this.mode & InseparableBrickMode.LAST && unfoldedBricks.length > 1) {
            const inseparableBricks = new InseparableBrick(this.mode, unfoldedBricks[unfoldedBricks.length - 2], unfoldedBricks[unfoldedBricks.length - 1]);
            unfoldedBricks.splice(unfoldedBricks.length - 2, 2, inseparableBricks);
        }
        return unfoldedBricks;
    }
}

export class ContainerBrick extends CompositeBrick {
    private paddingTopBrick: IPdfBrick;
    private paddingBottomBrick: IPdfBrick;
    private appearance: Readonly<IContainerBrickAppearance>;
    private get includedBorderWidth() {
        switch(this.appearance.borderMode) {
            case BorderMode.Inside:
                return this.appearance.borderWidth;
            case BorderMode.Middle:
                return this.appearance.borderWidth / 2;
            default:
                return 0;
        }
    }
    constructor(private controller: DocController, private layout: { xLeft: number, yTop: number, width: number }, appearance: Partial<Readonly<IContainerBrickAppearance>>) {
        super();
        this.appearance = SurveyHelper.mergeObjects({}, defaultContainerOptions, appearance);
    }
    getStartPoint(): IPoint {
        return { yTop: this.bricks[0].yBot, xLeft: this.layout.xLeft + this.appearance.paddingLeft + this.includedBorderWidth };
    }
    startSetup() {
        this.paddingTopBrick = new EmptyBrick(this.controller, { ...this.layout, xRight: this.layout.xLeft + this.layout.width, yBot: this.layout.yTop + this.appearance.paddingTop + this.includedBorderWidth });
        this.addBrick(this.paddingTopBrick);
        this.controller.pushMargins();
        this.controller.margins.left = this.layout.xLeft + this.appearance.paddingLeft + this.includedBorderWidth;
        this.controller.margins.right = this.controller.paperWidth - (this.layout.xLeft + this.layout.width) + this.appearance.paddingRight + this.includedBorderWidth;
    }
    private originalBricks: Array<IPdfBrick>;
    finishSetup() {
        this.controller.popMargins();
        this.paddingBottomBrick = new EmptyBrick(this.controller, {
            xLeft: this.layout.xLeft,
            yTop: this.yBot,
            xRight: this.layout.xLeft + this.layout.width,
            yBot: this.yBot + this.appearance.paddingBottom + this.includedBorderWidth
        });
        this.addBrick(this.paddingBottomBrick);
        this.originalBricks = this.bricks.slice(1, this.bricks.length - 1);
        if(this.bricks.length > 3) {
            const firstBrickWithPadding = new InseparableBrick(InseparableBrickMode.FIRST, this.bricks[0], this.bricks[1]);
            const lastBrickWithPadding = new InseparableBrick(InseparableBrickMode.LAST, this.bricks[this.bricks.length - 2], this.bricks[this.bricks.length - 1]);
            this.bricks.splice(0, 2, firstBrickWithPadding);
            this.bricks.splice(this.bricks.length - 2, 2, lastBrickWithPadding);
        } else {
            this.bricks.splice(0, this.bricks.length, new InseparableBrick(InseparableBrickMode.BOTH, ...this.bricks));
        }
        let renderedPageIndex = -1;
        const callback = () => {
            const currentPageIndex = this.controller.getCurrentPageIndex();
            if(currentPageIndex == renderedPageIndex) {
                return;
            } else {
                renderedPageIndex = currentPageIndex;
                const bricksOnPage = new CompositeBrick(...this.unfold().filter(brick => brick.getPageNumber() == currentPageIndex));
                if(this.appearance.backgroundColor !== null) {
                    const oldFillColor = this.controller.doc.getFillColor();
                    this.controller.doc.setFillColor(this.appearance.backgroundColor);
                    this.controller.doc.rect(
                        this.layout.xLeft + this.includedBorderWidth,
                        bricksOnPage.yTop + this.includedBorderWidth,
                        this.layout.width - this.includedBorderWidth * 2,
                        bricksOnPage.height - this.includedBorderWidth * 2,
                        'F');
                    this.controller.doc.setFillColor(oldFillColor);
                }
                if(this.appearance.borderColor !== null) {
                    SurveyHelper.renderFlatBorders(this.controller, {
                        xLeft: this.layout.xLeft,
                        xRight: this.layout.xLeft + this.layout.width,
                        yTop: bricksOnPage.yTop,
                        yBot: bricksOnPage.yBot,
                        width: this.layout.width,
                        height: bricksOnPage.height }, { ...this.appearance });
                }
            }
        };
        this.bricks.forEach(brick => {
            brick.addBeforeRenderCallback(callback);
        });
    }
    public getBricks(): Array<IPdfBrick> {
        return this.bricks;
    }
    public async setup(callback: (point: IPoint, bricks: Array<IPdfBrick>) => Promise<void>) {
        this.startSetup();
        const bricks:Array<IPdfBrick> = [];
        await callback(this.getStartPoint(), bricks);
        this.addBrick(...bricks);
        this.finishSetup();
    }
    public set xLeft(val: number) {}
    public get xLeft() {
        return this.layout.xLeft;
    }
    public set xRight(val: number) {}
    public get xRight() {
        return this.layout.xLeft + this.layout.width;
    }
    public get width() {
        return this.layout.width;
    }
    fitToHeight(height: number, alignCenter: boolean = false) {
        const originalHeight = this.height;
        this.paddingBottomBrick.yBot += height - originalHeight;
        if(alignCenter) {
            const shift = (height - originalHeight) / 2;
            this.originalBricks.forEach(brick => {
                brick.translateY((yTop, yBot) => {
                    return {
                        yTop: yTop + shift,
                        yBot: yBot + shift
                    };
                });
            });
        }
        this.updateRect();
    }
}