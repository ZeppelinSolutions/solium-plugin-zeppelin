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
        "highlight-comments": require("./rules/highlight-comments"),
        "missing-natspec-comments": require("./rules/missing-natspec-comments"),
        "no-arithmetic-operations": require("./rules/no-arithmetic-operations"),
        "no-state-variable-shadowing": require("./rules/no-state-variable-shadowing"),
        "no-unchecked-send": require("./rules/no-unchecked-send"),
        "no-unused-imports": require("./rules/no-unused-imports"),
        "parameters-underscore-prefix": require("./rules/parameters-underscore-prefix")
    }
};
