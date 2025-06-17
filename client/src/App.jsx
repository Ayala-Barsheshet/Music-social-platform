import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from "./services/UserProvider.jsx";
import "./App.css";
import Layout from "./routes/layout/Layout.jsx";

const App = () => {
  return (
    <Router>
      <UserProvider>
         <Layout />
      </UserProvider>
    </Router>
  );
};

export default App;
