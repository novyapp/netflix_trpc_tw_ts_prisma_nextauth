import { getSession } from "next-auth/react";
import { prisma } from "../../server/db/client";
import type { NextApiRequest, NextApiResponse } from "next";
// POST /api/post

export default async (req: NextApiRequest, res: NextApiResponse) => {
  //console.log("mymovies api", req.body);
  const session = await getSession({ req });
  const result = await prisma.movie.findMany({
    where: {
      userId: session?.user?.id,
    },
  });
  res.status(200).json(result);
  //console.log(result);
};
