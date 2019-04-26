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
    static findBotInterval(intervals: PackInterval[],
        xLeft: number, xRight: number, options: DocOptions): PackInterval {
        intervals.push({ pageIndex: 0, xLeft:
            options.margins.marginLeft, xRight: options.margins.marginLeft,
            yBot: options.margins.marginTop, absBot: options.margins.marginTop });
        return intervals.reduce((mx, cr) => {
            if (Math.abs(cr.xRight - xLeft) < SurveyHelper.EPSILON ||
                Math.abs(cr.xLeft - xRight) < SurveyHelper.EPSILON) return mx;
            if (cr.pageIndex < mx.pageIndex) return mx;
            if (cr.pageIndex > mx.pageIndex) return cr;
            return cr.yBot > mx.yBot ? cr : mx;
        }, intervals[intervals.length - 1]);
    }
    static addPack(packs: IPdfBrick[][], index: number, brick: IPdfBrick) {
        if (index == packs.length) {
            packs.push(new Array<IPdfBrick>());
        }
        packs[index].push(brick);
    }
    static pack(flats: IPdfBrick[], options: DocOptions): IPdfBrick[][] {
        let pageHeight: number = options.paperHeight -
            options.margins.marginTop - options.margins.marginBot; 
        let unfoldFlats: IPdfBrick[] = new Array<IPdfBrick>();
        flats.forEach((flat: IPdfBrick) => {
            let flatHeight: number = flat.yBot - flat.yTop;
            if (flatHeight > pageHeight + SurveyHelper.EPSILON) {
                unfoldFlats.push(...flat.unfold());
            }
            else unfoldFlats.push(flat);
        });
        unfoldFlats.sort((a: IPdfBrick, b: IPdfBrick) => {
            if (a.yTop < b.yTop) return -1;
            if (a.yTop > b.yTop) return 1;
            if (a.xLeft > b.xLeft) return 1;
            if (a.xLeft < b.xLeft) return -1;
            return 0;
        });
        let pageBot: number = options.paperHeight - options.margins.marginBot;
        let packs: IPdfBrick[][] = new Array<IPdfBrick[]>();
        let tree: IntervalTree<PackInterval> = new IntervalTree(); 
        unfoldFlats.forEach((flat: IPdfBrick) => {
            let intervals: PackInterval[] = tree.search(flat.xLeft, flat.xRight);
            let { pageIndex, yBot, absBot } = PagePacker.findBotInterval(
                intervals, flat.xLeft, flat.xRight, options);
            let height: number = flat.yBot - flat.yTop;
            flat.yTop = yBot + flat.yTop - absBot;
            if (Math.abs(flat.yTop - options.margins.marginTop) > SurveyHelper.EPSILON &&
                flat.yTop + height > pageBot + SurveyHelper.EPSILON) {
                pageIndex++;
                flat.yTop = options.margins.marginTop;
            }
            tree.insert(flat.xLeft, flat.xRight, { pageIndex: pageIndex,
                xLeft: flat.xLeft, xRight: flat.xRight,
                yBot: flat.yTop + height, absBot: flat.yBot });
            flat.yBot = flat.yTop + height;
            PagePacker.addPack(packs, pageIndex, flat);
        });
        return packs;
    }
}