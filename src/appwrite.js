// /* eslint-disable no-unused-vars */
// import { Client, Databases, Query, ID } from "appwrite";

// const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
// const TABLE_NAME = import.meta.env.VITE_APPWRITE_TABLE_NAME;
// const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
// const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;

// export const logEnvVariables = () => {
//   console.log("Appwrite Environment Variables:");
//   console.log("DATABASE_ID:", DATABASE_ID);
//   console.log("TABLE_NAME:", TABLE_NAME);
//   console.log("PROJECT_ID:", PROJECT_ID);
//   console.log("ENDPOINT:", ENDPOINT);
// };

// const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);
// const database = new Databases(client);

// export const updatedSearchCount = async (searchTerm, movie) => {
//   try {
//     // const search
//     const result = await database.listDocuments(DATABASE_ID, TABLE_NAME, [
//       Query.equal("searchTerm", searchTerm),
//     ]);

//     if (result.documents.length > 0) {
//       const doc = result.documents[0];
//       await database.updateDocument(DATABASE_ID, TABLE_NAME, doc.$id, {
//         count: doc.count + 1,
//       });
//     } else {
//       await database.createDocument(DATABASE_ID, TABLE_NAME, ID.unique(), {
//         searchTerm,
//         count: 1,
//         movie_id: movie.id,
//         poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
//       });
//     }
//   } catch (error) {
//     console.error("Error updating search count:", error);
//   }
// };

// export const getTrendingMovies = async () => {
//   try {
//     const result = await database.listDocuments(DATABASE_ID, TABLE_NAME, [
//       Query.limit(5),
//       Query.orderDesc("count"),
//     ]);
//     return result.documents;
//   } catch (error) {
//     console.error("Error fetching trending movies:", error);
//   }
// };
