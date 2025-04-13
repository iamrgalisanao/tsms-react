import React from "react";
import SalesReportPanel from "./Dashboard/SalesReportPanel";

const SalesReportPage = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold uppercase tracking-wide mb-6 text-primary">
        SALES REPORTS
      </h1>
      <SalesReportPanel />
    </div>
  );
};

export default SalesReportPage;
