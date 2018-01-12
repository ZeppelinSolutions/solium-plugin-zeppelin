/**
 * @fileoverview Report highlight comments.
 */

"use strict";

const HIGHLIGHT_COMMENTS = ["FIXME", "TODO", "XXX"];

module.exports = {
    meta: {
        docs: {
            recommended: true,
            type: "warning",
            description: "Report highlight comments: FIXME, TODO, XXX."
        },
        schema: []
    },

    create: function(context) {

        function inspectProgram(emitted) {
            if (emitted.exit) {
                let node = emitted.node;
                node.comments.forEach(comment => {
                    HIGHLIGHT_COMMENTS.forEach(highlight => {
                        if (comment.text.includes(highlight)) {
                            context.report({
                                node: comment,
                                message: `'${highlight}' comment.`
                            });
                        }
                    });
                });
            }
        }

        return {
            Program: inspectProgram
        };
    }
};
