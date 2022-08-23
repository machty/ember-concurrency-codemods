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
    const params = fn.params.filter((p) => {
      // Filter out any case of a TypeScript `this: ComponentClass`
      return p.name !== 'this';
    });
    const asyncArrowFn = j.arrowFunctionExpression(params, fn.body, true);
    asyncArrowFn.async = true;
    return asyncArrowFn;
  }

  const taskApiNames = ['task', 'restartableTask', 'dropTask', 'enqueueTask', 'keepLatestTask'];

  taskApiNames.forEach((taskApiName) => {
    // Transform
    // - ClassMethod:   @task *a(uid: string) { yield timeout(1); }
    // + ClassProperty: a = task(this, async (uid: string) => { await timeout(1); });
    root
      .find(j.ClassMethod, { decorators: [{ expression: { name: taskApiName } }] })
      .forEach((p) => {
        const jp = j(p);

        const asyncArrowFn = asyncArrowFunctionExpression(p.value);

        let newClassProperty = j.classProperty(
          j.identifier(p.node.key.name),
          j.callExpression(j.identifier(taskApiName), [j.thisExpression(), asyncArrowFn])
        );
        const q = jp.replaceWith(newClassProperty);
        convertYieldsToAwaits(q);
      });

    // Transform
    // - ClassMethod: @task({ drop: true }) *b(this: MyObject, uid: string) { yield timeout(1); }
    // + ClassProperty: b = task(this, { drop: true }, async (uid: string) => { await timeout(1); });
    root
      .find(j.ClassMethod, {
        decorators: [{ expression: { type: 'CallExpression', callee: { name: taskApiName } } }],
      })
      .forEach((p) => {
        const jp = j(p);

        const asyncArrowFn = asyncArrowFunctionExpression(p.value);
        const decoratorArgs = p.node.decorators[0].expression.arguments;

        let newClassProperty = j.classProperty(
          j.identifier(p.node.key.name),
          j.callExpression(j.identifier(taskApiName), [
            j.thisExpression(),
            ...decoratorArgs,
            asyncArrowFn,
          ])
        );
        const q = jp.replaceWith(newClassProperty);
        convertYieldsToAwaits(q);
      });

    // Transform
    // - ClassProperty @task(function* (uid: string) { yield timeout(1); }) d: any;
    // - ClassProperty d = task(this, async (uid: string) => { await timeout(1); });
    root
      .find(j.ClassProperty, {
        decorators: [
          {
            expression: {
              type: 'CallExpression',
              callee: { name: taskApiName },
              arguments: [{ type: 'FunctionExpression', generator: true }],
            },
          },
        ],
      })
      .forEach((p) => {
        const jp = j(p);

        const decoratorGeneratorFn = p.value.decorators[0].expression.arguments[0];

        const asyncArrowFn = asyncArrowFunctionExpression(decoratorGeneratorFn);

        let newClassProperty = j.classProperty(
          j.identifier(p.node.key.name),
          j.callExpression(j.identifier(taskApiName), [j.thisExpression(), asyncArrowFn])
        );
        const q = jp.replaceWith(newClassProperty);
        convertYieldsToAwaits(q);
      });

    // Transform
    // - ClassProperty: @task(function* (uid: string) { yield timeout(1); }).drop() e: any;
    // - ClassProperty: e = task(this, { drop: true }, async (uid: string) => { await timeout(1); });
    root
      .find(j.ClassProperty, {
        decorators: [
          {
            expression: {
              type: 'CallExpression',
              callee: { type: 'MemberExpression' },
            },
          },
        ],
      })
      .forEach((p) => {
        const jp = j(p);

        const optionProperties = [];

        // We have to loop through the chain of method calls and amass them into an options object literal.
        let memberCallExpression = p.node.decorators[0].expression;
        while (
          memberCallExpression &&
          memberCallExpression.type === 'CallExpression' &&
          memberCallExpression.callee.type === 'MemberExpression'
        ) {
          let memberExpression = memberCallExpression.callee;
          const optionName = memberExpression.property.name; // e.g. for .drop(), optionName is "drop"
          const args = memberCallExpression.arguments;
          const optionValue = args[0] || j.booleanLiteral(true);

          optionProperties.push(j.objectProperty(j.identifier(optionName), optionValue));

          memberCallExpression = memberCallExpression.callee.object;
        }

        const optionsObject = j.objectExpression(optionProperties);

        const asyncArrowFn = asyncArrowFunctionExpression(memberCallExpression.arguments[0]);

        let newClassProperty = j.classProperty(
          j.identifier(p.node.key.name),
          j.callExpression(j.identifier(taskApiName), [
            j.thisExpression(),
            optionsObject,
            asyncArrowFn,
          ])
        );
        const q = jp.replaceWith(newClassProperty);
        convertYieldsToAwaits(q);
      });
  });

  return root.toSource();
};

module.exports.type = 'js';
