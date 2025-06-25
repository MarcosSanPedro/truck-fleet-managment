import React, { useState, useEffect } from "react";
import type { Driver } from "../../types/index";
import { emptyDriver } from "../../lib/data";

interface DriverFormProps {
  driver?: Driver;
  onSubmit: (driver: Partial<Omit<Driver, "id">>) => void;
  onCancel: () => void;
}

export const DriverForm: React.FC<DriverFormProps> = ({
  driver = emptyDriver,
  onSubmit,
  onCancel,
}) => {
  // Initialize formData with default values for nested objects
  const [formData, setFormData] = useState<Partial<Omit<Driver, "id">>>({});

  useEffect(() => {
    setFormData((prev) => {
      return {
        ...emptyDriver,
        ...prev,
        ...driver,
      };
    });
  }, [driver]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  interface FormData {
    [key: string]: string | number | { [nestedKey: string]: string | number };
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked, dataset } = e.target;
    const fieldKey = dataset.key; // Get data-key attribute for nested objects

    setFormData((prev: FormData) => {
      // If data-key exists, update nested property
      if (fieldKey) {
        return {
          ...prev,
          [fieldKey]: {
            ...(prev[fieldKey] as { [key: string]: string | number }),
            [name]: type === "checkbox" ? checked : value,
          },
        };
      }
      // Otherwise, update top-level property
      return {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  };

  // Helper function to format field names for labels
  const formatLabel = (key: string) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(formData).map((key) => {
          if (
            typeof formData[key] === "string" ||
            typeof formData[key] === "number"
          ) {
            return (
              <div key={key}>
                <label
                  htmlFor={key}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {formatLabel(key)}
                </label>
                <input
                  type="text"
                  id={key}
                  name={key}
                  value={formData[key] as string | number} // Ensure proper typing
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            );
          }
          if (typeof formData[key] === "boolean" ) {
            return (
              <div key={key}>
                {formatLabel(key)}
                <label htmlFor={key} className=" text-sm  text-gray-700 mb-1">
                  <input
                    type="checkbox"
                    id={key}
                    name={key}
                    checked={formData[key]} // Ensure proper typing
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </label>
              </div>
            );
          }

          if (typeof formData[key] === "object") {
            return Object.keys(formData[key]).map((nestedKey) => {
              if (typeof formData[key][nestedKey] === "boolean") {
                return (
                  <div key={key}>
                    {formatLabel(key)}
                    <label
                      htmlFor={key}
                      className=" text-sm  text-gray-700 mb-1"
                    >
                      <input
                        type="checkbox"
                        id={key}
                        name={key}
                        checked={formData[key]} // Ensure proper typing
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </label>
                  </div>
                );
              } 
              if(typeof formData[key][nestedKey] === "number" || "string") {
                return (
                  <div key={`${key}.${nestedKey}`}>
                    <label
                      htmlFor={`${key}.${nestedKey}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {formatLabel(nestedKey)}
                    </label>
                    <input
                      type="text"
                      id={`${key}.${nestedKey}`}
                      name={nestedKey}
                      value={
                        (formData[key] as { [key: string]: string | number })[
                          nestedKey
                        ] || ""
                      }
                      onChange={handleChange}
                      data-key={key} // Use data-key to indicate parent object
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                );
              }
            });
          }

          return null; // Handle unexpected cases
        })}
      </div>
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </form>
  );
};
