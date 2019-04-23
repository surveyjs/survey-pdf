import IntervalTree from 'node-interval-tree';
import { DocOptions } from '../doc_controller';
import { IPdfBrick } from '../pdf_render/pdf_brick';

interface PackInterval {
    pageIndex: number;
    yBot: number;
}
export class PagePacker {
    static findBotInterval(intervals: PackInterval[]): PackInterval {
        if (intervals.length == 0) {
            return { pageIndex:0, yBot: 0.0 };
        }
        return intervals.reduce((mx, cr) => {
            if (cr.pageIndex > mx.pageIndex) return cr;
            if (cr.pageIndex < mx.pageIndex) return mx;
            return cr.yBot > mx.yBot ? cr : mx;
        }, intervals[0]);
    }
    static addPack(packs: IPdfBrick[][], index: number, brick: IPdfBrick) {
        if (index == packs.length) {
            packs.push(new Array<IPdfBrick>());
        }
        packs[index].push(brick);
    }
    //TODO boundary case problem
    static pack(flats: IPdfBrick[], options: DocOptions): IPdfBrick[][] {
        return [flats]; //TEMP
        flats.sort((a: IPdfBrick, b: IPdfBrick) => {
            if (a.yTop < b.yTop) return -1;
            if (a.yTop > b.yTop) return 1;
            if (a.xLeft > b.xLeft) return 1;
            if (a.xLeft < b.xLeft) return -1;
            return 0;
        });
        let pageBot: number = options.paperHeight - options.margins.marginBot;
        let packs: IPdfBrick[][] = new Array<IPdfBrick[]>();
        let tree: IntervalTree<PackInterval> = new IntervalTree(); 
        flats.forEach((flat: IPdfBrick) => {
            let intervals: PackInterval[] = tree.search(flat.xLeft, flat.xRight);
            let { pageIndex, yBot } = PagePacker.findBotInterval(intervals);
            let height: number = flat.yBot - flat.yTop;
            if (yBot + height > pageBot) {
                tree.insert(flat.xLeft, flat.xRight, { pageIndex: ++pageIndex, yBot: 0 });
                flat.yTop = 0; 
            }
            else {
                tree.insert(flat.xLeft, flat.xRight, { pageIndex: pageIndex, yBot: yBot + height });
                flat.yTop = yBot;
            }
            flat.yBot = flat.yTop + height;
            PagePacker.addPack(packs, pageIndex, flat);
        });
        return packs;
    }
}