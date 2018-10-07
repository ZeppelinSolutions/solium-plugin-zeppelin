/**
 * @fileoverview Report parameters with underscore.
 */

"use strict";

module.exports = {
    meta: {
        docs: {
            recommended: true,
            type: "error",
            description: "Report parameters with underscore"
        },
        schema: []
    },

    create: function(context) {

        function inspectFunctionDeclaration(emitted) {
            if (emitted.exit) {
                return;
            }
            emitted.node.params.forEach(param => {
                if (param.id.charAt(0) === "_") {
                    context.report({
                        node: emitted.node,
                        message: `'${param.id}' is prefixed with an underscore.`
                    });
                } else if (param.id.charAt(param.id.length - 1) === "_") {
                    context.report({
                        node: emitted.node,
                        message: `'${param.id}' is suffixed with an underscore.`
                    });
                }
            });
        }

        return {
            FunctionDeclaration: inspectFunctionDeclaration
        };
    }
};
