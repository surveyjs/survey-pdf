export * from './pdf-base';
import { registerVariablesManager } from '../styles/utils';
import { registerImageUtils } from '../utils/image';
import { ImageUtils } from '../utils/image/browser';
import { VariablesManager } from '../styles/utils/browser';
registerImageUtils(new ImageUtils());
registerVariablesManager(new VariablesManager());
