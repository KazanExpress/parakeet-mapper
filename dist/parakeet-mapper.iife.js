var parakeetMapper = (function (exports) {
  'use strict';

  var isFactory = function (v) { return typeof v === 'function'; };
  var isPropKey = function (v) { return typeof v === 'string'; };

  function mapFactory(fieldMap) {
      if (!fieldMap) {
          return mapFactory;
      }
      return function (input) {
          var result = {};
          for (var key in fieldMap) {
              var value = fieldMap[key];
              var inputValue = input[key];
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
                  for (var iKey in value) {
                      var iValue = input[iKey];
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

  var isPromise = function (v) { return v instanceof Promise; };
  var isPromiseArr = function (v) { return Array.isArray(v) && v.some(isPromise); };
  function flattenPromises(obj) {
      var promises = [];
      var _loop_1 = function (key) {
          var value = obj[key];
          var resolve = function (promise) { return promise.then(function (res) {
              obj[key] = res;
          }); };
          if (isPromise(value)) {
              promises.push(resolve(value));
          }
          else if (isPromiseArr(value)) {
              promises.push(resolve(Promise.all(value)));
          }
      };
      for (var key in obj) {
          _loop_1(key);
      }
      return Promise.all(promises)
          .then(function (_) { return obj; });
  }
  function wait(convert) {
      return function (input) { return flattenPromises(convert(input)); };
  }

  exports.mapFactory = mapFactory;
  exports.mapTypes = mapTypes;
  exports.Convertable = Convertable;
  exports.flattenPromises = flattenPromises;
  exports.wait = wait;

  return exports;

}({}));
//# sourceMappingURL=parakeet-mapper.iife.js.map
