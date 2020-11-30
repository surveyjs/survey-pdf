(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { SurveyPDF } from '../src/survey';
import { IRect, DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatImage } from '../src/flat_layout/flat_image';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
let __dummy_im = new FlatImage(null, null, null);

test('Check image question 100x100px', async () => {
    let json: any = {
        elements: [
            {
                type: 'image',
                name: 'image_question',
                titleLocation: 'hidden',
                imageLink: TestHelper.BASE64_IMAGE_100PX
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    controller.margins.left += controller.unitWidth;
    let width: number = (<any>survey.getAllQuestions()[0]).imageWidth;
    let height: number = (<any>survey.getAllQuestions()[0]).imageHeight;
    let widthPt: number = SurveyHelper.parseWidth(width + 'px',
        SurveyHelper.getPageAvailableWidth(controller));
    let heightPt: number = SurveyHelper.parseWidth(height + 'px',
        SurveyHelper.getPageAvailableWidth(controller));
    let assumeImage: IRect = {
        xLeft: controller.leftTopPoint.xLeft,
        xRight: controller.leftTopPoint.xLeft + widthPt,
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + heightPt
    };
    TestHelper.equalRect(expect, flats[0][0], assumeImage);
});