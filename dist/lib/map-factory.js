import { isPropKey, isFactory } from './util.js';
export function mapFactory(fieldMap) {
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
            else if (isFactory(value)) {
                result[key] = value(input, result);
            }
            else if (typeof value === 'object') {
                for (const iKey in value) {
                    const iValue = input[iKey];
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
//# sourceMappingURL=map-factory.js.map