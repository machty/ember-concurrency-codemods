import { task, timeout } from 'ember-concurrency';

// TODO: try another test where `task` isn't imported, but needs to be added

export default class MyObject {
  a = task(this, async (uid: string) => {
    await timeout(1);
  });

  b = task(this, { drop: true }, async (uid: string) => {
    await timeout(1);
  });

  c = task(this, { drop: true }, async (uid: string) => {
    await timeout(1);
  });

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
