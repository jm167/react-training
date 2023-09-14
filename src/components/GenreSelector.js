import React, { useState } from 'react';

function GenreSelect({ genres, selectedGenre, onChange }) {
  const [selected, setSelected] = useState(selectedGenre);

  const handleGenreClick = (genre) => {
    setSelected(genre);
    onChange(genre);
  };

  return (
    <div>
      {genres.map((genre) => (
        <label
          key={genre}
          onClick={() => handleGenreClick(genre)}
          style={{ color: selected === genre ? 'red' : 'black' }}
        >
          {genre}
        </label>
      ))}
    </div>
  );
}

export default GenreSelect;
