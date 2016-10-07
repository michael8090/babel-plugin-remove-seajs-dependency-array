'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

/**
 * in(seajs):
 *      define(id, ['a', 'b'], function(require, export, module){})
*  out(asynchronous cmd):
*       define(id, function(require, export, module){})
*/
exports.default = function (_ref) {
    var t = _ref.types;

    return {
        visitor: {
            CallExpression: function CallExpression(_ref2) {
                var node = _ref2.node;

                if (node.callee.name === 'define') {
                    (function () {
                        var args = node.arguments;
                        args.some(function (a, i) {
                            if (a.type === 'ArrayExpression') {
                                var requireCallback = args[args.length - 1];
                                var firstDependency = a.elements[0];
                                var firstCallbackArg = requireCallback.params && requireCallback.params[0];
                                if (!firstCallbackArg) {
                                    return true;
                                }
                                var firstCallbackArgName = firstCallbackArg.name;
                                if (firstDependency !== firstCallbackArgName) {
                                    // we got seajs
                                    args.splice(i, 1);
                                }
                                return true;
                            }
                            return false;
                        });
                    })();
                }
            }
        }
    };
};