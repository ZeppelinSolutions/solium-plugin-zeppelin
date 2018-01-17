/**
 * @fileoverview Disallow unchecked send
 */

"use strict";

module.exports = {
    meta: {
        docs: {
            recommended: true,
            type: "warning",
            description: "Disallow unchecked send"
        },
        schema: []
    },

    create: function(context) {

        let sendNodes = [];

        function inspectCallExpression(emitted) {
            const node = emitted.node;
            if (!emitted.exit) {
                if (isSendCall(node)) {
                    // XXX We save the send calls, instead of checking the parents
                    // of the node because solium currently only supports to go up
                    // one level. This would prevent us to check something like
                    // `if (!to.send()) { ... }`
                    // --elopio - 20171221
                    sendNodes.push(node);
                }
            } else if (node.callee.name === "assert" || node.callee.name === "require") {
                updateCheckedSend(node.arguments[0]);
            }
        }

        function isSendCall(node) {
            return (node.type === "CallExpression" &&
                    node.callee.hasOwnProperty("property") &&
                    node.callee.property.name === "send");
        }

        /**
         * updateCheckedSend() checks if the child of a check is a send.
         * If so, the node is removed from the list of unchecked sends.
         */
        function updateCheckedSend(node) {
            if (node.type === "UnaryExpression" && node.operator === "!") {
                // Go down one level if the node is a negation.
                node = node.argument;
            }
            if (isSendCall(node)) {
                sendNodes.find(function(sendNode, index) {
                    if (node === sendNode) {
                        sendNodes.splice(index, 1);
                        return true;
                    }
                });
            }
        }

        function inspectIfStatement(emitted) {
            if (!emitted.exit) {
                return;
            }

            const node = emitted.node;
            updateCheckedSend(node.test);
        }

        function inspectProgram(emitted) {
            if (emitted.exit) {
                sendNodes.forEach(function(node) {
                    context.report({
                        node: node,
                        message: "Uncheck send."
                    });
                });
            }
        }

        return {
            CallExpression: inspectCallExpression,
            IfStatement: inspectIfStatement,
            Program: inspectProgram
        };
    }
};
