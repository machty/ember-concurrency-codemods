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

  function asyncArrowFunctionExpression(fn) {
    const params = fn.params.filter(p => {
      // Filter out any case of a TypeScript `this: ComponentClass`
      return p.name !== 'this';
    });
    const asyncArrowFn = j.arrowFunctionExpression(params, fn.body, true);
    asyncArrowFn.async = true;
    return asyncArrowFn;
  }

  // Transform
  // - ClassMethod:   @task *a(uid: string) { yield timeout(1); }
  // + ClassProperty: a = task(this, async (uid: string) => { await timeout(1); });
  root.find(j.ClassMethod, { decorators: [{ expression: { name: 'task' } }] }).forEach((p) => {
    const jp = j(p);

    const asyncArrowFn = asyncArrowFunctionExpression(p.value);

    let newClassProperty = j.classProperty(
      j.identifier(p.node.key.name),
      j.callExpression(j.identifier('task'), [j.thisExpression(), asyncArrowFn])
    );
    const q = jp.replaceWith(newClassProperty);
    convertYieldsToAwaits(q);
  });

  // Transform
  // - ClassMethod: @task({ drop: true }) *b(this: MyObject, uid: string) { yield timeout(1); }
  // + ClassProperty: b = task(this, { drop: true }, async (uid: string) => { await timeout(1); });
  root
    .find(j.ClassMethod, {
      decorators: [{ expression: { type: 'CallExpression', callee: { name: 'task' } } }],
    })
    .forEach((p) => {
      const jp = j(p);

      const asyncArrowFn = asyncArrowFunctionExpression(p.value);
      const decoratorArgs = p.node.decorators[0].expression.arguments;

      let newClassProperty = j.classProperty(
        j.identifier(p.node.key.name),
        j.callExpression(j.identifier('task'), [j.thisExpression(), ...decoratorArgs, asyncArrowFn])
      );
      const q = jp.replaceWith(newClassProperty);
      convertYieldsToAwaits(q);
    });

  return root.toSource();
};

module.exports.type = 'js';
