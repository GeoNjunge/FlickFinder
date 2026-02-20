import { Queue, Worker } from "bullmq";
import { redisConnection } from "../Config/redis.js";
import {
  fetchMovies,
  updateSearchCount,
} from "../Controllers/movies.controller.js";

export const movieQueue = new Queue("movies", {
  connection: redisConnection as any,
});

const worker = new Worker(
  "movies",
  async (job) => {
    const { type, searchTerm, page, movie } = job.data;

    if (type === "refreshCache") {
      const data = await fetchMovies(page, searchTerm, true);

      if (data) {
        const cacheKey = searchTerm
          ? `movies:search:${searchTerm}:page:${page}`
          : `movies:discover:page:${page}`;

        await redisConnection.set(
          cacheKey,
          JSON.stringify({
            data,
            expiresAt: Date.now() + 3600 * 1000,
          }),
          { EX: 3600 }
        );
      }
    }

    if (type === "updateCount") {
      await updateSearchCount(searchTerm, movie);
    }
  },
  {
    connection: redisConnection as any,
  }
);

worker.on("completed", (job) => {
  console.log(`Job with ID ${job.id} has been completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job with ID ${job?.id} has failed with error: ${err.message}`);
});
