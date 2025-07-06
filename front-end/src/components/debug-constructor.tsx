"use client";

import * as React from "react";
import { DataTableConstructor } from "@/lib/data-constructor/constructor";

interface DebugData {
  id: number;
  name: string;
  email: string;
  age: number;
  isActive: boolean;
}

const debugData: DebugData[] = [
  { id: 1, name: "Test User", email: "test@example.com", age: 25, isActive: true },
  { id: 2, name: "Another User", email: "another@example.com", age: 30, isActive: false }
];

export function DebugConstructor() {
  const [step, setStep] = React.useState(1);
  const [logs, setLogs] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runTest = async () => {
    setLogs([]);
    setError(null);
    
    try {
      addLog("Starting constructor test...");
      addLog(`Data: ${JSON.stringify(debugData)}`);
      
      // Step 1: Create constructor
      addLog("Step 1: Creating constructor...");
      const constructor = new DataTableConstructor(debugData, {});
      addLog("✓ Constructor created successfully");
      
      // Step 2: Check constructor properties
      addLog("Step 2: Checking constructor properties...");
      addLog(`Data length: ${constructor.data.length}`);
      addLog(`Columns keys: ${Object.keys(constructor.columns).join(', ')}`);
      addLog(`Detected columns: ${constructor.detectedColumns.length}`);
      
      // Step 3: Check constructor data
      addLog("Step 3: Checking constructor data...");
      const constructorData = constructor.constructorData;
      addLog(`Constructor data structure: ${JSON.stringify({
        dataLength: constructorData.data.length,
        columnsKeys: Object.keys(constructorData.columns),
        detectedColumnsLength: constructorData.detectedColumns.length
      })}`);
      
      // Step 4: Check specific column
      addLog("Step 4: Checking specific column...");
      const emailColumn = constructor.columns.email;
      addLog(`Email column config: ${JSON.stringify(emailColumn)}`);
      
      if (emailColumn?.filterConfig) {
        addLog("✓ Email column has filterConfig");
        addLog(`Filter config: ${JSON.stringify(emailColumn.filterConfig)}`);
      } else {
        addLog("✗ Email column missing filterConfig");
      }
      
      // Step 5: Test getDataTableColumns
      addLog("Step 5: Testing getDataTableColumns...");
      const dataTableColumns = constructor.getDataTableColumns();
      addLog(`Generated ${dataTableColumns.length} columns`);
      
      setStep(5);
      addLog("✓ All tests completed successfully!");
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      addLog(`✗ Error: ${errorMessage}`);
      setError(errorMessage);
      console.error("Constructor test error:", err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Constructor Debug Test</h2>
      
      <div className="mb-4">
        <button 
          onClick={runTest}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Run Constructor Test
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 border border-red-300 bg-red-50 rounded">
          <h3 className="text-red-800 font-semibold">Error:</h3>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2">Test Data:</h3>
          <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
            {JSON.stringify(debugData, null, 2)}
          </pre>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Test Logs:</h3>
          <div className="bg-gray-100 p-3 rounded max-h-96 overflow-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500">No logs yet. Click "Run Constructor Test" to start.</p>
            ) : (
              <div className="space-y-1">
                {logs.map((log, index) => (
                  <div key={index} className="text-xs font-mono">
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Test Steps:</h3>
        <div className="space-y-2">
          <div className={`flex items-center ${step >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
            <span className="mr-2">1.</span>
            <span>Create constructor instance</span>
          </div>
          <div className={`flex items-center ${step >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
            <span className="mr-2">2.</span>
            <span>Check constructor properties</span>
          </div>
          <div className={`flex items-center ${step >= 3 ? 'text-green-600' : 'text-gray-400'}`}>
            <span className="mr-2">3.</span>
            <span>Check constructor data structure</span>
          </div>
          <div className={`flex items-center ${step >= 4 ? 'text-green-600' : 'text-gray-400'}`}>
            <span className="mr-2">4.</span>
            <span>Check specific column configuration</span>
          </div>
          <div className={`flex items-center ${step >= 5 ? 'text-green-600' : 'text-gray-400'}`}>
            <span className="mr-2">5.</span>
            <span>Test getDataTableColumns method</span>
          </div>
        </div>
      </div>
    </div>
  );
} 