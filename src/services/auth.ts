import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// Define user types
export type UserRole =
  | 'Admin'
  | 'IT Support'
  | 'Accounting'
  | 'Finance'
  | 'Commercial'
  | 'Super Admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  department?: string;
  lastLogin?: string;
  lastActive?: string;
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    notifications?: boolean;
    dashboardLayout?: string;
  };
}

// Mock user database
const USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'Admin',
    phone: '+1 (555) 123-4567',
    department: 'IT Department',
    lastLogin: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    preferences: {
      theme: 'light',
      notifications: true,
      dashboardLayout: 'default',
    },
  },
  {
    id: '2',
    name: 'IT Support User',
    email: 'it@example.com',
    role: 'IT Support',
    phone: '+1 (555) 234-5678',
    department: 'IT Department',
    lastLogin: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    preferences: {
      theme: 'dark',
      notifications: true,
      dashboardLayout: 'compact',
    },
  },
  {
    id: '3',
    name: 'Finance User',
    email: 'finance@example.com',
    role: 'Finance',
    phone: '+1 (555) 345-6789',
    department: 'Finance Department',
    lastLogin: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    preferences: {
      theme: 'light',
      notifications: true,
      dashboardLayout: 'default',
    },
  },
  {
    id: '4',
    name: 'Commercial User',
    email: 'commercial@example.com',
    role: 'Commercial',
    phone: '+1 (555) 456-7890',
    department: 'Commercial Department',
    lastLogin: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    preferences: {
      theme: 'system',
      notifications: false,
      dashboardLayout: 'expanded',
    },
  },
  {
    id: '5',
    name: 'Super Admin',
    email: 'superadmin@example.com',
    role: 'Super Admin',
    phone: '+1 (555) 567-8901',
    department: 'Executive',
    lastLogin: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    preferences: {
      theme: 'dark',
      notifications: true,
      dashboardLayout: 'custom',
    },
  },
  {
    id: '6',
    name: 'Accounting User',
    email: 'accounting@example.com',
    role: 'Accounting',
    phone: '+1 (555) 678-9012',
    department: 'Finance Department',
    lastLogin: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    preferences: {
      theme: 'light',
      notifications: true,
      dashboardLayout: 'default',
    },
  },
];

// Store for password reset tokens
interface ResetToken {
  email: string;
  token: string;
  expiresAt: number;
}

let resetTokens: ResetToken[] = [];

