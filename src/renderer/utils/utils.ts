export function getByKey<K, V>(listOfTuples: Array<[K, V]> | ReadonlyArray<[K, V]> | undefined, key: K): V | undefined {
  return listOfTuples ? listOfTuples.find(([k]) => k === key)?.[1] : undefined;
}

export function getEntryByKey<K, V>(
  listOfTuples: Array<[K, V]> | ReadonlyArray<[K, V]> | undefined,
  key: K,
): [K, V] | undefined {
  return listOfTuples ? listOfTuples.find(([k]) => k === key) : undefined;
}
