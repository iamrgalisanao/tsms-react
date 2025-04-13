import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import KeyMetricsPanel from "./Dashboard/KeyMetricsPanel";
import UserManagement from "./Dashboard/UserManagement";

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold uppercase tracking-wide mb-4 text-primary">
        ADMIN / IT SUPPORT DASHBOARD
      </h1>

      {/* System Performance Metrics */}
      <Card className="border-t-primary hover:shadow transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="text-white">
            System Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-5">
          <KeyMetricsPanel />
        </CardContent>
      </Card>

      {/* User Management */}

      <UserManagement />
    </div>
  );
};

export default AdminDashboard;
