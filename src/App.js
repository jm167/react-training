import { useState } from "react";
import  Counter from './components/Counter'
import  GenreSelect from './components/GenreSelector'
import  SearchBar from './components/SearchBar'



function AppMovies({ initialValue, genres }) {
  return (
    <div>
      
      <Counter
        initialValue={initialValue}
      />

      <GenreSelect
      selectedGenre = 'ALL'
        genres={genres}
        onChange={onGenreChange}
      />

      <SearchBar initialValue={''} onFilterTextChange={onFilterTextChange} onSubmit={onSubmit}/>

    </div>
  );
}

function onFilterTextChange(e) {
console.log(e)
}

function onSubmit(e) {
  console.log(e);
}

function onGenreChange(e) {
  console.log(e)
}



const INITIAL_VALUE = 1;
const GENRES_ARRAY = ["ALL", "DOCUMENTARY", "COMEDY", "HORROR", "CRIME"];

export default function App() {
  return (
    <AppMovies
      initialValue={INITIAL_VALUE}
      genres={GENRES_ARRAY}
    />
  );
}
