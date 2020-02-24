import fs from 'fs';
import path from 'path';

export const DATA_FOLDER_NAME = 'data';
const EXT = '.pm';
const SAFE_TIME = 60 * 1000; // a minute
const EXPIRATION = 7 * 24 * 60 * 60 * 1000; // a week

function checkExistence(path: string): Promise<boolean> {
  return new Promise(resolve => {
    fs.exists(path, res => {
      resolve(res);
    });
  });
}

export async function createDataFolder(dir: string): Promise<void> {
  const exists = await checkExistence(dir);
  if (!exists) {
    return new Promise((resolve, reject) => {
      fs.mkdir(dir, err => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

export function save(dir: string, blob: Uint8Array): Promise<void> {
  const timestamp = Date.now();
  return new Promise((resolve, reject) => {
    fs.writeFile(path.join(dir, timestamp + EXT), blob, err => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function getFilepaths(dir: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) reject(err);
      else resolve(files);
    });
  });
}

async function getTimestamps(dir: string): Promise<number[]> {
  const filepaths = await getFilepaths(dir);
  const filenames = filepaths.filter(p => p.endsWith(EXT));
  return filenames.map(n => parseInt(n.substring(0, n.length - EXT.length)));
}

function getDataFrom(dir: string, ts: number): Promise<Uint8Array | null> {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(dir, ts + EXT), (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

export async function getMostRecent(dir: string): Promise<Uint8Array | null> {
  const timestamps = await getTimestamps(dir);
  if (timestamps.length > 0) {
    const max = Math.max(...timestamps);
    return getDataFrom(dir, max);
  } else {
    return null;
  }
}

function timestampsToKeep(timestamps: number[], now: number): Set<number> {
  const [toKeep] = timestamps
    .sort()
    .reverse()
    .reduce(
      ([keep, stored], ts) => {
        if (stored && (ts > stored - SAFE_TIME || ts < now - EXPIRATION)) {
          return [keep, stored]; // skip
        } else {
          keep.add(ts);
          return [keep, ts];
        }
      },
      [new Set(), null] as [Set<number>, number | null],
    );

  return toKeep;
}

function remove(dir: string, ts: number): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.unlink(path.join(dir, ts + EXT), err => {
      if (err) reject(err);
      else resolve();
    });
  });
}

export async function cleanup(dir: string): Promise<void> {
  const timestamps = await getTimestamps(dir);
  if (timestamps.length === 0) return;

  const now = Date.now();
  const toKeep = timestampsToKeep(timestamps, now);
  const toRemove = timestamps.filter(ts => !toKeep.has(ts));
  await Promise.all(toRemove.map(ts => remove(dir, ts)));
}
