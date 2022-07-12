import Image from "next/image";
import { useEffect, useState } from "react";
import { Movie } from "typings";
import { baseUrl } from "@/constants/movie";
import { FaPlay } from "react-icons/fa";
import { InformationCircleIcon } from "@heroicons/react/solid";
import { useRecoilState } from "recoil";
import { modalState, movieState } from "atoms/modalAtom";
import { useMovieState, useStore } from "@/store";

interface Props {
  netflixOriginals: Movie[];
}

function Banner({ netflixOriginals }: Props) {
  const [movie, setMovie] = useState<Movie | undefined>();
  //const [showModal, setShowModal] = useRecoilState(modalState);
  //const [currentMovie, setCurrentMovie] = useRecoilState(movieState);
  const showModal = useStore((state) => state.modal);
  const setShowModal = useStore((state) => state.setModal);
  //console.log("showModal", modal);
  const currentMovie = useMovieState((state) => state.movies);
  const setCurrentMovie = useMovieState((state) => state.addMovie);

  const mId = Math.floor(Math.random() * netflixOriginals.length);

  useEffect(() => setMovie(netflixOriginals[mId]), [netflixOriginals]);

  //console.log(movie);

  return (
    <div className="flex flex-col space-y-2 py-16 md:space-y-4 lg:h-[65vh] lg:justify-end lg:pb-12">
      <div className="absolute top-0 left-0 -z-10 h-[95vh] w-screen">
        <Image
          src={`${baseUrl}${movie?.backdrop_path || movie?.poster_path}`}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <h1 className="text-2xl font-bold lg:text-7xl md:text-7xl">
        {movie?.title || movie?.name || movie?.original_name}
      </h1>
      <p className="max-w-xs text-shadow-md text-xs md:max-w-lg md:text-lg lg:max-w-2xl lg:text-2xl">
        {movie?.overview}
      </p>
      <div className="flex space-x-3">
        <button
          className="bannerButtom bg-white text-black"
          onClick={() => {
            setShowModal();
            setCurrentMovie(movie);
          }}
        >
          <FaPlay className="h-4 w-4 text-black md:h-7 md:w-7" /> Play
        </button>
        <button
          className="bannerButtom bg-[gray]/70"
          onClick={() => {
            setCurrentMovie(movie);
            setShowModal();
          }}
        >
          More Info <InformationCircleIcon className="h-5 w-5 md:h-8 md:w-8" />
        </button>
      </div>
    </div>
  );
}

export default Banner;
