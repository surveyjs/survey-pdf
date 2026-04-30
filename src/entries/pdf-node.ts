export * from './pdf-base';
import { registerVariablesManagerCreator } from '../style/utils';
import { registerImageUtils } from '../utils/image';
import { ImageUtils } from '../utils/image/node';
import { VariablesManager } from '../style/utils/node';
registerImageUtils(new ImageUtils());
registerVariablesManagerCreator(() => new VariablesManager());