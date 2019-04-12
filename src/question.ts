import { IQuestion, Question } from "survey-core";
import { IPoint, IRect, DocOptions } from "./docOptions"

export interface IPdfQuestion {
    renderContent(point: IPoint, isRender: boolean): IRect[];
    render(point: IPoint, isRender: boolean): IRect[];
}
export class PdfQuestion implements IPdfQuestion {
    constructor(
        protected question: IQuestion,
        protected docOptions: DocOptions
    ) { }
    private renderTitle(point: IPoint, isRender: boolean = true): IRect {
        this.docOptions.doc.setFontStyle("bold");
        let question = this.getQuestion<Question>();
        let number = question["no"] != "" ? question["no"] + " . " : "";
        let textBoundaries = this.renderText(
            point,
            number + question.title,
            isRender
        );
        this.docOptions.doc.setFontStyle("normal");
        return textBoundaries;
    }
    renderText(point: IPoint, text: string, isRender: boolean = true): IRect {
        let boundaruies: IRect = {
            xLeft: point.xLeft,
            xRight:
                point.xLeft +
                text.length * this.docOptions.fontSize * this.docOptions.xScale,
            yTop: point.yTop,
            yBot: point.yTop + this.docOptions.fontSize * this.docOptions.yScale
        };
        if (isRender) {
            let alignPoint = this.alignPoint(point, boundaruies);
            this.docOptions.doc.text(text, alignPoint.xLeft, alignPoint.yTop, {
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
                let contentPoint: IPoint = {
                    xLeft: titleRect.xLeft,
                    yTop: titleRect.yBot
                };
                let contentRects: IRect[] = this.renderContent(contentPoint, isRender);
                if (contentRects[0].yTop !== this.docOptions.margins.marginTop) {
                    contentRects[0].xLeft = titleRect.xLeft;
                    contentRects[0].xRight = Math.max(
                        contentRects[0].xRight,
                        titleRect.xRight
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
                let isNewPage: boolean = this.docOptions.tryNewPageElement(
                    titleRect.yBot,
                    isRender
                );
                if (isNewPage) {
                    titlePoint.xLeft = this.docOptions.margins.marginLeft;
                    titlePoint.yTop = this.docOptions.margins.marginTop;
                }
                titleRect = this.renderTitle(titlePoint, isRender);
                if (isNewPage) {
                    contentRects.push(titleRect);
                } else {
                    contentRects[contentRects.length - 1].xRight = Math.max(
                        contentRects[contentRects.length - 1].xRight,
                        titleRect.xRight
                    );
                    contentRects[contentRects.length - 1].yBot = titleRect.yBot;
                }
                return contentRects;
            }
            case "left": {
                let titleRect: IRect = this.renderTitle(point, isRender);
                let contentPoint: IPoint = {
                    xLeft: titleRect.xRight,
                    yTop: titleRect.yTop
                };
                let contentRects: IRect[] = this.renderContent(contentPoint, isRender);
                contentRects[0].xLeft = titleRect.xLeft;
                contentRects[0].yBot = Math.max(contentRects[0].yBot, titleRect.yBot);
                return contentRects;
            }
            case "hidden": {
                return this.renderContent(point, isRender);
            }
        }
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
}

