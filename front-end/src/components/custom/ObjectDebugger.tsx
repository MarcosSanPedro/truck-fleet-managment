import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Search,
  Filter,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react";

const ObjectDebugger = ({ driversData }: { driversData: any }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showValues, setShowValues] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [collapsedPaths, setCollapsedPaths] = useState(new Set<string>());

  const toggleCollapse = (path: string) => {
    const newCollapsed = new Set(collapsedPaths);
    if (newCollapsed.has(path)) {
      newCollapsed.delete(path);
    } else {
      newCollapsed.add(path);
    }
    setCollapsedPaths(newCollapsed);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getValueType = (value: any): string => {
    if (value === null) return "null";
    if (Array.isArray(value)) return "array";
    return typeof value;
  };

  const shouldShowItem = (key: string, value: any): boolean => {
    if (!searchTerm && filterType === "all") return true;

    const matchesSearch =
      !searchTerm ||
      key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(value).toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterType === "all" || getValueType(value) === filterType;

    return matchesSearch && matchesFilter;
  };

  const renderValue = (value: any, path: string = "", depth: number = 0) => {
    const isCollapsed = collapsedPaths.has(path);

    if (value === null) {
      return <span className="text-gray-500 italic">null</span>;
    }

    if (typeof value === "boolean") {
      return (
        <span
          className={`font-semibold ${value ? "text-green-600" : "text-red-600"}`}
        >
          {String(value)}
        </span>
      );
    }

    if (typeof value === "number") {
      return <span className="text-blue-600 font-mono">{value}</span>;
    }

    if (typeof value === "string") {
      return <span className="text-green-700">"{value}"</span>;
    }

    if (Array.isArray(value)) {
      return (
        <div className="ml-4">
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => toggleCollapse(path)}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
            >
              {isCollapsed ? (
                <ChevronRight size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
              <span className="font-mono text-purple-600">
                Array({value.length})
              </span>
            </button>
            <button
              onClick={() => copyToClipboard(JSON.stringify(value, null, 2))}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Copy size={12} />
            </button>
          </div>
          {!isCollapsed && (
            <div className="ml-4 border-l-2 border-gray-200 pl-4">
              {value.map((item: any, index: number) => (
                <div key={index} className="mb-2">
                  <span className="text-gray-500 font-mono text-sm">
                    [{index}]:{" "}
                  </span>
                  {renderValue(item, `${path}[${index}]`, depth + 1)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (typeof value === "object") {
      const entries = Object.entries(value).filter(([key, val]) =>
        shouldShowItem(key, val)
      );

      return (
        <div className="ml-4">
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => toggleCollapse(path)}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
            >
              {isCollapsed ? (
                <ChevronRight size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
              <span className="font-mono text-purple-600">
                Object({Object.keys(value).length})
              </span>
            </button>
            <button
              onClick={() => copyToClipboard(JSON.stringify(value, null, 2))}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Copy size={12} />
            </button>
          </div>
          {!isCollapsed && (
            <div className="ml-4 border-l-2 border-gray-200 pl-4">
              {entries.map(([key, val]) => (
                <div key={key} className="mb-2">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-800 font-medium min-w-0">
                      {key}:
                    </span>
                    {showValues &&
                      renderValue(val, `${path}.${key}`, depth + 1)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return <span className="text-gray-600">{String(value)}</span>;
  };

  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: "string", label: "Strings" },
    { value: "number", label: "Numbers" },
    { value: "boolean", label: "Booleans" },
    { value: "object", label: "Objects" },
    { value: "array", label: "Arrays" },
    { value: "null", label: "Null" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Drivers Data Debugger
        </h2>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Search size={20} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search keys or values..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowValues(!showValues)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            {showValues ? <EyeOff size={16} /> : <Eye size={16} />}
            {showValues ? "Hide Values" : "Show Values"}
          </button>

          <button
            onClick={() =>
              driversData &&
              copyToClipboard(JSON.stringify(driversData, null, 2))
            }
            className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md transition-colors disabled:opacity-50"
            disabled={!driversData}
          >
            <Copy size={16} />
            Copy All
          </button>
        </div>

        {/* Stats */}
        <div className="text-sm text-gray-600 mb-4">
          {driversData ? (
            <>
              Total size: {JSON.stringify(driversData).length} characters
              {Array.isArray(driversData) && (
                <span className="ml-4">Array length: {driversData.length}</span>
              )}
            </>
          ) : (
            "Loading drivers data..."
          )}
        </div>
      </div>

      {/* Object Display */}
      <div className="bg-gray-50 p-4 rounded-lg border font-mono text-sm overflow-auto max-h-96">
        {driversData ? (
          renderValue(driversData, "root")
        ) : (
          <div className="text-gray-500 italic">Loading drivers data...</div>
        )}
      </div>

      {/* Raw JSON Toggle */}
      <div className="mt-4">
        <details className="bg-gray-100 rounded-md">
          <summary className="px-4 py-2 cursor-pointer hover:bg-gray-200 transition-colors">
            View Raw JSON
          </summary>
          <pre className="p-4 text-xs bg-gray-50 overflow-auto max-h-64 border-t">
            {driversData ? JSON.stringify(driversData, null, 2) : "Loading..."}
          </pre>
        </details>
      </div>
    </div>
  );
};

export default ObjectDebugger;
