import React from "react";
import { format } from "date-fns";

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

interface PrintableSalesReportProps {
  tenantName?: string;
  tradeName?: string;
  branch?: string;
  month?: string;
  year?: string;
  date?: Date;
  salesData?: SalesData[];
  reportType: "monthly" | "daily" | "hourly";
}

const PrintableSalesReport: React.FC<PrintableSalesReportProps> = ({
  tenantName = "Tenant Name",
  tradeName = "Tradename",
  branch = "Branch",
  month = "JANUARY",
  year = "2025",
  date = new Date(),
  salesData = [],
  reportType = "monthly",
}) => {
  // Calculate totals
  const totals = salesData.reduce(
    (acc, curr) => {
      return {
        vatableTrans: acc.vatableTrans + curr.vatableTrans,
        scVatExemptTrans: acc.scVatExemptTrans + curr.scVatExemptTrans,
        salesDiscount: {
          withApproval:
            acc.salesDiscount.withApproval + curr.salesDiscount.withApproval,
          withoutApproval:
            acc.salesDiscount.withoutApproval +
            curr.salesDiscount.withoutApproval,
        },
        employeeDiscount: acc.employeeDiscount + curr.employeeDiscount,
        seniorCitizen: acc.seniorCitizen + curr.seniorCitizen,
        pwdDisc: acc.pwdDisc + curr.pwdDisc,
        vipCards: acc.vipCards + curr.vipCards,
        localTax: acc.localTax + curr.localTax,
        serviceCharge: {
          distributed:
            acc.serviceCharge.distributed + curr.serviceCharge.distributed,
          retained: acc.serviceCharge.retained + curr.serviceCharge.retained,
        },
        grossSales: acc.grossSales + curr.grossSales,
      };
    },
    {
      vatableTrans: 0,
      scVatExemptTrans: 0,
      salesDiscount: { withApproval: 0, withoutApproval: 0 },
      employeeDiscount: 0,
      seniorCitizen: 0,
      pwdDisc: 0,
      vipCards: 0,
      localTax: 0,
      serviceCharge: { distributed: 0, retained: 0 },
      grossSales: 0,
    },
  );

  // Calculate VAT and other values
  const vat = totals.vatableTrans * 0.12;
  const netSales = totals.vatableTrans;
  const netSalesAfterVat = netSales - vat;
  const netSalesSubjectToPercentageRent = netSalesAfterVat;

  // Format date for daily report
  const formattedDate = date ? format(date, "MMMM d, yyyy") : "";

  // For hourly report
  const formattedTime = date ? format(date, "h:mm a") : "";

  return (
    <div className="print-container bg-white p-4">
      <div className="flex items-start justify-between mb-6 w-full">
        {/* Centered Header */}
        <div className="flex-1 text-center">
          <h2 className="text-sm font-bold">
            {tradeName} / {branch} Branch
          </h2>
          <h4 className="text-xs font-semibold mt-1">
            CERTIFIED MONTHLY SALES REPORT
          </h4>
          <p className="text-sm italic">
            For the month of {month} {year}
          </p>
        </div>

        {/* Logo on the right */}
        <div className="w-28 h-16">
          <img
            src="/images/mwmlogo.png"
            alt="Company Logo"
            className="object-contain w-full h-full"
          />
        </div>
      </div>

      {/* Sales Report Table */}
      <div className="mb-6">
        {reportType === "monthly" && (
          <MonthlyReportTable salesData={salesData} totals={totals} />
        )}
        {reportType === "daily" && (
          <DailyReportTable salesData={salesData} totals={totals} />
        )}
        {reportType === "hourly" && (
          <HourlyReportTable salesData={salesData} totals={totals} />
        )}
      </div>

      {/* Summary Section */}
      {reportType === "monthly" && (
        <MonthlySummarySection
          totals={totals}
          netSales={netSales}
          vat={vat}
          netSalesAfterVat={netSalesAfterVat}
          netSalesSubjectToPercentageRent={netSalesSubjectToPercentageRent}
        />
      )}

      {/* Signatory Section */}
      <div className="mt-16 grid grid-cols-2 gap-8 signatory-section">
        <div className="text-center">
          <div className="border-t border-black pt-2">
            <p className="font-medium">Prepared by:</p>
            <p className="mt-10 font-semibold">{tenantName}</p>
            <p className="text-sm text-gray-600">Signature over Printed Name</p>
            <p className="mt-4 font-semibold">SUPERVISOR/OWNER</p>
            <p className="text-sm text-gray-600">(Position)</p>
          </div>
        </div>
        <div className="text-center">
          <div className="border-t border-black pt-2">
            <p className="font-medium">Certified Correct by:</p>
            <p className="mt-10 font-semibold">{tenantName}</p>
            <p className="text-sm text-gray-600">Signature over Printed Name</p>
            <p className="mt-4 font-semibold">AUTHORIZED REPRESENTATIVE</p>
            <p className="text-sm text-gray-600">(Position)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Monthly Report Table Component
const MonthlyReportTable = ({ salesData, totals }) => {
  return (
    <table className="w-full border-collapse text-xs mb-4">
      <thead>
        <tr>
          <th
            rowSpan={3}
            className="border px-2 py-1 text-xs font-semibold text-center align-middle"
          >
            Date
          </th>
          <th
            colSpan={2}
            rowSpan={1}
            className="border px-2 py-1 text-xs font-semibold text-center"
          >
            Net Sales
          </th>
          <th className="border px-2 py-1 text-xs font-semibold text-center"></th>
          <th
            colSpan={6}
            rowSpan={1}
            className="border px-2 py-1 text-xs font-semibold text-center"
          >
            Sales Discount
          </th>
          <th
            rowSpan={3}
            className="border px-2 py-1 text-xs font-semibold text-center"
          >
            Other Tax
            <br />
            <span className="text-[10px] font-normal">(Local Tax)</span>
          </th>

          <th
            colSpan={2}
            rowSpan={2}
            className="border px-2 py-1 text-xs font-semibold text-center align-middle"
          >
            Service Charge
          </th>
          <th
            rowSpan={3}
            className="border px-2 py-1 text-xs font-semibold text-center"
          >
            Gross Sales
          </th>
        </tr>

        <tr>
          <th className="border px-2 py-1 text-[10px] text-center font-medium leading-tight">
            Vatable Trans.
            <br />
          </th>
          <th className="border px-2 py-1 text-[10px] text-center font-medium leading-tight">
            SC Vat Exempt Trans.
            <br />
          </th>
          <th className="border px-2 py-1 text-[10px] text-center font-medium leading-tight"></th>
          <th
            colSpan={2}
            className="border px-2 py-1 text-xs text-center font-normal"
          >
            Promo
          </th>
          <th
            rowSpan={2}
            className="border px-2 py-1 text-xs text-center font-normal align-middle"
          >
            Employee's Discount
          </th>
          <th
            rowSpan={2}
            className="border px-2 py-1 text-xs text-center font-normal align-middle"
          >
            Senior Citizen's
          </th>
          <th
            rowSpan={2}
            className="border px-2 py-1 text-xs text-center font-normal align-middle"
          >
            PWD Disc.
          </th>
          <th
            rowSpan={2}
            className="border px-2 py-1 text-xs text-center font-normal align-middle"
          >
            VIP Cards
            <br />
            if any
          </th>
        </tr>

        <tr>
          <th className="border px-2 py-1 text-[10px] text-center font-normal">
            <span className="text-[9px]">
              (NET OF DISC. SERVICE CHARGE AND LOCAL TAX)
            </span>
          </th>
          <th className="border px-2 py-1 text-[10px] text-center font-normal">
            <span className="text-[9px]">
              (NET OF DISC. SERVICE CHARGE AND LOCAL TAX)
            </span>
          </th>
          <th className="border px-2 py-1 text-[10px] text-center font-normal"></th>
          <th className="border px-2 py-1 text-[10px] text-center font-normal">
            With Approval
          </th>

          <th className="border px-2 py-1 text-[10px] text-center font-normal">
            Without Approval
          </th>

          <th className="border px-2 py-1 text-[10px] text-center font-normal">
            Distributed to Employees
          </th>
          <th className="border px-2 py-1 text-[10px] text-center font-normal">
            Retained by Management
          </th>
        </tr>
      </thead>

      <tbody>
        {salesData.map((row, idx) => (
          <tr key={idx}>
            <td className="border p-1 text-center">{row.date}</td>
            <td className="border p-1 text-right">
              {row.vatableTrans.toFixed(2)}
            </td>
            <td className="border p-1 text-right">
              {row.scVatExemptTrans.toFixed(2)}
            </td>
            <td className="border"></td>
            <td className="border p-1 text-right">
              {row.salesDiscount.withApproval.toFixed(2)}
            </td>
            <td className="border p-1 text-right">
              {row.salesDiscount.withoutApproval.toFixed(2)}
            </td>
            <td className="border p-1 text-right">
              {row.employeeDiscount.toFixed(2)}
            </td>
            <td className="border p-1 text-right">
              {row.seniorCitizen.toFixed(2)}
            </td>
            <td className="border p-1 text-right">{row.pwdDisc.toFixed(2)}</td>
            <td className="border p-1 text-right">{row.vipCards.toFixed(2)}</td>
            <td className="border p-1 text-right">{row.localTax.toFixed(2)}</td>
            <td className="border p-1 text-right">
              {row.serviceCharge.distributed.toFixed(2)}
            </td>
            <td className="border p-1 text-right">
              {row.serviceCharge.retained.toFixed(2)}
            </td>
            <td className="border p-1 text-right font-semibold">
              {row.grossSales.toFixed(2)}
            </td>
          </tr>
        ))}
        <tr className="font-bold bg-gray-100">
          <td className="border p-1 text-center">Total</td>
          <td className="border p-1 text-right">
            {totals.vatableTrans.toFixed(2)}
          </td>
          <td className="border p-1 text-right">
            {totals.scVatExemptTrans.toFixed(2)}
          </td>
          <td className="border p-1 text-right"></td>
          <td className="border p-1 text-right">
            {totals.salesDiscount.withApproval.toFixed(2)}
          </td>
          <td className="border p-1 text-right">
            {totals.salesDiscount.withoutApproval.toFixed(2)}
          </td>
          <td className="border p-1 text-right">
            {totals.employeeDiscount.toFixed(2)}
          </td>
          <td className="border p-1 text-right">
            {totals.seniorCitizen.toFixed(2)}
          </td>
          <td className="border p-1 text-right">{totals.pwdDisc.toFixed(2)}</td>
          <td className="border p-1 text-right">
            {totals.vipCards.toFixed(2)}
          </td>
          <td className="border p-1 text-right">
            {totals.localTax.toFixed(2)}
          </td>
          <td className="border p-1 text-right">
            {totals.serviceCharge.distributed.toFixed(2)}
          </td>
          <td className="border p-1 text-right">
            {totals.serviceCharge.retained.toFixed(2)}
          </td>
          <td className="border p-1 text-right font-semibold">
            {totals.grossSales.toFixed(2)}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

// Daily Report Table Component
const DailyReportTable = ({ salesData, totals }) => {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-100">
          <th className="border p-2 text-left">Transaction Type</th>
          <th className="border p-2 text-right">Amount (₱)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border p-2">Vatable Transactions</td>
          <td className="border p-2 text-right">
            {totals.vatableTrans.toFixed(2)}
          </td>
        </tr>
        <tr>
          <td className="border p-2">SC/VAT Exempt Transactions</td>
          <td className="border p-2 text-right">
            {totals.scVatExemptTrans.toFixed(2)}
          </td>
        </tr>
        <tr>
          <td className="border p-2">Sales Discount (With Approval)</td>
          <td className="border p-2 text-right">
            {totals.salesDiscount.withApproval.toFixed(2)}
          </td>
        </tr>
        <tr>
          <td className="border p-2">Sales Discount (Without Approval)</td>
          <td className="border p-2 text-right">
            {totals.salesDiscount.withoutApproval.toFixed(2)}
          </td>
        </tr>
        <tr>
          <td className="border p-2">Employee Discount</td>
          <td className="border p-2 text-right">
            {totals.employeeDiscount.toFixed(2)}
          </td>
        </tr>
        <tr>
          <td className="border p-2">Senior Citizen Discount</td>
          <td className="border p-2 text-right">
            {totals.seniorCitizen.toFixed(2)}
          </td>
        </tr>
        <tr>
          <td className="border p-2">PWD Discount</td>
          <td className="border p-2 text-right">{totals.pwdDisc.toFixed(2)}</td>
        </tr>
        <tr>
          <td className="border p-2">VIP Cards</td>
          <td className="border p-2 text-right">
            {totals.vipCards.toFixed(2)}
          </td>
        </tr>
        <tr>
          <td className="border p-2">Local Tax</td>
          <td className="border p-2 text-right">
            {totals.localTax.toFixed(2)}
          </td>
        </tr>
        <tr>
          <td className="border p-2">Service Charge (Distributed)</td>
          <td className="border p-2 text-right">
            {totals.serviceCharge.distributed.toFixed(2)}
          </td>
        </tr>
        <tr>
          <td className="border p-2">Service Charge (Retained)</td>
          <td className="border p-2 text-right">
            {totals.serviceCharge.retained.toFixed(2)}
          </td>
        </tr>
        <tr className="font-bold">
          <td className="border p-2">Gross Sales</td>
          <td className="border p-2 text-right">
            {totals.grossSales.toFixed(2)}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

// Hourly Report Table Component
const HourlyReportTable = ({ salesData, totals }) => {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-100">
          <th className="border p-2 text-left">Transaction Type</th>
          <th className="border p-2 text-right">Amount (₱)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border p-2">Vatable Transactions</td>
          <td className="border p-2 text-right">
            {totals.vatableTrans.toFixed(2)}
          </td>
        </tr>
        <tr>
          <td className="border p-2">SC/VAT Exempt Transactions</td>
          <td className="border p-2 text-right">
            {totals.scVatExemptTrans.toFixed(2)}
          </td>
        </tr>
        <tr>
          <td className="border p-2">Sales Discount (With Approval)</td>
          <td className="border p-2 text-right">
            {totals.salesDiscount.withApproval.toFixed(2)}
          </td>
        </tr>
        <tr>
          <td className="border p-2">Sales Discount (Without Approval)</td>
          <td className="border p-2 text-right">
            {totals.salesDiscount.withoutApproval.toFixed(2)}
          </td>
        </tr>
        <tr>
          <td className="border p-2">Employee Discount</td>
          <td className="border p-2 text-right">
            {totals.employeeDiscount.toFixed(2)}
          </td>
        </tr>
        <tr>
          <td className="border p-2">Senior Citizen Discount</td>
          <td className="border p-2 text-right">
            {totals.seniorCitizen.toFixed(2)}
          </td>
        </tr>
        <tr>
          <td className="border p-2">PWD Discount</td>
          <td className="border p-2 text-right">{totals.pwdDisc.toFixed(2)}</td>
        </tr>
        <tr>
          <td className="border p-2">VIP Cards</td>
          <td className="border p-2 text-right">
            {totals.vipCards.toFixed(2)}
          </td>
        </tr>
        <tr>
          <td className="border p-2">Local Tax</td>
          <td className="border p-2 text-right">
            {totals.localTax.toFixed(2)}
          </td>
        </tr>
        <tr>
          <td className="border p-2">Service Charge (Distributed)</td>
          <td className="border p-2 text-right">
            {totals.serviceCharge.distributed.toFixed(2)}
          </td>
        </tr>
        <tr>
          <td className="border p-2">Service Charge (Retained)</td>
          <td className="border p-2 text-right">
            {totals.serviceCharge.retained.toFixed(2)}
          </td>
        </tr>
        <tr className="font-bold">
          <td className="border p-2">Gross Sales</td>
          <td className="border p-2 text-right">
            {totals.grossSales.toFixed(2)}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

// Monthly Summary Section Component
const MonthlySummarySection = ({
  totals,
  netSales,
  vat,
  netSalesAfterVat,
  netSalesSubjectToPercentageRent,
}) => {
  return (
    <div className="mt-6 pt-4">
      <div className="space-y-1">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-2 font-medium">Less:</div>
          <div className="col-span-8">Promo Discounts With Approval</div>
          <div className="col-span-2 text-right font-medium">-</div>
        </div>
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-2"></div>
          <div className="col-span-8">Approved VIP Cards</div>
          <div className="col-span-2 text-right font-medium">-</div>
        </div>
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-2"></div>
          <div className="col-span-8">SC Vat Exempt Transactions</div>
          <div className="col-span-2 text-right font-medium">-</div>
        </div>
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-2"></div>
          <div className="col-span-8">Senior Citizen/PWD Discounts</div>
          <div className="col-span-2 text-right font-medium">-</div>
        </div>
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-2"></div>
          <div className="col-span-8">Other Tax</div>
          <div className="col-span-2 text-right font-medium">-</div>
        </div>
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-2"></div>
          <div className="col-span-8">
            Service Charge Distributed to Employees
          </div>
          <div className="col-span-2 text-right font-medium">-</div>
        </div>
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-2"></div>
          <div className="col-span-8">
            Service Charge Retained by Management
          </div>
          <div className="col-span-2 text-right font-medium">-</div>
        </div>
        <div className="grid grid-cols-12 gap-2 font-semibold">
          <div className="col-span-2">Net Sales</div>
          <div className="col-span-8"></div>
          <div className="col-span-2 text-right">₱{netSales.toFixed(2)}</div>
        </div>
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-2">Less 12% VAT</div>
          <div className="col-span-8"></div>
          <div className="col-span-2 text-right">₱{vat.toFixed(2)}</div>
        </div>
        <div className="grid grid-cols-12 gap-2 font-semibold border-t border-black pt-1">
          <div className="col-span-10"></div>
          <div className="col-span-2 text-right">
            ₱{netSalesAfterVat.toFixed(2)}
          </div>
        </div>
        <div className="grid grid-cols-12 gap-2 mt-2">
          <div className="col-span-2 font-medium">Add:</div>
          <div className="col-span-8">SC Vat Exempt Transactions</div>
          <div className="col-span-2 text-right">-</div>
        </div>
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-2"></div>
          <div className="col-span-8">Other Tax</div>
          <div className="col-span-2 text-right">-</div>
        </div>
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-2"></div>
          <div className="col-span-8">
            Service Charge Retained by Management
          </div>
          <div className="col-span-2 text-right">-</div>
        </div>
        <div className="grid grid-cols-12 gap-2 font-semibold border-t border-black pt-1 border-b border-double pb-1">
          <div className="col-span-8">Net Sales Subject to Percentage rent</div>
          <div className="col-span-2"></div>
          <div className="col-span-2 text-right">
            ₱{netSalesSubjectToPercentageRent.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintableSalesReport;
