import express from "express";
import { getMovies, getTrendingMovies } from "../Services/movies.service.js";

const router = express.Router();

router.get("/search", getMovies);
router.get("/trending", getTrendingMovies);

export default router;
