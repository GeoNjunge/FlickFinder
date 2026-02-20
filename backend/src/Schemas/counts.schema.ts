import mongoose from "mongoose";

export const CountsSchema = new mongoose.Schema(
  {
    searchTerm: { type: String, required: true, unique: true },
    movieId: { type: Number },
    posterPath: { type: String },
    title: { type: String },
    count: { type: Number, required: true, default: 0 },
    lastSearchedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

const CountsModel = mongoose.model("Counts", CountsSchema);

export default CountsModel;
