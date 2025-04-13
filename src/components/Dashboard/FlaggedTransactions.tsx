import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { AlertTriangle, CheckCircle, Flag, Search } from "lucide-react";

interface FlaggedTransaction {
  id: string;
  transactionId: string;
  date: Date;
  tenant: string;
  amount: number;
  flagReason: string;
  flagType: "Missing Info" | "Incorrect Total" | "Late Sync" | "Other";
  status: "Pending" | "Resolved";
  flaggedBy: string;
  resolvedBy?: string;
  resolution?: string;
}

const FlaggedTransactions = () => {
  const [transactions, setTransactions] = useState<FlaggedTransaction[]>([
    {
      id: "1",
      transactionId: "TRX-001",
      date: new Date("2023-06-01T10:30:00"),
      tenant: "Coffee Shop",
      amount: 24.99,
      flagReason: "Missing POS terminal ID",
      flagType: "Missing Info",
      status: "Pending",
      flaggedBy: "John Doe",
    },
    {
      id: "2",
      transactionId: "TRX-004",
      date: new Date("2023-06-01T14:30:00"),
      tenant: "Clothing Store",
      amount: 45.0,
      flagReason: "Incorrect total amount, should be $54.99",
      flagType: "Incorrect Total",
      status: "Pending",
      flaggedBy: "Jane Smith",
    },
    {
      id: "3",
      transactionId: "TRX-007",
      date: new Date("2023-06-01T17:15:00"),
      tenant: "Bookstore",
      amount: 34.95,
      flagReason: "Transaction synced 24 hours late",
      flagType: "Late Sync",
      status: "Resolved",
      flaggedBy: "Robert Johnson",
      resolvedBy: "Emily Davis",
      resolution: "Confirmed with tenant, system clock was incorrect",
    },
    {
      id: "4",
      transactionId: "TRX-010",
      date: new Date("2023-06-02T12:00:00"),
      tenant: "Electronics",
      amount: 199.99,
      flagReason: "Customer dispute on refund amount",
      flagType: "Other",
      status: "Resolved",
      flaggedBy: "Michael Wilson",
      resolvedBy: "Sarah Brown",
      resolution: "Refund processed correctly, customer was confused about tax",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTransaction, setSelectedTransaction] =
    useState<FlaggedTransaction | null>(null);
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
  const [resolution, setResolution] = useState("");

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.transactionId
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.flagReason.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      transaction.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleResolveTransaction = () => {
    if (selectedTransaction && resolution) {
      const updatedTransactions = transactions.map((transaction) =>
        transaction.id === selectedTransaction.id
          ? {
              ...transaction,
              status: "Resolved" as const,
              resolvedBy: "Current User", // In a real app, this would be the logged-in user
              resolution: resolution,
            }
          : transaction,
      );

      setTransactions(updatedTransactions);
      setIsResolveDialogOpen(false);
      setResolution("");
    }
  };

  const openResolveDialog = (transaction: FlaggedTransaction) => {
    setSelectedTransaction(transaction);
    setIsResolveDialogOpen(true);
  };

  const getFlagTypeBadge = (flagType: FlaggedTransaction["flagType"]) => {
    switch (flagType) {
      case "Missing Info":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Missing Info
          </Badge>
        );
      case "Incorrect Total":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            Incorrect Total
          </Badge>
        );
      case "Late Sync":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Late Sync
          </Badge>
        );
      case "Other":
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            Other
          </Badge>
        );
      default:
        return null;
    }
  };

  // const formatCurrency = (amount: number) => {
  //   return new Intl.NumberFormat("en-US", {
  //     style: "currency",
  //     currency: "USD",
  //   }).format(amount);
  // };
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white">
          <Flag className="inline-block mr-2 h-5 w-5" />
          Flagged Transactions
        </CardTitle>
        <CardDescription className="text-white">
          Review and resolve flagged transactions that require attention
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-5">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search flagged items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Flag Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No flagged transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {transaction.transactionId}
                    </TableCell>
                    <TableCell>
                      {format(transaction.date, "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>{transaction.tenant}</TableCell>
                    <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                    <TableCell>
                      {getFlagTypeBadge(transaction.flagType)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          transaction.status === "Pending"
                            ? "outline"
                            : "default"
                        }
                        className={
                          transaction.status === "Pending"
                            ? "border-yellow-500 text-yellow-700"
                            : "bg-green-100 text-green-800"
                        }
                      >
                        {transaction.status === "Pending" ? (
                          <>
                            <AlertTriangle className="inline-block mr-1 h-3 w-3" />
                            Pending
                          </>
                        ) : (
                          <>
                            <CheckCircle className="inline-block mr-1 h-3 w-3" />
                            Resolved
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {transaction.status === "Pending" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openResolveDialog(transaction)}
                        >
                          Resolve
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openResolveDialog(transaction)}
                        >
                          View Details
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Resolve Dialog */}
        <Dialog
          open={isResolveDialogOpen}
          onOpenChange={setIsResolveDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedTransaction?.status === "Pending"
                  ? "Resolve Flagged Transaction"
                  : "Flagged Transaction Details"}
              </DialogTitle>
              <DialogDescription>
                {selectedTransaction?.status === "Pending"
                  ? "Provide resolution details for this flagged transaction."
                  : "View the details of this resolved transaction."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">
                  Transaction ID:
                </Label>
                <div className="col-span-3">
                  {selectedTransaction?.transactionId}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Tenant:</Label>
                <div className="col-span-3">{selectedTransaction?.tenant}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Amount:</Label>
                <div className="col-span-3">
                  {selectedTransaction?.amount &&
                    formatCurrency(selectedTransaction.amount)}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Flag Type:</Label>
                <div className="col-span-3">
                  {selectedTransaction?.flagType}
                </div>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right font-medium">Flag Reason:</Label>
                <div className="col-span-3">
                  {selectedTransaction?.flagReason}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Flagged By:</Label>
                <div className="col-span-3">
                  {selectedTransaction?.flaggedBy}
                </div>
              </div>

              {selectedTransaction?.status === "Resolved" ? (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-medium">
                      Resolved By:
                    </Label>
                    <div className="col-span-3">
                      {selectedTransaction?.resolvedBy}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right font-medium">
                      Resolution:
                    </Label>
                    <div className="col-span-3">
                      {selectedTransaction?.resolution}
                    </div>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="resolution" className="text-right">
                    Resolution:
                  </Label>
                  <Textarea
                    id="resolution"
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    placeholder="Enter resolution details..."
                    className="col-span-3"
                    rows={4}
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsResolveDialogOpen(false)}
              >
                {selectedTransaction?.status === "Resolved"
                  ? "Close"
                  : "Cancel"}
              </Button>
              {selectedTransaction?.status === "Pending" && (
                <Button
                  onClick={handleResolveTransaction}
                  disabled={!resolution}
                >
                  Resolve Transaction
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default FlaggedTransactions;
