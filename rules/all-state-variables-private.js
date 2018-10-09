/**
 * @fileoverview Report state variables that are not private.
 */

"use strict";

module.exports = {
    meta: {
        docs: {
            recommended: true,
            type: "warning",
            description: "Report state variables that are not private"
        },
        schema: []
    },

    create: function(context) {

        function inspectStateVariableDeclaration(emitted) {
            if (emitted.exit) {
                return;
            }
            if (emitted.node.visibility != "private") {
                context.report({
                    node: emitted.node,
                    message: `'${emitted.node.name}' is not private.`
                });
            }

        }

        return {
            StateVariableDeclaration: inspectStateVariableDeclaration
        };
    }
};
