export * from './pdf-base';
import { registerVariablesManagerCreator } from '../style/utils';
import { registerImageUtils } from '../utils/image';
import { ImageUtils } from '../utils/image/browser';
import { VariablesManager } from '../style/utils/browser';
registerImageUtils(new ImageUtils());
registerVariablesManagerCreator(() => new VariablesManager());
