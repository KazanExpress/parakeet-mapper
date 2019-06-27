(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.parakeetMapper = {})));
}(this, (function (exports) { 'use strict';

  function mapFactory(FieldMap) {
      return function (input, converters) {
          if (!FieldMap ||
              Array.isArray(FieldMap) ||
              !Object.keys(FieldMap).length) {
              return {};
          }
          var convert = converters ? function (key, value) { return (typeof converters[key] === 'function' ? converters[key](value) : value); } : function (_key, value) { return value; };
          var result = {};
          for (var key in FieldMap) {
              if (typeof FieldMap[key] === 'boolean' && FieldMap[key]) {
                  result[key] = convert(key, input[key]);
                  continue;
              }
              if (typeof FieldMap[key] === 'string') {
                  result[key] = convert(key, input[FieldMap[key]]);
                  continue;
              }
              if (typeof FieldMap[key] === 'function') {
                  var mapperValue = FieldMap[key](input);
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

  exports.mapFactory = mapFactory;
  exports.mapTypes = mapTypes;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=parakeet-mapper.umd.js.map
