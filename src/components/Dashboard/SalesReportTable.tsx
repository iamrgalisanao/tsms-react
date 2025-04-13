import React from "react";

interface SalesData {
  date: number;
  vatableTrans: number;
  scVatExemptTrans: number;
  salesDiscount: {
    withApproval: number;
    withoutApproval: number;
  };
  employeeDiscount: number;
  seniorCitizen: number;
  pwdDisc: number;
  vipCards: number;
  localTax: number;
  serviceCharge: {
    distributed: number;
    retained: number;
  };
  grossSales: number;
}

interface SalesReportTableProps {
  salesData: SalesData[];
  totals?: {
    vatableTrans: number;
    scVatExemptTrans: number;
    salesDiscount: {
      withApproval: number;
      withoutApproval: number;
    };
    employeeDiscount: number;
    seniorCitizen: number;
    pwdDisc: number;
    vipCards: number;
    localTax: number;
    serviceCharge: {
      distributed: number;
      retained: number;
    };
    grossSales: number;
  };
  reportType?: "monthly" | "daily";
}

const SalesReportTable: React.FC<SalesReportTableProps> = ({
  salesData = [],
  totals = {
    vatableTrans: 0,
    scVatExemptTrans: 0,
    salesDiscount: {
      withApproval: 0,
      withoutApproval: 0,
    },
    employeeDiscount: 0,
    seniorCitizen: 0,
    pwdDisc: 0,
    vipCards: 0,
    localTax: 0,
    serviceCharge: {
      distributed: 0,
      retained: 0,
    },
    grossSales: 0,
  },
  reportType = "monthly",
}) => {
  // For daily report, we only show one row of data
  const dataToDisplay =
    reportType === "daily" && salesData.length > 0 ? [salesData[0]] : salesData;

  return (
    <div
      className="overflow-x-auto bg-white print:overflow-visible print:w-full print:block"
      style={{ pageBreakInside: "avoid" }}
    >
      <table className="w-full border-collapse border border-gray-300 text-xs">
        <thead>
          {reportType === "monthly" && (
            <tr>
              <th className="border border-gray-300 px-2 py-1 text-xs font-semibold text-center bg-gray-50">
                Date
              </th>
              <th
                className="border border-gray-300 px-2 py-1 text-xs font-semibold text-center bg-gray-50"
                colSpan={2}
              >
                Net Sales
              </th>
              <th
                className="border border-gray-300 px-2 py-1 text-xs font-semibold text-center bg-gray-50"
                colSpan={2}
              >
                Sales Discount
              </th>
              <th className="border border-gray-300 px-2 py-1 text-xs font-semibold text-center bg-gray-50">
                Employee's Discount
              </th>
              <th className="border border-gray-300 px-2 py-1 text-xs font-semibold text-center bg-gray-50">
                Senior Citizen's
              </th>
              <th className="border border-gray-300 px-2 py-1 text-xs font-semibold text-center bg-gray-50">
                PWD Disc.
              </th>
              <th className="border border-gray-300 px-2 py-1 text-xs font-semibold text-center bg-gray-50">
                VIP Cards if any
              </th>
              <th className="border border-gray-300 px-2 py-1 text-xs font-semibold text-center bg-gray-50">
                Other Tax
              </th>
              <th
                className="border border-gray-300 px-2 py-1 text-xs font-semibold text-center bg-gray-50"
                colSpan={2}
              >
                Service Charge
              </th>
              <th className="border border-gray-300 px-2 py-1 text-xs font-semibold text-center bg-gray-50">
                Gross Sales
              </th>
            </tr>
          )}
          <tr>
            {reportType === "monthly" && (
              <th className="border border-gray-300 px-2 py-1 bg-gray-50"></th>
            )}
            <th className="border border-gray-300 px-2 py-1 text-xs font-medium text-center bg-gray-50">
              Vatable Trans.
              <br />
              <span className="text-[9px]">
                (NET OF DISC. SERVICE
                <br />
                CHARGE AND LOCAL TAX)
              </span>
            </th>
            <th className="border border-gray-300 px-2 py-1 text-xs font-medium text-center bg-gray-50">
              SC Vat Exempt Trans.
              <br />
              <span className="text-[9px]">
                (NET OF DISC. SERVICE
                <br />
                CHARGE AND LOCAL TAX)
              </span>
            </th>
            <th className="border border-gray-300 px-2 py-1 text-xs font-medium text-center bg-gray-50">
              With
              <br />
              Approval
            </th>
            <th className="border border-gray-300 px-2 py-1 text-xs font-medium text-center bg-gray-50">
              Without
              <br />
              Approval
            </th>
            <th className="border border-gray-300 px-2 py-1 text-xs font-medium text-center bg-gray-50"></th>
            <th className="border border-gray-300 px-2 py-1 text-xs font-medium text-center bg-gray-50"></th>
            <th className="border border-gray-300 px-2 py-1 text-xs font-medium text-center bg-gray-50"></th>
            <th className="border border-gray-300 px-2 py-1 text-xs font-medium text-center bg-gray-50"></th>
            <th className="border border-gray-300 px-2 py-1 text-xs font-medium text-center bg-gray-50"></th>
            <th className="border border-gray-300 px-2 py-1 text-xs font-medium text-center bg-gray-50">
              Distributed
              <br />
              to Employees
            </th>
            <th className="border border-gray-300 px-2 py-1 text-xs font-medium text-center bg-gray-50">
              Retained by
              <br />
              Management
            </th>
            <th className="border border-gray-300 px-2 py-1 text-xs font-medium text-center bg-gray-50"></th>
          </tr>
        </thead>
        <tbody>
          {dataToDisplay && dataToDisplay.length > 0 ? (
            dataToDisplay.map((day) => (
              <tr key={day?.date || "unknown"}>
                {reportType === "monthly" && (
                  <td className="border border-gray-300 px-2 py-1 text-xs">
                    {day?.date || "-"}
                  </td>
                )}
                <td className="border border-gray-300 px-2 py-1 text-xs text-right">
                  {day?.vatableTrans?.toFixed(2) || "0.00"}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-xs text-right">
                  {day?.scVatExemptTrans?.toFixed(2) || "0.00"}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-xs text-right">
                  {day?.salesDiscount?.withApproval?.toFixed(2) || "0.00"}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-xs text-right">
                  {day?.salesDiscount?.withoutApproval?.toFixed(2) || "0.00"}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-xs text-right">
                  {day?.employeeDiscount?.toFixed(2) || "0.00"}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-xs text-right">
                  {day?.seniorCitizen?.toFixed(2) || "0.00"}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-xs text-right">
                  {day?.pwdDisc?.toFixed(2) || "0.00"}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-xs text-right">
                  {day?.vipCards?.toFixed(2) || "0.00"}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-xs text-right">
                  {day?.localTax?.toFixed(2) || "0.00"}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-xs text-right">
                  {day?.serviceCharge?.distributed?.toFixed(2) || "0.00"}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-xs text-right">
                  {day?.serviceCharge?.retained?.toFixed(2) || "0.00"}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-xs text-right font-medium">
                  {day?.grossSales?.toFixed(2) || "0.00"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={reportType === "monthly" ? 13 : 12}
                className="border border-gray-300 px-2 py-4 text-center text-gray-500"
              >
                No data available
              </td>
            </tr>
          )}
          <tr className="bg-gray-100 font-medium">
            {reportType === "monthly" && (
              <td className="border border-gray-300 px-2 py-1 text-xs font-semibold">
                Total
              </td>
            )}
            <td className="border border-gray-300 px-2 py-1 text-xs text-right font-semibold">
              {totals?.vatableTrans?.toFixed(2) || "0.00"}
            </td>
            <td className="border border-gray-300 px-2 py-1 text-xs text-right font-semibold">
              {totals?.scVatExemptTrans?.toFixed(2) || "0.00"}
            </td>
            <td className="border border-gray-300 px-2 py-1 text-xs text-right font-semibold">
              {totals?.salesDiscount?.withApproval?.toFixed(2) || "0.00"}
            </td>
            <td className="border border-gray-300 px-2 py-1 text-xs text-right font-semibold">
              {totals?.salesDiscount?.withoutApproval?.toFixed(2) || "0.00"}
            </td>
            <td className="border border-gray-300 px-2 py-1 text-xs text-right font-semibold">
              {totals?.employeeDiscount?.toFixed(2) || "0.00"}
            </td>
            <td className="border border-gray-300 px-2 py-1 text-xs text-right font-semibold">
              {totals?.seniorCitizen?.toFixed(2) || "0.00"}
            </td>
            <td className="border border-gray-300 px-2 py-1 text-xs text-right font-semibold">
              {totals?.pwdDisc?.toFixed(2) || "0.00"}
            </td>
            <td className="border border-gray-300 px-2 py-1 text-xs text-right font-semibold">
              {totals?.vipCards?.toFixed(2) || "0.00"}
            </td>
            <td className="border border-gray-300 px-2 py-1 text-xs text-right font-semibold">
              {totals?.localTax?.toFixed(2) || "0.00"}
            </td>
            <td className="border border-gray-300 px-2 py-1 text-xs text-right font-semibold">
              {totals?.serviceCharge?.distributed?.toFixed(2) || "0.00"}
            </td>
            <td className="border border-gray-300 px-2 py-1 text-xs text-right font-semibold">
              {totals?.serviceCharge?.retained?.toFixed(2) || "0.00"}
            </td>
            <td className="border border-gray-300 px-2 py-1 text-xs text-right font-semibold">
              {totals?.grossSales?.toFixed(2) || "0.00"}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SalesReportTable;
