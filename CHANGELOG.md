# [2.1.0](https://github.com/clowdhaus/terraform-min-max/compare/v2.0.0...v2.1.0) (2025-10-03)


### Features

* Update node version to v24 ([#95](https://github.com/clowdhaus/terraform-min-max/issues/95)) ([b4a5f6a](https://github.com/clowdhaus/terraform-min-max/commit/b4a5f6a2781ff5777caae2ebab6dc2e079e3c69b))

## [1.4.2](https://github.com/clowdhaus/terraform-min-max/compare/v1.4.1...v1.4.2) (2025-10-03)


### Bug Fixes

* implement proper Terraform ~> operator support ([#94](https://github.com/clowdhaus/terraform-min-max/issues/94)) ([40cc62e](https://github.com/clowdhaus/terraform-min-max/commit/40cc62efd99f649380b47b565cfe40206b48f924)), closes [#22](https://github.com/clowdhaus/terraform-min-max/issues/22)

## [1.4.1](https://github.com/clowdhaus/terraform-min-max/compare/v1.4.0...v1.4.1) (2025-07-08)


### Bug Fixes

* Correct Terraform version for module test ([#78](https://github.com/clowdhaus/terraform-min-max/issues/78)) ([9925580](https://github.com/clowdhaus/terraform-min-max/commit/9925580e4719bf4d54f09eb3c60d4d772f48f15c))

# [1.4.0](https://github.com/clowdhaus/terraform-min-max/compare/v1.3.2...v1.4.0) (2025-07-01)


### Features

* Update dependencies to latest, fix CI checks ([0e8936f](https://github.com/clowdhaus/terraform-min-max/commit/0e8936f2b61066ac0aaa45230befe1395106e2c4))

## [1.3.2](https://github.com/clowdhaus/terraform-min-max/compare/v1.3.1...v1.3.2) (2025-01-20)


### Bug Fixes

* **deps:** update dependency semver to v7.6.3 ([#40](https://github.com/clowdhaus/terraform-min-max/issues/40)) ([dda00ad](https://github.com/clowdhaus/terraform-min-max/commit/dda00ad7bcf402332a5634da790931d30df698e1))

## [1.3.1](https://github.com/clowdhaus/terraform-min-max/compare/v1.3.0...v1.3.1) (2024-04-04)


### Bug Fixes

* Update dependencies to latest to patch reported vulnerabilities ([c8e77f9](https://github.com/clowdhaus/terraform-min-max/commit/c8e77f9397303d1c3f69493f07dfab111f194b99))

# [1.3.0](https://github.com/clowdhaus/terraform-min-max/compare/v1.2.7...v1.3.0) (2024-03-06)


### Bug Fixes

* Update versions used in CI workflows to remove deprecated versions ([#30](https://github.com/clowdhaus/terraform-min-max/issues/30)) ([dc9dc91](https://github.com/clowdhaus/terraform-min-max/commit/dc9dc9157fe3317c5c10a7edfd151db423a9c757))


### Features

* Update dependencies to latest to patch reported vulnerabilities ([#29](https://github.com/clowdhaus/terraform-min-max/issues/29)) ([f103061](https://github.com/clowdhaus/terraform-min-max/commit/f10306180c9c6160fbef1f6cb01225f6e519b7ea))

## [1.2.7](https://github.com/clowdhaus/terraform-min-max/compare/v1.2.6...v1.2.7) (2023-07-22)


### Bug Fixes

* Update dependencies to latest to patch reported vulnerabilities ([2083c02](https://github.com/clowdhaus/terraform-min-max/commit/2083c02f521c19e2bf7b31a060d9b08fedbcdcfd))

## [1.2.6](https://github.com/clowdhaus/terraform-min-max/compare/v1.2.5...v1.2.6) (2023-04-28)


### Bug Fixes

* Update dependencies to latest to patch reported vulnerabilities ([2135a07](https://github.com/clowdhaus/terraform-min-max/commit/2135a07cc54e4124a4ea504b222f58b925cc0d16))

## [1.2.5](https://github.com/clowdhaus/terraform-min-max/compare/v1.2.4...v1.2.5) (2023-01-08)


### Bug Fixes

* Update dependencies to latest to patch reported vulnerabilities ([1036d2b](https://github.com/clowdhaus/terraform-min-max/commit/1036d2b5ae252f6c5536519702dc76028ef1fa48))

## [1.2.4](https://github.com/clowdhaus/terraform-min-max/compare/v1.2.3...v1.2.4) (2022-11-13)


### Bug Fixes

* Correct search logic to include `sort()` which will return the correct result ([#18](https://github.com/clowdhaus/terraform-min-max/issues/18)) ([c592570](https://github.com/clowdhaus/terraform-min-max/commit/c592570b641f1c4050371eb10a36c8b3084f05e6))

## [1.2.3](https://github.com/clowdhaus/terraform-min-max/compare/v1.2.2...v1.2.3) (2022-11-13)


### Bug Fixes

* Filter out sub-directory paths ([#17](https://github.com/clowdhaus/terraform-min-max/issues/17)) ([4e17e62](https://github.com/clowdhaus/terraform-min-max/commit/4e17e62c0caec29df4a932ca9379306ae075de25))

## [1.2.2](https://github.com/clowdhaus/terraform-min-max/compare/v1.2.1...v1.2.2) (2022-11-13)


### Bug Fixes

* Switch to use a regex to filter out results instead of length ([#16](https://github.com/clowdhaus/terraform-min-max/issues/16)) ([6a81ce9](https://github.com/clowdhaus/terraform-min-max/commit/6a81ce9986c92312c78609995aa33c4c0e4ccd40))

## [1.2.1](https://github.com/clowdhaus/terraform-min-max/compare/v1.2.0...v1.2.1) (2022-11-12)


### Bug Fixes

* Add sort ascending by string length in versions.tf files keys array ([#15](https://github.com/clowdhaus/terraform-min-max/issues/15)) ([8250970](https://github.com/clowdhaus/terraform-min-max/commit/8250970624bba09f5d3e3b396c9cd0f521b8220b))

# [1.2.0](https://github.com/clowdhaus/terraform-min-max/compare/v1.1.1...v1.2.0) (2022-10-27)


### Features

* Update depdencies to latest to remove warning on `setOutput` ([e1efe31](https://github.com/clowdhaus/terraform-min-max/commit/e1efe311319da6635d8a8095b8ce936e6d335581))

## [1.1.1](https://github.com/clowdhaus/terraform-min-max/compare/v1.1.0...v1.1.1) (2022-08-01)


### Bug Fixes

* package.json & yarn.lock to reduce vulnerabilities ([#10](https://github.com/clowdhaus/terraform-min-max/issues/10)) ([4e1252e](https://github.com/clowdhaus/terraform-min-max/commit/4e1252eba3723803affb633ccd5df84170e4fa87))

# [1.1.0](https://github.com/clowdhaus/terraform-min-max/compare/v1.0.8...v1.1.0) (2022-07-28)


### Features

* Update dependencies to patch reported vulnerabilities ([770ebab](https://github.com/clowdhaus/terraform-min-max/commit/770ebab21c37899d98ddd31a1fbf3d4dc3ee0022))

## [1.0.8](https://github.com/clowdhaus/terraform-min-max/compare/v1.0.7...v1.0.8) (2022-06-04)


### Bug Fixes

* **deps:** Update dependencies to latest to patch reported vulnerabilities ([989b832](https://github.com/clowdhaus/terraform-min-max/commit/989b8328febeb0f4eaa214fd190e6d786628cde7))
* Revert patch of `semver-regex` causing issues with `import` vs `require` ([06d675b](https://github.com/clowdhaus/terraform-min-max/commit/06d675b45b1a0f5bf5d8c8a9720593bf7e1b5604))

## [1.0.7](https://github.com/clowdhaus/terraform-min-max/compare/v1.0.6...v1.0.7) (2022-03-28)


### Bug Fixes

* Update dependencies to latest to patch reported vulnerabilities ([#6](https://github.com/clowdhaus/terraform-min-max/issues/6)) ([df03691](https://github.com/clowdhaus/terraform-min-max/commit/df036915208a27a559dc769f7c6a1413c55c58dd))

## [1.0.6](https://github.com/clowdhaus/terraform-min-max/compare/v1.0.5...v1.0.6) (2022-01-15)


### Bug Fixes

* correct dist output by downgrading `node-fetch` ([#3](https://github.com/clowdhaus/terraform-min-max/issues/3)) ([14dd414](https://github.com/clowdhaus/terraform-min-max/commit/14dd41404de18a3cb8b898eb87ea56809fd7ce02))

## [1.0.5](https://github.com/clowdhaus/terraform-min-max/compare/v1.0.4...v1.0.5) (2022-01-15)


### Bug Fixes

* update dependencies to latest to patch reported vulnerability ([ac60582](https://github.com/clowdhaus/terraform-min-max/commit/ac605826692ed7fd8a73b94f0df1b440dcf9a144))

## [1.0.4](https://github.com/clowdhaus/terraform-min-max/compare/v1.0.3...v1.0.4) (2021-11-03)


### Bug Fixes

* **deps:** update dependencies to latest and re-compile action artifact ([86511f9](https://github.com/clowdhaus/terraform-min-max/commit/86511f9f178cc636ac2eb00ffdfe73f77090fa52))

## [1.0.3](https://github.com/clowdhaus/terraform-min-max/compare/v1.0.2...v1.0.3) (2021-10-15)


### Bug Fixes

* **deps:** add missing packags for publishing semantic-release changelog ([3ec7db4](https://github.com/clowdhaus/terraform-min-max/commit/3ec7db4b9648dd28b970f847768eeeee93373cf3))
* **deps:** set min resolution version to patch vulnerability in `ansi-regex` sub-dependency ([5c3dcee](https://github.com/clowdhaus/terraform-min-max/commit/5c3dcee3c43fe9da8c3cac99c3c13d73dd970ca6))
