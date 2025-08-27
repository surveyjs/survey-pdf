const  { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.atob = function (str) {
  return Buffer.from(str, 'base64').toString('binary');
}
global.btoa = function (str) {
  return Buffer.from(str, 'binary').toString('base64');
}
global.queueMicrotask = (cb) => { cb(); }