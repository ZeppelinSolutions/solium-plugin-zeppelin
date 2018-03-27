/**
 * @fileoverview Tests for highlight-comments rule
 */

"use strict";

let dedent = require("dedent");
let Solium = require("solium");
let wrappers = require("./utils/wrappers");
let addPragma = wrappers.addPragma;

let userConfig = {
    rules: {
        "zeppelin/highlight-comments": 1
    }
};

describe("[RULE] highlight-comments: Rejections", function() {
    afterEach(function(done) {
        Solium.reset();
        done();
    });

    it("should comments with highlights", function(done) {
        let scenarios = [
            {
                highlightComment: "AUDIT",
                code: "// AUDIT dummy comment."
            }, {
                highlightComment: "AUDIT",
                code: dedent`
                    /* AUDIT dummy comment.
                     */`
            }, {
                highlightComment: "FIXME",
                code: "// FIXME dummy comment."
            }, {
                highlightComment: "FIXME",
                code: dedent`
                    /* FIXME dummy comment.
                     */`
            }, {
                highlightComment: "TODO",
                code: "// TODO dummy comment."
            }, {
                highlightComment: "TODO",
                code: dedent`
                    /* TODO dummy comment.
                     */`
            }, {
                highlightComment: "XXX",
                code: "// XXX dummy comment."
            }, {
                highlightComment: "XXX",
                code: dedent`
                    /* XXX dummy comment.
                     */`
            }
        ];
        scenarios.forEach(scenario => {
            let errors = Solium.lint(addPragma(scenario.code), userConfig);

            errors.constructor.name.should.equal("Array");
            errors.length.should.equal(1);
            errors[0].message.should.equal(`'${scenario.highlightComment}' comment.`);
        });

        done();
    });
});

describe("[RULE] highlight-comments: Acceptances", function() {
    afterEach(function(done) {
        Solium.reset();
        done();
    });

    it("should accept comments without highlights", function(done) {
        let scenarios = [
            "// dummy comment.",
            dedent`
                /* dummy comment.
                 */`
        ];

        scenarios.forEach(code => {
            let errors = Solium.lint(addPragma(code), userConfig);

            errors.constructor.name.should.equal("Array");
            errors.length.should.equal(0);
        });

        done();
    });
});
