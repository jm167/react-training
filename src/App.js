import { useState } from "react";

function FilterableProductTable({ products, genres }) {
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
        initalGenre={selectedGenre}
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

function GenreSelect(props) {
  const rows = [];
  console.log(props.initalGenre
  );

  props.genres.forEach((genre) => {
    if (genre !== props.initalGenre) {
      rows.push(
        <label onClick={(e) => props.onGenreSelect(genre)}> {genre} </label>
      );
    } else {
      rows.push(<label style={{ color: "red" }}> {genre} </label>);
    }
  });
  return <div>{rows}</div>;
}

// function SearchBar(initialValue, onTextChange) {
//   return (
//     <input value={initialValue} onChange={(e) => console.log(e)}/>
//   );
// }

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">{category}</th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? (
    product.name
  ) : (
    <span style={{ color: "blue" }}>{product.name}</span>
  );

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (product.name.toLowerCase().indexOf(filterText.toLowerCase()) === -1) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category}
        />
      );
    }
    rows.push(<ProductRow product={product} key={product.name} />);
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
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
const PRODUCTS = [
  { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
  { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
  { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
  { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
  { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
  { category: "Vegetables", price: "$1", stocked: true, name: "Peas" }
];
const GENRES_ARRAY = ["ALL", "DOCUMENTARY", "COMEDY", "HORROR", "CRIME"];

export default function App() {
  return (
    <FilterableProductTable
      products={PRODUCTS}
      initialValue={INITIAL_VALUE}
      genres={GENRES_ARRAY}
    />
  );
}
