function mapFactory(FieldMap) {
    return function (input, converters) {
        if (!FieldMap ||
            Array.isArray(FieldMap) ||
            !Object.keys(FieldMap).length) {
            return {};
        }
        const convert = converters ? (key, value) => (typeof converters[key] === 'function' ? converters[key](value) : value) : (_key, value) => value;
        const result = {};
        for (const key in FieldMap) {
            if (typeof FieldMap[key] === 'boolean' && FieldMap[key]) {
                result[key] = convert(key, input[key]);
                continue;
            }
            if (typeof FieldMap[key] === 'string') {
                result[key] = convert(key, input[FieldMap[key]]);
                continue;
            }
            if (typeof FieldMap[key] === 'function') {
                let mapperValue = FieldMap[key](input);
                result[key] = convert(key, mapperValue);
                continue;
            }
        }
        return result;
    };
}
function mapTypes(input, FieldMap) {
    return mapFactory(FieldMap)(input);
}

export { mapFactory, mapTypes };
//# sourceMappingURL=parakeet-mapper.es.js.map
