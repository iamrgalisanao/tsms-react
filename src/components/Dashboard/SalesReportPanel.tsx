import React, { useState } from "react";
import ReactDOMServer from "react-dom/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Printer, FileSpreadsheet, FileText } from "lucide-react";
import SalesReportTable from "./SalesReportTable";
import PrintableSalesReport from "./PrintableSalesReport";
// main.tsx or index.tsx
import "../../index.css";

interface SalesReportPanelProps {
  tenantName?: string;
  tradeName?: string;
  branch?: string;
  month?: string;
  year?: string;
  salesData?: {
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
  }[];
}

const SalesReportPanel = ({
  tenantName = "Tenant Name",
  tradeName = "Tradename",
  branch = "Branch",
  month = "JANUARY",
  year = "2025",
  salesData = [
    {
      date: 1,
      vatableTrans: 23234.0,
      scVatExemptTrans: 0,
      salesDiscount: { withApproval: 0, withoutApproval: 0 },
      employeeDiscount: 0,
      seniorCitizen: 0,
      pwdDisc: 0,
      vipCards: 0,
      localTax: 0,
      serviceCharge: { distributed: 0, retained: 0 },
      grossSales: 23234.0,
    },
    {
      date: 2,
      vatableTrans: 1323.0,
      scVatExemptTrans: 0,
      salesDiscount: { withApproval: 0, withoutApproval: 0 },
      employeeDiscount: 0,
      seniorCitizen: 0,
      pwdDisc: 0,
      vipCards: 0,
      localTax: 0,
      serviceCharge: { distributed: 0, retained: 0 },
      grossSales: 1323.0,
    },
    {
      date: 3,
      vatableTrans: 2525.0,
      scVatExemptTrans: 0,
      salesDiscount: { withApproval: 0, withoutApproval: 0 },
      employeeDiscount: 0,
      seniorCitizen: 0,
      pwdDisc: 0,
      vipCards: 0,
      localTax: 0,
      serviceCharge: { distributed: 0, retained: 0 },
      grossSales: 2525.0,
    },
    {
      date: 4,
      vatableTrans: 22525.0,
      scVatExemptTrans: 0,
      salesDiscount: { withApproval: 0, withoutApproval: 0 },
      employeeDiscount: 0,
      seniorCitizen: 0,
      pwdDisc: 0,
      vipCards: 0,
      localTax: 0,
      serviceCharge: { distributed: 0, retained: 0 },
      grossSales: 22525.0,
    },
  ],
}: SalesReportPanelProps) => {
  const [reportType, setReportType] = useState("monthly");
  const [date, setDate] = useState<Date | undefined>(new Date());

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

  return (
    <>
      {/* --- UI Controls (NOT visible in print) --- */}
      <CardHeader
        className="print:hidden"
        style={{
          display: "block",
          "@media print": { display: "none !important" },
        }}
      >
        <CardTitle className="flex items-center justify-between text-white">
          <span>Sales Reports</span>
          <div
            className="flex items-center space-x-2 print:hidden"
            style={{
              display: "flex",
              "@media print": { display: "none !important" },
            }}
          >
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 text-black"
              onClick={() => {
                const printWindow = window.open("", "_blank");
                if (!printWindow) return;

                const htmlContent = ReactDOMServer.renderToStaticMarkup(
                  <div className="bg-white text-black p-6 w-full">
                    <PrintableSalesReport
                      tenantName={tenantName}
                      tradeName={tradeName}
                      branch={branch}
                      year={year}
                      month={month}
                      date={date}
                      salesData={salesData}
                      reportType={reportType as any}
                    />
                  </div>,
                );

                printWindow.document.write(`
      <html>
        <head>
          <title>Print Sales Report</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              font-size: 11px;
              color: #000;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              table-layout: fixed;
            }
            th, td {
              border: 1px solid #000;
              padding: 4px;
              text-align: right;
              vertical-align: middle;
            }
            th {
              text-align: center;
              font-size: 8px;
              font-weight: 600;
            }
            td{
              font-size: 8px;
            }
            .text-left {
              text-align: left !important;
            }
            .report-header {
              text-align: center;
              margin-top: 60px;
              margin-bottom: 10px;
            }
            .signature {
              margin-top: 60px;
              display: flex;
              justify-content: space-between;
              padding: 0 60px;
            }
            img {
              max-width: 100px;
              height: auto;
            }
          </style>
        </head>
        <body>
          ${htmlContent}
          <script>
            window.onload = function() {
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `);
                printWindow.document.close();
              }}
            >
              <Printer className="h-4 w-4 mr-1" />
              Print
            </Button>

            <Button variant="outline" size="sm" className="h-8 px-2 text-black">
              <FileSpreadsheet className="h-4 w-4 mr-1" />
              Excel
            </Button>

            <Button variant="outline" size="sm" className="h-8 px-2 text-black">
              <FileText className="h-4 w-4 mr-1" />
              PDF
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      {/* --- Main Report Card (contains everything, including print-only content) --- */}
      <Card className="w-full bg-white print:shadow-none print:border-none print:m-0 print:p-0">
        <CardContent className="print:block">
          <Tabs
            defaultValue="monthly"
            onValueChange={setReportType}
            className="w-full"
          >
            {/* --- Tabs UI: Hidden in print --- */}
            <div className="flex justify-between items-center mb-4">
              <TabsList
                className="print:hidden"
                style={{ "@media print": { display: "none !important" } }}
              >
                <TabsTrigger value="daily">Daily Report</TabsTrigger>
                <TabsTrigger value="monthly">Monthly Report</TabsTrigger>
              </TabsList>
              <Popover
                className="print:hidden"
                style={{ "@media print": { display: "none !important" } }}
              >
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[240px] text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* --- PRINTABLE CONTENT BELOW --- */}
            <div
              className="print-content"
              style={{
                "@media print": {
                  display: "block !important",
                  visibility: "visible !important",
                },
              }}
            >
              {reportType === "monthly" ? (
                <MonthlySalesReport
                  tradeName={tradeName}
                  branch={branch}
                  month={month}
                  year={year}
                  salesData={salesData}
                  totals={totals}
                  netSales={netSales}
                  vat={vat}
                  netSalesAfterVat={netSalesAfterVat}
                  netSalesSubjectToPercentageRent={
                    netSalesSubjectToPercentageRent
                  }
                  tenantName={tenantName}
                  date={date}
                />
              ) : (
                <DailySalesReport
                  tradeName={tradeName}
                  branch={branch}
                  date={date}
                  salesData={salesData}
                  totals={totals}
                  tenantName={tenantName}
                />
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
};

// Monthly Sales Report Component
const MonthlySalesReport = ({
  tradeName,
  branch,
  month,
  year,
  salesData,
  totals,
  netSales,
  vat,
  netSalesAfterVat,
  netSalesSubjectToPercentageRent,
  tenantName,
  date,
}) => {
  return (
    <div className="p-4">
      <div className="relative mb-6">
        {/* Right-aligned logo */}
        <div className="absolute top-0 right-0 w-28 h-16 print:static print:float-right">
          <img
            src="/images/mwmlogo.png"
            alt="Company Logo"
            className="object-contain w-full h-full"
          />
        </div>
        {/* Center-aligned header content */}
        <div className="text-center pt-16">
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
      </div>

      {/* Table */}
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
              <td className="border p-1 text-right">
                {row.pwdDisc.toFixed(2)}
              </td>
              <td className="border p-1 text-right">
                {row.vipCards.toFixed(2)}
              </td>
              <td className="border p-1 text-right">
                {row.localTax.toFixed(2)}
              </td>
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
            <td className="border p-1 text-right">
              {totals.pwdDisc.toFixed(2)}
            </td>
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
            <div className="col-span-8">
              Net Sales Subject to Percentage rent
            </div>
            <div className="col-span-2"></div>
            <div className="col-span-2 text-right">
              ₱{netSalesSubjectToPercentageRent.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

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

// Daily Sales Report Component
const DailySalesReport = ({
  tradeName,
  branch,
  date,
  salesData,
  totals,
  tenantName,
}) => {
  const formattedDate = date ? format(date, "MMMM d, yyyy") : "";

  return (
    <div className="p-4">
      <div className="text-center mb-6">
        <div className="flex justify-between items-center">
          <div></div>
          <div>
            <h2 className="text-xl font-bold">{tradeName}</h2>
            <h3 className="text-lg">{branch} Branch</h3>
            <h4 className="text-md font-semibold mt-2">Daily Sales Report</h4>
            <p className="text-sm">{formattedDate}</p>
          </div>
          <div className="w-24 h-16 print:block hidden">
            <img
              src="https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=128&q=80"
              alt="Company Logo"
              className="object-contain w-full h-full"
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h5 className="font-semibold mb-2">Daily Transactions</h5>
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
              <td className="border p-2 text-right">
                {totals.pwdDisc.toFixed(2)}
              </td>
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
      </div>

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

export default SalesReportPanel;
