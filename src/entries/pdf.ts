export * from './pdf-base';
import { registerImageUtils } from '../utils/image';
import { ImageUtils } from '../utils/image/browser';
registerImageUtils(new ImageUtils());
