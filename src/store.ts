import { Movie } from "../typings";
import create from "zustand";
import { movieState } from "atoms/modalAtom";

type State = {
  modal: boolean;
  setModal: () => void;
};
type StateMovie = {
  movies: Movie | null;
  addMovie: (arg0: any) => void;
};

export const useStore = create<State>((set, get) => ({
  modal: false,
  setModal: (): void => {
    const { modal } = get();
    set({ modal: !modal });
  },
}));

export const useMovieState = create<StateMovie>((set) => ({
  movies: null,
  addMovie: (movies) =>
    set((state) => ({
      movies: movies,
    })),
}));
