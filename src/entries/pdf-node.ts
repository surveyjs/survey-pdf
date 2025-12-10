export * from './pdf-base';
import { registerImageUtils } from '../utils/image';
import { ImageUtils } from '../utils/image/node';
registerImageUtils(new ImageUtils());