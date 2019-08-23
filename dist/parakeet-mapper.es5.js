'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var isConverter = function (v) { return typeof v === 'function'; };
var isPropKey = function (v) { return typeof v === 'string'; };

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
            else if (isPropKey(value)) {
                result[key] = input[value];
            }
            else if (isConverter(value)) {
                result[key] = value(input);
            }
            else if (typeof value === 'object') {
                for (var _iKey in value)
                    break;
                var iKey = _iKey;
                var iValue = input[iKey];
                // If no value is found in input - get it by the same key as in the output
                result[key] = value[iKey](iValue == null ? inputValue : iValue);
            }
        }
        return result;
    };
}

function mapTypes(input, FieldMap) {
    if (!input || !FieldMap) {
        return mapTypes;
    }
    return mapFactory(FieldMap)(input);
}

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

function flattenPromises(obj) {
    var promises = [];
    var _loop_1 = function (key) {
        var value = obj[key];
        if (value instanceof Promise) {
            promises.push(value.then(function (resolved) {
                obj[key] = resolved;
            }));
        }
    };
    for (var key in obj) {
        _loop_1(key);
    }
    return Promise.all(promises)
        .then(function (_) { return obj; });
}
function wait(convert) {
    return function (input) { return flattenPromises(convert(input)); };
}

exports.mapFactory = mapFactory;
exports.mapTypes = mapTypes;
exports.Convertable = Convertable;
exports.flattenPromises = flattenPromises;
exports.wait = wait;
//# sourceMappingURL=parakeet-mapper.es5.js.map
