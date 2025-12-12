export * from './pdf-base';
import { registerVariablesManager } from 'src/styles/utils';
import { registerImageUtils } from '../utils/image';
import { ImageUtils } from '../utils/image/node';
import { VariablesManager } from 'src/styles/utils/node';
registerImageUtils(new ImageUtils());
registerVariablesManager(new VariablesManager());