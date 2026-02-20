import { v4 as uuidv4 } from "uuid";
import { redisConnection } from "../Config/redis.js";
import logger from "../Config/logger.js";
import { refreshCache } from "./refresh.js";

export const generateLockKeyAndCache = async (
  cacheKey: string,
  page: number,
  searchTerm: string,
  TTL: number
) => {
  const lockKey = `${cacheKey}:lock`;
  const lockId = uuidv4();

  // Try to acquire the lock for 10s
  const lockAcquired = await redisConnection.set(lockKey, lockId, {
    NX: true,
    EX: 10,
  });

  if (lockAcquired) {
    try {
      logger.info(`Lock acquired for key ${cacheKey} with lock ID ${lockId}`);
      await refreshCache(cacheKey, page, searchTerm, TTL); // Example parameters
      logger.info(`Cache refreshed for key ${cacheKey}`);
    } catch (error) {
      logger.error("Error refreshing cache inside mutex lock:", error);
    } finally {
      // Release the lock
      const currentLock = await redisConnection.get(lockKey);
      if (currentLock === lockId) await redisConnection.del(lockKey);
    }
  }
};
