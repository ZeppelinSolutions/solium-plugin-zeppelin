/**
 * @fileoverview Report private state variables without underscore prefix.
 */

"use strict";

module.exports = {
    meta: {
        docs: {
            recommended: true,
            type: "warning",
            description: "Report private state variables without underscore prefix"
        },
        schema: []
    },

    create: function(context) {

        function inspectStateVariableDeclaration(emitted) {
            if (emitted.exit) {
                return;
            }
            let stateVariable = emitted.node.name;
            if ((stateVariable.charAt(0) !== "_") &&
                    (emitted.node.visibility == "private")) {
                context.report({
                    node: emitted.node,
                    message: `'${stateVariable}' does not have an underscore as prefix.`
                });
            }

        }

        return {
            StateVariableDeclaration: inspectStateVariableDeclaration
        };
    }
};
