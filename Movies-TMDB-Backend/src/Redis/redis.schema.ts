import { Entity, Repository, Schema } from "redis-om";
import client from "../Config/redis.js";

interface TrendingProps {
  searchTerm: string;
  movieId: number;
  posterPath: string;
  title: string;
  count: number;
  lastSearchedAt: Date;
}

class Trending extends Entity implements TrendingProps {
  searchTerm!: string;
  movieId!: number;
  posterPath!: string;
  title!: string;
  count!: number;
  lastSearchedAt!: Date;
}

const TrendingSchema = new Schema(Trending, {
  searchTerm: { type: "string" },
  movieId: { type: "number" },
  posterPath: { type: "string" },
  title: { type: "string" },
  count: { type: "number", sortable: true },
  lastSearchedAt: { type: "date" },
});

export const TrendingRepository = client.fetchRepository(TrendingSchema);
await TrendingRepository.createIndex();
export { Trending, TrendingSchema };
