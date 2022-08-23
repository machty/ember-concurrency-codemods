# rm-ember-concurrency-task

Removes any usage of [ember-concurrency-async](https://github.com/chancancode/ember-concurrency-async),
e.g. any usage of `taskFor()` (and the less common `perform()` utility fn).

This codemod should only be run after you've run the `async-arrow-task` codemod and tested
your codebase.

Once you've applied this codemod you can:

1. Remove "ember-concurrency-ts" from package.json
2. Remove any traces of `import 'ember-concurrency-async';` or `import 'ember-concurrency-ts/async';`

## Usage

```
npx ember-concurrency-codemods async-arrow-task path/of/files/ or/some**/*glob.js

# or

yarn global add ember-concurrency-codemods
ember-concurrency-codemods async-arrow-task path/of/files/ or/some**/*glob.js
```

## Local Usage
```
node ./bin/cli.js async-arrow-task path/of/files/ or/some**/*glob.js
```

## Input / Output

<!--FIXTURES_TOC_START-->
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
<!--FIXTURES_CONTENT_END-->