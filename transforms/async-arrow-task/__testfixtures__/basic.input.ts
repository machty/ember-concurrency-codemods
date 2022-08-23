import { task, timeout } from 'ember-concurrency';

// TODO: top comment

/**
 * class comment
 */
export default class MyObject {
  // begin comment a
  @task *a(uid: string) {
    yield timeout(1);
  }
  // end comment a
  
  // begin comment b
  @task({ drop: true }) *b(this: MyObject, uid: string) {
    yield timeout(1);
  }
  // end comment b

  // begin comment c
  @task({ drop: true }) *c(uid: string) {
    yield timeout(1);
  }
  // end comment c

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
