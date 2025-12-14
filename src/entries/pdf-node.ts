export * from './pdf-base';
import { registerVariablesManager } from '../styles/utils';
import { registerImageUtils } from '../utils/image';
import { ImageUtils } from '../utils/image/node';
import { VariablesManager } from '../styles/utils/node';
registerImageUtils(new ImageUtils());
registerVariablesManager(new VariablesManager());