import React, { useState, useEffect  } from 'react';

function SearchBar({ initialValue, onFilterTextChange, onSubmit  }) {

  const [inputValue, setInputValue] = useState(initialValue);

  const handleInputChange = (e) => {
    const newText = e.target.value;
    setInputValue(newText);
    onFilterTextChange(newText);
  };
  const handleSubmit = () => {
    onFilterTextChange(inputValue);
    onSubmit(inputValue);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onFilterTextChange(inputValue);
      onSubmit(inputValue);
    }
  };


  return (
    <form>
      <input
        type="text"
        value={inputValue}
        placeholder="Search..."
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />
      <button onClick={handleSubmit}>Submit</button>
    </form>
  );
}

export default SearchBar;