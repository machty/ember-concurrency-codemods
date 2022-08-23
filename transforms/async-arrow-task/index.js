const { getParser } = require('codemod-cli').jscodeshift;
const { getOptions } = require('codemod-cli');

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const options = getOptions();
  const root = j(file.source);

  function convertYieldsToAwaits(q) {
    q.find(j.YieldExpression).forEach((path) => {
      const { argument, comments } = path.value;
      if (argument && argument.type === 'ConditionalExpression') {
        const { test, consequent, alternate } = argument;
        const stmt = j.conditionalExpression(
          test,
          j.awaitExpression(consequent),
          j.awaitExpression(alternate)
        );
        j(path).replaceWith(stmt);
      } else {
        const awaitExp = j.awaitExpression(argument);
        awaitExp.comments = comments;
        j(path).replaceWith(awaitExp);
      }
    });
  }

  root.find(j.ClassMethod, { decorators: [{ expression: { name: 'task' } }] }).forEach((p) => {
    const jp = j(p);
    // Transform
    // - ClassMethod:   @task *a(uid: string) { yield timeout(1); }
    // + ClassProperty: a = task(this, async (uid: string) => { await timeout(1); });

    const asyncArrowFn = j.arrowFunctionExpression(p.value.params, p.value.body, true);
    asyncArrowFn.async = true;

    let newClassProperty = j.classProperty(
      j.identifier(p.node.key.name),
      j.callExpression(j.identifier('task'), [j.thisExpression(), asyncArrowFn])
    );
    const q = jp.replaceWith(newClassProperty);
    convertYieldsToAwaits(q);
  });

  return root.toSource();
};

module.exports.type = 'js';
