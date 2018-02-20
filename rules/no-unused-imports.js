/**
 * @fileoverview Disallow unused imports
 *
 * Thanks to the pseudocode by Raghav Dua.
 */

"use strict";

let fs = require("fs");
let solparse = require("solparse");

module.exports = {
    meta: {
        docs: {
            recommended: true,
            type: "error",
            description: "Disallow unused imports"
        },
        schema: []
    },

    create: function(context) {

        let imports = {};

        function inspectImportStatement(emitted) {
            if (emitted.exit) {
                return;
            }
            const node = emitted.node;
            if (node.symbols.length === 0) {
                // Global import.
                // Parse the file and collect the exported symbols.
                node.symbols = [];
                if (fs.existsSync(node.from)) {
                    let data = fs.readFileSync(node.from, "utf-8");
                    let ast = solparse.parse(data, { comment: true });
                    ast.body.forEach(statement => {
                        if (statement.type === "ContractStatement" ||
                                statement.type === "InterfaceStatement" ||
                                statement.type === "LibraryStatement") {
                            node.symbols.push({
                                "type": "GlobalImportSymbol",
                                "name": statement.name,
                                "alias": statement.name
                            });
                        }
                    });
                } else {
                    // If the imported file doesn't exist, that's probably
                    // because the path where solium is being executed is not
                    // the same as the one where the contract is stored.
                    // TODO use node.from relative to the path of the file
                    // being analyzed.
                    // See https://github.com/OpenZeppelin/solium-plugin-zeppelin/issues/21
                    // --elopio - 2018-03-20
                    return;
                }
            }
            imports[node.from] = node;
        }

        function inspectContractStatement(emitted) {
            if (emitted.exit) {
                return;
            }
            const node = emitted.node;
            Object.keys(imports).forEach(function(from) {
                // Check if there are imported symbols used for inheritance.
                node.is.forEach(function(parent) {
                    if (parent.type === "ModifierName") {
                        updateUsedSymbol(imports[from], parent.name);
                    }
                });
            });
        }

        function inspectMemberExpression(emitted) {
            if (emitted.exit) {
                return;
            }
            const node = emitted.node;
            Object.keys(imports).forEach(function(from) {
                // Check if members from imported symbols are used.
                updateUsedSymbol(imports[from], node.object.name);
            });
        }

        function inspectStateVariableDeclaration(emitted) {
            if (emitted.exit) {
                return;
            }
            const node = emitted.node;
            Object.keys(imports).forEach(function(from) {
                // Check if members from imported symbols are used.
                updateUsedSymbol(imports[from], node.literal.literal);
            });
        }

        function inspectUsingStatement(emitted) {
            if (emitted.exit) {
                return;
            }
            const node = emitted.node;
            Object.keys(imports).forEach(function(from) {
                // Check if members from imported symbols are used.
                updateUsedSymbol(imports[from], node.library);
            });
        }

        /**
         * updateUsedSymbol() checks if a symbol comes from an imported file.
         * If so, the symbol is removed from the list of imported symbols to check.
         * If the symbol was the last remaining item from that import, the import
         * is removed from the list to check.
        */
        function updateUsedSymbol(importNode, usedSymbolName) {
            importNode.symbols.some(function(symbol, index) {
                if (symbol.alias === usedSymbolName) {
                    importNode.symbols.splice(index, 1);
                    if (symbol.type === "GlobalImportSymbol") {
                        // If one globally imported symbol is used, it means
                        // that the import is used, so there is no need to check
                        // the rest.
                        importNode.symbols = importNode.symbols.filter(
                            symbol => symbol.type !== "GlobalImportSymbol");
                    }
                    if (importNode.symbols.length === 0) {
                        delete imports[importNode.from];
                    }
                    return true;
                }
            });
        }

        function inspectProgram(emitted) {
            if (emitted.exit) {
                Object.keys(imports).forEach(function(from) {
                    let symbols = imports[from].symbols;
                    if (symbols.length > 0) {
                        // If there are remaining symbols, it means that they
                        // were not used.
                        symbols.forEach(function(symbol) {
                            context.report({
                                node: imports[from],
                                message: `Unused imported symbol '${symbol.name}' from '${from}'.`
                            });
                        });
                    } else {
                        context.report({
                            node: imports[from],
                            message: `Unused import '${from}'.`
                        });
                    }
                });
            }
        }

        return {
            ImportStatement: inspectImportStatement,
            ContractStatement: inspectContractStatement,
            MemberExpression: inspectMemberExpression,
            StateVariableDeclaration: inspectStateVariableDeclaration,
            UsingStatement: inspectUsingStatement,
            Program: inspectProgram
        };
    }
};
