/**
 * @fileoverview Utility methods for test suit
 *
 * Copied from solium-plugin-security tests at:
 * https://github.com/duaraghav8/solium-plugin-security
 */

"use strict";

module.exports = {
    /**
	 * Wrap a solidity statement in valid contract boilerplate.
	 * @param  {String} code Solidity snippet to wrap
	 * @return {String}      wrapped snippet
	 */
    toContract: function(code) {
        let pre = "pragma solidity ^0.4.3;\n\n\ncontract Wrap {\n\t";
        let post = "\n}";
        return pre + code + post;
    }
};
