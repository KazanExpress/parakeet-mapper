import { mapFactory } from './map-factory.js';
export function mapTypes(input, FieldMap) {
    if (!input || !FieldMap) {
        return mapTypes;
    }
    return mapFactory(FieldMap)(input);
}
//# sourceMappingURL=map-types.js.map