"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
function mapFactory(fieldMap) {
    if (!fieldMap) {
        return mapFactory;
    }
    return function (input) {
        var result = {};
        for (var key in fieldMap) {
            var value = fieldMap[key];
            var inputValue = input[key];
            if (value === true) {
                result[key] = inputValue;
            }
            else if (util_1.isPropKey(value)) {
                result[key] = input[value];
            }
            else if (util_1.isFactory(value)) {
                result[key] = value(input, result);
            }
            else if (typeof value === 'object') {
                for (var iKey in value) {
                    var iValue = input[iKey];
                    // If no value is found in input - get it by the same key as in the output
                    result[key] = value[iKey](iValue == null ? inputValue : iValue);
                    // We only need to check the first key
                    break;
                }
            }
        }
        return result;
    };
}
exports.mapFactory = mapFactory;
//# sourceMappingURL=map-factory.js.map