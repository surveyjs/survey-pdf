import { IRect, DocController, ISize } from '../doc_controller';
import { IPdfBrick, IPdfBrickOptions, PdfBrick, TranslateXFunction } from './pdf_brick';
import { SurveyHelper, IInputAppearanceOptions } from '../helper_survey';
import { mergeRects } from '../utils';
export interface ITextFieldBrickOptions extends IPdfBrickOptions {
    isReadOnly: boolean;
    fieldName: string;
    shouldRenderBorders: boolean;
    value?: string;
    placeholder?: string;
    inputType?: string;
    isMultiline?: boolean;
}

export class TextFieldBrick extends PdfBrick {
    public constructor(controller: DocController,
        rect: IRect, protected options: ITextFieldBrickOptions, protected appearance: IInputAppearanceOptions
    ) {
        super(controller, rect);
        options.isMultiline = options.isMultiline ?? false;
        options.placeholder = options.placeholder ?? '';
        options.inputType = options.inputType ?? '';
        options.value = options.value ?? '';
    }
    private renderColorQuestion(): void {
        this.controller.setFillColor(this.options.value || 'black');
        this.controller.doc.rect(this.contentRect.xLeft, this.contentRect.yTop,
            this.contentRect.width, this.contentRect.height, 'F');
        this.controller.restoreFillColor();
    }
    public async renderInteractive(): Promise<void> {
        if (this.options.inputType === 'color') {
            this.renderColorQuestion();
            return;
        }
        const formScale = SurveyHelper.getRectBorderScale(this.contentRect, this.appearance.borderWidth ?? 0);
        const scaledAcroformRect = SurveyHelper.createAcroformRect(SurveyHelper.scaleRect(this.contentRect, formScale));
        if(this.appearance.backgroundColor) {
            this.controller.setFillColor(this.appearance.backgroundColor);
            this.controller.doc.rect(...scaledAcroformRect, 'F');
            this.controller.restoreFillColor();
        }
        const { color: fontColor } = SurveyHelper.parseColor(this.appearance.fontColor);
        const inputField: any = this.options.inputType === 'password' ?
            new (<any>this.controller.doc.AcroFormPasswordField)() :
            new (this.controller.AcroFormTextField)();
        inputField.fieldName = this.options.fieldName;
        inputField.fontName = this.appearance.fontName;
        inputField.fontSize = this.appearance.fontSize;
        inputField.maxFontSize = this.appearance.fontSize;
        inputField.isUnicode = SurveyHelper.isCustomFont(
            this.controller, inputField.fontName);
        if (this.options.inputType !== 'password') {
            inputField.V = this.getCorrectedText(this.options.value);
            inputField.DV = this.getCorrectedText(this.options.placeholder);
        }
        else inputField.value = '';
        inputField.multiline = this.options.isMultiline;
        inputField.readOnly = this.options.isReadOnly;
        inputField.color = fontColor;
        inputField.Rect = scaledAcroformRect;
        this.controller.doc.addField(inputField);
        SurveyHelper.renderFlatBorders(this.controller, this.contentRect, this.appearance);
    }
    protected shouldRenderFlatBorders(): boolean {
        return this.options.shouldRenderBorders;
    }
    private _textBrick: IPdfBrick;
    public get textBrick(): IPdfBrick {
        return this._textBrick;
    }
    public set textBrick(val: IPdfBrick) {
        this._textBrick = val;
        const unFoldedBricks = val.unfold();
        const bricksCount = unFoldedBricks.length;
        let renderedBricksCount = 0;
        const bricksByPage: { [index: number]: Array<IRect & ISize> } = {};
        const afterRenderTextBrickCallback = (brick: PdfBrick) => {
            if(this.shouldRenderFlatBorders()) {
                renderedBricksCount++;
                const currentPageNumber = this.controller.getCurrentPageIndex();
                if(!bricksByPage[currentPageNumber]) {
                    bricksByPage[currentPageNumber] = [];
                }
                bricksByPage[currentPageNumber].push(brick.contentRect);
                if(renderedBricksCount >= bricksCount) {
                    const keys = Object.keys(bricksByPage);
                    const renderedOnOnePage = keys.length == 1;
                    keys.forEach((key: string) => {
                        const mergedRect = mergeRects(...bricksByPage[key as any]);
                        const borderRect = {
                            xLeft: this.contentRect.xLeft,
                            xRight: this.contentRect.xRight,
                            width: this.contentRect.width,
                            yTop: renderedOnOnePage ? this.contentRect.yTop : mergedRect.yTop,
                            yBot: renderedOnOnePage ? this.contentRect.yBot : mergedRect.yBot,
                            height: renderedOnOnePage ? this.contentRect.height : mergedRect.yBot - mergedRect.yTop,
                        };
                        this.controller.setPage(Number(key));
                        SurveyHelper.renderFlatBorders(this.controller, borderRect, this.appearance);
                        this.controller.setPage(currentPageNumber);
                    });
                }
            }
        };
        unFoldedBricks.forEach((brick: PdfBrick) => {
            brick.afterRenderCallback = afterRenderTextBrickCallback.bind(this.contentRect, brick);
        });
        this.updateRect();
    }
    public updateRect(): void {
        if(this.textBrick) {
            this.textBrick.updateRect();
            this._xLeft = this.textBrick.xLeft;
            this._xRight = this.textBrick.xRight;
            this._yTop = this.textBrick.yTop;
            this._yBot = this.textBrick.yBot;
        }
    }

