import { getSession } from "next-auth/react";
import { prisma } from "../../server/db/client";
import type { NextApiRequest, NextApiResponse } from "next";
// POST /api/post

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, backdrop_path, original_title } = req.body;
  console.log(req.body);
  console.log("api movie", id, original_title);
  const session = await getSession({ req });

  //console.log("api movie session", session);
  console.log("movie id delete", id);
  console.log(req.body);
  console.log("deleted movie");
  if (req.method === "DELETE") {
    const movieId = parseInt(req.body);
    const deletemovie = await prisma.movie.deleteMany({
      where: {
        userId: session?.user?.id,
        movieId: movieId,
      },
    });
    res.json(deletemovie);
  } else {
    const result = await prisma.movie.create({
      data: {
        title: original_title,
        poster: backdrop_path,
        movieId: id,
        userId: session?.user?.id,
      },
    });
    res.json(result);
  }
};
