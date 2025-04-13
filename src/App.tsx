import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/home';
import Login from './components/Login';
import PasswordReset from './components/PasswordReset';
import SalesReportPage from './components/SalesReportPage';
import { useAuth } from './services/auth';

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
    </Suspense>
  );
}
