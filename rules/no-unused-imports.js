/**
 * @fileoverview Disallow unused imports
 *
 * Thanks to the pseudocode by Raghav Dua.
 */

"use strict";

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
            if (node.symbols.length > 0) {
                // TODO for now, ignore the imports like `import "./file";`
                // In order to see if those imports are used, the imported file
                // has to be parsed to collect the symbols that it exports.
                // --elopio - 2017-12-20
                imports[node.from] = node;
            }
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

        /**
         * updateUsedSymbol() checks if a symbol comes from an imported file.
         * If so, the symbol is removed from the list of imported symbols to check.
         * If the symbol was the last remaining item from that import, the import
         * is removed from the list to check.
        */
        function updateUsedSymbol(importNode, usedSymbolName) {
            let symbols = importNode.symbols;
            symbols.some(function(symbol, index) {
                if (symbol.alias === usedSymbolName) {
                    symbols.splice(index, 1);
                    if (symbols.length === 0) {
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
            Program: inspectProgram
        };
    }
};
