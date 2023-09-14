import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import GenreSelect from "./GenreSelector"; // Adjust the path as needed

describe("GenreSelect component", () => {
  test("Test that component renders all genres passed in props", () => {
    const genres = ["ALL", "DOCUMENTARY", "COMEDY", "HORROR", "CRIME"];
    const mockOnChange = jest.fn();

    const { getByText } = render(
      <GenreSelect genres={genres} onChange={mockOnChange} />
    );
    const genreLabel = getByText("COMEDY");
    fireEvent.click(genreLabel);
    
    expect(genreLabel).toHaveStyle({ color: "red" });
  });

  test("Highlights the selected genre passed in props", () => {
    const genres = ["ALL", "DOCUMENTARY", "COMEDY", "HORROR", "CRIME"];
    const selectedGenre = "COMEDY";

    const mockOnChange = jest.fn();
    render(
      <GenreSelect
        genres={genres}
        selectedGenre={selectedGenre}
        onChange={mockOnChange}
      />
    );

    const selectedGenreLabel = screen.getByText(selectedGenre);
    expect(selectedGenreLabel).toHaveStyle({ color: "red" });
  });

  test('Test that after a click event on a genre button component calls "onChange" callback and passes correct genre in arguments', () => {
    const genres = ["ALL", "DOCUMENTARY", "COMEDY", "HORROR", "CRIME"];
    const mockOnChange = jest.fn();

    const { getByText } = render(
      <GenreSelect genres={genres} onChange={mockOnChange} />
    );
    const genreLabel = getByText("DOCUMENTARY");
    fireEvent.click(genreLabel);

    expect(mockOnChange).toHaveBeenCalledWith("DOCUMENTARY");
  });
});
