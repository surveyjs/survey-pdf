import { SurveyPDF } from '../src/survey';
import { ItemValue, ITheme, PanelModel } from 'survey-core';
import { DefaultLight } from '../src/themes/default-light';
import { FlatCheckbox } from '../src/flat_layout/flat_checkbox';
import { DocController } from '../src/doc_controller';
test('onGetQuestionStyles is fired and can modify question styles', () => {
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
    survey.onGetQuestionStyles.add((_, options) => {
        options.styles.title.fontColor = options.getColorVariable('--test-color-variable');
        options.styles.title.fontSize = options.getSizeVariable('--test-size-variable');
        options.styles.title.lineHeight = 90;
        options.styles.wrapper.backgroundColor = '#00ff00';
        expect(options.question.name).toBe('q1');

    });
    const question = survey.getAllQuestions()[0];
    const styles = survey.getStylesForElement(question);
    expect(styles.title.fontColor).toBe('#ede7e11a');
    expect(styles.title.lineHeight).toBe(90);
    expect(styles.title.fontSize).toBe(60);
    expect(styles.wrapper.backgroundColor).toBe('#00ff00');
});

test('onGetPanelStyles is fired and can modify panel styles', () => {
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
    survey.onGetPanelStyles.add((_, options) => {
        options.styles.title.fontColor = options.getColorVariable('--test-color-variable');
        options.styles.title.fontSize = options.getSizeVariable('--test-size-variable');
        options.styles.title.lineHeight = 90;
        options.styles.wrapper = { backgroundColor: '#00ff00' };
        expect(options.panel.name).toBe('panel1');
    });

    const panel = survey.getAllPanels()[0];
    const styles = survey.getStylesForElement(panel as PanelModel);
    expect(styles.title.fontColor).toBe('#ede7e11a');
    expect(styles.title.lineHeight).toBe(90);
    expect(styles.title.fontSize).toBe(60);
    expect(styles.wrapper.backgroundColor).toBe('#00ff00');
});

test('onGetPageStyles is fired and can modify page styles', () => {
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
    survey.onGetPageStyles.add((_, options) => {
        options.styles.title.fontColor = options.getColorVariable('--test-color-variable');
        options.styles.title.fontSize = options.getSizeVariable('--test-size-variable');
        options.styles.title.lineHeight = 90;
        options.styles.wrapper = { backgroundColor: '#00ff00' };
        expect(options.page.name).toBe('page1');
    });

    const page = survey.pages[0];
    const styles = survey.getStylesForElement(page);
    expect(styles.title.fontColor).toBe('#ede7e11a');
    expect(styles.title.lineHeight).toBe(90);
    expect(styles.title.fontSize).toBe(60);
    expect(styles.wrapper.backgroundColor).toBe('#00ff00');
});

test('onGetItemStyles is fired and can modify item styles', () => {
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
    survey.onGetItemStyles.add((_, options) => {
        if(options.item.value == 'a') {
            options.styles.label.fontColor = options.getColorVariable('--test-color-variable');
            options.styles.label.fontSize = options.getSizeVariable('--test-size-variable');
            options.styles.label.lineHeight = 90;
            options.styles.input = { fontColor: '#00ff00' };
        } else if(options.item.value == 'b') {
            options.styles.label.fontColor = '#ffffff';
            options.styles.label.fontSize = 40;
            options.styles.label.lineHeight = 70;
        }
    });

    const q = survey.getAllQuestions()[0] as any;
    const flat = new FlatCheckbox(survey, q, new DocController({}), survey.styles);
    let resStyles = flat.getStylesForItem(q.visibleChoices[0]);
    expect(resStyles.label.fontColor).toBe('#ede7e11a');
    expect(resStyles.label.lineHeight).toBe(90);
    expect(resStyles.label.fontSize).toBe(60);
    expect(resStyles.input.fontColor).toBe('#00ff00');
    resStyles = flat.getStylesForItem(q.visibleChoices[1]);
    expect(resStyles.label.fontColor).toBe('#ffffff');
    expect(resStyles.label.fontSize).toBe(40);
    expect(resStyles.label.lineHeight).toBe(70);
});