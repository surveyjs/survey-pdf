(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
    return {};
};
import { SurveyPDF } from '../src/survey';
import { DocController } from '../src/doc_controller';
import { FlatTextbox } from '../src/flat_layout/flat_textbox';
import { TestHelper } from '../src/helper_test';
const __dummy_tb = new FlatTextbox(null, null, null);

test('Check html render in question description', async () => {
    const descriptor: any = Object.getOwnPropertyDescriptor(window, 'frames');
    jest.spyOn(window, 'frames', 'get').mockImplementation(() => {
        const frames = descriptor?.get();
        Object.keys(frames).filter(key => key.includes('jsPDFhtmlText')).forEach(key => {
            Object.defineProperty(frames[key].Element.prototype, 'clientWidth', { value: 100 });
        });
        return frames;
    });
    const json: any = {
        questions: [
            {
                type: 'text',
                description: '<table style="width: 100px; height: 100px"><tbody><tr><td>1</td><td>1</td></tr></tbody></table>',
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    survey.onTextMarkdown.add((_: any, options: any) => {
        options.html = options.text;
    });
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    await survey['renderSurvey'](controller);
});