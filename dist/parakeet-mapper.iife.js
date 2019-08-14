var parakeetMapper = (function (exports) {
  'use strict';

  var isFlag = function (v) { return typeof v === 'boolean'; };
  var isConverter = function (v) { return typeof v === 'function'; };
  var isPropKey = function (v) { return typeof v === 'string'; };
  var typedKeyOf = function (obj) { return Object.keys(obj); };

  function mapFactory(fieldMap) {
      if (!fieldMap) {
          return mapFactory;
      }
      return function (input) {
          var empty = {};
          if (!fieldMap || !Object.keys(fieldMap).length) {
              return empty;
          }
          return typedKeyOf(fieldMap)
              .reduce(function (result, key) {
              var value = fieldMap[key];
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
                  var iKey = Object.keys(value)[0];
                  result[key] = value[iKey](input[iKey]);
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
      var Convertable = /** @class */ (function () {
          function Convertable(options) {
              var misc = [];
              for (var _i = 1; _i < arguments.length; _i++) {
                  misc[_i - 1] = arguments[_i];
              }
              var converted = converter.apply(void 0, misc)(options);
              for (var key in converted) {
                  this[key] = converted[key];
              }
          }
          Convertable.toInput = reverseConverter ? function (options) {
              var misc = [];
              for (var _i = 1; _i < arguments.length; _i++) {
                  misc[_i - 1] = arguments[_i];
              }
              return (reverseConverter.apply(void 0, misc)(options));
          } : undefined;
          Convertable.createConverter = converter;
          Convertable.reverseConverter = reverseConverter;
          return Convertable;
      }());
      return Convertable;
  }

  exports.mapFactory = mapFactory;
  exports.mapTypes = mapTypes;
  exports.Convertable = Convertable;

  return exports;

}({}));
//# sourceMappingURL=parakeet-mapper.iife.js.map
