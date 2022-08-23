export default class MyObject {
  foo() {
    this.someTask.perform();

    // TODO: figure out safe way to remove perform()
    perform(this.someTask, 1000).then(foo => 123)
  }
}
