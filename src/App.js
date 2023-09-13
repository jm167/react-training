import { useState } from "react";

function FilterableProductTable({ genres }) {
  const [filterText, setFilterText] = useState("");
  const [counter, setCounter] = useState(1);
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
  const rows = [];
  console.log(initialGenre);

  return genres.map((genre) => {
    if (genre !== initialGenre) {
      return (
        <label onClick={(e) => onGenreSelect(genre)}> {genre} </label>
      );
    } else {
      return <label style={{ color: "red" }}> {genre} </label>;
    }
  });
}

function SearchBar({ filterText, onFilterTextChange }) {
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
  // value += onIncrease ? +1 : -1;

  if (incrementCounter) {
    console.log("click +");
  }
  if (decrementCounter) {
    console.log("click -");
  }

  return (
    <div>
      <button onClick={incrementCounter}>+</button>{" "}
      <input
        onChange={(e) => onInput(Number(e.target.value))}
        value={initialValue}
        type="number"
      ></input>
      <button onClick={decrementCounter}> - </button>
    </div>
  );
}

const INITIAL_VALUE = 0;
const GENRES_ARRAY = ["ALL", "DOCUMENTARY", "COMEDY", "HORROR", "CRIME"];

export default function App() {
  return (
    <FilterableProductTable
      initialValue={INITIAL_VALUE}
      genres={GENRES_ARRAY}
    />
  );
}
