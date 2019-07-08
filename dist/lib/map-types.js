"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var map_factory_1 = require("./map-factory");
function mapTypes(input, FieldMap) {
    if (!input || !FieldMap) {
        return mapTypes;
    }
    return map_factory_1.mapFactory(FieldMap)(input);
}
exports.mapTypes = mapTypes;
//# sourceMappingURL=map-types.js.map