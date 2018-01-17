# solium-plugin-zeppelin

[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

> Solium plugin for Zeppelin audits

## Install

TODO: transfer the npm package from duaraghav8 to zeppelin, and publish.

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
