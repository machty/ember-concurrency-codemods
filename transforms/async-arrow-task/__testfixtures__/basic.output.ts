import { task, timeout } from 'ember-concurrency';

// TODO: top comment

/**
 * class comment
 */
export default class MyObject {
  // begin comment a
  a = task(async (uid: string) => {
    await timeout(1);
  });

  // end comment a

  // begin comment b
  b = task({ drop: true }, async (uid: string) => {
    await timeout(1);
  });

  // end comment b

  // begin comment c
  c = task({ drop: true }, async (uid: string) => {
    await timeout(1);
  });

  // end comment c

  d = task(async (uid: string) => {
    await timeout(1);
  });

  e = task({
    drop: true
  }, async (uid: string) => {
    await timeout(1);
  });

  f = task({
    group: 'myTaskGroup',
    maxConcurrency: 3,
    keepLatest: true,
    restartable: true,
    enqueue: true,
    drop: true
  }, async (uid: string) => {
    await timeout(1);
  });

  rt = restartableTask(async (uid: string) => {
    await timeout(1);
  });

  dt = dropTask(async (uid: string) => {
    await timeout(1);
  });

  et = enqueueTask(async (uid: string) => {
    await timeout(1);
  });

  klt = keepLatestTask(async (uid: string) => {
    await timeout(1);
  });
}
