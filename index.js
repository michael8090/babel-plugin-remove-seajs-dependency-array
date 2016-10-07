/**
 * in(seajs):
 *      define(id, ['a', 'b'], function(require, export, module){})
*  out(asynchronous cmd):
*       define(id, function(require, export, module){})
*/
export default ({types: t}) => {
    return {
        visitor: {
            CallExpression({node}) {
                if (node.callee.name === 'define') {
                    const args = node.arguments;
                    args.some((a, i) => {
                        if (a.type === 'ArrayExpression') {
                            const requireCallback = args[args.length - 1];
                            const firstDependency = a.elements[0];
                            const firstCallbackArg = requireCallback.params && requireCallback.params[0];
                            if (!firstCallbackArg) {
                                return true;
                            }
                            const firstCallbackArgName = firstCallbackArg.name;
                            if (firstDependency !== firstCallbackArgName) {
                                // we got seajs
                                args.splice(i, 1);
                            }
                            return true;
                        }
                        return false;
                    });
                }
            }
        }
    };
};
