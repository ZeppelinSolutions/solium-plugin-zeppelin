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
        "no-arithmetic-operations": require("./rules/no-arithmetic-operations")
    }
};