    public async renderReadOnly(): Promise<void> {
        this.controller.pushMargins(this.contentRect.xLeft,
            this.controller.paperWidth - this.contentRect.xRight);
        if (this.options.inputType === 'color') {
            this.renderColorQuestion();
        } else {
            await this.textBrick.render();
        }
        this.controller.popMargins();
    }
    public unfold(): IPdfBrick[] {
        if (this.getShouldRenderReadOnly() && this.options.inputType !== 'color') {
            return this.textBrick.unfold();
        } else {
            return super.unfold();
        }
    }
    public translateX(func: TranslateXFunction): void {
        const res = func(this.contentRect.xLeft, this.contentRect.xRight);
        this._xLeft = res.xLeft;
        this._xRight = res.xRight;
        if(this.textBrick) {
            this.textBrick.translateX(func);
        }
    }
    protected setXLeft(val: number): void {
        const delta = val - this._xLeft;
        super.setXLeft(val);
        if(this.textBrick) {
            this.textBrick.xLeft = this.textBrick.xLeft + delta;
        }
    }
    protected setXRight(val: number): void {
        const delta = val - this._xRight;
        super.setXRight(val);
        if(this.textBrick) {
            this.textBrick.xRight = this.textBrick.xRight + delta;
        }
    }
    protected setYTop(val: number): void {
        const delta = val - this._yTop;
        super.setYTop(val);
        if(this.textBrick) {
            this.textBrick.yTop = this.textBrick.yTop + delta;
        }
    }
    protected setYBottom(val: number): void {
        const delta = val - this._yBot;
        super.setYBottom(val);
        if(this.textBrick) {
            this.textBrick.yBot = this.textBrick.yBot + delta;
        }
    }
    public setPageNumber(val: number): void {
        if(this.getShouldRenderReadOnly() && this.options.inputType !== 'color') {
            this.textBrick.setPageNumber(val);
        } else {
            super.setPageNumber(val);
        }
    }
    public getPageNumber(): number {
        if(this.getShouldRenderReadOnly() && this.options.inputType !== 'color') {
            return this.textBrick.getPageNumber();
        } else {
            return super.getPageNumber();
        }
    }
    public increasePadding(val: { top: number, bottom: number }): void {
        if(val.top == 0 && val.bottom == 0) return;
        if(this.getShouldRenderReadOnly() && this.options.inputType !== 'color') {
            this.textBrick.increasePadding(val);
            this.updateRect();
        } else {
            super.increasePadding(val);
        }
    }
    public addBeforeRenderCallback(func: (brick: IPdfBrick) => void): void {
        if(this.getShouldRenderReadOnly() && this.options.inputType !== 'color') {
            this.textBrick.addBeforeRenderCallback(func);
        } else {
            super.addBeforeRenderCallback(func);
        }
    }
}