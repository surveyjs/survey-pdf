import { DocController, IPoint } from '../doc_controller';
import { SurveyHelper } from '../helper_survey';
import { IPdfBrick } from './pdf_brick';
import { CompositeBrick } from './pdf_composite';
import { EmptyBrick } from './pdf_empty';

interface IContainerBrickAppearance {
    paddingTop: number;
    paddingLeft: number;
    paddingBottom: number;
    paddingRight: number;
    borderWidth: number;
    borderColor: string;
    backgroundColor: string;
    borderOutside: boolean;
}

export enum InseparableBrickMode {
    FIRST = 1, LAST = 2, BOTH = 3
}
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
    private get includedBorderWidth() {
        return this.appearance.borderOutside ? 0 : this.appearance.borderWidth;
    }
    constructor(private controller: DocController, private layout: { xLeft: number, yTop: number, width: number }, private appearance: IContainerBrickAppearance) {
        super();
        this.addBrick(new EmptyBrick(controller, { ...layout, xRight: layout.xLeft + layout.width, yBot: layout.yTop + appearance.paddingTop + this.includedBorderWidth }));
    }
    getStartPoint(): IPoint {
        return { yTop: this.bricks[0].yBot, xLeft: this.layout.xLeft + this.appearance.paddingLeft + this.includedBorderWidth };
    }
    startSetup() {
        this.controller.pushMargins();
        this.controller.margins.left = this.layout.xLeft + this.appearance.paddingLeft + this.includedBorderWidth;
        this.controller.margins.right = this.controller.paperWidth - (this.layout.xLeft + this.layout.width) + this.appearance.paddingRight + this.includedBorderWidth;
    }
    finishSetup() {
        this.controller.popMargins();
        this.addBrick(new EmptyBrick(this.controller, {
            xLeft: this.layout.xLeft,
            yTop: this.yBot,
            xRight: this.layout.xLeft + this.layout.width,
            yBot: this.yBot + this.appearance.paddingBottom + this.includedBorderWidth
        }));
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
                const oldFillColor = this.controller.doc.getFillColor();
                this.controller.doc.setFillColor(this.appearance.backgroundColor);
                SurveyHelper.renderFlatBorders(this.controller, {
                    xLeft: this.layout.xLeft,
                    xRight: this.layout.xLeft + this.layout.width,
                    yTop: bricksOnPage.yTop,
                    yBot: bricksOnPage.yBot,
                    width: this.layout.width,
                    height: bricksOnPage.height }, { ...this.appearance });
                this.controller.doc.rect(
                    this.layout.xLeft + this.includedBorderWidth,
                    bricksOnPage.yTop + this.includedBorderWidth,
                    this.layout.width - this.includedBorderWidth * 2,
                    bricksOnPage.height - this.includedBorderWidth * 2,
                    'F');
                this.controller.doc.setFillColor(oldFillColor);
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
}