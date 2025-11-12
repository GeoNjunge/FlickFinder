import { redisConnection } from "../Config/redis.js";
import { fetchMovies } from "../Controllers/movies.controller.js";

export const refreshCache = async (
  key: string,
  page: number,
  searchTerm: string,
  TTL: number
) => {
  const newData = await fetchMovies(page, searchTerm, true);

  await redisConnection.set(
    key,
    JSON.stringify({
      data: newData,
      expiresAt: Date.now() + TTL,
    }),
    { EX: TTL }
  );
};
