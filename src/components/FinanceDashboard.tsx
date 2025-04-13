import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import KeyMetricsPanel from "./Dashboard/KeyMetricsPanel";
import TransactionTable from "./Dashboard/TransactionTable";
import FlaggedTransactions from "./Dashboard/FlaggedTransactions";
import DataVisualization from "./Dashboard/DataVisualization";

const FinanceDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold uppercase tracking-wide mb-4 text-primary">
        ACCOUNTING / FINANCE DASHBOARD
      </h1>

      {/* Key Financial Metrics 
      <Card className="border-t-primary hover:shadow transition-shadow duration-200">
        <CardHeader>
          <CardTitle>Key Financial Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <KeyMetricsPanel />
        </CardContent>
      </Card>
      */}
      <KeyMetricsPanel />
      {/* Monthly/Daily Sales Summary 
      <Card className="border-t-primary hover:shadow transition-shadow duration-200">
        <CardHeader>
          <CardTitle>Monthly/Daily Sales Summary</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <DataVisualization />
        </CardContent>
      </Card>
      */}
      <DataVisualization />

      {/* Transaction Table with focus on reconciliation */}
      {/*<Card className="border-t-primary hover:shadow transition-shadow duration-200">
      //   <CardHeader>
      //     <CardTitle>Transaction Log</CardTitle>
      //   </CardHeader>
      //   <CardContent className="pt-0">
      //     <TransactionTable />
      //   </CardContent>
      // </Card> */}

      <TransactionTable />

      {/* Flagged Transactions with focus on financial issues 
      <Card className="border-t-primary hover:shadow transition-shadow duration-200">
        <CardHeader>
          <CardTitle>Flagged Transactions</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <FlaggedTransactions />
        </CardContent>
      </Card>
      */}
      <FlaggedTransactions />
    </div>
  );
};

export default FinanceDashboard;
