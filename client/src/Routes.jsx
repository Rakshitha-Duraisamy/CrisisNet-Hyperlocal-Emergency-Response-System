import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import RaiseSOSPage from './pages/raise-sos-page';
import Dashboard from './pages/dashboard';
import RegistrationPage from './pages/registration-page';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/raise-sos-page" element={<RaiseSOSPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/registration-page" element={<RegistrationPage />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;