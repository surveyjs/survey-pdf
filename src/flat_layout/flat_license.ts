import { DocController, IPoint } from '../doc_controller';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { TextBrick } from '../pdf_render/pdf_text';
import { LinkBrick } from '../pdf_render/pdf_link';
import { SurveyHelper } from '../helper_survey';
import { SurveyPDF } from '../survey';
import { ITextStyle } from '../style/types';

type ITextPart = { text: string } & ({isLink?: false} | { isLink: true, url: string })

export class FlatLicense {
    constructor(private survey: SurveyPDF, private controller: DocController) {

    }
    private getTextStyle(): ITextStyle {
        return {
            fontSize: 10,
            fontStyle: 'normal',
            fontName: 'helvetica',
            fontColor: '#000000',
            lineHeight: 12
        };
    }
    private getLinkStyle(): ITextStyle {
        return SurveyHelper.mergeObjects({}, this.getTextStyle(), { fontColor: '#0000FF' });
    }
    private getLicenseParts(license: string): Array<ITextPart> {
        const regex = /\[([^\]]+)\]\(([^)]+)\)|([^\[]+)/g;
        const parts: Array<ITextPart> = [];
        let match: RegExpExecArray | null;
        while ((match = regex.exec(license)) !== null) {
            if (match[1] && match[2]) {
                parts.push({
                    text: match[1],
                    isLink: true,
                    url: match[2]
                });
            } else if (match[3]) {
                parts.push({
                    text: match[3]
                });
            }
        }
        return parts;
    }
    private splitPartsToFit(parts: Array<ITextPart>, width: number): Array<Array<ITextPart>> {
        const lines: Array<Array<ITextPart>> = [];
        let currentLine: Array<ITextPart> = [];
        let currentLineWidth = 0;
        for (const part of parts) {
            let text = part.text;
            const words = text.split(/(\s+)/);
            for (const word of words) {
                if (word === '') continue;
                const wordWidth = this.controller.measureText(word, this.getTextStyle()).width;
                if (currentLineWidth + wordWidth > width && currentLine.length > 0) {
                    lines.push(currentLine);
                    currentLine = [];
                    currentLineWidth = 0;
                }
                currentLine.push({ ...part, text: word });
                currentLineWidth += wordWidth;
            }
        }
        if (currentLine.length > 0) {
            lines.push(currentLine);
        }
        return lines.map((line) => {
            let currentPart: ITextPart;
            const mergedLine: Array<ITextPart> = [];
            for (const part of line) {
                if(!currentPart || !(currentPart.isLink === part.isLink && (currentPart.isLink ? part.isLink && currentPart.url === part.url : true))) {
                    currentPart = part;
                    mergedLine.push(part);
                } else {
                    currentPart.text += part.text;
                }
            }
            mergedLine[mergedLine.length - 1].text = mergedLine[mergedLine.length - 1].text.trim();
            return mergedLine;
        });
    }
    private generateLicenseFlats(point: IPoint, lines: Array<Array<ITextPart>>, width: number): Array<IPdfBrick> {
        const resultBrick = new CompositeBrick();
        const currPoint = SurveyHelper.clone(point);
        for(const line of lines) {
            const lineBrick = new CompositeBrick();
            for(const part of line) {
                const textSize = this.controller.measureText(part.text, this.getTextStyle());
                let brick: IPdfBrick;
                if(part.isLink) {
                    brick = new LinkBrick(this.controller, SurveyHelper.createRect(currPoint, textSize.width, textSize.height), { text: part.text, link: part.url, readOnlyShowLink: false }, this.getLinkStyle());
                } else {
                    brick = new TextBrick(this.controller, SurveyHelper.createRect(currPoint, textSize.width, textSize.height), { text: part.text }, this.getTextStyle());
                }
                lineBrick.addBrick(brick);
                currPoint.xLeft += textSize.width;
            }
            this.centerLineBrick(lineBrick, point.xLeft, width + point.xLeft);
            resultBrick.addBrick(lineBrick);
            currPoint.yTop += lineBrick.height;
        }
        return [resultBrick];
    }
    private centerLineBrick(lineBrick: IPdfBrick, xLeft: number, xRight: number) {
        const shift = (xRight + xLeft - lineBrick.xRight - lineBrick.xLeft) / 2;
        lineBrick.translateX((xLeft, xRight) => {
            return { xLeft: xLeft + shift, xRight: xRight + shift };
        });
    }
    public generateFlats(point: IPoint): Array<IPdfBrick> {
        if(this.survey.haveCommercialLicense) {
            return [];
        }
        const license = this.survey.licenseText;
        const availableWidth = SurveyHelper.getPageAvailableWidth(this.controller);
        const licenseParts = this.getLicenseParts(license);
        const licenseLines = this.splitPartsToFit(licenseParts, availableWidth);
        const res = this.generateLicenseFlats(point, licenseLines, availableWidth);
        return res;
    }
}