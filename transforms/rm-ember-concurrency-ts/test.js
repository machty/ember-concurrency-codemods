'use strict';

const { runTransformTest } = require('codemod-cli');

runTransformTest({
  name: 'rm-ember-concurrency-test',
  path: require.resolve('./index.js'),
  fixtureDir: `${__dirname}/__testfixtures__/`,
});
