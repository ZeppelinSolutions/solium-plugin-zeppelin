/**
 * @fileoverview Entry Point of Solium plugin for Zeppelin audits
 * @author Leo Arias <yo@elopio.net>
 */

"use strict";

module.exports = {
    meta: {
        description: "Solium plugin for Zeppelin audits"
    },

    rules: {
        "constant-candidates": require("./rules/constant-candidates"),
        "no-arithmetic-operations": require("./rules/no-arithmetic-operations"),
        "no-modifiers-without-revert": require("./rules/no-modifiers-without-revert"),
        "no-unchecked-send": require("./rules/no-unchecked-send"),
        "no-unused-imports": require("./rules/no-unused-imports")
    }
};
