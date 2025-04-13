import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import KeyMetricsPanel from "./Dashboard/KeyMetricsPanel";
import DataVisualization from "./Dashboard/DataVisualization";
import TransactionTable from "./Dashboard/TransactionTable";

const CommercialDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold uppercase tracking-wide mb-4 text-primary">
        COMMERCIAL TEAM DASHBOARD
      </h1>

      {/* Tenant Performance Metrics */}
      <KeyMetricsPanel />

      {/* Performance Trend Visualizations */}
      <DataVisualization />

      {/* Transaction Table with focus on tenant performance */}
      {/*<TransactionTable />*/}
      <TransactionTable />
    </div>
  );
};

export default CommercialDashboard;
