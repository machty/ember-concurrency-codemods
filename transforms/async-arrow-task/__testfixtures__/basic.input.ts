import { task, timeout } from 'ember-concurrency';

// TODO: try another test where `task` isn't imported, but needs to be added

export default class MyObject {
  @task *a(uid: string) {
    yield timeout(1);
  }

  @task({ drop: true }) *b(this: MyObject, uid: string) {
    yield timeout(1);
  }

  @task({ drop: true }) *c(uid: string) {
    yield timeout(1);
  }

  @task(function* (uid: string) {
    yield timeout(1);
  })
  d: any;

  @task(function* (uid: string) {
    yield timeout(1);
  }).drop()
  e: any;

  @task(function* (uid: string) {
    yield timeout(1);
  })
    .drop()
    .enqueue()
    .restartable()
    .keepLatest()
    .maxConcurrency(3)
    .group('myTaskGroup')
  f: any;

  @restartableTask *rt(uid: string) {
    yield timeout(1);
  }

  @dropTask *dt(uid: string) {
    yield timeout(1);
  }

  @enqueueTask *et(uid: string) {
    yield timeout(1);
  }

  @keepLatestTask *klt(uid: string) {
    yield timeout(1);
  }
}
