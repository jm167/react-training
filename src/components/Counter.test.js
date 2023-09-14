import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Counter from "./Counter"; // Adjust the path as needed
import userEvent from '@testing-library/user-event'

describe("Counter component", () => {
  test("Renders with initial value", () => {
    const initialValue = 3;
    render(<Counter initialValue={initialValue} />);
    const counterInput = screen.getByDisplayValue(initialValue);
    expect(counterInput).toHaveValue(initialValue);
  });

  test('Increments the counter when the "+" button is clicked', () => {
    const initialValue = 5;
    const { getByDisplayValue } = render(<Counter initialValue={initialValue} />);
    const incrementButton = document.getElementById('increment-btn');
    const counterInput = getByDisplayValue(initialValue)
    fireEvent.click(incrementButton);
    expect(counterInput).toHaveValue(initialValue + 1);
  });

  test('Decrements the counter when the "-" button is clicked', () => {
    const initialValue = 5;
    const { getByDisplayValue } = render(<Counter initialValue={initialValue} />);
    const decrementButton =  document.getElementById("decrement-btn");
    const counterInput = getByDisplayValue(initialValue)
    fireEvent.click(decrementButton);
    expect(counterInput).toHaveValue(initialValue - 1);
  });
});
