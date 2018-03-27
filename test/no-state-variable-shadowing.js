/**
 * @fileoverview Tests for no-state-variable-shadowing rule
 */

"use strict";

let dedent = require("dedent");
let Solium = require("solium");
let wrappers = require("./utils/wrappers");
let addPragma = wrappers.addPragma;

let userConfig = {
    rules: {
        "zeppelin/no-state-variable-shadowing": 1
    }
};

describe("[RULE] no-state-variable-shadowing: Rejections", function() {

    afterEach(function(done) {
        Solium.reset();
        done();
    });

    it("should reject direct inheritance shadowing on same file", function(done) {
        let code = dedent`
            contract TestParentContract {
                uint testVariable;
            }
            contract TestContract is TestParentContract {
                uint testVariable;
            }`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.should.be.instanceof(Array);
        errors.length.should.equal(1);
        errors[0].message.should.equal(dedent`
            'TestContract' shadows the state variable 'testVariable' \
            defined in the parent contract 'TestParentContract'.`);

        done();
    });

    it("should reject transitive inheritance shadowing on same file", function(done) {
        let code = dedent`
            contract TestGrandParentContract {
                uint testVariable;
            }
            contract TestParentContract is TestGrandParentContract {}
            contract TestContract is TestParentContract {
                uint testVariable;
            }`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.should.be.instanceof(Array);
        errors.length.should.equal(1);
        errors[0].message.should.equal(dedent`
            'TestContract' shadows the state variable 'testVariable' \
            defined in the parent contract 'TestGrandParentContract'.`);

        done();
    });

});

describe("[RULE] no-state-variable-shadowing: Acceptances", function() {

    afterEach(function(done) {
        Solium.reset();
        done();
    });

    it("should accept contracts without inheritance", function(done) {
        let code = dedent`
            contract TestContract {
                uint testVariable;
            }`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.should.deepEqual([]);

        done();
    });

    it("should accept contracts with inheritance without shadowing", function(done) {
        let code = dedent`
            contract ParentTestContract {
                uint testVariable;
            }
            contract TestContract is ParentTestContract {
                uint testVariable2;
            }`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.should.deepEqual([]);

        done();
    });

    it("should accept contracts with transitive inheritance without shadowing", function(done) {
        let code = dedent`
            contract GrandParentTestContract {
                uint testVariable;
            }
            contract ParentTestContract is GrandParentTestContract {
                uint testVariable2;
            }
            contract TestContract is ParentTestContract {
                uint testVariable3;
            }`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.should.deepEqual([]);

        done();
    });

    it("should ignore contract from global import", function(done) {
        let code = dedent`
            import './Dummy.sol';
            contract Dummy is TestImportedContract {
                uint testVariable;
            }`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.should.deepEqual([]);

        done();
    });


});
