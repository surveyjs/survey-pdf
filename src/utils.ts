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

export interface IPadding {
  top: number;
  bot: number;
  left: number;
  right: number;
}

export function parsePadding(padding: Array<number> | number): IPadding {
    if (Array.isArray(padding) && padding.length > 1) {
        if (padding.length == 2) {
            return {
                top: padding[0],
                bot: padding[0],
                left: padding[1],
                right: padding[1],
            };
        }
        if (padding.length == 3) {
            return {
                top: padding[0],
                left: padding[1],
                right: padding[1],
                bot: padding[2],
            };
        }
        if (padding.length == 4) {
            return {
                top: padding[0],
                right: padding[1],
                bot: padding[2],
                left: padding[3],
            };
        }
    } else {
        const value = Array.isArray(padding) ? padding[0] : padding;
        return {
            top: value,
            bot: value,
            right: value,
            left: value,
        };
    }
}
