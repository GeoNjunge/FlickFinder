import axios from "axios";
import logger from "../Config/logger.js";
import dotenv from "dotenv";
import CountsModel from "../Schemas/counts.schema.js";
import { TrendingRepository } from "../Redis/redis.schema.js";
import { redisConnection } from "../Config/redis.js";

dotenv.config();

const token = process.env.VITE_READ_ACCESS_TOKEN;

const DISCOVER_URL = "https://api.themoviedb.org/3/discover/movie";
const SEARCH_URL = "https://api.themoviedb.org/3/search/movie"; // New dedicated search URL
const APIOPTIONS = {};

export const fetchMovies = async (page: number, searchTerm: string) => {
  const cacheKey = searchTerm
    ? `movies:search:${searchTerm}:page:${page}`
    : `movies:discover:page:${page}`;
  try {
    // Check cache first
    const cached = await redisConnection.get(cacheKey);
    if (cached) {
      logger.info(`Cache hit for key ${cacheKey}`);
      return JSON.parse(cached);
    }

    // No cache then fetch from TMDB
    const isSearching = !!searchTerm;
    const url = isSearching ? SEARCH_URL : DISCOVER_URL;

    let params: any = {
      page,
      language: "en-US",
      include_adult: false,
      include_video: false,
    };

    if (isSearching) {
      params.query = searchTerm; // Use 'query' for /search/movie
    } else {
      params.sort_by = "popularity.desc"; // Use 'sort_by' for /discover/movie
    }

    logger.info(
      `Fetching movies from TMDB API - ${
        isSearching ? "Search" : "Discover"
      } Mode`,
      { params }
    );

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
      },
      params: params,
      timeout: 10000,
    });

    if (!response || response.status < 200 || response.status >= 300) {
      logger.error(`TMDB API responded with status ${response?.status}`);
      throw new Error(
        `TMDB API error: ${response?.statusText || "Unexpected status"}`
      );
    }

    const data = response.data;

    if (data && data.response === false) {
      logger.warn("TMDB API returned an unsuccessful response");
      return null;
    }

    logger.info("Movies fetched successfully from TMDB API", data);

    //cache the response foer 1 hour
    await redisConnection.set(cacheKey, JSON.stringify(data), { EX: 3600 });
    logger.info(`cached response for key ${cacheKey}`);

    return data;
  } catch (error) {
    logger.error("Error fetching movies:", error);
    throw error;
  }
};

export const updateSearchCount = async (searchTerm: string, movie: any) => {
  try {
    const mongoResult = await CountsModel.findOneAndUpdate(
      { searchTerm },
      {
        $inc: { count: 1 },
        $set: {
          lastSearchedAt: new Date(),
          movieId: movie.id,
          posterPath: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
          title: movie.title,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    // sync with redis
    const trendingEntity = await TrendingRepository.createAndSave({
      searchTerm,
      movieId: movie.id,
      posterPath: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
      title: movie.title,
      count: mongoResult.count,
      lastSearchedAt: new Date(),
    });

    logger.info(
      "Search count incremented successfully successfully in Mongo + Redis",
      trendingEntity
    );
    return mongoResult;
  } catch (error) {
    logger.error("Error updating search count:", error);
    throw error;
  }
};

export const fetchTrendingMovies = async () => {
  try {
    const redisTrending = TrendingRepository.search()
      .sortDesc("count")
      .returnAll();

    if ((await redisTrending).length > 0) {
      logger.info("Trending movies served from redis");
      return redisTrending;
    }
    logger.warn("No data in redis fall back to mongodb");
    const mongoTrending = await CountsModel.find()
      .sort({ count: -1 })
      .limit(10);

    // Optionally sync back to redis
    for (const movie of mongoTrending) {
      await TrendingRepository.createAndSave({
        searchTerm: movie.searchTerm,
        movieId: movie.movieId!,
        posterPath: movie.posterPath!,
        title: movie.title!,
        count: movie.count,
        lastSearchedAt: movie.lastSearchedAt,
      });
    }
    return mongoTrending;
  } catch (error) {
    logger.error("Error fetching trending movies:", error);
    throw error;
  }
};
