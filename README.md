# Logi-filter-builder

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]

You can use LogiFilterBuilder to create more complicated filters rather than using the out of the box filter bar on top of data grids.

The component is developed using visual components from Material-ui.

## Installation

```sh
// with npm
npm install logi-filter-builder

// with yarn
yarn add logi-filter-builder
```

## Usage

```js
import AdvancedFilter from "logi-filter-builder";
```

Now you can add <AdvancedFilter> to your application.

### properties

Columns:

an Array of {Header: "headerName", accessor: "DatabaseFieldName", dataType: "String"}

getFilterStatement: function which will be called when user clicks on Apply button and if validation is successful it will return the Tsql filter statement. (Note: currently this has only been tested with MS SQL Server).

## example

you can find an example in /demo/src/index.js

[build-badge]: https://img.shields.io/travis/user/repo/master.png?style=flat-square
[build]: https://travis-ci.org/logipro/logi-filter-builder
[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.org/package/npm-package
