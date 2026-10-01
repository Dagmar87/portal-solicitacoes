import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';

import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Requests from './pages/Requests';
import RequestDetails from './pages/RequestDetails';
import RequestFormPage from './pages/RequestFormPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route
              element={
                <>
                  <Header />
                </>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/requests" element={<Requests />} />

              <Route path="/requests/new" element={<RequestFormPage />} />

              <Route path="/requests/:id" element={<RequestDetails />} />

              <Route path="/requests/:id/edit" element={<RequestFormPage />} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
