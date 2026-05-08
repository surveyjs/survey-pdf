import { beforeEach } from 'vitest';
import { FlatPage } from './src/flat_layout/flat_page';
import { FlatPanel } from './src/flat_layout/flat_panel';
import { FlatRepository } from './src/flat_layout/flat_repository';
import { FlatSurvey } from './src/flat_layout/flat_survey';
import { registerVariablesManagerCreator } from './src/style/utils';
import { VariablesManager } from './src/style/utils/node';
beforeEach(() => {
    registerVariablesManagerCreator(() => new VariablesManager());
    FlatRepository.registerSurvey(FlatSurvey);
    FlatRepository.registerPage(FlatPage as any);
    FlatRepository.registerPanel(FlatPanel as any);
});