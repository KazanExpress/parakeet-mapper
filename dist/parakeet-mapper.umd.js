(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.parakeetMapper = {})));
}(this, (function (exports) { 'use strict';

  function mapTypes(input, FieldMap) {
      if (!FieldMap ||
          Array.isArray(FieldMap) ||
          !Object.keys(FieldMap).length) {
          return {};
      }
      var result = {};
      for (var key in FieldMap) {
          if (typeof FieldMap[key] === 'boolean' && FieldMap[key]) {
              result[key] = input[key];
              continue;
          }
          if (typeof FieldMap[key] === 'string') {
              result[key] = input[FieldMap[key]];
              continue;
          }
          if (typeof FieldMap[key] === 'function') {
              var mapperValue = FieldMap[key](input);
              result[key] = mapperValue;
              continue;
          }
      }
      return result;
  }

  exports.mapTypes = mapTypes;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=parakeet-mapper.umd.js.map
