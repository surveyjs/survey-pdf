export * from './pdf-base';
import { registerVariablesManager } from '../style/utils';
import { registerImageUtils } from '../utils/image';
import { ImageUtils } from '../utils/image/node';
import { VariablesManager } from '../style/utils/node';
registerImageUtils(new ImageUtils());
registerVariablesManager(new VariablesManager());