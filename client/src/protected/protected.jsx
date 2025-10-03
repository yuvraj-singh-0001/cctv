import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/check", {
      credentials: "include", // send cookies
    })
      .then(async (res) => {
        if (!res.ok) {
          return { authenticated: false };
        }
        try {
          return await res.json();
        } catch {
          return { authenticated: false };
        }
      })
      .then((data) => {
        setIsAuthenticated(data.authenticated);
        setAuthChecked(true);
      })
      .catch(() => {
        setIsAuthenticated(false);
        setAuthChecked(true);
      });
  }, []);

  if (!authChecked) {
    // Optionally show a loading spinner
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;