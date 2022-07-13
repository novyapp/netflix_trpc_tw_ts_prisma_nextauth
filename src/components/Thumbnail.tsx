import React from "react";
import { Movie } from "typings";
import Image from "next/image";
import { useRecoilState } from "recoil";
import { modalState, movieState } from "atoms/modalAtom";
import { useMovieState, useStore } from "../store";

interface Props {
  movie: Movie;
}

function Thumbnail({ movie }: Props) {
  const [modal, setModal] = useStore((state) => [state.modal, state.setModal]);
  const [curmovie, setCurmovie] = useMovieState((state) => [
    state.movies,
    state.addMovie,
  ]);

  return (
    <div
      onClick={() => {
        setModal();
        setCurmovie(movie);
      }}
      className="relative h-28 min-w-[180px] cursor-pointer transition duration-200 ease-out md:h-36 md:min-w-[260px] md:hover"
    >
      <Image
        src={`https://image.tmdb.org/t/p/w500${
          movie.backdrop_path || movie.poster_path || movie.poster
        }`}
        className="rounded-sm object-cover md:rounded"
        layout="fill"
      />
    </div>
  );
}

export default Thumbnail;
