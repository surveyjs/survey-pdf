import { FlatPage } from "./src/flat_layout/flat_page";
import { FlatPanel } from "./src/flat_layout/flat_panel";
import { FlatRepository } from "./src/flat_layout/flat_repository";
import { FlatSurvey } from "./src/flat_layout/flat_survey";
import { registerVariablesManager } from "./src/style/utils";
import { VariablesManager } from "./src/style/utils/node";
global.beforeAll(() => {
    registerVariablesManager(new VariablesManager());
    FlatRepository.registerSurvey(FlatSurvey);
    FlatRepository.registerPage(FlatPage);
    FlatRepository.registerPanel(FlatPanel);
})