import { TextEncoder, TextDecoder  } from "util";
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
const consoleError = console.error;
global.console.error = (e) => {
    if(!e.match(/^survey-core has version/)) {
        consoleError(e);
    }
}