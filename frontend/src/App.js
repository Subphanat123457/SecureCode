// App.js
import React from "react";
import UserRoutes from "./router/userRoutes";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/authContext";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <header className="App-header">
          <Router>
            <UserRoutes />
          </Router>
        </header>
      </div>
    </AuthProvider>
  );
}

export default App;
