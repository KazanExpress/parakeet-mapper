"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isPromise = function (v) { return v instanceof Promise; };
var isPromiseArr = function (v) { return Array.isArray(v) && v.some(isPromise); };
function flattenPromises(obj) {
    var promises = [];
    var _loop_1 = function (key) {
        var value = obj[key];
        var resolve = function (promise) { return promise.then(function (res) {
            obj[key] = res;
        }); };
        if (isPromise(value)) {
            promises.push(resolve(value));
        }
        else if (isPromiseArr(value)) {
            promises.push(resolve(Promise.all(value)));
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