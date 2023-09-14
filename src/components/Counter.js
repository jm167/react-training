import React, { useState } from 'react';

function Counter({ initialValue }) {
  const [counter, setCounter] = useState(initialValue);

  const incrementCounter = () => setCounter(counter + 1);
  const decrementCounter = () => setCounter(counter - 1);

  return (
    <div>
      <button id="increment-btn" onClick={incrementCounter}>+</button>{" "}
      <input 
        id="counter-input"
        value={counter}
        type="number"
        onChange={(e) => setCounter(Number(e.target.value))}
      ></input>
      <button id="decrement-btn" onClick={decrementCounter}> - </button>
    </div>
  );
}

export default Counter;