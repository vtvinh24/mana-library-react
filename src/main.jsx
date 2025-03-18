import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import BookProvider from "./context/BookProvider.jsx";
import AuthProvider from "./context/AuthProvider.jsx";
import UserProvider from "./context/UserProvider.jsx";
import AdminProvider from "./context/AdminProvider.jsx";

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
