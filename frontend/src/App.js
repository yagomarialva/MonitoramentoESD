import React from "react";
import "./i18n.js"; // ts => import './i18n.ts'
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { AuthProvider } from "./context/AuthContext.js";
import HomePage from "./pages/HomePage/HomePage.jsx";

const App = () => {
  useEffect(() => {
    document.title = "FCT Auto Test";
  }, []);
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const handleChangeLanguage = () => {
    const newLanguage = currentLanguage === "en" ? "pt" : "en";
    setCurrentLanguage(newLanguage);
    changeLanguage(newLanguage);
  };

  return (
    <>
      <AuthProvider>
        <div className="App">
          <HomePage />
        </div>
      </AuthProvider>
    </>
  );
};

export default App;
