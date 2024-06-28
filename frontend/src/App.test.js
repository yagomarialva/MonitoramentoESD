// src/App.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import App from "./App";

describe("App Component", () => {
  it("renders AppBar with navigation links", () => {
    render(
      // <I18nextProvider i18n={i18n}>
        <Router>
          <App />
        </Router>
      // </I18nextProvider>
    );

    expect(screen.getByText("User Management")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("Bracelets ESD")).toBeInTheDocument();
  });

  // it("changes language when Change Language button is clicked", () => {
  //   render(
  //     <I18nextProvider i18n={i18n}>
  //       <Router>
  //         <App />
  //       </Router>
  //     </I18nextProvider>
  //   );

  //   const changeLanguageButton = screen.getByText("Change Language");
  //   expect(changeLanguageButton).toBeInTheDocument();

  //   fireEvent.click(changeLanguageButton);
  //   expect(i18n.language).toBe("pt");

  //   fireEvent.click(changeLanguageButton);
  //   expect(i18n.language).toBe("en");
  // });
});
