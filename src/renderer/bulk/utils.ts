import { Collection } from '../models/Collection';

// Todo: sanitize
export function validateCollection(data: unknown): Collection | null {
  return data as Collection;
}
