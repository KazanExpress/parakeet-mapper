const isFlag = (v) => typeof v === 'boolean';
const isConverter = (v) => typeof v === 'function';
const isPropKey = (v) => typeof v === 'string';
const typedKeyOf = (obj) => Object.keys(obj);

function mapFactory(fieldMap) {
    if (!fieldMap) {
        return mapFactory;
    }
    return function (input) {
        const empty = {};
        if (!fieldMap || !Object.keys(fieldMap).length) {
            return empty;
        }
        return typedKeyOf(fieldMap)
            .reduce((result, key) => {
            const value = fieldMap[key];
            if (isFlag(value) && value) {
                result[key] = input[key];
            }
            else if (isPropKey(value)) {
                result[key] = input[value];
            }
            else if (isConverter(value)) {
                result[key] = value(input);
            }
            else if (typeof value === 'object') {
                const iKey = Object.keys(value)[0];
                // If no value is found in input - get it by the same key as in the output
                const ivalue = input[iKey] == null ? input[key] : input[iKey];
                result[key] = value[iKey](ivalue);
            }
            return result;
        }, empty);
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

function flattenPromises(obj) {
    const promises = [];
    for (const key in obj) {
        const value = obj[key];
        if (value instanceof Promise) {
            promises.push(value.then(resolved => {
                obj[key] = resolved;
            }));
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