// Authentication service
export const useAuth = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    // Check if logout was in progress
    const logoutInProgress = sessionStorage.getItem('logoutInProgress');
    if (logoutInProgress) {
      // Clear the flag and don't restore the user
      sessionStorage.removeItem('logoutInProgress');
      setIsLoading(false);
      return;
    }

    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      setError(null);

      // Simulate API call delay
      setTimeout(() => {
        // Check if email exists and password matches
        if (password !== 'tsms1234') {
          setIsLoading(false);
          setError('Invalid password');
          reject('Invalid password');
          return;
        }

        const user = USERS.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );

        if (!user) {
          setIsLoading(false);
          setError('User not found');
          reject('User not found');
          return;
        }

        // Set current user
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        setIsLoading(false);
        resolve(user);
      }, 500); // Simulate network delay
    });
  };

  // Logout function - simplified as the actual logout is handled in the Home component
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser'); // Clear stored user data
    navigate('/login'); // Redirect to login page
  };

  // Request password reset function
  const requestPasswordReset = (email: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      setResetError(null);
      setResetSuccess(false);

      // Simulate API call delay
      setTimeout(() => {
        const user = USERS.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );

        if (!user) {
          setIsLoading(false);
          setResetError('No account found with this email address');
          reject('No account found with this email address');
          return;
        }

        // Generate a random token
        const token =
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15);

        // Set expiration to 1 hour from now
        const expiresAt = Date.now() + 60 * 60 * 1000;

        // Store the token
        resetTokens = resetTokens.filter((t) => t.email !== email);
        resetTokens.push({ email, token, expiresAt });

        // In a real app, this would send an email with the reset link
        console.log(
          `Password reset link for ${email}: /reset-password?token=${token}`
        );

        setIsLoading(false);
        setResetSuccess(true);
        resolve();
      }, 500);
    });
  };

  // Verify reset token
  const verifyResetToken = (token: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      setResetError(null);

      // Simulate API call delay
      setTimeout(() => {
        const resetToken = resetTokens.find((t) => t.token === token);

        if (!resetToken) {
          setIsLoading(false);
          setResetError('Invalid or expired reset token');
          reject('Invalid or expired reset token');
          return;
        }

        if (resetToken.expiresAt < Date.now()) {
          // Remove expired token
          resetTokens = resetTokens.filter((t) => t.token !== token);
          setIsLoading(false);
          setResetError('Reset token has expired');
          reject('Reset token has expired');
          return;
        }

        setIsLoading(false);
        resolve(resetToken.email);
      }, 500);
    });
  };

  // Reset password function
  const resetPassword = (token: string, newPassword: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      setResetError(null);
      setResetSuccess(false);

      // First verify the token
      verifyResetToken(token)
        .then((email) => {
          // In a real app, this would update the user's password in the database
          console.log(
            `Password for ${email} has been reset to: ${newPassword}`
          );

          // Remove the used token
          resetTokens = resetTokens.filter((t) => t.token !== token);

          setIsLoading(false);
          setResetSuccess(true);
          resolve();
        })
        .catch((err) => {
          setIsLoading(false);
          setResetError(err);
          reject(err);
        });
    });
  };

  // Update user profile
  const updateUserProfile = (
    userId: string,
    updates: Partial<User>
  ): Promise<User> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      setError(null);

      // Simulate API call delay
      setTimeout(() => {
        const userIndex = USERS.findIndex((u) => u.id === userId);

        if (userIndex === -1) {
          setIsLoading(false);
          setError('User not found');
          reject('User not found');
          return;
        }

        // Update user data
        const updatedUser = {
          ...USERS[userIndex],
          ...updates,
          // Don't allow changing these fields through this method
          id: USERS[userIndex].id,
          role: USERS[userIndex].role,
        };

        USERS[userIndex] = updatedUser;

        // If this is the current user, update the current user state
        if (currentUser && currentUser.id === userId) {
          setCurrentUser(updatedUser);
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }

        setIsLoading(false);
        resolve(updatedUser);
      }, 500);
    });
  };

  // Update user preferences
  const updateUserPreferences = (
    userId: string,
    preferences: Partial<User['preferences']>
  ): Promise<User> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      setError(null);

      // Simulate API call delay
      setTimeout(() => {
        const userIndex = USERS.findIndex((u) => u.id === userId);

        if (userIndex === -1) {
          setIsLoading(false);
          setError('User not found');
          reject('User not found');
          return;
        }

        // Update user preferences
        const updatedUser = {
          ...USERS[userIndex],
          preferences: {
            ...USERS[userIndex].preferences,
            ...preferences,
          },
        };

        USERS[userIndex] = updatedUser;

        // If this is the current user, update the current user state
        if (currentUser && currentUser.id === userId) {
          setCurrentUser(updatedUser);
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }

        setIsLoading(false);
        resolve(updatedUser);
      }, 500);
    });
  };

  // Update user last active timestamp
  const updateLastActive = (userId: string): void => {
    if (!userId) return;

    const userIndex = USERS.findIndex((u) => u.id === userId);
    if (userIndex === -1) return;

    USERS[userIndex].lastActive = new Date().toISOString();

    // If this is the current user, update the current user state
    if (currentUser && currentUser.id === userId) {
      const updatedUser = {
        ...currentUser,
        lastActive: new Date().toISOString(),
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  return {
    currentUser,
    isAuthenticated: !!currentUser,
    isLoading,
    error,
    resetSuccess,
    resetError,
    login,
    logout,
    requestPasswordReset,
    verifyResetToken,
    resetPassword,
    updateUserProfile,
    updateUserPreferences,
    updateLastActive,
  };
};
