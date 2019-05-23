import IntervalTree from 'node-interval-tree';
import { DocOptions } from '../doc_controller';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { SurveyHelper } from '../helper_survey';

interface PackInterval {
    pageIndex: number;
    xLeft: number;
    xRight: number;
    yBot: number;
    absBot: number;
}
export class PagePacker {
    private static findBotInterval(intervals: PackInterval[],
        xLeft: number, xRight: number, options: DocOptions): PackInterval {
        intervals.push({ pageIndex: 0, xLeft:
            options.margins.left, xRight: options.margins.left,
            yBot: options.margins.top, absBot: options.margins.top });
        return intervals.reduce((mx, cr) => {
            if (Math.abs(cr.xRight - xLeft) < SurveyHelper.EPSILON ||
                Math.abs(cr.xLeft - xRight) < SurveyHelper.EPSILON) return mx;
            if (cr.pageIndex < mx.pageIndex) return mx;
            if (cr.pageIndex > mx.pageIndex) return cr;
            return cr.yBot > mx.yBot ? cr : mx;
        }, intervals[intervals.length - 1]);
    }
    private static addPack(packs: IPdfBrick[][], index: number, brick: IPdfBrick) {
        if (index == packs.length) {
            packs.push([]);
        }
        packs[index].push(brick);
    }
    public static pack(flats: IPdfBrick[][], options: DocOptions): IPdfBrick[][] {
        let pageHeight: number = options.paperHeight -
            options.margins.top - options.margins.bot; 
        let unfoldFlats: IPdfBrick[][] = [];
        flats.forEach((flatsPage: IPdfBrick[]) => {
            unfoldFlats.push([]);
            flatsPage.forEach((flat: IPdfBrick) => {
                let flatHeight: number = flat.yBot - flat.yTop;
                if (flatHeight > pageHeight + SurveyHelper.EPSILON) {
                    unfoldFlats[unfoldFlats.length - 1].push(...flat.unfold());
                }
                else unfoldFlats[unfoldFlats.length - 1].push(flat);
            });
        });
        unfoldFlats.forEach((unfoldFlatsPage: IPdfBrick[]) => {
            unfoldFlatsPage.sort((a: IPdfBrick, b: IPdfBrick) => {
                if (a.yTop < b.yTop) return -1;
                if (a.yTop > b.yTop) return 1;
                if (a.xLeft > b.xLeft) return 1;
                if (a.xLeft < b.xLeft) return -1;
                return 0;
            });
        });
        let pageIndexModel: number = 0;
        let packs: IPdfBrick[][] = [];
        let pageBot: number = options.paperHeight - options.margins.bot;
        unfoldFlats.forEach((unfoldFlatsPage: IPdfBrick[]) => {
            let tree: IntervalTree<PackInterval> = new IntervalTree();
            unfoldFlatsPage.forEach((flat: IPdfBrick) => {
                let intervals: PackInterval[] = tree.search(flat.xLeft, flat.xRight);
                let { pageIndex, yBot, absBot } = PagePacker.findBotInterval(
                    intervals, flat.xLeft, flat.xRight, options);
                let height: number = flat.yBot - flat.yTop;
                flat.yTop = yBot + flat.yTop - absBot;
                if (Math.abs(flat.yTop - options.margins.top) > SurveyHelper.EPSILON &&
                    flat.yTop + height > pageBot + SurveyHelper.EPSILON) {
                    flat.yTop = options.margins.top;
                    pageIndex++;
                }
                tree.insert(flat.xLeft, flat.xRight, { pageIndex: pageIndex,
                    xLeft: flat.xLeft, xRight: flat.xRight,
                    yBot: flat.yTop + height, absBot: flat.yBot });
                flat.yBot = flat.yTop + height;
                PagePacker.addPack(packs, pageIndexModel + pageIndex, flat);
            });
            pageIndexModel++;
        });
        return packs;
    }
}