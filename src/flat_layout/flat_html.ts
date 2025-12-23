import { QuestionHtmlModel, Serializer } from 'survey-core';
import { IPoint } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { SurveyHelper } from '../helper_survey';
import { EmptyBrick } from '../pdf_render/pdf_empty';
import { IQuestionHtmlStyle } from '../styles/types';

export type IHTMLRenderType = 'auto' | 'standard' | 'image';
export class FlatHTML extends FlatQuestion<QuestionHtmlModel, IQuestionHtmlStyle> {
    private chooseRender(html: string): IHTMLRenderType {
        if (/<[^>]*style[^<]*>/.test(html) ||
            /<[^>]*table[^<]*>/.test(html) ||
            /&\w+;/.test(html)) {
            return 'image';
        }
        return 'standard';
    }

    private static correctHtmlRules: [{ searchRegExp: RegExp, replaceString: string }] = [
        { searchRegExp: /(<\/?br\s*?\/?\s*?>\s*){2,}/g, replaceString: '<br>' }
    ];
    protected correctHtml(html: string): string {
        FlatHTML.correctHtmlRules.forEach((rule) => {
            html = html.replace(rule.searchRegExp, rule.replaceString);
        });
        return html;
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        let renderAs: IHTMLRenderType = <IHTMLRenderType>this.question.renderAs;
        if(!SurveyHelper.hasDocument) {
            return [new EmptyBrick(this.controller, SurveyHelper.createRect(point, 0, 0))];
        }
        if (renderAs === 'auto') renderAs = this.controller.htmlRenderAs;
        if (renderAs === 'auto') renderAs = this.chooseRender(SurveyHelper.getLocString(this.question.locHtml));
        const html: string = SurveyHelper.createHtmlContainerBlock(SurveyHelper.getLocString(this.question.locHtml), this.controller, this.styles.text);
        if (renderAs === 'image') {
            const width: number = SurveyHelper.getPageAvailableWidth(this.controller);
            const { url, aspect }: { url: string, aspect: number } =
            await SurveyHelper.htmlToImage(html, width, this.controller);
            const height: number = width / aspect;
            return [await SurveyHelper.createImageFlat(point, this.question, this.controller, { link: url, width, height })];
        }
        return [SurveyHelper.splitHtmlRect(this.controller, await SurveyHelper.createHTMLFlat(
            point, this.controller, this.correctHtml(html), this.styles.text))];
    }
}

Serializer.removeProperty('html', 'renderAs');
Serializer.addProperty('html', {
    name: 'renderAs',
    default: 'auto',
    visible: false,
    choices: ['auto', 'standard', 'image']
});
FlatRepository.getInstance().register('html', FlatHTML);