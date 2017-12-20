/**
 * @fileoverview Disallow arithmetic operations
 *
 * Based on the solium no-bit-operations rule at:
 * https://github.com/duaraghav8/solium-plugin-security
 */

"use strict";

const DISALLOWED_OPERATORS = ["*", "/", "-", "+"];

module.exports = {
    meta: {
        docs: {
            recommended: true,
            type: "warning",
            description: "Disallow arithmetic operators"
        },
        schema: []
    },

    create: function(context) {
        function inspectBinaryExpression(emitted) {
            const node = emitted.node;

            if (emitted.exit) {
                return;
            }

            if (DISALLOWED_OPERATORS.indexOf(node.operator.trim()) !== -1) {
                context.report({
                    node: node,
                    message: `Avoid use of arithmetic operation '${node.operator}' directly. Use SafeMath instead.`
                });
            }
        }

        return {
            BinaryExpression: inspectBinaryExpression
        };
    }
};
