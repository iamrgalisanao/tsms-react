import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import {
  CalendarIcon,
  BarChart3Icon,
  LineChartIcon,
  PieChartIcon,
  Download,
} from 'lucide-react';
import RealtimeChart from './RealtimeChart';

interface DataVisualizationProps {
  salesData?: any[];
  tenants?: string[];
  fullView?: boolean; // Add the fullView prop as an optional boolean
}

const DataVisualization = ({
  salesData = [
    { date: '2023-01-01', tenant: 'Tenant A', sales: 5200 },
    { date: '2023-01-02', tenant: 'Tenant A', sales: 4800 },
    { date: '2023-01-03', tenant: 'Tenant A', sales: 5500 },
    { date: '2023-01-04', tenant: 'Tenant A', sales: 6100 },
    { date: '2023-01-05', tenant: 'Tenant A', sales: 5900 },
    { date: '2023-01-01', tenant: 'Tenant B', sales: 3200 },
    { date: '2023-01-02', tenant: 'Tenant B', sales: 3500 },
    { date: '2023-01-03', tenant: 'Tenant B', sales: 3800 },
    { date: '2023-01-04', tenant: 'Tenant B', sales: 4100 },
    { date: '2023-01-05', tenant: 'Tenant B', sales: 3900 },
    { date: '2023-01-01', tenant: 'Tenant C', sales: 2200 },
    { date: '2023-01-02', tenant: 'Tenant C', sales: 2500 },
    { date: '2023-01-03', tenant: 'Tenant C', sales: 2800 },
    { date: '2023-01-04', tenant: 'Tenant C', sales: 3100 },
    { date: '2023-01-05', tenant: 'Tenant C', sales: 2900 },
  ],
  tenants = ['Tenant A', 'Tenant B', 'Tenant C', 'Tenant D', 'Tenant E'],
}: DataVisualizationProps) => {
  const [selectedTab, setSelectedTab] = useState('trends');
  const [selectedTenants, setSelectedTenants] = useState<string[]>([
    'Tenant A',
    'Tenant B',
  ]);
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to?: Date;
  }>({ from: new Date(new Date().setDate(new Date().getDate() - 7)) });
  const [chartType, setChartType] = useState('line');

  const handleTenantToggle = (tenant: string) => {
    if (selectedTenants.includes(tenant)) {
      setSelectedTenants(selectedTenants.filter((t) => t !== tenant));
    } else {
      setSelectedTenants([...selectedTenants, tenant]);
    }
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <span>Data Visualization</span>
          <div className="flex items-center space-x-2 text-black">
            <Button
              variant={chartType === 'line' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('line')}
              className="h-8 w-8 p-0"
            >
              <LineChartIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={chartType === 'bar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('bar')}
              className="h-8 w-8 p-0"
            >
              <BarChart3Icon className="h-4 w-4" />
            </Button>
            <Button
              variant={chartType === 'pie' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('pie')}
              className="h-8 w-8 p-0"
            >
              <PieChartIcon className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 px-2 ml-2">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="mt-5">
        <Tabs
          defaultValue="trends"
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <div className="flex justify-between items-center mb-4 ">
            <TabsList>
              <TabsTrigger value="trends">Sales Trends</TabsTrigger>
              <TabsTrigger value="comparison">Tenant Comparison</TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[240px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, 'LLL dd, y')} -{' '}
                          {format(dateRange.to, 'LLL dd, y')}
                        </>
                      ) : (
                        format(dateRange.from, 'LLL dd, y')
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange as any}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {selectedTab === 'comparison' && (
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select tenants" />
                  </SelectTrigger>
                  <SelectContent>
                    {tenants.map((tenant) => (
                      <SelectItem key={tenant} value={tenant}>
                        {tenant}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <TabsContent value="trends" className="space-y-4 text-white">
            <RealtimeChart
              title="Sales Trends"
              type={chartType as 'line' | 'bar' | 'pie'}
              data={[
                { name: 'Mon', value: 4200, previousValue: 3800 },
                { name: 'Tue', value: 4800, previousValue: 4100 },
                { name: 'Wed', value: 5100, previousValue: 4600 },
                { name: 'Thu', value: 5900, previousValue: 5200 },
                { name: 'Fri', value: 6200, previousValue: 5500 },
                { name: 'Sat', value: 5400, previousValue: 5100 },
                { name: 'Sun', value: 4100, previousValue: 3900 },
              ]}
              dataKeys={['value', 'previousValue']}
              colors={['#0ea5e9', '#94a3b8']}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-white">
                    Average Daily Sales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₱4,280</div>
                  <p className="text-xs text-muted-foreground">
                    +12.5% from previous period
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-white">
                    Peak Sales Day
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Thursday</div>
                  <p className="text-xs text-muted-foreground">
                    ₱5,940 average
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-white">
                    Growth Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+8.3%</div>
                  <p className="text-xs text-muted-foreground">
                    Month-over-month
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-4">
            <RealtimeChart
              title={`Tenant Comparison: ${selectedTenants.join(' vs ')}`}
              type={chartType as 'line' | 'bar' | 'pie'}
              data={
                chartType === 'pie'
                  ? [
                      { id: 1, name: 'Tenant A', value: 35 },
                      { id: 2, name: 'Tenant B', value: 25 },
                      { id: 3, name: 'Tenant C', value: 20 },
                      { id: 4, name: 'Tenant D', value: 15 },
                      { id: 5, name: 'Tenant E', value: 5 },
                    ]
                  : [
                      {
                        name: 'Week 1',
                        value: 4200,
                        'Tenant A': 4200,
                        'Tenant B': 3800,
                      },
                      {
                        name: 'Week 2',
                        value: 4800,
                        'Tenant A': 4800,
                        'Tenant B': 4100,
                      },
                      {
                        name: 'Week 3',
                        value: 5100,
                        'Tenant A': 5100,
                        'Tenant B': 4600,
                      },
                      {
                        name: 'Week 4',
                        value: 5900,
                        'Tenant A': 5900,
                        'Tenant B': 5200,
                      },
                    ]
              }
              dataKeys={chartType === 'pie' ? ['value'] : selectedTenants}
              colors={['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-white">
                    Top Performing Tenant
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Tenant A</div>
                  <p className="text-xs text-muted-foreground">
                    $156,780 total sales
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Highest Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Tenant C</div>
                  <p className="text-xs text-muted-foreground">
                    +24.7% month-over-month
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">
                Tenant Performance Ranking
              </h3>
              <div className="space-y-2">
                {tenants.slice(0, 5).map((tenant, index) => (
                  <div key={`${tenant}-${index}`} className="flex items-center">
                    <div className="w-8 text-sm font-medium">{index + 1}</div>
                    <div className="flex-1">{tenant}</div>
                    <div className="text-sm font-medium">
                      $
                      {Math.floor(
                        5000 - index * 800 + Math.random() * 500
                      ).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DataVisualization;
