/**
 * @fileoverview Disallow state variable shadowing
 */

"use strict";

module.exports = {
    meta: {
        docs: {
            recommended: true,
            type: "error",
            description: "Disallow state variable shadowing"
        },
        schema: []
    },

    create: function(context) {

        let contracts = {};

        function inspectContractStatement(emitted) {
            if (emitted.exit) {
                let node = emitted.node;
                let parents = [];

                node.is.forEach(parent => {
                    parents.push(parent.name);
                });

                let stateVariables = [];

                node.body.forEach(statement => {
                    if (statement.type === "StateVariableDeclaration") {
                        stateVariables.push(statement.name);
                    }
                });

                contracts[node.name] = {
                    "parents": parents,
                    "stateVariables": stateVariables,
                    "node": node
                };
            }
        }

        function inspectProgram(emitted) {
            if (emitted.exit) {
                Object.keys(contracts).forEach(contractName => {
                    let contract = contracts[contractName];
                    if (contract.parents.length > 0 && contract.stateVariables.length > 0) {
                        checkContractStateVariables(contract);
                    }
                });
            }
        }

        function checkContractStateVariables(contract) {
            contract.stateVariables.forEach(stateVariable => {
                let parent = findStateVariableInParent(contracts, stateVariable, contract.parents);
                if (parent !== undefined) {
                    context.report({
                        node: contract.node,
                        message: `'${contract.node.name}' shadows the state variable ` +
                            `'${stateVariable}' defined in the parent contract ` +
                            `'${parent}'.`
                    });
                }
            });
        }

        function findStateVariableInParent(contracts, stateVariable, parents) {
            // XXX recursive function.
            // --elopio - 20180111
            for (let index = 0; index < parents.length; index ++) {
                let parent = parents[index];
                if (contracts[parent] !== undefined) {
                    if (contracts[parent].stateVariables.includes(stateVariable)) {
                        return parent;
                    } else {
                        return findStateVariableInParent(
                            contracts, stateVariable, contracts[parent].parents);
                    }
                }
                else {
                    // The parent is from an external import, not yet supported.
                    // https://github.com/elopio/solium-plugin-zeppelin/issues/19
                    return undefined;
                }
            }
        }

        return {
            ContractStatement: inspectContractStatement,
            Program: inspectProgram
        };
    }
};
