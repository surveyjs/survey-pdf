import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPoint, ISize } from '../doc_controller';
import { IPdfBrick, PdfBrick } from '../pdf_render/pdf_brick';
import { IBorderDescription, SurveyHelper } from '../helper_survey';
import { EmptyBrick } from '../pdf_render/pdf_empty';
import { CompositeBrick } from '../pdf_render/pdf_composite';

export class FlatSignaturePad extends FlatQuestion {
    public static BORDER_STYLE: 'dashed' | 'solid' | 'none' = 'dashed';
    private _signatureSize: ISize;
    private get signatureSize(): ISize {
        if(!this._signatureSize) {
            let width = SurveyHelper.pxToPt(<any>this.question.signatureWidth);
            let height = SurveyHelper.pxToPt(<any>this.question.signatureHeight);
            const availableWidth = SurveyHelper.getPageAvailableWidth(this.controller);
            if(width > availableWidth) {
                const newWidth: number = availableWidth;
                height *= newWidth / width;
                width = newWidth;
            }
            this._signatureSize = { width, height };
        }
        return this._signatureSize;
    }
    public async generateBackgroundImage(point: IPoint): Promise<IPdfBrick> {
        return await SurveyHelper.createImageFlat(point, this.question, this.controller, { link: this.question.backgroundImage, ...this.signatureSize, objectFit: 'cover' }, true);
    }
    private getSignImageUrl() {
        return this.question.storeDataAsText || !this.question.loadedData ? this.question.value : this.question.loadedData;
    }
    public async generateSign(point: IPoint): Promise<IPdfBrick> {
        let brick: PdfBrick;
        if(this.question.value) {
            brick = await SurveyHelper.createImageFlat(point,
                this.question, this.controller, { link: this.getSignImageUrl(), ...this.signatureSize }, false
            ) as PdfBrick;
        } else {
            brick = new EmptyBrick(this.controller, SurveyHelper.createRect(point, this.signatureSize.width, this.signatureSize.height));
        }
        if(FlatSignaturePad.BORDER_STYLE !== 'none') {
            brick.afterRenderCallback = () => {
                const borderOptions: IBorderDescription = {
                    height: brick.width,
                    width: brick.width,
                    yTop: brick.yTop,
                    yBot: brick.yBot,
                    xLeft: brick.xLeft,
                    xRight: brick.xRight,
                };
                SurveyHelper.renderFlatBorders(this.controller, borderOptions, {
                    borderColor: this.styles.inputBorderColor,
                    borderWidth: SurveyHelper.getScaledSize(this.controller, this.styles.inputBorderWidthScale),
                    dashStyle: FlatSignaturePad.BORDER_STYLE == 'dashed' ? {
                        dashArray: [5],
                        dashPhase: 0
                    } : undefined
                });
            };
        }

        return brick;
    }

    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        const compositeBrick = new CompositeBrick();
        if(this.question.backgroundImage) {
            compositeBrick.addBrick(await this.generateBackgroundImage(point));
        }
        compositeBrick.addBrick(await this.generateSign(point));
        return [compositeBrick];
    }
}

FlatRepository.getInstance().register('signaturepad', FlatSignaturePad);