/**
 * @fileoverview Disallow modifiers without revert
 */

"use strict";

module.exports = {
    meta: {
        docs: {
            recommended: true,
            type: "warning",
            description: "Warn on modifiers without revert"
        },
        schema: []
    },

    create: function(context) {
        function inspectModifierDeclaration(emitted) {
            if (emitted.exit) {
                return;
            }
            const node = emitted.node;
            if (!hasRevertChild(node)) {
                context.report({
                    node: node,
                    message: `Modifier '${node.name}' without revert.`
                });
            }
        }

        function hasRevertChild(node) {
            // XXX Recursive function.
            // --elopio - 20180105
            if (Array.isArray(node)) {
                return node.some(element => hasRevertChild(element));
            } else if (node !== null && typeof node === "object") {
                return isRevertExpression(node) ||
                    Object.keys(node).some(key => {
                        if (key !== "parent") {
                            return hasRevertChild(node[key]);
                        }
                    });
            }
        }

        function isRevertExpression(statement) {
            return statement.type === "ExpressionStatement" &&
                statement.expression.type === "CallExpression" &&
                (statement.expression.callee.name === "require" ||
                 statement.expression.callee.name === "revert");
        }

        return {
            ModifierDeclaration: inspectModifierDeclaration
        };
    }
};
