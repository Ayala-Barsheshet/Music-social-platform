import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./comp/Navbar.jsx";
import MainRoutes from "./routes/MainRoutes.jsx";
import "./App.css";
import { UserProvider } from "./services/UserProvider.jsx";

const App = () => {
  return (
    <Router>
      <UserProvider>
      <div className="app-container">
        <Navbar />
        <main className="main-content"><MainRoutes /></main>
      </div>
      </UserProvider>
    </Router>
  );
};

export default App;