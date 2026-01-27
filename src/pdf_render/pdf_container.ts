import { DocController, IPoint } from '../doc_controller';
import { BorderMode, BorderRect, IBorderExtendedStyle, SurveyHelper } from '../helper_survey';
import { IPdfBrick } from './pdf_brick';
import { CompositeBrick } from './pdf_composite';
import { type IPadding, parsePadding } from '../utils';

interface IContainerBrickStyle extends IBorderExtendedStyle {
    padding: Array<number> | number;
    backgroundColor: string | null;
}

const defaultContainerOptions: IContainerBrickStyle = {
    padding: 0,
    borderWidth: 0,
    backgroundColor: null,
    borderColor: null,
    borderMode: 1,
    borderRadius: 0
};

export class ContainerBrick extends CompositeBrick {
    private style: Readonly<IContainerBrickStyle>;
    private get includedBorderWidth() {
        switch(this.style.borderMode) {
            case BorderMode.Inside:
                return this.style.borderWidth;
            case BorderMode.Middle:
                return this.style.borderWidth / 2;
            default:
                return 0;
        }
    }
    private _padding: IPadding;
    private get padding(): IPadding {
        if(!this._padding) {
            this._padding = parsePadding(this.style.padding);
        }
        return this._padding;
    }
    constructor(private controller: DocController, private layout: { xLeft: number, yTop: number, width: number }, style?: Partial<Readonly<IContainerBrickStyle>>) {
        super();
        this.style = SurveyHelper.mergeObjects({}, defaultContainerOptions, style);
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
        this.increasePadding({ top: this.padding.top + this.includedBorderWidth, bottom: this.padding.bot + this.includedBorderWidth });
        let renderedPageIndex = -1;
        const callback = () => {
            const currentPageIndex = this.controller.getCurrentPageIndex();
            if(currentPageIndex == renderedPageIndex) {
                return;
            } else {
                renderedPageIndex = currentPageIndex;
                const unfoldedBricks = this.unfold().filter(brick => !brick.isEmpty);
                const unfoldedBricksOnPage = unfoldedBricks.filter(brick => brick.getPageNumber() == currentPageIndex);
                const mergedRect = SurveyHelper.mergeRects(...unfoldedBricksOnPage);
                let borderRect = BorderRect.All;
                if(unfoldedBricks[0] != unfoldedBricksOnPage[0]) {
                    borderRect ^= BorderRect.Top;
                }
                if(unfoldedBricks[unfoldedBricks.length - 1] !== unfoldedBricksOnPage[unfoldedBricksOnPage.length - 1]) {
                    borderRect ^= BorderRect.Bottom;
                }
                if(this.style.backgroundColor !== null) {
                    this.controller.setFillColor(this.style.backgroundColor);
                    const rect = SurveyHelper.createRect(
                        { xLeft: this.layout.xLeft + this.includedBorderWidth, yTop: mergedRect.yTop + this.includedBorderWidth },
                        this.layout.width - this.includedBorderWidth * 2,
                        (mergedRect.yBot - mergedRect.yTop) - this.includedBorderWidth * 2);
                    const { lines, point } = SurveyHelper.getRoundedShape(rect, { ...this.style, borderRect, borderRadius: Math.max(this.style.borderRadius - (this.style.borderWidth - this.includedBorderWidth), 0) });
                    this.controller.doc.lines(lines, point.xLeft, point.yTop, [1, 1], 'F', true);
                    this.controller.restoreFillColor();
                }
                if(this.style.borderColor !== null) {
                    SurveyHelper.renderFlatBorders(this.controller, {
                        xLeft: this.layout.xLeft,
                        xRight: this.layout.xLeft + this.layout.width,
                        yTop: mergedRect.yTop,
                        yBot: mergedRect.yBot,
                        width: this.layout.width,
                        height: mergedRect.yBot - mergedRect.yTop }, { ...this.style, borderRect });
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
