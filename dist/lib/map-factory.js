"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
function mapFactory(fieldMap) {
    if (!fieldMap) {
        return mapFactory;
    }
    return function (input) {
        var empty = {};
        if (!fieldMap || !Object.keys(fieldMap).length) {
            return empty;
        }
        return util_1.typedKeyOf(fieldMap)
            .reduce(function (result, key) {
            var value = fieldMap[key];
            if (util_1.isFlag(value) && value) {
                result[key] = input[key];
            }
            else if (util_1.isPropKey(value)) {
                result[key] = input[value];
            }
            else if (util_1.isConverter(value)) {
                result[key] = value(input);
            }
            else if (typeof value === 'object') {
                var iKey = Object.keys(value)[0];
                result[key] = value[iKey](input[iKey]);
            }
            return result;
        }, empty);
    };
}
exports.mapFactory = mapFactory;
//# sourceMappingURL=map-factory.js.map