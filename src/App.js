import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TopUp from "./pages/TopUp";
import Transaction from "./pages/Transaction";
import Akun from "./pages/Akun"; 
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="*"
            element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/topup" element={<TopUp />} />
                  <Route path="/transaction" element={<Transaction />} />
                  <Route path="/akun" element={<Akun />} />
                </Routes>
              </>
            }
          />
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
