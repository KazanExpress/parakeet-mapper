const isPromise = (v) => v instanceof Promise;
const isPromiseArr = (v) => Array.isArray(v) && v.some(isPromise);
export function flattenPromises(obj) {
    const promises = [];
    for (const key in obj) {
        const value = obj[key];
        const resolve = (promise) => promise.then(res => {
            obj[key] = res;
        });
        if (isPromise(value)) {
            promises.push(resolve(value));
        }
        else if (isPromiseArr(value)) {
            promises.push(resolve(Promise.all(value)));
        }
    }
    return Promise.all(promises)
        .then(_ => obj);
}
export function wait(convert) {
    return input => flattenPromises(convert(input));
}
//# sourceMappingURL=wait.js.map