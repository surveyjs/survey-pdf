(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};
import { checkFlatSnapshot } from './snapshot_helper';
import { FlatImage } from '../src/flat_layout/flat_image';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
import '../src/flat_layout/flat_image';

test('Check image question 100x100px', async () => {
    SurveyHelper.shouldConvertImageToPng = false;
    const json: any = {
        elements: [
            {
                type: 'image',
                name: 'image_question',
                titleLocation: 'hidden',
                imageLink: TestHelper.BASE64_IMAGE_100PX
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'image_100x100'
    });
    SurveyHelper.shouldConvertImageToPng = true;
});

test('Check image question with "auto"', async () => {
    const getOldImageSize = SurveyHelper.getImageSize;
    SurveyHelper.getImageSize = async () => {
        return { width: 100, height: 75 };
    };
    SurveyHelper.shouldConvertImageToPng = false;
    const json: any = {
        elements: [
            {
                type: 'image',
                name: 'image_question',
                titleLocation: 'hidden',
                imageHeight: 'auto',
                imageWidth: 100,
                imageLink: TestHelper.BASE64_IMAGE_100PX
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'image_100xauto'
    });
    await checkFlatSnapshot(json, {
        snapshotName: 'image_autox100',
        onSurveyCreated: (survey) => {
            survey.getAllQuestions()[0].imageWidth = 'auto';
            survey.getAllQuestions()[0].imageHeight = '100';
        }
    });
    SurveyHelper.shouldConvertImageToPng = true;
    SurveyHelper.getImageSize = getOldImageSize;
});

test('Check image question with "auto" and 100%', async () => {
    const getOldImageSize = SurveyHelper.getImageSize;
    SurveyHelper.getImageSize = async () => {
        return { width: 100, height: 75 };
    };
    SurveyHelper.shouldConvertImageToPng = false;
    const json: any = {
        elements: [
            {
                type: 'image',
                name: 'image_question',
                titleLocation: 'hidden',
                imageHeight: 'auto',
                imageWidth: '100%',
                imageLink: TestHelper.BASE64_IMAGE_100PX
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'image_100%xauto',
    });
    SurveyHelper.getImageSize = getOldImageSize;
});

test('Check image question 100x100px with set size server-side', async () => {
    SurveyHelper.inBrowser = false;
    const json: any = {
        elements: [
            {
                type: 'image',
                name: 'image_question',
                titleLocation: 'hidden',
                imageLink: TestHelper.BASE64_IMAGE_100PX,
                imageWidth: 160,
                imageHeight: 110,
            }
        ]
    };
    await checkFlatSnapshot(json, {
        snapshotName: 'image_100x100_server_side_set_size',
    });
    SurveyHelper.inBrowser = true;
});