# DEPRECATED

[![No Maintenance Intended](http://unmaintained.tech/badge.svg)](http://unmaintained.tech/)

[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

[![Travis](https://img.shields.io/travis/OpenZeppelin/solium-plugin-zeppelin.svg?style=flat-square&branch=master)](https://travis-ci.org/OpenZeppelin/solium-plugin-zeppelin)

> Solium plugin for Zeppelin audits

*IMPORTANT*: This project is no longer maintained. OpenZeppelin migrated to [solhint](https://github.com/OpenZeppelin/openzeppelin-solidity/issues/508), and for audits we are using multiple specialized security tools like [Slither](https://github.com/trailofbits/slither) and [Mythril](https://github.com/ConsenSys/mythril-classic). Feel free to take these Solium rules, copy them and adjust them to your needs. If you need assistance migrating, contact [@elopio](https://github.com/elopio).

## Install

```
$ npm install -g solium
$ npm install -g solium-plugin-zeppelin
```

## Usage

In the .soliumrc.json file, add:

    {
      ...
      "rules": {
        ...
        "zeppelin/constant-candidates": [
          "warning"
        ],
        "zeppelin/highlight-comments": [
          "warning"
        ],
        "zeppelin/missing-natspec-comments": [
          "warning"
        ],
        "zeppelin/no-arithmetic-operations": [
          "warning"
        ],
        "zeppelin/no-state-variable-shadowing": [
          "warning"
        ],
        "zeppelin/no-unchecked-send": [
          "warning"
        ],
        "zeppelin/no-unused-imports": [
          "warning"
        ],
        "zeppelin/private-state-variables-underscore-prefix": [
          "warning"
        ],
        "zeppelin/all-state-variables-private": [
          "warning"
        ]
    }

## Maintainers

[@elopio](https://github.com/elopio)

[@facuspagnuolo](https://github.com/facuspagnuolo)

## Contribute

We welcome all kinds of contributors! Open an
[issue](https://github.com/elopio/solium-plugin-zeppelin/issues) or submit pull
requests.

To set up for development, see the [HACKING](HACKING.md) file.

## License

[MIT](LICENSE) © 2017-2018 [OpenZeppelin](https://openzeppelin.org/)
