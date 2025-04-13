import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Server,
  Download,
} from "lucide-react";

interface Terminal {
  id: string;
  name: string;
  location: string;
  status: "online" | "offline" | "connecting";
  lastSync: string;
}

interface ImportResult {
  terminalId: string;
  terminalName: string;
  status: "success" | "failed";
  message: string;
  transactionsCount?: number;
  timestamp: string;
}

const BatchImportPanel = ({
  terminals = [
    {
      id: "1",
      name: "Terminal 01",
      location: "Food Court",
      status: "online",
      lastSync: "2023-06-15 14:30",
    },
    {
      id: "2",
      name: "Terminal 02",
      location: "Fashion Wing",
      status: "online",
      lastSync: "2023-06-15 13:45",
    },
    {
      id: "3",
      name: "Terminal 03",
      location: "Electronics",
      status: "offline",
      lastSync: "2023-06-14 18:20",
    },
    {
      id: "4",
      name: "Terminal 04",
      location: "Grocery",
      status: "online",
      lastSync: "2023-06-15 12:10",
    },
    {
      id: "5",
      name: "Terminal 05",
      location: "Home Goods",
      status: "online",
      lastSync: "2023-06-15 11:30",
    },
  ] as Terminal[],
  importResults = [] as ImportResult[],
}) => {
  const [selectedTerminals, setSelectedTerminals] = useState<string[]>([]);
  const [importInProgress, setImportInProgress] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [currentResults, setCurrentResults] =
    useState<ImportResult[]>(importResults);
  const [activeTab, setActiveTab] = useState("terminals");

  const handleTerminalSelect = (terminalId: string) => {
    setSelectedTerminals((prev) =>
      prev.includes(terminalId)
        ? prev.filter((id) => id !== terminalId)
        : [...prev, terminalId],
    );
  };

  const handleSelectAll = () => {
    if (
      selectedTerminals.length ===
      terminals.filter((t) => t.status === "online").length
    ) {
      setSelectedTerminals([]);
    } else {
      setSelectedTerminals(
        terminals.filter((t) => t.status === "online").map((t) => t.id),
      );
    }
  };

  const startImport = () => {
    if (selectedTerminals.length === 0) return;

    setImportInProgress(true);
    setImportProgress(0);

    // Simulate import process
    const interval = setInterval(() => {
      setImportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          completeImport();
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const completeImport = () => {
    // Simulate import results
    const results: ImportResult[] = selectedTerminals.map((id) => {
      const terminal = terminals.find((t) => t.id === id);
      const success = Math.random() > 0.2; // 80% success rate for simulation

      return {
        terminalId: id,
        terminalName: terminal?.name || "",
        status: success ? "success" : "failed",
        message: success
          ? "Import completed successfully"
          : "Connection timed out",
        transactionsCount: success
          ? Math.floor(Math.random() * 100) + 1
          : undefined,
        timestamp: new Date().toLocaleString(),
      };
    });

    setCurrentResults([...results, ...currentResults].slice(0, 20)); // Keep last 20 results
    setImportInProgress(false);
    setActiveTab("results");
  };

  const cancelImport = () => {
    setImportInProgress(false);
    setImportProgress(0);
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Batch Transaction Import
        </CardTitle>
        <CardDescription>
          Connect to POS terminals and import transaction data in batches
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="terminals">Terminals</TabsTrigger>
            <TabsTrigger value="results">Import Results</TabsTrigger>
          </TabsList>

          <TabsContent value="terminals">
            {importInProgress ? (
              <div className="space-y-4">
                <Alert>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <AlertTitle>Import in Progress</AlertTitle>
                  <AlertDescription>
                    Connecting to {selectedTerminals.length} terminals and
                    importing transaction data.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{importProgress}%</span>
                  </div>
                  <Progress value={importProgress} className="h-2" />
                </div>

                <Button variant="destructive" onClick={cancelImport}>
                  Cancel Import
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="select-all"
                      checked={
                        selectedTerminals.length ===
                          terminals.filter((t) => t.status === "online")
                            .length &&
                        terminals.filter((t) => t.status === "online").length >
                          0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                    <Label htmlFor="select-all">
                      Select All Online Terminals
                    </Label>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    {selectedTerminals.length} of {terminals.length} selected
                  </div>
                </div>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {terminals.map((terminal) => (
                    <div
                      key={terminal.id}
                      className="flex items-center justify-between p-3 border rounded-md"
                    >
                      <div className="flex items-center space-x-4">
                        <Checkbox
                          id={`terminal-${terminal.id}`}
                          checked={selectedTerminals.includes(terminal.id)}
                          onCheckedChange={() =>
                            handleTerminalSelect(terminal.id)
                          }
                          disabled={terminal.status === "offline"}
                        />
                        <div>
                          <div className="font-medium">{terminal.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {terminal.location}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-muted-foreground">
                          Last sync: {terminal.lastSync}
                        </div>
                        <Badge
                          variant={
                            terminal.status === "online"
                              ? "default"
                              : "destructive"
                          }
                          className="flex items-center gap-1"
                        >
                          <Server className="h-3 w-3" />
                          {terminal.status.charAt(0).toUpperCase() +
                            terminal.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <Button
                    onClick={startImport}
                    disabled={selectedTerminals.length === 0}
                    className="w-full"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Import Transactions from Selected Terminals
                  </Button>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="results">
            {currentResults.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="mx-auto h-12 w-12 mb-4 opacity-20" />
                <p>No import results available yet</p>
                <p className="text-sm">
                  Select terminals and start an import to see results here
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {currentResults.map((result, index) => (
                  <div key={index} className="p-4 border rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {result.status === "success" ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <span className="font-medium">
                          {result.terminalName}
                        </span>
                      </div>
                      <Badge
                        variant={
                          result.status === "success"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {result.status === "success" ? "Success" : "Failed"}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-2">
                      {result.message}
                    </p>

                    <div className="flex justify-between text-sm">
                      <span>
                        {result.transactionsCount !== undefined &&
                          `${result.transactionsCount} transactions imported`}
                      </span>
                      <span className="text-muted-foreground">
                        {result.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-sm text-muted-foreground">
          <Server className="inline-block h-4 w-4 mr-1" />
          {terminals.filter((t) => t.status === "online").length} of{" "}
          {terminals.length} terminals online
        </div>
        {activeTab === "results" && currentResults.length > 0 && (
          <Button variant="outline" size="sm">
            Export Results
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default BatchImportPanel;
