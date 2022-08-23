import { taskFor, perform } from 'ember-concurrency-ts'

export default class MyObject {
  foo() {
    taskFor(this.someTask).perform();

    // TODO: figure out safe way to remove perform()
    perform(this.someTask, 1000).then(foo => 123)
  }
}
