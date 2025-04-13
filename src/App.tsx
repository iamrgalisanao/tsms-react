import { Suspense } from 'react';
import { Routes, Route, useRoutes } from 'react-router-dom';
import Home from './components/home';
import Login from './components/Login'; // Ensure the path and case are correct
import PasswordReset from './components/PasswordReset';
import SalesReportPage from './components/SalesReportPage';
import { useAuth } from './services/auth';
import routes from 'tempo-routes';

export default function App() {
  const { currentUser } = useAuth();

  // Check for logout in progress on initial render
  const isLogoutInProgress =
    sessionStorage.getItem('logoutInProgress') === 'true';

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<PasswordReset />} />
          <Route path="/sales-reports" element={<SalesReportPage />} />
        </Routes>
      </>
    </Suspense>
  );
}
