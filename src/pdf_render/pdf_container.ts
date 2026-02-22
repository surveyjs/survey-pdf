import { DocController, IPoint } from '../doc_controller';
import { BorderMode, IBorderExtendedStyle, SurveyHelper } from '../helper_survey';
import { IPdfBrick } from './pdf_brick';
import { CompositeBrick } from './pdf_composite';
import { type ISideValues, parseSideValues } from '../utils';

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
    private includedBorderWidthValue: ISideValues<number>;
    private get includedBorderWidth(): ISideValues<number> {
        if(!this.includedBorderWidthValue) {
            const value = parseSideValues(this.style.borderWidth);
            Object.keys(value).forEach((key: keyof ISideValues) => {
                switch(this.style.borderMode) {
                    case BorderMode.Inside:
                        break;
                    case BorderMode.Middle:
                        value[key] = value[key] / 2;
                        break;
                    default:
                        return 0;
                }
            });
            this.includedBorderWidthValue = value;
        }
        return this.includedBorderWidthValue;
    }
    private _padding: ISideValues;
    private get padding(): ISideValues {
        if(!this._padding) {
            this._padding = parseSideValues(this.style.padding);
        }
        return this._padding;
    }
    constructor(private controller: DocController, private layout: { xLeft: number, yTop: number, width: number }, style?: Partial<Readonly<IContainerBrickStyle>>) {
        super();
        this.style = SurveyHelper.mergeObjects({}, defaultContainerOptions, style);
    }
    getStartPoint(): IPoint {
        return { yTop: this.layout.yTop + this.padding.top + this.includedBorderWidth.top, xLeft: this.layout.xLeft + this.padding.left + this.includedBorderWidth.left };
    }
    startSetup() {
        this.controller.pushMargins();
        this.controller.margins.left = this.layout.xLeft + this.padding.left + this.includedBorderWidth.left;
        this.controller.margins.right = this.controller.paperWidth - (this.layout.xLeft + this.layout.width) + this.padding.right + this.includedBorderWidth.right;
    }
    finishSetup() {
        this.controller.popMargins();
        this.increasePadding({ top: this.padding.top + this.includedBorderWidth.top, bottom: this.padding.bot + this.includedBorderWidth.bot });
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
                const keys = ['top', 'right', 'bot', 'left'];
                const borderWidth = new Array(4).fill(0, 0, 4).map((_, i) => (Array.isArray(this.style.borderWidth) ? this.style.borderWidth[i] : this.style.borderWidth) ?? 0);
                const borderRadius = new Array(4).fill(0, 0, 4).map((_, i) => {
                    const borderRadius = (Array.isArray(this.style.borderRadius) ? this.style.borderRadius[i] : this.style.borderRadius) ?? 0;
                    return Math.min(
                        Math.max(borderRadius - borderWidth[i] - this.includedBorderWidth[keys[i] as keyof ISideValues]), 0),
                    Math.max(borderRadius - (borderWidth[i - 1 < 0 ? borderWidth.length - 1 : i - 1] - this.includedBorderWidth[keys[i - 1 < 0 ? keys.length - 1 : i - 1] as keyof ISideValues]), 0);
                });
                if(unfoldedBricks[0] != unfoldedBricksOnPage[0]) {
                    borderRadius[0] = 0;
                    borderRadius[1] = 0;
                    borderWidth[0] = 0;
                }
                if(unfoldedBricks[unfoldedBricks.length - 1] !== unfoldedBricksOnPage[unfoldedBricksOnPage.length - 1]) {
                    borderRadius[2] = 0;
                    borderRadius[3] = 0;
                    borderWidth[2] = 0;
                }
                if(this.style.backgroundColor !== null) {
                    this.controller.setFillColor(this.style.backgroundColor);
                    const rect = SurveyHelper.createRect(
                        { xLeft: this.layout.xLeft + this.includedBorderWidth.left, yTop: mergedRect.yTop + this.includedBorderWidth.top },
                        this.layout.width - this.includedBorderWidth.left - this.includedBorderWidth.right,
                        (mergedRect.yBot - mergedRect.yTop) - this.includedBorderWidth.top - this.includedBorderWidth.bot);
                    const { lines, point } = SurveyHelper.getDocLinesFromShape(SurveyHelper.createRoundedShape(rect, { ...this.style, borderRadius }));
                    this.controller.doc.lines(lines, ...point, [1, 1], 'F', true);
                    this.controller.restoreFillColor();
                }
                if(this.style.borderColor !== null) {
                    SurveyHelper.renderFlatBorders(this.controller, {
                        xLeft: this.layout.xLeft,
                        xRight: this.layout.xLeft + this.layout.width,
                        yTop: mergedRect.yTop,
                        yBot: mergedRect.yBot,
                        width: this.layout.width,
                        height: mergedRect.yBot - mergedRect.yTop }, { ...this.style, borderRadius, borderWidth });
                }
            }
        };
        this.bricks.forEach(brick => {
            brick.addBeforeRenderCallback(callback);
        });
    }
    public getBricks(): Array<IPdfBrick> {
        return this.bricks.slice();
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
