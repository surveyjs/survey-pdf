import { registerVariablesManager } from "./src/styles/utils";
import { VariablesManager } from "./src/styles/utils/node";
global.beforeAll(() => {
    registerVariablesManager(new VariablesManager());
})