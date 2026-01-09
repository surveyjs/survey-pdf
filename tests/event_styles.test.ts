import { SurveyPDF } from '../src/survey';
import { ITheme, PanelModel } from 'survey-core';
import { DefaultLight } from '../src/themes/default-light';
import { FlatCheckbox } from '../src/flat_layout/flat_checkbox';
import { DocController } from '../src/doc_controller';
test('onGetQuestionStyle is fired and can modify question style', () => {
    const survey = new SurveyPDF({
        pages: [
            {
                name: 'p1',
                elements: [
                    { type: 'text', name: 'q1' }
                ]
            }
        ]
    });

    const theme: ITheme = { ...DefaultLight };
    theme.cssVariables = { ...DefaultLight.cssVariables };
    theme.cssVariables['--test-size-variable'] = '80px';
    theme.cssVariables['--test-color-variable'] = 'rgba(237, 231, 225, 0.1)';
    survey.applyTheme(theme);
    survey.onGetQuestionStyle.add((_, options) => {
        options.style.title.fontColor = options.getColorVariable('--test-color-variable');
        options.style.title.fontSize = options.getSizeVariable('--test-size-variable');
        options.style.title.lineHeight = 90;
        options.style.container.backgroundColor = '#00ff00';
        expect(options.question.name).toBe('q1');

    });
    const question = survey.getAllQuestions()[0];
    const style = survey.getElementStyle(question);
    expect(style.title.fontColor).toBe('#ede7e11a');
    expect(style.title.lineHeight).toBe(90);
    expect(style.title.fontSize).toBe(60);
    expect(style.container.backgroundColor).toBe('#00ff00');
});

test('onGetPanelStyle is fired and can modify panel style', () => {
    const survey = new SurveyPDF({
        pages: [
            {
                name: 'p1',
                elements: [
                    {
                        type: 'panel',
                        name: 'panel1',
                        elements: [{ type: 'text', name: 'q1' }]
                    }
                ]
            }
        ]
    });

    const theme: ITheme = { ...DefaultLight };
    theme.cssVariables = { ...DefaultLight.cssVariables };
    theme.cssVariables['--test-size-variable'] = '80px';
    theme.cssVariables['--test-color-variable'] = 'rgba(237, 231, 225, 0.1)';
    survey.applyTheme(theme);
    survey.onGetPanelStyle.add((_, options) => {
        options.style.title.fontColor = options.getColorVariable('--test-color-variable');
        options.style.title.fontSize = options.getSizeVariable('--test-size-variable');
        options.style.title.lineHeight = 90;
        options.style.container = { backgroundColor: '#00ff00' };
        expect(options.panel.name).toBe('panel1');
    });

    const panel = survey.getAllPanels()[0];
    const style = survey.getElementStyle(panel as PanelModel);
    expect(style.title.fontColor).toBe('#ede7e11a');
    expect(style.title.lineHeight).toBe(90);
    expect(style.title.fontSize).toBe(60);
    expect(style.container.backgroundColor).toBe('#00ff00');
});

test('onGetPageStyle is fired and can modify page style', () => {
    const survey = new SurveyPDF({
        pages: [
            {
                name: 'page1',
                elements: []
            }
        ]
    });
    const theme: ITheme = { ...DefaultLight };
    theme.cssVariables = { ...DefaultLight.cssVariables };
    theme.cssVariables['--test-size-variable'] = '80px';
    theme.cssVariables['--test-color-variable'] = 'rgba(237, 231, 225, 0.1)';
    survey.applyTheme(theme);
    survey.onGetPageStyle.add((_, options) => {
        options.style.title.fontColor = options.getColorVariable('--test-color-variable');
        options.style.title.fontSize = options.getSizeVariable('--test-size-variable');
        options.style.title.lineHeight = 90;
        options.style.container = { backgroundColor: '#00ff00' };
        expect(options.page.name).toBe('page1');
    });

    const page = survey.pages[0];
    const style = survey.getElementStyle(page);
    expect(style.title.fontColor).toBe('#ede7e11a');
    expect(style.title.lineHeight).toBe(90);
    expect(style.title.fontSize).toBe(60);
    expect(style.container.backgroundColor).toBe('#00ff00');
});

test('onGetItemStyle is fired and can modify item style', () => {
    const survey = new SurveyPDF({
        pages: [
            {
                name: 'p1',
                elements: [
                    {
                        type: 'checkbox',
                        name: 'q1',
                        choices: [
                            { value: 'a', text: 'A' },
                            { value: 'b', text: 'B' }
                        ]
                    }
                ]
            }
        ]
    });
    const theme: ITheme = { ...DefaultLight };
    theme.cssVariables = { ...DefaultLight.cssVariables };
    theme.cssVariables['--test-size-variable'] = '80px';
    theme.cssVariables['--test-color-variable'] = 'rgba(237, 231, 225, 0.1)';
    survey.applyTheme(theme);
    survey.onGetItemStyle.add((_, options) => {
        if(options.item.value == 'a') {
            options.style.choiceText.fontColor = options.getColorVariable('--test-color-variable');
            options.style.choiceText.fontSize = options.getSizeVariable('--test-size-variable');
            options.style.choiceText.lineHeight = 90;
            options.style.input = { fontColor: '#00ff00' };
        } else if(options.item.value == 'b') {
            options.style.choiceText.fontColor = '#ffffff';
            options.style.choiceText.fontSize = 40;
            options.style.choiceText.lineHeight = 70;
        }
    });

    const q = survey.getAllQuestions()[0] as any;
    const flat = new FlatCheckbox(survey, q, new DocController({}), survey.style);
    let resStyle = flat.getItemStyle(q.visibleChoices[0]);
    expect(resStyle.choiceText.fontColor).toBe('#ede7e11a');
    expect(resStyle.choiceText.lineHeight).toBe(90);
    expect(resStyle.choiceText.fontSize).toBe(60);
    expect(resStyle.input.fontColor).toBe('#00ff00');
    resStyle = flat.getItemStyle(q.visibleChoices[1]);
    expect(resStyle.choiceText.fontColor).toBe('#ffffff');
    expect(resStyle.choiceText.fontSize).toBe(40);
    expect(resStyle.choiceText.lineHeight).toBe(70);
});