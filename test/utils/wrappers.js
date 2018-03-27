/**
 * @fileoverview Utility methods for test suit
 *
 * Copied from solium tests at:
 * https://github.com/duaraghav8/solium
 */

"use strict";

let dedent = require("dedent");

module.exports = {

    /**
     * Wrap a solidity statement in valid contract boilerplate.
     * @param  {String} code Solidity snippet to wrap
     * @return {String}      wrapped snippet
     */
    toContract: function(code) {
        return dedent`
            pragma solidity ^0.4.3;


            contract Wrap {
                ${code}
            }
            `;
    },

    /**
     * Prepend solidity contract / library with a pragma statement
     * @param  {String} code Solidity snippet
     * @return {String}      snippet with pragma statement.
     */
    addPragma: function(code) {
        return dedent`
            pragma solidity ^0.4.3;

            ${code}`;
    }
};
