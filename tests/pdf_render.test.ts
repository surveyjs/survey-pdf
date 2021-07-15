(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
    return {};
};

import { IDocOptions, IRect } from '../src/doc_controller';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { CompositeBrick } from '../src/pdf_render/pdf_composite';
import { TestHelper } from '../src/helper_test';
import { SurveyPDF } from '../src/survey';

test('Check composite shift', () => {
	const flats: IRect[] = [
        { xLeft: 10, xRight: 50, yTop: 10, yBot: 20 },
        { xLeft: 10, xRight: 20, yTop: 20, yBot: 30 },
        { xLeft: 20, xRight: 50, yTop: 20, yBot: 30 }
    ];
    const composite: CompositeBrick = new CompositeBrick(...TestHelper.wrapRects(flats));
    composite.yTop = 80;
    composite.yBot = 100;
    const unfoldFlats: IPdfBrick[] = composite.unfold();
    TestHelper.equalRect(expect, unfoldFlats[0],
        { xLeft: 10, xRight: 50, yTop: 80, yBot: 90 });
    TestHelper.equalRect(expect, unfoldFlats[1],
        { xLeft: 10, xRight: 20, yTop: 90, yBot: 100 });
    TestHelper.equalRect(expect, unfoldFlats[2],
        { xLeft: 20, xRight: 50, yTop: 90, yBot: 100 });
});

function checkBalancedQ(pdf: string) {
    let balanced = true;
    pdf.split('<</').filter(s => s.substring(0, 11) === 'Type /Page\n').forEach(s => {
        let small = 0;
        let big = 0;
        s.split('\n').forEach(s => {
            let i = 0;
            while (i < s.length && s[i] === ' ') {
                i++;
            }
            if (i < s.length && s[i] === 'q') {
                while (i < s.length && s[i] !== 'B') {
                    if (s[i] === 'q') {
                        small++;
                    }
                    i++;
                }
            }
            if (i < s.length && (s[i] === 'Q' || s[i] === 'E')) {
                while (i < s.length) {
                    if (s[i] === 'Q') {
                        big++;
                    }
                    i++;
                }
            }
        });
        balanced = balanced && (small === big);
    });
    return balanced;
}

test('Check html two pages render', async () => {
    const json = {
        pages: [
         {
           name: "page1",
           elements: [
             {
               type: "html",
               name: "ckeditor",
               title: "CK Editor",
               html: `Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia."`,
               }
         ]
        }
       ],
       showProgressBar: "top"
    };
    const options: IDocOptions = {
        htmlRenderAs: 'standard',
        fontSize: 14,
        fontName: 'Times',
        format: [50, 50],
        margins: {
          left: 10,
          right: 10,
          top: 10,
          bot: 10,
        }
    };
    const survey: SurveyPDF = new SurveyPDF(json, options);
    const pdfAsString = await survey.raw();
    expect(checkBalancedQ(pdfAsString)).toBeTruthy();
});