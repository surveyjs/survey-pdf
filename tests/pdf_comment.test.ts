import { TestHelper } from '../src/helper_test';
import { checkFlatSnapshot, checkPDFSnapshot } from './snapshot_helper';

const largeCommentText = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus.';

var json = {
    showQuestionNumbers: 'on',
    'elements': [
        {
            'type': 'comment',
            'name': 'comment'
        }
    ]
};

test('Check long comment splitted in multiple pages', async () => {
    await checkPDFSnapshot(json, {
        controllerOptions: {
            fontSize: 20
        },
        onSurveyCreated: (survey) => {
            survey.mode = 'display';
            survey.data = {
                comment: `${largeCommentText} ${largeCommentText} ${largeCommentText}`
            };
        },
        snapshotName: 'long_comment',
    });
});

test('Check medium comment', async () => {
    await checkPDFSnapshot(json, {
        controllerOptions: {
            fontSize: 20
        },
        onSurveyCreated: (survey) => {
            survey.mode = 'display';
            survey.data = {
                comment: `${largeCommentText}`
            };
        },
        snapshotName: 'medium_comment',
    });
});

test('Check short comment', async () => {
    await checkPDFSnapshot(json, {
        controllerOptions: {
            fontSize: 20
        },
        onSurveyCreated: (survey) => {
            survey.mode = 'display';
            survey.data = {
                comment: 'Small text'
            };
        },
        snapshotName: 'short_comment',
    });
});