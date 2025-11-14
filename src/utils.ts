import { type IRect } from './doc_controller';

export function mergeRects(...rects: IRect[]): IRect {
    const resultRect: IRect = {
        xLeft: rects[0].xLeft,
        xRight: rects[0].xRight,
        yTop: rects[0].yTop,
        yBot: rects[0].yBot
    };
    rects.forEach((rect: IRect) => {
        resultRect.xLeft = Math.min(resultRect.xLeft, rect.xLeft),
        resultRect.xRight = Math.max(resultRect.xRight, rect.xRight),
        resultRect.yTop = Math.min(resultRect.yTop, rect.yTop),
        resultRect.yBot = Math.max(resultRect.yBot, rect.yBot);
    });
    return resultRect;
}