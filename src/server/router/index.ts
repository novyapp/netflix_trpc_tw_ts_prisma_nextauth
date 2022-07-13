// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { authRouter } from "./auth";
import { moviesRouter } from "./movies";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("auth.", authRouter)
  .merge("movies.", moviesRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
