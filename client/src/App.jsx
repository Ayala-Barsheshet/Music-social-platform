import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./comp/Navbar";
import MainRoutes from "./routes/MainRoutes";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content"><MainRoutes /></main>
      </div>
    </Router>
  );
};

export default App;