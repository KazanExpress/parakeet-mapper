"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFlag = function (v) { return typeof v === 'boolean'; };
exports.isConverter = function (v) { return typeof v === 'function'; };
exports.isPropKey = function (v) { return typeof v === 'string'; };
exports.isPropMapper = function (v) { return typeof v === 'object' && exports.isConverter(v[Object.keys(v)[0]]); };
exports.typedKeyOf = function (obj) { return Object.keys(obj); };
//# sourceMappingURL=util.js.map