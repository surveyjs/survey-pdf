export * from './pdf-base';
import { registerVariablesManager } from '../style/utils';
import { registerImageUtils } from '../utils/image';
import { ImageUtils } from '../utils/image/browser';
import { VariablesManager } from '../style/utils/browser';
registerImageUtils(new ImageUtils());
registerVariablesManager(new VariablesManager());
