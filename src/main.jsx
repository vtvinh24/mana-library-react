import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import { BookProvider } from "./context/BookContext.jsx";
import { AdminProvider } from "./context/AdminContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <UserProvider>
        <BookProvider>
          <AdminProvider>
            <App />
          </AdminProvider>
        </BookProvider>
      </UserProvider>
    </AuthProvider>
  </React.StrictMode>
);
