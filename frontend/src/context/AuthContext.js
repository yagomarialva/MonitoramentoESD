// AuthContext.js
import React, { createContext, useState, useContext } from "react";

// Cria o contexto
const AuthContext = createContext();

// Cria o provedor de contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto de autenticação
export const useAuth = () => {
  return useContext(AuthContext);
};
