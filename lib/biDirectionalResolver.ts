import { IdResolver, MemoryCache } from "@atproto/identity";

const HOUR = 60e3 * 60;
const DAY = HOUR * 24;

export function createIdResolver() {
  return new IdResolver({
    didCache: new MemoryCache(HOUR, DAY),
  });
}

export const resolveDidToHandle = async (
  resolver: IdResolver,
  did: string
): Promise<string> => {
  const didDoc = await resolver.did.resolveAtprotoData(did);
  const resolvedHandle = await resolver.handle.resolve(didDoc.handle);
  if (resolvedHandle === did) {
    return didDoc.handle;
  }
  return did;
};

export const resolveDidsToHandles = async (
  idResolver: IdResolver,
  dids: string[]
): Promise<Record<string, string>> => {
  const didHandleMap: Record<string, string> = {};
  const resolves = await Promise.all(
    dids.map((did) => resolveDidToHandle(idResolver, did).catch((_) => did))
  );
  for (let i = 0; i < dids.length; i++) {
    didHandleMap[dids[i]] = resolves[i];
  }
  return didHandleMap;
};