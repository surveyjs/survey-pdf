import IntervalTree from 'node-interval-tree';
import { DocOptions, DocController } from '../doc_controller';
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
    private static findBotInterval(tree: IntervalTree<PackInterval>,
        xLeft: number, xRight: number, options: DocOptions): PackInterval {
        const intervals: PackInterval[] = tree.search(xLeft, xRight);
        intervals.push({
            pageIndex: 0, xLeft:
                options.margins.left, xRight: options.margins.left,
            yBot: options.margins.top, absBot: options.margins.top
        });
        return intervals.reduce((mx, cr) => {
            if (Math.abs(cr.xRight - xLeft) < SurveyHelper.EPSILON ||
                Math.abs(cr.xLeft - xRight) < SurveyHelper.EPSILON) return mx;
            if (cr.pageIndex < mx.pageIndex) return mx;
            if (cr.pageIndex > mx.pageIndex) return cr;
            return cr.yBot > mx.yBot ? cr : mx;
        }, intervals[intervals.length - 1]);
    }
    private static addPack(packs: IPdfBrick[][], index: number, brick: IPdfBrick) {
        for (let i: number = packs.length; i <= index; i++) {
            packs.push([]);
        }
        packs[index].push(brick);
    }
    public static pack(flats: IPdfBrick[][], controller: DocController): IPdfBrick[][] {
        const pageHeight: number = controller.paperHeight -
            controller.margins.top - controller.margins.bot;
        const unfoldFlats: IPdfBrick[][] = [];
        flats.forEach((flatsPage: IPdfBrick[]) => {
            unfoldFlats.push([]);
            flatsPage.forEach((flat: IPdfBrick) => {
                if (flat.height > pageHeight + SurveyHelper.EPSILON) {
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
        const packs: IPdfBrick[][] = [];
        const pageBot: number = controller.paperHeight - controller.margins.bot;
        unfoldFlats.forEach((unfoldFlatsPage: IPdfBrick[]) => {
            const tree: IntervalTree<PackInterval> = new IntervalTree();
            let pageIndexShift: number = 0;
            unfoldFlatsPage.forEach((flat: IPdfBrick) => {
                let { pageIndex, yBot, absBot } = PagePacker.findBotInterval(
                    tree, flat.xLeft, flat.xRight, controller);
                const height: number = flat.height;
                flat.yTop = yBot + flat.yTop - absBot;
                if (Math.abs(flat.yTop - controller.margins.top) > SurveyHelper.EPSILON &&
                    flat.yTop + height > pageBot + SurveyHelper.EPSILON || flat.isPageBreak) {
                    flat.yTop = controller.margins.top;
                    pageIndex++;
                    pageIndexShift = Math.max(pageIndexShift, pageIndex);
                }
                tree.insert(flat.xLeft, flat.xRight, {
                    pageIndex: pageIndex,
                    xLeft: flat.xLeft, xRight: flat.xRight,
                    yBot: flat.yTop + height, absBot: flat.yBot
                });
                flat.yBot = flat.yTop + height;
                PagePacker.addPack(packs, pageIndexModel + pageIndex, flat);
            });
            pageIndexModel += pageIndexShift + 1;
        });
        return packs;
    }
}