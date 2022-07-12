import { getSession } from "next-auth/react";
import { prisma } from "../../server/db/client";
import type { NextApiRequest, NextApiResponse } from "next";
// POST /api/post

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    id,
    backdrop_path,
    original_title,
    release_date,
    original_language,
    original_name,
    overview,
    poster_path,
    vote_average,
    vote_count,
    name,
  } = req.body;
  //console.log(req.body);
  //console.log("api movie", id, original_title);
  const session = await getSession({ req });

  //console.log("api movie session", session);
  //console.log("movie id delete", id);
  //console.log(req.body);
  //console.log("deleted movie");
  if (req.method === "DELETE") {
    const movieId = parseInt(req.body);
    const deletemovie = await prisma.movie.deleteMany({
      where: {
        userId: session?.user?.id,
        id: movieId,
      },
    });
    res.json(deletemovie);
  } else {
    const result = await prisma.movie.create({
      data: {
        title: original_title,
        id: parseInt(id),
        userId: session?.user?.id,
        backdrop_path: backdrop_path,
        release_date: release_date,
        name: name,
        original_language: original_language,
        original_name: original_name,
        overview: overview,
        poster_path: poster_path,
        vote_average: vote_average,
        vote_count: vote_count,
      },
    });
    res.json(result);
  }
};
