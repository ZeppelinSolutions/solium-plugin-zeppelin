/**
 * @fileoverview Report internal state variables without underscore suffix.
 */

"use strict";

module.exports = {
    meta: {
        docs: {
            recommended: true,
            type: "error",
            description: "Report internal state variables without underscore suffix"
        },
        schema: []
    },

    create: function(context) {

        function inspectStateVariableDeclaration(emitted) {
            if (emitted.exit) {
                return;
            }
            let param = emitted.node.name;
            if ( (param.charAt(param.length - 1) !== "_") &&
               (param.visibility != "public")) {
                context.report({
                    node: emitted.node,
                    message: `'${param}' does not have an underscore as suffix.`
                });
            }

        }

        return {
            StateVariableDeclaration: inspectStateVariableDeclaration
        };
    }
};
