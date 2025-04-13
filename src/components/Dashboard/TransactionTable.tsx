import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  formatDisplayCurrency,
  formatDisplayDate,
  formatTSMSDate,
  formatTSMSCurrency,
} from '@/lib/utils';
import {
  Download,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Edit,
  History,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';

interface Transaction {
  id: string;
  date: Date;
  tenant: string;
  terminal: string;
  type: 'sale' | 'refund' | 'void';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
}

interface TransactionTableProps {
  transactions?: Transaction[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onExport?: () => void;
}

// Mock data for demonstration
const mockTransactions: Transaction[] = [
  {
    id: '8a918a90-7cbd-4b44-adc0-bc3d31cee238',
    date: new Date('2023-06-01T10:30:00'),
    tenant: 'C-T1005',
    terminal: 'POS-001',
    type: 'sale',
    amount: 24.9,
    status: 'completed',
  },
  {
    id: '8a918a90-7cbd-4b44-adc0-bc3d31cee238',
    date: new Date('2023-06-01T11:45:00'),
    tenant: 'C-T1005',
    terminal: 'POS-002',
    type: 'sale',
    amount: 59.95,
    status: 'completed',
  },
  {
    id: '8a918a90-7cbd-4b44-adc0-bc3d31cee238',
    date: new Date('2023-06-01T13:15:00'),
    tenant: 'C-T1005',
    terminal: 'POS-003',
    type: 'sale',
    amount: 87.5,
    status: 'completed',
  },
  {
    id: '8a918a90-7cbd-4b44-adc0-bc3d31cee238',
    date: new Date('2023-06-01T14:30:00'),
    tenant: 'C-T1005',
    terminal: 'POS-004',
    type: 'refund',
    amount: 45.0,
    status: 'completed',
  },
  {
    id: '8a918a90-7cbd-4b44-adc0-bc3d31cee238',
    date: new Date('2023-06-01T15:45:00'),
    tenant: 'C-T1005',
    terminal: 'POS-005',
    type: 'sale',
    amount: 299.99,
    status: 'pending',
  },
  {
    id: '8a918a90-7cbd-4b44-adc0-bc3d31cee238',
    date: new Date('2023-06-01T16:30:00'),
    tenant: 'C-T1005',
    terminal: 'POS-001',
    type: 'void',
    amount: 12.5,
    status: 'completed',
  },
  {
    id: '8a918a90-7cbd-4b44-adc0-bc3d31cee238',
    date: new Date('2023-06-01T17:15:00'),
    tenant: 'C-T1005',
    terminal: 'POS-002',
    type: 'sale',
    amount: 34.95,
    status: 'failed',
  },
  {
    id: '8a918a90-7cbd-4b44-adc0-bc3d31cee238',
    date: new Date('2023-06-02T09:30:00'),
    tenant: 'C-T1005',
    terminal: 'POS-003',
    type: 'sale',
    amount: 65.75,
    status: 'completed',
  },
  {
    id: '8a918a90-7cbd-4b44-adc0-bc3d31cee238',
    date: new Date('2023-06-02T10:45:00'),
    tenant: 'C-T1005',
    terminal: 'POS-004',
    type: 'sale',
    amount: 129.99,
    status: 'completed',
  },
  {
    id: '8a918a90-7cbd-4b44-adc0-bc3d31cee238',
    date: new Date('2023-06-02T12:00:00'),
    tenant: 'C-T1005',
    terminal: 'POS-005',
    type: 'refund',
    amount: 199.99,
    status: 'pending',
  },
];

const TransactionTable = ({
  transactions = mockTransactions,
  isLoading = false,
  onRefresh = () => {},
  onExport = () => {},
  limit,
}: TransactionTableProps & { limit?: number }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [advancedSearchTerm, setAdvancedSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<keyof Transaction | 'all'>(
    'all'
  );
  const [selectedTenant, setSelectedTenant] = useState<string>('all_tenants');
  const [selectedType, setSelectedType] = useState<string>('all_types');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [sortField, setSortField] = useState<keyof Transaction>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [editReason, setEditReason] = useState('');
  const [editedTransaction, setEditedTransaction] = useState<
    Partial<Transaction>
  >({});

  // Advanced search functionality
  const performAdvancedSearch = (transaction: Transaction) => {
    if (!advancedSearchTerm) return true;

    const term = advancedSearchTerm.toLowerCase();

    if (searchField === 'all') {
      return (
        transaction.id.toLowerCase().includes(term) ||
        transaction.tenant.toLowerCase().includes(term) ||
        transaction.terminal.toLowerCase().includes(term) ||
        transaction.type.toLowerCase().includes(term) ||
        transaction.status.toLowerCase().includes(term) ||
        transaction.amount.toString().includes(term) ||
        format(transaction.date, 'MMM d, yyyy').toLowerCase().includes(term)
      );
    }

    if (searchField === 'date') {
      return format(transaction.date, 'MMM d, yyyy')
        .toLowerCase()
        .includes(term);
    }

    if (searchField === 'amount') {
      return transaction.amount.toString().includes(term);
    }

    return String(transaction[searchField]).toLowerCase().includes(term);
  };

  // Filter transactions based on search term, tenant, type, and date
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.terminal.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTenant =
      selectedTenant === 'all_tenants' || transaction.tenant === selectedTenant;
    const matchesType =
      selectedType === 'all_types' || transaction.type === selectedType;

    const matchesDate = selectedDate
      ? format(transaction.date, 'yyyy-MM-dd') ===
        format(selectedDate, 'yyyy-MM-dd')
      : true;

    const matchesAdvancedSearch = performAdvancedSearch(transaction);

    return (
      matchesSearch &&
      matchesTenant &&
      matchesType &&
      matchesDate &&
      matchesAdvancedSearch
    );
  });

  // Apply limit if specified
  const limitedTransactions = limit
    ? filteredTransactions.slice(0, limit)
    : filteredTransactions;

  // Sort transactions
  const sortedTransactions = [...limitedTransactions].sort((a, b) => {
    if (sortField === 'amount') {
      return sortDirection === 'asc'
        ? a.amount - b.amount
        : b.amount - a.amount;
    }

    if (sortField === 'date') {
      return sortDirection === 'asc'
        ? a.date.getTime() - b.date.getTime()
        : b.date.getTime() - a.date.getTime();
    }

    const aValue = String(a[sortField]).toLowerCase();
    const bValue = String(b[sortField]).toLowerCase();

    return sortDirection === 'asc'
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  // Get unique tenants for filter dropdown
  const tenants = Array.from(new Set(transactions.map((t) => t.tenant)));

  const handleSort = (field: keyof Transaction) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: keyof Transaction) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            Failed
          </Badge>
        );
      default:
        return null;
    }
  };
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };
  // Using the utility function for currency formatting
  // const formatCurrency = (amount: number) => {
  //   return `₱${amount.toFixed(2)}`;
  // };

  // Handle transaction edit
  const handleEditTransaction = () => {
    if (!selectedTransaction || !editReason) return;

    // In a real app, this would call an API to update the transaction
    console.log('Transaction edited:', editedTransaction);
    console.log('Edit reason:', editReason);

    // Close the dialog
    setIsEditDialogOpen(false);
    setEditReason('');
  };

  // Mock transaction history data
  const transactionHistory = [
    {
      date: new Date('2023-06-01T10:35:00'),
      user: 'John Doe',
      action: 'Created transaction',
      details: 'Initial transaction creation',
    },
    {
      date: new Date('2023-06-01T14:22:00'),
      user: 'Jane Smith',
      action: 'Updated amount',
      details: 'Changed amount from ₱22.99 to ₱24.99',
    },
    {
      date: new Date('2023-06-02T09:15:00'),
      user: 'System',
      action: 'Status change',
      details: 'Changed status from pending to completed',
    },
  ];

  return (
    <>
      <Card className="w-full bg-white">
        <CardHeader className="pb-2 ">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="text-xl font-bold text-white">
              Transaction Log
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isLoading}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="mt-5">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Quick search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1"
                onClick={() => setIsAdvancedSearchOpen(true)}
              >
                Advanced
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={selectedTenant} onValueChange={setSelectedTenant}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by tenant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_tenants">All Tenants</SelectItem>
                  {tenants.map((tenant) => (
                    <SelectItem key={tenant} value={tenant}>
                      {tenant}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_types">All Types</SelectItem>
                  <SelectItem value="sale">Sale</SelectItem>
                  <SelectItem value="refund">Refund</SelectItem>
                  <SelectItem value="void">Void</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[180px] justify-start text-left font-normal"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    {selectedDate
                      ? format(selectedDate, 'PPP')
                      : 'Filter by date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                  {selectedDate && (
                    <div className="p-3 border-t border-border">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedDate(undefined)}
                        className="w-full"
                      >
                        Clear Date
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center">
                      Transaction ID {getSortIcon('id')}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center">
                      Transaction Timestamp {getSortIcon('date')}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort('tenant')}
                  >
                    <div className="flex items-center">
                      Tenant ID {getSortIcon('tenant')}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort('terminal')}
                  >
                    <div className="flex items-center">
                      Hardware ID {getSortIcon('terminal')}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort('type')}
                  >
                    <div className="flex items-center">
                      Transaction Type {getSortIcon('type')}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer text-right"
                    onClick={() => handleSort('amount')}
                  >
                    <div className="flex items-center justify-end">
                      Gross Sales {getSortIcon('amount')}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      Validation Status {getSortIcon('status')}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction, index) => (
                  <tr key={`${transaction.id}-${index}`}>
                    <td>{transaction.id}</td>
                    <td>{transaction.amount}</td>
                  </tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {/* Advanced Search Dialog */}
      <Dialog
        open={isAdvancedSearchOpen}
        onOpenChange={setIsAdvancedSearchOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Advanced Search</DialogTitle>
            <DialogDescription>
              Search transactions with more specific criteria.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="search-field" className="text-right">
                Search in
              </Label>
              <Select
                value={searchField as string}
                onValueChange={(value) =>
                  setSearchField(value as keyof Transaction | 'all')
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fields</SelectItem>
                  <SelectItem value="id">ID</SelectItem>
                  <SelectItem value="tenant">Tenant</SelectItem>
                  <SelectItem value="terminal">Terminal</SelectItem>
                  <SelectItem value="type">Type</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="search-term" className="text-right">
                Search for
              </Label>
              <Input
                id="search-term"
                value={advancedSearchTerm}
                onChange={(e) => setAdvancedSearchTerm(e.target.value)}
                className="col-span-3"
                placeholder="Enter search term"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setAdvancedSearchTerm('');
                setSearchField('all');
                setIsAdvancedSearchOpen(false);
              }}
            >
              Clear
            </Button>
            <Button onClick={() => setIsAdvancedSearchOpen(false)}>
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Transaction Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>
              Make changes to the transaction. All edits are logged.
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="transaction-id" className="text-right">
                  Transaction ID
                </Label>
                <Input
                  id="transaction-id"
                  value={selectedTransaction.id}
                  disabled
                  className="col-span-3 bg-muted"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="transaction-amount" className="text-right">
                  Amount
                </Label>
                <Input
                  id="transaction-amount"
                  type="number"
                  value={editedTransaction.amount}
                  onChange={(e) =>
                    setEditedTransaction({
                      ...editedTransaction,
                      amount: parseFloat(e.target.value),
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="transaction-status" className="text-right">
                  Status
                </Label>
                <Select
                  value={editedTransaction.status as string}
                  onValueChange={(value) =>
                    setEditedTransaction({
                      ...editedTransaction,
                      status: value as Transaction['status'],
                    })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-reason" className="text-right">
                  Reason for Edit
                </Label>
                <Input
                  id="edit-reason"
                  value={editReason}
                  onChange={(e) => setEditReason(e.target.value)}
                  className="col-span-3"
                  placeholder="Explain why this edit is needed"
                  required
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditTransaction} disabled={!editReason}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transaction History Dialog */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transaction History</DialogTitle>
            <DialogDescription>
              View the complete history of changes for this transaction.
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="py-4">
              <div className="mb-4 p-3 bg-muted rounded-md">
                <p className="font-medium">
                  Transaction ID: {selectedTransaction.id}
                </p>
                <p>
                  Current Amount: {formatCurrency(selectedTransaction.amount)}
                </p>
                <p>Current Status: {selectedTransaction.status}</p>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Change History</h4>
                {transactionHistory.map((history, index) => (
                  <div key={index} className="border-b pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{history.action}</p>
                        <p className="text-sm text-muted-foreground">
                          {history.details}
                        </p>
                      </div>
                      <div className="text-right text-sm">
                        <p>{format(history.date, 'MMM d, yyyy h:mm a')}</p>
                        <p className="text-muted-foreground">
                          By: {history.user}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsHistoryDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TransactionTable;
