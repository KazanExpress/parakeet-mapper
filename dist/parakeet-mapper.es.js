const isConverter = (v) => typeof v === 'function';
const isPropKey = (v) => typeof v === 'string';

function mapFactory(fieldMap) {
    if (!fieldMap) {
        return mapFactory;
    }
    return function (input) {
        const result = {};
        for (const key in fieldMap) {
            const value = fieldMap[key];
            const inputValue = input[key];
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
                const iKey = _iKey;
                const iValue = input[iKey];
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
    class Convertable {
        constructor(options, ...misc) {
            const converted = converter(...misc)(options);
            for (const key in converted) {
                this[key] = converted[key];
            }
        }
    }
    Convertable.toInput = reverseConverter ? (options, ...misc) => (reverseConverter(...misc)(options)) : undefined;
    Convertable.createConverter = converter;
    Convertable.reverseConverter = reverseConverter;
    return Convertable;
}

const isPromise = (v) => v instanceof Promise;
const isPromiseArr = (v) => Array.isArray(v) && v.some(isPromise);
function flattenPromises(obj) {
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
function wait(convert) {
    return input => flattenPromises(convert(input));
}

export { mapFactory, mapTypes, Convertable, flattenPromises, wait };
//# sourceMappingURL=parakeet-mapper.es.js.map
