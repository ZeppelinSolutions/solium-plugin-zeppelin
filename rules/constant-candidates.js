/**
 * @fileoverview Warn about possible constant variables
 */

"use strict";

module.exports = {
    meta: {
        docs: {
            recommended: true,
            type: "warning",
            description: "Warn about possible constant variables"
        },
        schema: []
    },

    create: function(context) {

        let constantCandidates = {};

        function inspectStateVariableDeclaration(emitted) {
            if (emitted.exit) {
                return;
            }

            const node = emitted.node;

            if (isConstantCandidate(node)) {
                constantCandidates[node.name] = node;
            }
        }

        function isConstantCandidate(node) {
            // The state variable is a constant candidate if:
            // - it is not already constant and,
            // - it is private (otherwise it could be mutated in other file that imports it) and,
            // - it is:
            //   - a literal or,
            //   - a call to keccak256, sha256, ripemd160, ecrecover, addmod or mulmod.
            return !node.is_constant && node.visibility === "private" &&
                (isLiteral(node.value) ||
                 (node.value.type === "CallExpression" &&
                  (node.value.callee.name === "keccak256" ||
                   node.value.callee.name === "sha256" ||
                   node.value.callee.name === "ripemd160" ||
                   node.value.callee.name === "ecrecover" ||
                   node.value.callee.name === "addmod" ||
                   node.value.callee.name === "mulmod")));
        }

        function isLiteral(node) {
            // XXX Recursive function.
            // --elopio - 20171222
            return node.type === "Literal" ||
                (node.type === "BinaryExpression" &&
                 isLiteral(node.left) &&
                 isLiteral(node.right));
        }

        function inspectAssignmentExpression(emitted) {
            if (emitted.exit) {
                return;
            }
            const node = emitted.node;
            Object.keys(constantCandidates).some(function(candidate) {
                if (node.left.name === candidate) {
                    delete constantCandidates[candidate];
                    return true;
                }
            });
        }

        function inspectProgram(emitted) {
            if (emitted.exit) {
                Object.keys(constantCandidates).forEach(function(candidate) {
                    context.report({
                        node: constantCandidates[candidate],
                        message: `The state variable '${candidate}' could be constant.`
                    });
                });
            }
        }

        return {
            StateVariableDeclaration: inspectStateVariableDeclaration,
            AssignmentExpression: inspectAssignmentExpression,
            Program: inspectProgram
        };
    }
};
