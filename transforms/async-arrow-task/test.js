'use strict';

const { runTransformTest } = require('codemod-cli');

runTransformTest({ 
  name: 'async-arrow-task',
  path: require.resolve('./index.js'),
  fixtureDir: `${__dirname}/__testfixtures__/`,
});