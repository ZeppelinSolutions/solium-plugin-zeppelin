/**
 * @fileoverview Report parameters without underscore prefix.
 */

"use strict";

module.exports = {
    meta: {
        docs: {
            recommended: true,
            type: "error",
            description: "Report parameters without underscore prefix"
        },
        schema: []
    },

    create: function(context) {

        function inspectFunctionDeclaration(emitted) {
            if (emitted.exit) {
                return;
            }
            emitted.node.params.forEach(param => {
                if (param.id.charAt(0) !== "_") {
                    context.report({
                        node: emitted.node,
                        message: `'${param.id}' is not prefixed with an underscore.`
                    });
                }
            });
        }

        return {
            FunctionDeclaration: inspectFunctionDeclaration
        };
    }
};
