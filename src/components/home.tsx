import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Bell,
  Settings,
  User,
  Flag,
  Users,
  LogOut,
  UserCircle,
  FileText,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import KeyMetricsPanel from './Dashboard/KeyMetricsPanel';
import TransactionTable from './Dashboard/TransactionTable';
import UserProfile from './UserProfile';

import DataVisualization from './Dashboard/DataVisualization';
import FlaggedTransactions from './Dashboard/FlaggedTransactions';
import UserManagement from './Dashboard/UserManagement';
import AdminDashboard from './AdminDashboard';
import FinanceDashboard from './FinanceDashboard';
import CommercialDashboard from './CommercialDashboard';
import SalesReportPanel from './Dashboard/SalesReportPanel';
import { useAuth, UserRole } from '../services/auth';

const Home = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { toast } = useToast();

  // Use the auth service
  const {
    currentUser,
    isAuthenticated,
    login,
    logout,
    error,
    updateLastActive,
  } = useAuth();
  const userRole = currentUser?.role || 'Super Admin'; // Fallback for demo

  // Handle login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    try {
      await login(email, password);
      toast({
        title: 'Login successful',
        description: 'Welcome to Tenant Sales Management System',
      });
    } catch (err) {
      toast({
        title: 'Login failed',
        description: error || 'Invalid credentials',
        variant: 'destructive',
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Update last active timestamp when user interacts with the app
  useEffect(() => {
    if (currentUser) {
      const updateActivity = () => {
        updateLastActive(currentUser.id);
      };

      // Update on initial load
      updateActivity();

      // Set up event listeners for user activity
      window.addEventListener('click', updateActivity);
      window.addEventListener('keypress', updateActivity);
      window.addEventListener('scroll', updateActivity);

      // Clean up event listeners
      return () => {
        window.removeEventListener('click', updateActivity);
        window.removeEventListener('keypress', updateActivity);
        window.removeEventListener('scroll', updateActivity);
      };
    }
  }, [currentUser, updateLastActive]);

  // Handle logout
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();

    // Call the logout function from useAuth
    logout();
  };

  // If not logged in, show login form
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-[350px]">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-primary mb-1">
              Tenant Sales
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Management System
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoggingIn}>
                {isLoggingIn ? 'Logging in...' : 'Login'}
              </Button>

              <div className="text-xs text-muted-foreground mt-4">
                <p>Demo accounts:</p>
                <p>admin@example.com / tsms1234</p>
                <p>finance@example.com / tsms1234</p>
                <p>it@example.com / tsms1234</p>
                <p>commercial@example.com / tsms1234</p>
              </div>
            </form>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card p-4 flex flex-col">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary">Tenant Sales</h2>
          <p className="text-sm text-muted-foreground">Management System</p>
        </div>

        <nav className="space-y-1 flex-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-left ${
              activeTab === 'dashboard'
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground hover:bg-accent hover:text-white'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="9" />
              <rect x="14" y="3" width="7" height="5" />
              <rect x="14" y="12" width="7" height="9" />
              <rect x="3" y="16" width="7" height="5" />
            </svg>
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-left ${
              activeTab === 'transactions'
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground hover:bg-accent hover:text-white'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <span>Transactions</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-left ${
              activeTab === 'analytics'
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground hover:bg-accent hover:text-white'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            <span>Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('flagged')}
            className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-left ${
              activeTab === 'flagged'
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground hover:bg-accent hover:text-white'
            }`}
          >
            <Flag className="h-5 w-5" />
            <span>Flagged Items</span>
          </button>

          {(userRole === 'Accounting' ||
            userRole === 'Finance' ||
            userRole === 'Super Admin') && (
            <button
              onClick={() => setActiveTab('sales-reports')}
              className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-left ${
                activeTab === 'sales-reports'
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-accent hover:text-white'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <span>Sales Reports</span>
            </button>
          )}

          {(userRole === 'Admin' || userRole === 'Super Admin') && (
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-left ${
                activeTab === 'users'
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-accent hover:text-white'
              }`}
            >
              <Users className="h-5 w-5" />
              <span>User Management</span>
            </button>
          )}
        </nav>

        <div className="mt-auto pt-4 border-t space-y-2">
          <div className="px-3 py-2">
            <p className="text-xs text-muted-foreground mb-1 block">
              Logged in as:{' '}
              <span className="font-medium">{currentUser.name}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Role: <span className="font-medium">{currentUser.role}</span>
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-md text-left text-muted-foreground hover:bg-accent hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold">
            {activeTab === 'dashboard' && 'Dashboard'}
            {activeTab === 'transactions' && 'Transaction Log'}
            {activeTab === 'batch-import' && 'Batch Import'}
            {activeTab === 'analytics' && 'Analytics'}
            {activeTab === 'flagged' && 'Flagged Transactions'}
            {activeTab === 'users' && 'User Management'}
            {activeTab === 'sales-reports' && 'Sales Reports'}
          </h1>

          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full">
              <Bell className="h-5 w-5 text-muted-foreground" />
            </button>
            <button className="p-2 rounded-full">
              <Settings className="h-5 w-5 text-muted-foreground" />
            </button>
            <div
              className="flex items-center space-x-2 cursor-pointer p-2 rounded-md"
              onClick={() => setIsProfileOpen(true)}
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <UserCircle className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{currentUser.name}</span>
                <span className="text-xs text-muted-foreground">
                  {currentUser.role}
                </span>
              </div>
            </div>
            <UserProfile open={isProfileOpen} onOpenChange={setIsProfileOpen} />
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {userRole === 'Admin' || userRole === 'IT Support' ? (
                <AdminDashboard />
              ) : userRole === 'Accounting' || userRole === 'Finance' ? (
                <FinanceDashboard />
              ) : userRole === 'Commercial' ? (
                <CommercialDashboard />
              ) : (
                // Super Admin sees all metrics
                <>
                  <KeyMetricsPanel />
                  <DataVisualization />
                  <TransactionTable limit={5} />
                </>
              )}
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-6">
              <TransactionTable />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <DataVisualization fullView={true} />
            </div>
          )}

          {activeTab === 'flagged' && (
            <div className="space-y-6">
              <FlaggedTransactions />
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <UserManagement />
            </div>
          )}

          {activeTab === 'sales-reports' && (
            <div className="space-y-6">
              <SalesReportPanel />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
