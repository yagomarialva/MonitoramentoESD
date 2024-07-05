// src/components/ESDTable/StationTable.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "../../../i18n";
import StationTable from "./StationTable";
import {
  getAllBracelets,
  createBracelets,
  deleteBracelets,
  updateBracelets,
} from "../../../api/braceletApi";

// Mocking the API functions
jest.mock("../../../api/braceletApi");

describe("StationTable Component", () => {
  const bracelets = [
    { id: 1, userId: 1, title: "Bracelet 1", completed: false },
    { id: 2, userId: 2, title: "Bracelet 2", completed: true },
  ];

  beforeEach(() => {
    getAllBracelets.mockResolvedValue(bracelets);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the table with data", async () => {
    render(
      <Router>
        <StationTable />
      </Router>
    );

    await screen.findByText("Bracelet 1");
    expect(screen.getByText("Bracelet 2")).toBeInTheDocument();
  });
});
