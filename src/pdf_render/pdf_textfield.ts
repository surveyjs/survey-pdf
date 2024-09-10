import { IQuestion, QuestionTextModel, settings } from 'survey-core';
import { IRect, DocController } from '../doc_controller';
import { IPdfBrick, PdfBrick, TranslateXFunction } from './pdf_brick';
import { SurveyHelper } from '../helper_survey';
import { CompositeBrick } from './pdf_composite';

export class TextFieldBrick extends PdfBrick {
    protected question: QuestionTextModel;
    public constructor(question: IQuestion, controller: DocController,
        rect: IRect, protected isQuestion: boolean,
        protected fieldName: string, protected value: string,
        protected placeholder: string, public isReadOnly: boolean,
        protected isMultiline: boolean, protected inputType: string) {
        super(question, controller, rect);
        this.question = <QuestionTextModel>question;
    }
    private renderColorQuestion(): void {
        let oldFillColor: string = this.controller.doc.getFillColor();
        this.controller.doc.setFillColor(this.question.value || 'black');
        this.controller.doc.rect(this.xLeft, this.yTop,
            this.width, this.height, 'F');
        this.controller.doc.setFillColor(oldFillColor);
    }
    public async renderInteractive(): Promise<void> {
        if (this.inputType === 'color') {
            this.renderColorQuestion();
            return;
        }
        const inputField: any = this.inputType === 'password' ?
            new (<any>this.controller.doc.AcroFormPasswordField)() :
            new (<any>this.controller.doc.AcroFormTextField)();
        inputField.fieldName = this.fieldName;
        inputField.fontName = this.controller.fontName;
        inputField.fontSize = this.fontSize;
        inputField.isUnicode = SurveyHelper.isCustomFont(
            this.controller, inputField.fontName);
        if (this.inputType !== 'password') {
            inputField.V = ' ' + this.getCorrectedText(this.value);
            inputField.DV = ' ' + this.getCorrectedText(this.placeholder);
        }
        else inputField.value = '';
        inputField.multiline = this.isMultiline;
        inputField.readOnly = this.isReadOnly;
        inputField.color = this.textColor;
        let formScale: number = SurveyHelper.formScale(this.controller, this);
        inputField.maxFontSize = this.controller.fontSize * formScale;
        inputField.Rect = SurveyHelper.createAcroformRect(
            SurveyHelper.scaleRect(this, formScale));
        this.controller.doc.addField(inputField);
        SurveyHelper.renderFlatBorders(this.controller, this);
    }
    protected shouldRenderFlatBorders(): boolean {
        return settings.readOnlyTextRenderMode === 'input';
    }
    protected getShouldRenderReadOnly(): boolean {
        return SurveyHelper.shouldRenderReadOnly(this.question, this.controller, this.isReadOnly);
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
        const bricksByPage: { [index: number]: Array<PdfBrick> } = {};
        const afterRenderTextBrickCallback = (brick: PdfBrick) => {
            if(this.shouldRenderFlatBorders()) {
                renderedBricksCount++;
                const currentPageNumber = this.controller.getCurrentPageIndex();
                if(!bricksByPage[currentPageNumber]) {
                    bricksByPage[currentPageNumber] = [];
                }
                bricksByPage[currentPageNumber].push(brick);
                if(renderedBricksCount >= bricksCount) {
                    const keys = Object.keys(bricksByPage);
                    const renderedOnOnePage = keys.length == 1;
                    keys.forEach((key: string) => {
                        const compositeBrick = new CompositeBrick();
                        bricksByPage[key as any].forEach((brick: PdfBrick) => {
                            compositeBrick.addBrick(brick);
                        });
                        const padding = this.controller.unitHeight * SurveyHelper.VALUE_READONLY_PADDING_SCALE;
                        const borderRect = {
                            xLeft: this.xLeft,
                            xRight: this.xRight,
                            width: this.width,
                            yTop: renderedOnOnePage ? this.yTop : compositeBrick.yTop - padding,
                            yBot: renderedOnOnePage ? this.yBot : compositeBrick.yBot + padding,
                            height: renderedOnOnePage ? this.height : compositeBrick.height + 2 * padding,
                            formBorderColor: this.formBorderColor,
                        };
                        this.controller.setPage(Number(key));
                        SurveyHelper.renderFlatBorders(this.controller, borderRect);
                        this.controller.setPage(currentPageNumber);
                    });
                }
            }
        };
        unFoldedBricks.forEach((brick: PdfBrick) => {
            brick.afterRenderCallback = afterRenderTextBrickCallback.bind(this, brick);
        });
    }
    public async renderReadOnly(): Promise<void> {
        this.controller.pushMargins(this.xLeft,
            this.controller.paperWidth - this.xRight);
        if (this.inputType === 'color') {
            this.renderColorQuestion();
        } else {
            await this.textBrick.render();
        }
        this.controller.popMargins();
    }
    public unfold(): IPdfBrick[] {
        if (this.getShouldRenderReadOnly() && this.inputType !== 'color') {
            return this.textBrick.unfold();
        } else {
            return super.unfold();
        }
    }
    public translateX(func: TranslateXFunction): void {
        const res = func(this.xLeft, this.xRight);
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
}