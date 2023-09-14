import { useState } from "react";

function MoviesApp({ initialValue, genres }) {
  const [filterText, setFilterText] = useState("");
  const [counter, setCounter] = useState( initialValue );
  const incrementCounter = () => setCounter(counter + 1);
  let decrementCounter = () => setCounter(counter - 1);
  

  const [selectedGenre, setSelectedGenre] = useState("ALL");

  if (counter <= 0) {
    setCounter(1);
  }

  return (
    <div>
      <GenreSelect
        initialGenre={selectedGenre}
        genres={genres}
        onGenreSelect={setSelectedGenre}
      />

      <SearchBar filterText={filterText} onFilterTextChange={setFilterText} />

      <Counter
        initialValue={counter}
        incrementCounter={incrementCounter}
        decrementCounter={decrementCounter}
        onInput={setCounter}
      />
    </div>
  );
}

function GenreSelect({initialGenre, genres, onGenreSelect}) {
  return genres.map((genre) => {
    if (genre !== initialGenre) {
      return (
        <label key={genre} onClick={(e) => onGenreSelect(genre)}> {genre} </label>
      );
    } else {
      return <label key={genre} style={{ color: "red" }}> {genre} </label>;
    }
  });
}

export function SearchBar({ filterText, onFilterTextChange }) {
  return (
    <form>
      <input
        type="text"
        value={filterText}
        placeholder="Search..."
        onChange={(e) => onFilterTextChange(e.target.value)}
      />
      <label>{filterText}</label>
    </form>
  );
}

function Counter({
  initialValue,
  incrementCounter,
  decrementCounter,
  onInput
}) {


  return (
    <div >
      <button id="increment-btn" onClick={incrementCounter}>+</button>{" "}
      <input 
        id="counter-input"
        onChange={(e) => onInput(Number(e.target.value))}
        value={initialValue}
        type="number"
      ></input>
      <button id="decrement-btn" onClick={decrementCounter}> - </button>
    </div>
  );
}

export const INITIAL_VALUE = 5;
const GENRES_ARRAY = ["ALL", "DOCUMENTARY", "COMEDY", "HORROR", "CRIME"];

export default function App() {
  return (
    <MoviesApp
      initialValue={INITIAL_VALUE}
      genres={GENRES_ARRAY}
    />
  );
}
