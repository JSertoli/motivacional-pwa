import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import UserSettings from "./pages/UserSettings";

export default function App() {
  const [user, setUser] = useState(() => {
    // Pega do localStorage no primeiro render
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/home" />
            ) : (
              <Login onLogin={(u: any) => setUser(u)} />
            )
          }
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={user ? <Home setUser={setUser} /> : <Navigate to="/" />}
        />
        <Route path="/settings" element={user ? <UserSettings setPropUser={setUser}/> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
