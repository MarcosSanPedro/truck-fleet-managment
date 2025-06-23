import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { Plus, UserCheck, UserX, Phone, Mail, MapPin, Calendar, Shield, User, Award, Edit3, Trash2, ArrowLeft, AlertTriangle, CheckCircle, FileText, Users } from "lucide-react";
import { apiService } from "../../services/api";
import { Table } from "../../components/ui/table";
import { Modal } from "../../components/ui/Modal";
import { DriverForm } from "../../components/forms/driversForms";
import type { Driver } from "../../types/index";

// Interface for table columns
interface TableColumn {
  key: keyof Driver | string;
  label: string;
  render?: (value: any, driver?: Driver) => React.ReactNode;
}

// StatusBadge component
const StatusBadge: React.FC<{ status: string; type: 'employment' | 'assignment' }> = ({ status, type }) => {
  const colors = {
    employment: {
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-red-100 text-red-800',
      inactive: 'bg-gray-100 text-gray-800',
    },
    assignment: {
      active: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-purple-100 text-purple-800',
    },
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[type][status as keyof typeof colors[typeof type]] || 'bg-gray-100 text-gray-800'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// PerformanceIndicator component
const PerformanceIndicator: React.FC<{ label: string; value: number; type: 'rating' | 'percentage' | 'number' }> = ({ label, value, type }) => {
  return (
    <div className="space-y-2">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="font-semibold text-gray-900">
        {type === 'percentage' ? `${value}%` : type === 'rating' ? `${value}/5` : value}
      </div>
    </div>
  );
};

// Route configuration
export const Route = createFileRoute("/drivers/$driverId")({
  component: DriversDetails,
  loader: async ({params}) => {
    
    const driver = await apiService.getById<Driver>("drivers", Number(params.driverId) );
    return driver;
  },
});

// Main Drivers component
function DriversDetails() {
  // Component states
  const driver = Route.useLoaderData() as Driver;
  const [drivers, setDrivers] = useState<Driver[]>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingDriver, setEditingDriver] = useState<Driver | undefined>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Sync local state with loader data
  // useEffect(() => {
  //   if (initialDrivers && Array.isArray(initialDrivers)) {
  //     const flatDrivers = Array.isArray(initialDrivers[0]) 
  //       ? (initialDrivers as unknown as Driver[][]).flat()
  //       : initialDrivers;
  //     setDrivers(flatDrivers);
  //   }
  // }, [initialDrivers]);

  // // Handlers
  // const handleCreate = useCallback(() => {
  //   setEditingDriver(undefined);
  //   setIsModalOpen(true);
  //   setError(null);
  // }, []);

  // const handleEdit = useCallback((driver: Driver) => {
  //   setEditingDriver(driver);
  //   setIsModalOpen(true);
  //   setError(null);
  // }, []);

  // const handleDelete = useCallback(async (driver: Driver) => {
  //   if (!driver.id) {
  //     setError("Cannot delete a driver without ID");
  //     return;
  //   }

  //   setIsLoading(true);
  //   setError(null);

  //   try {
  //     await apiService.delete("drivers", driver.id);
  //     setDrivers((prev) => prev.filter((d) => d.id !== driver.id));
  //     setSelectedDriver(null);
  //     setShowDeleteConfirm(false);
  //   } catch (error) {
  //     console.error("Error deleting driver:", error);
  //     setError("Failed to delete driver. Please try again.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, []);

  const handleSubmit = useCallback(async (driverData: Omit<Driver, "id">) => {
    setIsLoading(true);
    setError(null);

    try {
      if (editingDriver && editingDriver.id) {
        const updatedDriver = await apiService.update<Driver>("drivers", editingDriver.id, driverData);
        setDrivers((prev) => prev.map((driver) => driver.id === editingDriver.id ? updatedDriver : driver));
      } else {
        const newDriver = await apiService.create<Driver>("drivers", driverData);
        setDrivers((prev) => [...prev, newDriver]);
      }
      setIsModalOpen(false);
      setEditingDriver(undefined);
    } catch (error) {
      console.error("Error saving driver:", error);
      setError(editingDriver ? "Failed to update driver." : "Failed to create driver.");
    } finally {
      setIsLoading(false);
    }
  }, [editingDriver]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingDriver(undefined);
    setError(null);
  }, []);

  const handleViewProfile = (driver: Driver) => {
    setSelectedDriver(driver);
  };

  const handleBack = () => {
    setSelectedDriver(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isLicenseExpiringSoon = (expirationDate?: string) => {
    if (!expirationDate) return false;
    const expDate = new Date(expirationDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expDate <= thirtyDaysFromNow;
  };

  // Filter drivers based on search term
  // const filteredDrivers = drivers.filter((driver) => {
  //   const searchLower = searchTerm.toLowerCase();
  //   const fullName = `${driver.firstName || ''} ${driver.lastName || ''}`.toLowerCase();
  //   const email = (driver.email || '').toLowerCase();
  //   return fullName.includes(searchLower) || email.includes(searchLower);
  // });

  // Render profile view if a driver is selected
  if (driver) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Profile Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleBack}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </button>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Driver Profile</h1>
                    <p className="mt-1 text-sm text-gray-500">Detailed information and management options</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    // onClick={() => handleEdit(selectedDriver)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Driver
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Driver
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Driver Overview Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="p-8">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <img
                    src={driver.photo || '/default-avatar.png'}
                    alt={`${driver.firstName} ${driver.lastName}`}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-3 border-white shadow-md ${
                    driver.employment ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {driver.firstName} {driver.lastName}
                      </h2>
                      <div className="flex items-center mt-2 space-x-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <User className="w-4 h-4 mr-1" />
                          ID: {driver.id}
                        </div>
                        <StatusBadge status={selectedDriver ? 'active' : 'inactive'} type="employment" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-5 h-5 mr-3 text-gray-400" />
                        <span>{driver.phone || 'N/A'}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Mail className="w-5 h-5 mr-3 text-gray-400" />
                        <span>{driver.email}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                        <span>Hired: {formatDate(driver.employment.hireDate)}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <Shield className="w-5 h-5 mr-3 text-blue-500" />
                        <span>Status: {driver.employment.status ? 'Active' : 'Inactive'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* License Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  License Information
                </h3>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Driver License</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-green-600">Valid</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">License Number:</span>
                        <div className="font-medium">{driver.license.number}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Expires:</span>
                        <div className={`font-medium ${isLicenseExpiringSoon(driver.license.expirationDate) ? 'text-amber-600' : ''}`}>
                          {formatDate(driver.license.expirationDate)}
                          {isLicenseExpiringSoon(driver.license.expirationDate) && (
                            <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                              Expiring Soon
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>{driver.firstName} {driver.lastName}</strong>? 
                This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  // onClick={() => handleDelete(selectedDriver)}
                  className="px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete Driver
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

 
}


export default DriversDetails;