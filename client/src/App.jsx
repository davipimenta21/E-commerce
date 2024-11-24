import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import Error404 from "./pages/Error404";
import Header from "./components/Header";
import DetalhesProduto from "./pages/DetalhesProduto";

const App = () => {
  const [user, setUser ] = useState(null);

  useEffect(() => {
    const storedUser  = localStorage.getItem("user");
    if (storedUser ) {
      try {
        setUser (JSON.parse(storedUser ));
      } catch (err) {
        console.error("Erro ao parsear usuário:", err);
        localStorage.removeItem("user");
      }
    }
  }, []);

  return (
    <Router>
      <Header user={user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser ={setUser } />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={
            user && user.role === "admin" ? (
              <Admin user={user} />
            ) : (
              <Navigate to="/not-found" />
            )
          }
        />
        <Route path="/not-found" element={<Error404 />} />
        <Route path="*" element={<Error404 />} />
        <Route path="/products/:id" element={<DetalhesProduto />} />
      </Routes>
    </Router>
  );
};

export default App;