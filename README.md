<p align="center">
  <img src=".github/terraform.png" alt="terraform" height="364px">
</p>
<h1 style="font-size: 56px; margin: 0; padding: 0;" align="center">
  terraform-min-max
</h1>
<p align="center">
  <img src="https://badgen.net/badge/TypeScript/strict%20%F0%9F%92%AA/blue" alt="Strict TypeScript">
  <img src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg" alt="Commitizen friendly">
  <a href="https://snyk.io/test/github/clowdhaus/terraform-min-max">
    <img src="https://snyk.io/test/github/clowdhaus/terraform-min-max/badge.svg" alt="Known Vulnerabilities" data-canonical-src="https://snyk.io/test/github/clowdhaus/terraform-min-max">
  </a>
</p>
<p align="center">
  <a href="https://github.com/clowdhaus/terraform-min-max/actions?query=workflow%3Atest">
    <img src="https://github.com/clowdhaus/terraform-min-max/workflows/test/badge.svg?branch=main" alt="test">
  </a>
</p>

GitHub action used to evaluate the Terraform minimum and maximum versions permitted

## Usage

```yml
steps:
  - name: Checkout
    uses: actions/checkout@v3

  - name: Extract Terraform min/max versions
    id: minMax
    uses: clowdhaus/terraform-min-max@main
    with:
      # The project root directory (.) is used as the default
      directory: .
outputs:
  minVersion: ${{ steps.minMax.outputs.minVersion }}
  maxVersion: ${{ steps.minMax.outputs.maxVersion }}
```

## Scenarios

### Extract minimum and maximum permitted versions of Terraform for use in matrix pipelines

```yml
jobs:
  versionExtract:
    name: Extract Min/Max Versions
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Extract Terraform min/max versions
        id: minMax
        uses: clowdhaus/terraform-min-max@main
        with:
          directory: tests/0.13
    outputs:
      minVersion: ${{ steps.minMax.outputs.minVersion }}
      maxVersion: ${{ steps.minMax.outputs.maxVersion }}

  versionEvaluate:
    name: Evaluate Min/Max Versions
    runs-on: ubuntu-latest
    needs: versionExtract
    strategy:
      matrix:
        version:
          - ${{ needs.versionExtract.outputs.minVersion }}
          - ${{ needs.versionExtract.outputs.maxVersion }}

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Install Terraform v${{ matrix.version }}
        uses: hashicorp/setup-terraform@v1
        with:
          terraform_version: ${{ matrix.version }}

      - name: Initialize and validate v${{ matrix.version }}
        run: |
          cd tests/0.13
          terraform init
          terraform validate
```

## Getting Started

The following instructions will help you get setup for development and testing purposes.

### Prerequisites

#### [yarn](https://github.com/yarnpkg/yarn)

`yarn` is used to handle dependencies and executing scripts on the codebase.

See [here](https://yarnpkg.com/en/docs/install#debian-stable) for instructions on installing yarn on your local machine.

Once you have installed `yarn`, you can install the project dependencies by running the following command from within the project root directory:

```bash
  $ yarn
```

## Contributing

Please read [CODE_OF_CONDUCT.md](.github/CODE_OF_CONDUCT.md) for details on our code of conduct and the process for submitting pull requests.

## Changelog

Please see the [CHANGELOG.md](CHANGELOG.md) for details on individual releases.
