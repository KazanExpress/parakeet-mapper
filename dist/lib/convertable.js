"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Convertable(converter, reverseConverter) {
    var Convertable = /** @class */ (function () {
        function Convertable(options) {
            var misc = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                misc[_i - 1] = arguments[_i];
            }
            var converted = converter.apply(void 0, misc)(options);
            for (var key in converted) {
                this[key] = converted[key];
            }
        }
        Convertable.toInput = reverseConverter ? function (options) {
            var misc = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                misc[_i - 1] = arguments[_i];
            }
            return (reverseConverter.apply(void 0, misc)(options));
        } : undefined;
        Convertable.createConverter = converter;
        Convertable.reverseConverter = reverseConverter;
        return Convertable;
    }());
    return Convertable;
}
exports.Convertable = Convertable;
//# sourceMappingURL=convertable.js.map