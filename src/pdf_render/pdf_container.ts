import { DocController, IPoint } from '../doc_controller';
import { BorderMode, BorderRect, SurveyHelper } from '../helper_survey';
import { IPdfBrick } from './pdf_brick';
import { CompositeBrick } from './pdf_composite';
import { EmptyBrick } from './pdf_empty';

interface IContainerBrickAppearance {
    padding: Array<number> | number;
    borderWidth: number;
    borderColor: string | null;
    backgroundColor: string | null;
    borderMode: BorderMode;
}

export enum InseparableBrickMode {
    FIRST = 1, LAST = 2, BOTH = 3
}

const defaultContainerOptions: IContainerBrickAppearance = {
    padding: 0,
    borderWidth: 0,
    backgroundColor: null,
    borderColor: null,
    borderMode: 1,
};

interface IPadding {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

function parsePadding(padding: Array<number> | number): IPadding {
    if (Array.isArray(padding) && padding.length > 1) {
        if (padding.length == 2) {
            return {
                top: padding[0],
                bottom: padding[0],
                left: padding[1],
                right: padding[1],
            };
        }
        if (padding.length == 3) {
            return {
                top: padding[0],
                left: padding[1],
                right: padding[1],
                bottom: padding[2],
            };
        }
        if (padding.length == 4) {
            return {
                top: padding[0],
                right: padding[1],
                bottom: padding[2],
                left: padding[3],
            };
        }
    } else {
        const value = Array.isArray(padding) ? padding[0] : padding;
        return {
            top: value,
            bottom: value,
            right: value,
            left: value,
        };
    }
}

export class ContainerBrick extends CompositeBrick {
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
    private _padding: IPadding;
    private get padding(): IPadding {
        if(!this._padding) {
            this._padding = parsePadding(this.appearance.padding);
        }
        return this._padding;
    }
    constructor(private controller: DocController, private layout: { xLeft: number, yTop: number, width: number }, appearance?: Partial<Readonly<IContainerBrickAppearance>>) {
        super();
        this.appearance = SurveyHelper.mergeObjects({}, defaultContainerOptions, appearance);
    }
    getStartPoint(): IPoint {
        return { yTop: this.layout.yTop + this.padding.top + this.includedBorderWidth, xLeft: this.layout.xLeft + this.padding.left + this.includedBorderWidth };
    }
    startSetup() {
        this.controller.pushMargins();
        this.controller.margins.left = this.layout.xLeft + this.padding.left + this.includedBorderWidth;
        this.controller.margins.right = this.controller.paperWidth - (this.layout.xLeft + this.layout.width) + this.padding.right + this.includedBorderWidth;
    }
    finishSetup() {
        this.controller.popMargins();
        this.increasePadding({ top: this.padding.top + this.includedBorderWidth, bottom: this.padding.bottom + this.includedBorderWidth });
        let renderedPageIndex = -1;
        const callback = () => {
            const currentPageIndex = this.controller.getCurrentPageIndex();
            if(currentPageIndex == renderedPageIndex) {
                return;
            } else {
                renderedPageIndex = currentPageIndex;
                const unfoldedBricks = this.unfold();
                const unfoldedBricksOnPage = unfoldedBricks.filter(brick => brick.getPageNumber() == currentPageIndex);
                const mergedRect = SurveyHelper.mergeRects(...unfoldedBricksOnPage);
                let borderRect = BorderRect.All;
                if(unfoldedBricks[0] != unfoldedBricksOnPage[0]) {
                    borderRect ^= BorderRect.Top;
                }
                if(unfoldedBricks[unfoldedBricks.length - 1] !== unfoldedBricksOnPage[unfoldedBricksOnPage.length - 1]) {
                    borderRect ^= BorderRect.Bottom;
                }
                if(this.appearance.backgroundColor !== null) {
                    const oldFillColor = this.controller.doc.getFillColor();
                    this.controller.doc.setFillColor(this.appearance.backgroundColor);
                    this.controller.doc.rect(
                        this.layout.xLeft + this.includedBorderWidth,
                        mergedRect.yTop + this.includedBorderWidth,
                        this.layout.width - this.includedBorderWidth * 2,
                        (mergedRect.yBot - mergedRect.yTop) - this.includedBorderWidth * 2,
                        'F');
                    this.controller.doc.setFillColor(oldFillColor);
                }
                if(this.appearance.borderColor !== null) {
                    SurveyHelper.renderFlatBorders(this.controller, {
                        xLeft: this.layout.xLeft,
                        xRight: this.layout.xLeft + this.layout.width,
                        yTop: mergedRect.yTop,
                        yBot: mergedRect.yBot,
                        width: this.layout.width,
                        height: mergedRect.yBot - mergedRect.yTop }, { ...this.appearance, borderRect });
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
        if(alignCenter) {
            const shift = (height - this.height) / 2;
            this.translateY((yTop, yBot) => {
                return {
                    yTop: yTop + shift,
                    yBot: yBot + shift
                };
            });
            this.increasePadding({ top: shift, bottom: shift });
        } else {
            this.increasePadding({ top: 0, bottom: height - this.height });
        }
    }
}
