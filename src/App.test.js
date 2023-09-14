import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";
import { INITIAL_VALUE } from "./App";
import GenreSelect from "./App";


test("Test that component renders initial value provided in props", () => {
  render(<App />);
  const counter = screen.getByDisplayValue(INITIAL_VALUE);
  expect(counter).toBeInTheDocument();

});

test("Test that a click event on decrement button decrements the displayed value", () => {
  render(<App />);
  const counter = document.getElementById('counter-input');
  const valueBeforeClick = Number(counter.value);
  fireEvent.click(
    document.getElementById('decrement-btn'),
  );
  const calculatedValue = valueBeforeClick - 1;
  expect(calculatedValue).toBe(Number(counter.value))
});

test("Test that a click event on increment button increments the displayed value", () => {
  render(<App />);
  const counter = document.getElementById('counter-input');
  const valueBeforeClick = Number(counter.value);
  fireEvent.click(
    document.getElementById('increment-btn'),
  );
  const calculatedValue = valueBeforeClick + 1;
  expect(calculatedValue).toBe(Number(counter.value))
});


describe("GenreSelect", () => {
  it("renders an input with the value equal to initial value passed in props", () => {
    const initialGenre = "Action";
    const genres = ["Action", "Comedy", "Drama"];
    const onGenreSelect = jest.fn();

    const  getByDisplayValue  = render(
      <GenreSelect
        initialGenre={initialGenre}
        genres={genres}
        onGenreSelect={onGenreSelect}
      />
    );
    render(<App />);
    expect(getByDisplayValue(initialGenre)).toBeInTheDocument();
  });
});

test("Validate genres are showing", () => {
  render(<App />);
  const genres = screen.getByText(/DOCUMENTARY/i);
  expect(genres).toBeInTheDocument();
});

test("Validate search input is showing", () => {
  render(<App />);
  const inputNode = screen.getByPlaceholderText("Search...");
  expect(inputNode).toBeInTheDocument();
});
