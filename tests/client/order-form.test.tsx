import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("@vibe/core", () => ({
  TextField: ({ onChange, ...props }: any) => (
    <input {...props} onChange={(e) => onChange?.(e.target.value)} />
  ),
  Dropdown: ({ options = [], onChange }: any) => (
    <select
      aria-label="fragrances"
      onChange={() =>
        onChange?.([
          options[0],
          options[1],
          options[2]
        ])
      }
    >
      <option>Select fragrances</option>
    </select>
  ),
  Button: (props: any) => <button {...props} />,
  AttentionBox: ({ text }: any) => <div>{text}</div>,
  Loader: () => <span>loading...</span>
}), { virtual: true });

import OrderForm from "../../client/src/components/OrderForm";
import * as fragranceService from "../../client/src/services/fragranceService";
import * as orderService from "../../client/src/services/orderService";
import { act } from "react";

jest.mock("../../client/src/services/orderService");
jest.mock("../../client/src/services/fragranceService");

describe("OrderForm", () => {

  beforeEach(() => {
    jest.clearAllMocks();

    (fragranceService.fetchFragrances as jest.Mock).mockResolvedValue([
      { slug: "vanilla", display_name: "Vanilla" },
      { slug: "amber", display_name: "Amber" },
      { slug: "cedar", display_name: "Cedar" }
    ]);
  });

  const validForm = {
    firstName: "Example",
    lastName: "User",
    fragranceSlugs: ["vanilla", "amber", "cedar"],
    kitsAmount: 2
  };

  // Render

  it("should render form fields", async () => {

    await act(async () => {
        render(<OrderForm />);
    });
      
    expect(screen.getByTitle(/first name/i)).toBeInTheDocument();
    expect(screen.getByTitle(/last name/i)).toBeInTheDocument();
    expect(screen.getByTitle(/kits amount/i)).toBeInTheDocument();

    expect(
      screen.getByRole("combobox", { name: /fragrances/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /create order/i })
    ).toBeInTheDocument();

  });


  // Input interaction

  it("should update input values", async () => {

    await act(async () => {
        render(<OrderForm />);
    });

    const firstNameInput = screen.getByTitle(/first name/i);

    fireEvent.change(firstNameInput, {
      target: { value: "Example" }
    });

    expect(firstNameInput).toHaveValue("Example");

  });


  // Button enable logic

  it("should enable submit button when form is valid", async () => {

    await act(async () => {
        render(<OrderForm />);
    });

    const button = screen.getByRole("button", { name: /create order/i });

    expect(button).toBeDisabled();

    fireEvent.change(
      screen.getByTitle(/first name/i),
      { target: { value: "Example" } }
    );

    fireEvent.change(
      screen.getByTitle(/last name/i),
      { target: { value: "User" } }
    );

    fireEvent.change(
      screen.getByTitle(/kits amount/i),
      { target: { value: 2 } }
    );

    fireEvent.change(await screen.findByRole("combobox"));

    await waitFor(() => {
      expect(button).toBeEnabled();
    });

  });

  
  // Successful submit

  it("should submit form successfully", async () => {

    (orderService.createOrder as jest.Mock).mockResolvedValue({
      itemId: "123"
    });

    await act(async () => {
        render(<OrderForm />);
    });

    const button = screen.getByRole("button", { name: /create order/i });

    fireEvent.change(
      screen.getByTitle(/first name/i),
      { target: { value: validForm.firstName } }
    );

    fireEvent.change(
      screen.getByTitle(/last name/i),
      { target: { value: validForm.lastName } }
    );

    fireEvent.change(
      screen.getByTitle(/kits amount/i),
      { target: { value: validForm.kitsAmount } }
    );

    fireEvent.change(await screen.findByRole("combobox"));

    fireEvent.click(button);

    await waitFor(() => {
      expect(orderService.createOrder).toHaveBeenCalledWith({
        firstName: "Example",
        lastName: "User",
        fragranceSlugs: ["vanilla", "amber", "cedar"],
        kitsAmount: 2
      });
    });

  });

  // API error handling

  it("should show error message when API fails", async () => {

    (orderService.createOrder as jest.Mock).mockRejectedValue(
      new Error("Server error")
    );

    await act(async () => {
        render(<OrderForm />);
    });

    fireEvent.change(
      screen.getByTitle(/first name/i),
      { target: { value: "Example" } }
    );

    fireEvent.change(
      screen.getByTitle(/last name/i),
      { target: { value: "User" } }
    );

    fireEvent.change(
      screen.getByTitle(/kits amount/i),
      { target: { value: 2 } }
    );

    fireEvent.change(await screen.findByRole("combobox"));

    const button = screen.getByRole("button", { name: /create order/i });

    fireEvent.click(button);

    expect(
      await screen.findByText(/server error/i)
    ).toBeInTheDocument();

  });

});