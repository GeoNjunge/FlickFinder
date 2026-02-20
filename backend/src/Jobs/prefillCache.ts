import { movieQueue } from "./queues.js";

export const prefillCache = async () => {
  const popularPages = [1, 2, 3];
  const searchTerms = ["", "batman", "superman", "spiderman", "avengers"];

  for (const page of popularPages) {
    movieQueue.add("refreshCache", {
      type: "refreshCache",
      searchTerm: "",
      page,
    });
  }

  for (const term of searchTerms) {
    movieQueue.add("refreshCache", {
      type: "refreshCache",
      searchTerm: term,
      page: 1,
    });
  }
};
