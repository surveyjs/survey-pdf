import { IQuestion, Question } from "survey-core";
import { IPoint, IRect, DocController } from "./docController";

export interface IPdfQuestion {
    renderContent(point: IPoint, isRender: boolean): IRect[];
    render(point: IPoint, isRender: boolean): IRect[];
}
export class PdfQuestion implements IPdfQuestion {
    static DESCRIPTION_FONT_SIZE_SCALE_MAGIC: number = 2.0 / 3.0;
    constructor(
        protected question: IQuestion,
        protected docController: DocController
    ) { }
    private renderTitle(point: IPoint, isRender: boolean = true): IRect {
        this.docController.doc.setFontStyle("bold");
        let question: Question = this.getQuestion<Question>();
        let number: string = question["no"] != "" ? question["no"] + " . " : "";
        let required: string = question.isRequired ? " " + question.requiredText : "";
        let boundaries: IRect = this.renderText(
            point,
            number + question.title + required,
            isRender
        );
        this.docController.doc.setFontStyle("normal");
        return boundaries;
    }
    private renderDescription(point: IPoint, isRender: boolean = true): IRect {
        let oldFontSize: number = this.docController.fontSize;
        this.docController.fontSize = oldFontSize * PdfQuestion.DESCRIPTION_FONT_SIZE_SCALE_MAGIC;
        let boundaries: IRect = {
            xLeft: point.xLeft,
            xRight: point.xLeft,
            yTop: point.yTop,
            yBot: point.yTop
        }
        let question: Question = this.getQuestion<Question>();
        if (question.description != "") {
            boundaries = this.renderText(point, question.description, isRender);
        }
        this.docController.fontSize = oldFontSize;
        return boundaries;
    }
    renderText(point: IPoint, text: string, isRender: boolean = true): IRect {
        let { width, height } = this.docController.measureText(text);
        let boundaruies: IRect = {
            xLeft: point.xLeft,
            xRight: point.xLeft + width,
            yTop: point.yTop,
            yBot: point.yTop + height
        };
        if (isRender) {
            let alignPoint = this.alignPoint(point, boundaruies);
            this.docController.doc.text(text, alignPoint.xLeft, alignPoint.yTop, {
              align: "left",
              baseline: "middle"
            });
          }
        return boundaruies;
    }
    renderContent(point: IPoint, isRender: boolean = true): IRect[] {
        return [
            {
                xLeft: point.xLeft,
                xRight: point.xLeft,
                yTop: point.yTop,
                yBot: point.yTop
            }
        ];
    }
    render(point: IPoint, isRender: boolean = true): IRect[] {
        switch (this.getQuestion<Question>().titleLocation) {
            case "top":
            case "default": {
                let titleRect: IRect = this.renderTitle(point, isRender);
                let descPoint: IPoint = {
                    xLeft: titleRect.xLeft,
                    yTop: titleRect.yBot
                };
                let descRect: IRect = this.renderDescription(descPoint, isRender);
                let contentPoint: IPoint = {
                    xLeft: descRect.xLeft,
                    yTop: descRect.yBot
                };
                let contentRects: IRect[] = this.renderContent(contentPoint, isRender);
                if (contentRects[0].yTop !== this.docController.margins.marginTop) {
                    contentRects[0].xLeft = titleRect.xLeft;
                    contentRects[0].xRight = Math.max(
                        titleRect.xRight,
                        descRect.xRight,
                        contentRects[0].xRight,
                    );
                    contentRects[0].yTop = titleRect.yTop;
                } else {
                    contentRects.unshift(titleRect);
                }
                return contentRects;
            }
            case "bottom": {
                let contentRects: IRect[] = this.renderContent(point, isRender);
                let titlePoint: IPoint = {
                    xLeft: contentRects[contentRects.length - 1].xLeft,
                    yTop: contentRects[contentRects.length - 1].yBot
                };
                let titleRect: IRect = this.renderTitle(titlePoint, false);
                let descPoint: IPoint = {
                    xLeft: titleRect.xLeft,
                    yTop: titleRect.yBot
                };
                let descRect: IRect = this.renderDescription(descPoint, false);
                let isNewPage: boolean = this.docController.isNewPageElement(descRect.yBot);
                if (isNewPage) {
                    if (isRender) this.docController.addPage();
                    titlePoint.xLeft = this.docController.margins.marginLeft;
                    titlePoint.yTop = this.docController.margins.marginTop;
                }
                titleRect = this.renderTitle(titlePoint, isRender);
                descPoint = {
                    xLeft: titleRect.xLeft,
                    yTop: titleRect.yBot
                };
                descRect = this.renderDescription(descPoint, isRender);
                if (isNewPage) {
                    contentRects.push({
                        xLeft: titleRect.xLeft,
                        xRight: Math.max(titleRect.xRight, descRect.xRight),
                        yTop: titleRect.yTop,
                        yBot: descRect.yBot
                    });
                } else {
                    contentRects[contentRects.length - 1].xRight = Math.max(
                        titleRect.xRight,
                        descRect.xRight,
                        contentRects[contentRects.length - 1].xRight,
                    );
                    contentRects[contentRects.length - 1].yBot = descRect.yBot;
                }
                return contentRects;
            }
            case "left": {
                let titleRect: IRect = this.renderTitle(point, isRender);
                let descPoint: IPoint = {
                    xLeft: titleRect.xLeft,
                    yTop: titleRect.yBot
                };
                let descRect: IRect = this.renderDescription(descPoint, isRender);
                let contentPoint: IPoint = {
                    xLeft: Math.max(titleRect.xRight, descRect.xRight),
                    yTop: titleRect.yTop
                };
                let contentRects: IRect[] = this.renderContent(contentPoint, isRender);
                contentRects[0].xLeft = titleRect.xLeft;
                contentRects[0].yTop = titleRect.yTop;
                contentRects[0].yBot = Math.max(contentRects[0].yBot, descRect.yBot);
                return contentRects;
            }
            case "hidden": {
                return this.renderContent(point, isRender);
            }
        }
        // if (this.getQuestion<Question>().hasComment) {
        // let commentRect: IRect = this.renderComment(
        //     {
        //     xLeft: contentRects[contentRects.length - 1].xLeft,
        //     yTop: contentRects[contentRects.length - 1].yBot
        //     },
        //     isRender
        // );
        // if (commentRect.yTop == this.docController.margins.marginTop) {
        //     contentRects.push(commentRect);
        // } else {
        //     contentRects[contentRects.length - 1].yBot = commentRect.yBot;
        //     contentRects[contentRects.length - 1].xRight = Math.max(
        //     contentRects[contentRects.length - 1].xRight,
        //     commentRect.xRight
        //     );
        // }
        // }
        // return contentRects;
    }
    alignPoint(point: IPoint, boundaries: IRect): IPoint {
        return {
            xLeft: point.xLeft,
            yTop: point.yTop + (boundaries.yBot - boundaries.yTop) / 2.0
        };
    }
    getQuestion<T extends Question>(): T {
        return <T>this.question;
    }
    renderComment(point: IPoint, isRender: boolean) {
        let question = this.getQuestion<Question>();
        let textBoundaries = this.renderText(point, question.commentText, false);
        let textFieldWidth = this.docController.paperWidth -
        this.docController.margins.marginRight - point.xLeft;
        let textFieldHeight = this.docController.fontSize * this.docController.yScale * 3;
        let textField = new (<any>this.docController.doc.AcroFormTextField)();
        textField.fontSize = this.docController.fontSize;
        textField.maxFontSize = this.docController.fontSize;

        if (this.docController.isNewPageElement(textBoundaries.yBot + textFieldHeight)) {
            this.docController.addPage();
            textBoundaries.xRight =
                this.docController.margins.marginLeft +
                textBoundaries.xLeft -
                textBoundaries.xRight;
            textBoundaries.yBot =
                this.docController.margins.marginTop +
                textBoundaries.yBot -
                textBoundaries.yTop;
            textBoundaries.xLeft = this.docController.margins.marginLeft;
            textBoundaries.yTop = this.docController.margins.marginTop;
        }
        if (isRender) {
            this.renderText(point, question.commentText, true);
            textField.Rect = [
                textBoundaries.xLeft,
                textBoundaries.yBot,
                textFieldWidth,
                textFieldHeight
            ];
            textField.multiline = true;
            textField.value = "";
            this.docController.doc.addField(textField);
        }
        return {
            xLeft: textBoundaries.xLeft,
            xRight: textBoundaries.xLeft + textFieldWidth,
            yTop: textBoundaries.yTop,
            yBot: textBoundaries.yBot + textFieldHeight
        };
    }
}
