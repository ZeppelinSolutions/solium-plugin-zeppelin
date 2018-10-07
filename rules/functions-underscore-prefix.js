/**
 * @fileoverview Report internal and private functions without underscore prefix.
 */

"use strict";

module.exports = {
    meta: {
        docs: {
            recommended: true,
            type: "warning",
            description: "Report internal and private functions without underscore prefix"
        },
        schema: []
    },

    create: function(context) {

        function inspectFunctionDeclaration(emitted) {
            if (emitted.exit) {
                return;
            }
            if (emitted.node.modifiers !== null) {
                emitted.node.modifiers.find(modifier => {
                    if (modifier.name === "private" || modifier.name === "internal") {
                        if (emitted.node.name.charAt(0) !== "_") {
                            context.report({
                                node: emitted.node,
                                message: `'${emitted.node.name}' is not prefixed with an underscore.`
                            });
                        }
                        return true;
                    }
                });
            }
        }

        return {
            FunctionDeclaration: inspectFunctionDeclaration
        };
    }
};
