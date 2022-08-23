import { task, timeout } from 'ember-concurrency';

// TODO: top comment

/**
 * class comment
 */
export default class MyObject {
  // begin comment a
  a = task(this, async (uid: string) => {
    await timeout(1);
  });

  // end comment a

  // begin comment b
  b = task(this, { drop: true }, async (uid: string) => {
    await timeout(1);
  });

  // end comment b

  // begin comment c
  c = task(this, { drop: true }, async (uid: string) => {
    await timeout(1);
  });

  // end comment c

  d = task(this, async (uid: string) => {
    await timeout(1);
  });

  e = task(this, {
    drop: true
  }, async (uid: string) => {
    await timeout(1);
  });

  f = task(this, {
    group: 'myTaskGroup',
    maxConcurrency: 3,
    keepLatest: true,
    restartable: true,
    enqueue: true,
    drop: true
  }, async (uid: string) => {
    await timeout(1);
  });

  rt = restartableTask(this, async (uid: string) => {
    await timeout(1);
  });

  dt = dropTask(this, async (uid: string) => {
    await timeout(1);
  });

  et = enqueueTask(this, async (uid: string) => {
    await timeout(1);
  });

  klt = keepLatestTask(this, async (uid: string) => {
    await timeout(1);
  });
}
