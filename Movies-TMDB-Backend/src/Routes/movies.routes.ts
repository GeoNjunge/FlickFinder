import express, { Request, Response } from "express";
import { getMovies, getTrendingMovies } from "../Services/movies.service.js";
import fs from "fs";
import logger from "../Config/logger.js";

const router = express.Router();

router.get("/search", getMovies);
router.get("/trending", getTrendingMovies);

// simulate offline movies
router.get("/offline-movies", async (req: Request, res: Response) => {
  fs.readFile(
    "/FilesystemRoot/React19-Tutorial/movies-TMDB/Movies-TMDB-Backend/OfflineLatencyTest/data.json",
    "utf8",
    (err, data) => {
      if (err) {
        logger.error("Error reading file: ", err);
        return;
      }

      try {
        const jobsData = JSON.parse(data);
        res.status(200).json({ jobsData });
      } catch (error) {
        logger.error("Error parsing JSON");
      }
    }
  );
});

export default router;
