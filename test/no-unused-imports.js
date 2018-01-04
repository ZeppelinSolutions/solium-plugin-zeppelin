/**
 * @fileoverview Tests for no-unused-imports rule
 */

"use strict";

let Solium = require("solium");
let wrappers = require("./utils/wrappers");
let addPragma = wrappers.addPragma;

let userConfig = {
    rules: {
        "zeppelin/no-unused-imports": 1
    }
};

describe("[RULE] no-unused-imports: Acceptances", function() {
    it("should accept imported symbol used in inheritance", function(done) {
        let code = "import {TestImportedContract} from './Dummy.sol';\n" +
            "contract Dummy is TestImportedContract {}",
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();

        done();
    });
});

describe("[RULE] no-unused-imports: Acceptances", function() {
    it("should accept imported symbol used in multiple inheritance", function(done) {
        let code = "import {TestImportedContract} from './Dummy.sol';\n" +
            "contract Dummy1 is Dummy2, TestImportedContract {}",
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();

        done();
    });
});

describe("[RULE] no-unused-imports: Acceptances", function() {
    it("should accept multiple imported symbols used in inheritance", function(done) {
        let code = "import {TestImportedContract1, TestImportedContract2} from './Dummy.sol';\n" +
            "contract Dummy is TestImportedContract1, TestImportedContract2 {}",
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();

        done();
    });
});

describe("[RULE] no-unused-imports: Acceptances", function() {
    it("should accept imported symbol used in alias", function(done) {
        let code = "import {Dummy as TestImportedContract} from './Dummy.sol';\n" +
            "contract Dummy is TestImportedContract {}",
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();

        done();
    });
});

describe("[RULE] no-unused-imports: Acceptances", function() {
    it("should accept imported symbol with member used", function(done) {
        let code = "import {TestImportedContract} from './Dummy.sol';\n" +
            "contract Dummy {int dummy = TestImportedContract.dummy();}",
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();

        done();
    });
});

describe("[RULE] no-unused-imports: Acceptances", function() {
    it("should ignore all global symbols imports", function(done) {
        let code = "import './Dummy.sol';\n" +
            "contract Dummy {}",
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();

        done();
    });
});

describe("[RULE] no-unused-imports: Rejections", function() {
    it("should reject contracts with unused imported symbols", function(done) {
        let code = "import {TestImportedContract} from './TestFile.sol';\n" +
            "contract Dummy {}",
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);
        errors[0].message.should.equal(
            "Unused imported symbol 'TestImportedContract' from './TestFile.sol'.");

        Solium.reset();

        done();
    });
});
