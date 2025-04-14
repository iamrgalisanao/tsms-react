import { Suspense } from 'react';
import { Routes, Route, useRoutes } from 'react-router-dom';
import Home from './components/home';
import Login from './components/Login';
import PasswordReset from './components/PasswordReset';
import SalesReportPage from './components/SalesReportPage';
import { useAuth } from './services/auth';
import routes from 'tempo-routes';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const { currentUser } = useAuth();

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Routes>
        {/* Make Login the default route */}
        <Route path="/" element={<Login />} />
        {/* Add a separate route for Home */}
        <Route path="/home" element={<Home />} />
        <Route path="/reset-password" element={<PasswordReset />} />
        <Route path="/sales-reports" element={<SalesReportPage />} />
      </Routes>
      {import.meta.env.VITE_TEMPO === 'true' && useRoutes(routes)}
    </Suspense>
  );
}
