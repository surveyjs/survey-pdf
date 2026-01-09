import { registerVariablesManager } from "./src/style/utils";
import { VariablesManager } from "./src/style/utils/node";
global.beforeAll(() => {
    registerVariablesManager(new VariablesManager());
})