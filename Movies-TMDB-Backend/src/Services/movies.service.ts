import { NextFunction, Request, Response } from "express";
import logger from "../Config/logger.js";
import {
  fetchMovies,
  fetchTrendingMovies,
  updateSearchCount,
} from "../Controllers/movies.controller.js";

export const getMovies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.info("Fetching movies from TMDB API");
    
    const response = await fetchMovies(1, req.query.searchTerm as string);

    if (!response) {
      logger.warn("No movies data received from TMDB API");
      return res.status(404).json({ message: "No movies found" });
    }

    if (response.results.length === 0) {
      logger.warn("Movies data is empty");
      return res.status(204).send();
    }

    if (response.results.length > 0 && req.query.searchTerm) {
      updateSearchCount(req.query.searchTerm as string, response.results[0]);
    }

    logger.info("Movies data fetched successfully");

    res.status(200).json(response);
  } catch (error) {
    logger.error("Error in getMovies controller:", error);
    next(error);
  }
};

export const getTrendingMovies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.info("Fetching trending movies from TMDB API");
    const response = await fetchTrendingMovies();

    if (!response) {
      logger.warn("No trending movies data received from TMDB API");
      return res.status(404).json({ message: "No trending movies found" });
    }

    if (response.length === 0) {
      logger.warn("Trending movies data is empty");
      return res.status(204).send();
    }

    logger.info("Trending movies data fetched successfully");

    res.status(200).json(response);
  } catch (error) {
    logger.error("Error in getTrendingMovies controller:", error);
    next(error);
  }
};
