import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "../services/auth";

const PasswordReset = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    requestPasswordReset,
    verifyResetToken,
    resetPassword,
    isLoading,
    resetSuccess,
    resetError,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState<"request" | "reset">("request");
  const [validToken, setValidToken] = useState(false);
  const [tokenEmail, setTokenEmail] = useState("");

  // Check for token in URL
  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      setStep("reset");

      // Verify the token
      verifyResetToken(tokenFromUrl)
        .then((email) => {
          setValidToken(true);
          setTokenEmail(email);
          toast({
            title: "Valid reset link",
            description: `You can now reset the password for ${email}`,
          });
        })
        .catch((error) => {
          setValidToken(false);
          toast({
            title: "Invalid reset link",
            description: error,
            variant: "destructive",
          });
        });
    }
  }, [searchParams, verifyResetToken, toast]);

  // Handle request password reset
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    try {
      await requestPasswordReset(email);
      toast({
        title: "Reset email sent",
        description:
          "If an account exists with this email, you will receive password reset instructions",
      });
      // In a real app, we would redirect to a confirmation page
      // For demo purposes, we'll just clear the form
      setEmail("");
    } catch (error) {
      // We don't show specific errors to prevent email enumeration attacks
      toast({
        title: "Reset email sent",
        description:
          "If an account exists with this email, you will receive password reset instructions",
      });
    }
  };

  // Handle password reset
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validToken) {
      toast({
        title: "Invalid token",
        description: "This password reset link is invalid or has expired",
        variant: "destructive",
      });
      return;
    }

    if (!password || !confirmPassword) {
      toast({
        title: "Password required",
        description: "Please enter and confirm your new password",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both passwords match",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    try {
      await resetPassword(token, password);
      toast({
        title: "Password reset successful",
        description:
          "Your password has been reset. You can now log in with your new password.",
      });
      // Redirect to login page after successful reset
      navigate("/");
    } catch (error) {
      toast({
        title: "Reset failed",
        description: resetError || "An error occurred during password reset",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[400px]">
        <CardContent className="pt-6">
          {step === "request" ? (
            <>
              <h2 className="text-2xl font-bold text-primary mb-6">
                Reset Password
              </h2>
              <form onSubmit={handleRequestReset} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Processing..." : "Request Password Reset"}
                </Button>

                <div className="text-center mt-4">
                  <Button
                    variant="link"
                    onClick={() => navigate("/")}
                    className="text-sm text-muted-foreground"
                  >
                    Back to Login
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-primary mb-6">
                Set New Password
              </h2>
              {validToken ? (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="text-sm text-muted-foreground mb-4">
                    Setting new password for: {tokenEmail}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">New Password</label>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Confirm Password
                    </label>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Processing..." : "Reset Password"}
                  </Button>

                  <div className="text-center mt-4">
                    <Button
                      variant="link"
                      onClick={() => navigate("/")}
                      className="text-sm text-muted-foreground"
                    >
                      Back to Login
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-4">
                  <p className="text-destructive mb-4">
                    This password reset link is invalid or has expired.
                  </p>
                  <Button onClick={() => setStep("request")} className="mb-2">
                    Request New Reset Link
                  </Button>
                  <div>
                    <Button
                      variant="link"
                      onClick={() => navigate("/")}
                      className="text-sm text-muted-foreground"
                    >
                      Back to Login
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordReset;
