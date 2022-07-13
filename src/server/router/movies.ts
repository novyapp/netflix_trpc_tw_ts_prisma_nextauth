import { createRouter } from "./context";
import { prisma } from "../db/client";
import { z } from "zod";

export const moviesRouter = createRouter()
  .query("get-my-movies", {
    input: z.object({
      open: z.boolean(),
      userId: z.string().nullish(),
    }),

    async resolve({ input }) {
      const result = await prisma.movie.findMany({
        where: {
          userId: input.userId,
        },
      });
      return result;
    },
  })

  .query("singlemovie", {
    input: z.object({
      userId: z.string().nullish(),
    }),
    async resolve({ input }) {
      const result = await prisma.movie.findMany({
        where: {
          userId: input.userId,
        },
      });
      return result;
    },
  })
  .mutation("add-movie", {
    input: z.object({
      title: z.string().nullish(),
      id: z.number(),
      userId: z.string().nullish(),
      backdrop_path: z.string().nullish(),
      release_date: z.string().nullish(),
      name: z.string().nullish(),
      original_language: z.string().nullish(),
      original_name: z.string().nullish().nullish(),
      overview: z.string().nullish(),
      poster_path: z.string().nullish(),
      vote_average: z.number().nullish(),
      vote_count: z.number().nullish(),
    }),
    async resolve({ input }) {
      const result = await prisma.movie.create({
        data: {
          title: input.title,
          id: input.id,
          userId: input.userId,
          backdrop_path: input.backdrop_path,
          release_date: input.release_date,
          name: input.name,
          original_language: input.original_language,
          original_name: input.original_name,
          overview: input.overview,
          poster_path: input.poster_path,
          vote_average: input.vote_average,
          vote_count: input.vote_count,
        },
      });
      return result;
    },
  })
  .mutation("delete-movie", {
    input: z.object({
      id: z.number(),
      userId: z.string(),
    }),
    async resolve({ input }) {
      const deletemovie = await prisma.movie.deleteMany({
        where: {
          userId: input.userId,
          id: input.id,
        },
      });
      return deletemovie;
    },
  });
