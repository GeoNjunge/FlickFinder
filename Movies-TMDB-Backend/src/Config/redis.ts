import { createClient } from "redis";
import { Client as RedisOMClient } from "redis-om";
import logger from "./logger.js";

const url = process.env.REDIS_URL || "redis://localhost:6379";

const redisConnection = createClient({
  url: url,
});

redisConnection.on("error", (err) => logger.error("Redis client error", err));
redisConnection.on("connect", () => logger.info("Connected to redis"));

await redisConnection.connect();

const client = new RedisOMClient();
await client.use(redisConnection);

export { redisConnection };

export default client;
