import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
} from "lucide-react";

interface KeyMetric {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

interface TopTenant {
  name: string;
  sales: number;
  transactions: number;
  growth: number;
}

interface KeyMetricsPanelProps {
  dailySales?: number;
  transactionCount?: number;
  averageTransaction?: number;
  topTenants?: TopTenant[];
}

const KeyMetricsPanel = ({
  dailySales = 24680.45,
  transactionCount = 342,
  averageTransaction = 72.16,
  topTenants = [
    {
      name: "Food Court Express",
      sales: 5842.5,
      transactions: 87,
      growth: 12.3,
    },
    { name: "Fashion Boutique", sales: 4210.75, transactions: 43, growth: 8.7 },
    { name: "Electronics Hub", sales: 3950.2, transactions: 28, growth: -2.4 },
    { name: "Wellness Center", sales: 2845.6, transactions: 56, growth: 15.8 },
  ],
}: KeyMetricsPanelProps) => {
  const metrics: KeyMetric[] = [
    {
      title: "Daily Sales",
      value: `₱${dailySales.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: 8.2,
      icon: <DollarSign className="h-5 w-5 text-muted-foreground text-white" />,
    },
    {
      title: "Transactions",
      value: transactionCount.toString(),
      change: 4.5,
      icon: (
        <ShoppingCart className="h-5 w-5 text-muted-foreground text-white" />
      ),
    },
    {
      title: "Avg. Transaction",
      value: `₱${averageTransaction.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: -1.8,
      icon: <TrendingUp className="h-5 w-5 text-muted-foreground text-white" />,
    },
    {
      title: "Active Tenants",
      value: `${topTenants.length}/${topTenants.length + 3}`,
      change: 0,
      icon: <Users className="h-5 w-5 text-muted-foreground text-white" />,
    },
  ];

  return (
    <div className="w-full space-y-4 bg-background">
      <h2 className="text-2xl font-bold tracking-tight">Key Metrics</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                {metric.title}
              </CardTitle>
              {metric.icon}
            </CardHeader>
            <CardContent className="mt-5">
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                {metric.change > 0 ? (
                  <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
                ) : metric.change < 0 ? (
                  <ArrowDownIcon className="mr-1 h-4 w-4 text-red-500" />
                ) : null}
                <span
                  className={
                    metric.change > 0
                      ? "text-green-500"
                      : metric.change < 0
                        ? "text-red-500"
                        : ""
                  }
                >
                  {metric.change > 0 ? "+" : ""}
                  {metric.change}% from yesterday
                </span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-white">Top Performing Tenants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {topTenants.map((tenant, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium">{tenant.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {tenant.transactions} transactions
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    ₱
                    {tenant.sales.toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p
                    className={`text-sm flex items-center justify-end ${tenant.growth > 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    {tenant.growth > 0 ? (
                      <ArrowUpIcon className="mr-1 h-3 w-3" />
                    ) : (
                      <ArrowDownIcon className="mr-1 h-3 w-3" />
                    )}
                    {tenant.growth > 0 ? "+" : ""}
                    {tenant.growth}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KeyMetricsPanel;
