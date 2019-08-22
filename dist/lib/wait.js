"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.flattenPromises = flattenPromises;
function wait(convert) {
    return function (input) { return flattenPromises(convert(input)); };
}
exports.wait = wait;
//# sourceMappingURL=wait.js.map