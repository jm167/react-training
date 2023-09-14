import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar'; // Adjust the path as needed


test('Renders an input with the initial value passed in props', () => {
    const initialValue = "initial value"; // Simulate the initial value
    const mockOnFilterTextChange = jest.fn();
  
    render(
      <SearchBar initialValue={initialValue} onFilterTextChange={mockOnFilterTextChange} />
    );
  
    const inputElement = screen.getByPlaceholderText("Search...");
    expect(inputElement).toHaveValue(initialValue);
  });

  test('Calls onChange prop with proper value after typing and clicking Submit', () => {
    const initialFilterText = "initial value"; // Initial value passed in props
    const mockOnFilterTextChange = jest.fn();
    const mockOnSubmit = jest.fn();
  
    render(
      <SearchBar
        filterText={initialFilterText}
        onFilterTextChange={mockOnFilterTextChange}
        onSubmit={mockOnSubmit}
      />
    );
  
    const inputElement = screen.getByPlaceholderText("Search...");
    fireEvent.change(inputElement, { target: { value: "new value" } });
    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);
    expect(mockOnFilterTextChange).toHaveBeenCalledWith("new value");
    expect(mockOnSubmit).toHaveBeenCalledWith("new value");
  });

  test('Calls onChange prop with proper value after typing and pressing Enter', () => {
    const initialFilterText = "initial value"; // Initial value passed in props
    const mockOnFilterTextChange = jest.fn();
    const mockOnSubmit = jest.fn();
  
    render(
      <SearchBar
        filterText={initialFilterText}
        onFilterTextChange={mockOnFilterTextChange}
        onSubmit={mockOnSubmit}
      />
    );
  
    const inputElement = screen.getByPlaceholderText("Search...");
    fireEvent.change(inputElement, { target: { value: "new value" } });
    fireEvent.keyPress(inputElement, { key: 'Enter', code: 13, charCode: 13 });
    expect(mockOnFilterTextChange).toHaveBeenCalledWith("new value");
    expect(mockOnSubmit).toHaveBeenCalledWith("new value");
  });