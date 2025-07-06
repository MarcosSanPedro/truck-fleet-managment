"use client";

import * as React from "react";
import { DataTableConstructor } from "@/lib/data-constructor/constructor";

// Simple test data
const testData = [
  { id: 1, name: "John", email: "john@example.com", age: 30 },
  { id: 2, name: "Jane", email: "jane@example.com", age: 25 }
];

export function ConstructorTest() {
  const [error, setError] = React.useState<string | null>(null);
  const [constructorData, setConstructorData] = React.useState<any>(null);

  React.useEffect(() => {
    try {
      console.log("Creating constructor with data:", testData);
      const constructor = new DataTableConstructor(testData, {});
      console.log("Constructor created successfully:", constructor);
      console.log("Constructor data:", constructor.constructorData);
      console.log("Constructor columns:", constructor.columns);
      setConstructorData(constructor.constructorData);
    } catch (err) {
      console.error("Error creating constructor:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }, []);

  if (error) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded">
        <h3 className="text-red-800 font-semibold">Error:</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!constructorData) {
    return <div className="p-4">Loading constructor test...</div>;
  }

  return (
    <div className="p-4 border rounded">
      <h3 className="font-semibold mb-2">Constructor Test Results:</h3>
      <div className="space-y-2">
        <div>
          <strong>Data length:</strong> {constructorData.data.length}
        </div>
        <div>
          <strong>Columns:</strong>
          <pre className="text-xs bg-gray-100 p-2 mt-1 rounded">
            {JSON.stringify(constructorData.columns, null, 2)}
          </pre>
        </div>
        <div>
          <strong>Detected Columns:</strong>
          <pre className="text-xs bg-gray-100 p-2 mt-1 rounded">
            {JSON.stringify(constructorData.detectedColumns, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
} 