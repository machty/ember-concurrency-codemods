const { getParser } = require('codemod-cli').jscodeshift;
const { getOptions } = require('codemod-cli');

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const options = getOptions();
  const root = j(file.source);

  // let binding = path.scope.getBinding(path.node.name);
  // if (binding && binding.kind === 'module') {
  //   let { node, parent } = binding.path;

  // remove taskFor()
  root
    .find(j.CallExpression, {
      callee: {
        name: 'taskFor',
      },
    })
    .forEach((p) => {
      const jp = j(p);
      jp.replaceWith(p.node.arguments[0]);
    });

  // remove perform().
  root
    .find(j.CallExpression, {
      callee: {
        name: 'perform',
        type: 'Identifier',
      },
    })
    .forEach((p) => {
      // const jp = j(p);
      // jp.replaceWith(p.node.arguments[0]);
      // TODO: I couldn't figure out how to ensure that `perform()` comes from ember-concurrency-ts.
      // How do you look up the binding of the callee?
      // This seemed to get close but returned the root Program node rather than the import:
      // cp = p.scope.lookup('perfor')
    });

  root.find(j.ImportDeclaration, { source: { value: 'ember-concurrency-ts' } }).forEach((p) => {
    const jp = j(p);
    jp.remove();
  });

  return root.toSource();
};

module.exports.type = 'js';
