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
  const modal = useStore((state) => state.modal);
  const setModal = useStore((state) => state.setModal);
  //console.log("showModal", modal);
  const curmovie = useMovieState((state) => state.movies);
  const setCurmovie = useMovieState((state) => state.addMovie);

  //const [showModal, setShowModal] = useRecoilState(modalState);
  //const [currentMovie, setCurrentMovie] = useRecoilState(movieState);
  //console.log("cun", curmovie);
  //console.log("cur", currentMovie);
  return (
    <div
      onClick={() => {
        //setCurrentMovie(movie);
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
