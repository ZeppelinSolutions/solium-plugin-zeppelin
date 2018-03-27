/**
 * @fileoverview Report uncommented code.
 */

"use strict";

module.exports = {
    meta: {
        docs: {
            recommended: true,
            type: "error",
            description: "Report uncommented code"
        },
        schema: []
    },

    create: function(context) {

        let nodesThatRequireComments = [];

        function inspectContractStatement(emitted) {
            if (emitted.exit) {
                nodesThatRequireComments.push(emitted.node);
            }
        }

        function inspectInterfaceStatement(emitted) {
            if (emitted.exit) {
                nodesThatRequireComments.push(emitted.node);
            }
        }

        function inspectLibraryStatement(emitted) {
            if (emitted.exit) {
                nodesThatRequireComments.push(emitted.node);
            }
        }

        function inspectFunctionDeclaration(emitted) {
            if (emitted.exit) {
                nodesThatRequireComments.push(emitted.node);
            }
        }

        function inspectProgram(emitted) {
            if (emitted.exit) {
                emitted.node.comments = getCommentsWithMergedNatspecLines(
                    emitted.node.comments);
                nodesThatRequireComments.forEach(node => {
                    let comment = getComment(node, emitted.node);
                    if (comment === undefined) {
                        context.report({
                            node: node,
                            message: `'${node.name}' has no comment.`
                        });
                    } else if (!isNatspecComment(comment)) {
                        context.report({
                            node: node,
                            message: `'${node.name}' has no natspec comment.`
                        });
                    } else if (requiresTitle(node.type) && !hasTitle(comment)) {
                        context.report({
                            node: node,
                            message: `'${node.name}' has no natspec title comment.`
                        });
                    }
                });
            }
        }

        /**
         * Merge the adjacent Natspec line comments.
         *
         * Solium parses separately each line with a comment that starts
         * with ///.
         * We want to check the contents of the comment blocks, so we need to
         * merge the adjacent Natspec lines into one comment.
         *
         * XXX To keep this simple, the order of the comments in the list might
         * change. Currently we don't use the order at all, so that's not a
         * problem now.
         * --elopio - 20180110
         */
        function getCommentsWithMergedNatspecLines(originalComments) {
            let comments = [];
            let lastNatspecLineComment = null;
            originalComments.forEach(comment => {
                if (!comment.text.startsWith("///")) {
                    // Not a natspec comment, just add it to the list.
                    comments.push(comment);
                } else if (lastNatspecLineComment === null) {
                    // This is the first natspec line we find.
                    lastNatspecLineComment = comment;
                } else if (lastNatspecLineComment.end !== comment.start -1) {
                    // Not adjacent natspec comments.
                    comments.push(JSON.parse(
                        JSON.stringify(lastNatspecLineComment)));
                    lastNatspecLineComment = comment;
                } else {
                    // Join the natspec comments.
                    lastNatspecLineComment.text += "\n" + comment.text;
                    lastNatspecLineComment.end = comment.end;
                }
            });
            if (lastNatspecLineComment !== null) {
                comments.push(lastNatspecLineComment);
            }
            return comments;
        }

        /**
         * Get the comment that corresponds to a node.
         *
         * Solium doesn't link nodes with their comments, it just puts all
         * of them in the Program node.
         * So we do this by searching for a comment that ends right before
         * the node starts.
        */
        function getComment(node, program) {
            // Take into account the empty spaces at the start of the line.
            let emptySpaces = 0;
            while (context.getSourceCode().text.charAt(
                node.start - emptySpaces - 1) !== "\n") {
                emptySpaces++;
            }
            return program.comments.find(
                comment => comment.end === node.start - emptySpaces - 1);
        }

        /**
         * Check if a comment follows the Ethereum Natural Specification Format
         *
         * Natspec comments start with /// of with /**.
         * See https://github.com/ethereum/wiki/wiki/Ethereum-Natural-Specification-Format
         */
        function isNatspecComment(comment) {
            return comment.text.startsWith("///") ||
                comment.text.startsWith("/**");
        }

        function requiresTitle(type) {
            return type === "ContractStatement" ||
                type === "InterfaceStatement" ||
                type === "LibraryStatement";
        }

        function hasTitle(comment) {
            return comment.text.includes("@title");
        }

        return {
            ContractStatement: inspectContractStatement,
            InterfaceStatement: inspectInterfaceStatement,
            LibraryStatement: inspectLibraryStatement,
            FunctionDeclaration: inspectFunctionDeclaration,
            Program: inspectProgram
        };
    }
};
