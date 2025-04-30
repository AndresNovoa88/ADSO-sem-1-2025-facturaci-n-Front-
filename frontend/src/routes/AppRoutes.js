// src/routes/AppRoutes.jsx
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import AuthLayout from "../layouts/AuthLayout";

// Lazy loading
const Login = lazy(() => import("../pages/Auth/Login"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const FacturaForm = lazy(() => import("../pages/Facturas/FacturaForm"));
const NotFound = lazy(() => import("../pages/NotFound"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Routes>
        {/* Login envuelto con layout */}
        <Route
          path="/login"
          element={
            <ProtectedRoute>
              <AuthLayout>
                <Login />
              </AuthLayout>
            </ProtectedRoute>
          }
        />

        {/* Rutas protegidas */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/facturas/nueva"
          element={
            <ProtectedRoute>
              <FacturaForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/facturas/editar/:id"
          element={
            <ProtectedRoute>
              <FacturaForm />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
// src/routes/AppRoutes.jsx