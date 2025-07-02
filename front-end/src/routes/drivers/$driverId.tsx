import {
  createFileRoute,
  Link,
} from "@tanstack/react-router";
import {
  ArrowLeft,
  Edit3,
  Trash2,
  AlertTriangle,
  Phone,
  Mail,
  Calendar,
  Shield,
  MapPin,
  Truck,
  Award,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle,
  Star,
} from "lucide-react";
import { apiService } from "../../services/api";
import type { Driver } from "../../types/index";
import useEntityDetails from "../../lib/useEntityDetails";

export const Route = createFileRoute("/drivers/$driverId")({
  component: DriversDetails,
  loader: async ({ params }) => {
    try {
      const driver = await apiService.getById<Driver>(
        "drivers",
        Number(params.driverId)
      );
      if (!driver) throw new Error("Driver not found");
      return driver;
    } catch (error) {
      throw new Error(`Failed to load driver: ${error}`);
    }
  },
});

function DriversDetails() {
  const loaderDriver = Route.useLoaderData() as Driver | null;
  const {
    entity: driver,
    editedEntity: editedDriver,
    isEditing,
    error,
    showDeleteConfirm,
    setShowDeleteConfirm,
    startEdit,
    cancelEdit,
    saveEdit,
    deleteEntity,
    handleFieldChange,
    handleNestedFieldChange,
    setIsEditing,
  } = useEntityDetails<Driver>("drivers", loaderDriver);

  // For double-nested fields (e.g., certifications.drug_test_date)
  const handleDoubleNestedFieldChange = (
    section: string,
    subSection: string,
    field: string,
    value: any
  ) => {
    if (!editedDriver) return;
    handleFieldChange(section, {
      ...((editedDriver as any)[section] || {}),
      [subSection]: {
        ...(((editedDriver as any)[section]?.[subSection]) || {}),
        [field]: value,
      },
    });
  };

  const formatDate = (dateString?: string) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "available":
        return "bg-green-100 text-green-800";
      case "on-route":
      case "loading":
        return "bg-blue-100 text-blue-800";
      case "maintenance":
      case "suspended":
        return "bg-red-100 text-red-800";
      case "on-leave":
      case "off-duty":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPerformanceColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 3.5) return "text-blue-600";
    if (rating >= 2.5) return "text-yellow-600";
    return "text-red-600";
  };

  if (!driver || !editedDriver) return <div>Error: Driver not found</div>;

  return (
    <div className="">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link to="/Drivers">
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Drivers
              </button>
            </Link>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">
                Driver Profile
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Complete driver information and performance metrics
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={saveEdit}
                    className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  onClick={startEdit}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              )}
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Driver
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-2">
        {/* Driver Overview Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                {isEditing ? (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={editedDriver.first_name}
                      onChange={(e) =>
                        handleFieldChange("first_name", e.target.value)
                      }
                      className="rounded px-2 py-1 text-lg"
                      placeholder="First Name"
                    />
                    <input
                      type="text"
                      value={editedDriver.last_name}
                      onChange={(e) =>
                        handleFieldChange("last_name", e.target.value)
                      }
                      className="rounded px-2 py-1 text-lg"
                      placeholder="Last Name"
                    />
                  </div>
                ) : (
                  <h2 className="text-3xl font-bold text-white">
                    {driver.first_name} {driver.last_name}
                  </h2>
                )}
                <div className="flex items-center mt-2 space-x-4">
                  <span className="text-blue-100">ID: {driver.id}</span>
                  <span className="text-blue-100">
                    Employee ID:{" "}
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedDriver.employment.employee_id}
                        onChange={(e) =>
                          handleNestedFieldChange(
                            "employment",
                            "employee_id",
                            e.target.value
                          )
                        }
                        className="rounded px-1 text-xs"
                        placeholder="Employee ID"
                      />
                    ) : (
                      driver.employment.employee_id
                    )}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(driver.employment.status)}`}
                >
                  <Shield className="w-4 h-4 mr-1" />
                  {isEditing ? (
                    <select
                      value={editedDriver.employment.status}
                      onChange={(e) =>
                        handleNestedFieldChange(
                          "employment",
                          "status",
                          e.target.value
                        )
                      }
                      className="rounded px-1 text-xs"
                    >
                      <option value="active">Active</option>
                      <option value="available">Available</option>
                      <option value="on-route">On Route</option>
                      <option value="loading">Loading</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="suspended">Suspended</option>
                      <option value="on-leave">On Leave</option>
                      <option value="off-duty">Off Duty</option>
                    </select>
                  ) : (
                    driver.employment.status.charAt(0).toUpperCase() +
                    driver.employment.status.slice(1)
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Phone */}
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedDriver.phone_number}
                      onChange={(e) =>
                        handleFieldChange("phone_number", e.target.value)
                      }
                      className="rounded px-2"
                      placeholder="Phone Number"
                    />
                  ) : (
                    <p className="font-medium">
                      {driver.phone_number || "Not provided"}
                    </p>
                  )}
                </div>
              </div>
              {/* Email */}
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedDriver.email}
                      onChange={(e) =>
                        handleFieldChange("email", e.target.value)
                      }
                      className="rounded px-2"
                      placeholder="Email"
                    />
                  ) : (
                    <p className="font-medium">{driver.email}</p>
                  )}
                </div>
              </div>
              {/* Hire Date */}
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hire Date</p>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editedDriver.employment.hire_date}
                      onChange={(e) =>
                        handleNestedFieldChange(
                          "employment",
                          "hire_date",
                          e.target.value
                        )
                      }
                      className="rounded px-2"
                    />
                  ) : (
                    <p className="font-medium">{driver.employment.hire_date}</p>
                  )}
                </div>
              </div>
              {/* Experience */}
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  {isEditing ? (
                    <input
                      type="number"
                      min={0}
                      value={editedDriver.employment.years_experience}
                      onChange={(e) =>
                        handleNestedFieldChange(
                          "employment",
                          "years_experience",
                          Number(e.target.value)
                        )
                      }
                      className="rounded px-2"
                    />
                  ) : (
                    <p className="font-medium">
                      {driver.employment.years_experience} years
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
                Performance Metrics
              </h3>

              <div className="grid grid-cols-2 gap-2">
                {/* Safety Rating */}
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.1"
                      min={0}
                      max={5}
                      value={editedDriver.performance.safety_rating}
                      onChange={(e) =>
                        handleNestedFieldChange(
                          "performance",
                          "safety_rating",
                          parseFloat(e.target.value)
                        )
                      }
                      className="text-3xl font-bold border rounded px-2"
                    />
                  ) : (
                    <div
                      className={`text-3xl font-bold ${getPerformanceColor(driver.performance.safety_rating)}`}
                    >
                      {driver.performance.safety_rating.toFixed(1)}
                    </div>
                  )}
                  <div className="flex justify-center mt-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(driver.performance.safety_rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">Safety Rating</p>
                </div>
                {/* On-Time Delivery */}
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  {isEditing ? (
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={editedDriver.performance.on_time_delivery_rate}
                      onChange={(e) =>
                        handleNestedFieldChange(
                          "performance",
                          "on_time_delivery_rate",
                          Number(e.target.value)
                        )
                      }
                      className="text-3xl font-bold border rounded px-2"
                    />
                  ) : (
                    <div className="text-3xl font-bold text-green-600">
                      {driver.performance.on_time_delivery_rate}%
                    </div>
                  )}
                  <p className="text-sm text-gray-600 mt-2">On-Time Delivery</p>
                </div>
                {/* Total Miles */}
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  {isEditing ? (
                    <input
                      type="number"
                      min={0}
                      value={editedDriver.performance.total_miles_driven}
                      onChange={(e) =>
                        handleNestedFieldChange(
                          "performance",
                          "total_miles_driven",
                          Number(e.target.value)
                        )
                      }
                      className="text-3xl font-bold border rounded px-2"
                    />
                  ) : (
                    <div className="text-3xl font-bold text-blue-600">
                      {driver.performance.total_miles_driven.toLocaleString()}
                    </div>
                  )}
                  <p className="text-sm text-gray-600 mt-2">Total Miles</p>
                </div>
                {/* Days Accident-Free */}
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  {isEditing ? (
                    <input
                      type="number"
                      min={0}
                      value={editedDriver.performance.accidents_free}
                      onChange={(e) =>
                        handleNestedFieldChange(
                          "performance",
                          "accidents_free",
                          Number(e.target.value)
                        )
                      }
                      className="text-3xl font-bold border rounded px-2"
                    />
                  ) : (
                    <div className="text-3xl font-bold text-purple-600">
                      {driver.performance.accidents_free}
                    </div>
                  )}
                  <p className="text-sm text-gray-600 mt-2">
                    Days Accident-Free
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Current Assignment */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Truck className="w-6 h-6 mr-2 text-blue-600" />
              Current Assignment
            </h3>

            <div className="space-y-4">
              {/* Truck Number */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Truck Number</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedDriver.current_assignment.truck_number}
                    onChange={(e) =>
                      handleNestedFieldChange(
                        "current_assignment",
                        "truck_number",
                        e.target.value
                      )
                    }
                    className="rounded px-2"
                  />
                ) : (
                  <span className="font-medium">
                    {driver.current_assignment.truck_number}
                  </span>
                )}
              </div>
              {/* Route */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Route</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedDriver.current_assignment.route}
                    onChange={(e) =>
                      handleNestedFieldChange(
                        "current_assignment",
                        "route",
                        e.target.value
                      )
                    }
                    className="rounded px-2"
                  />
                ) : (
                  <span className="font-medium">
                    {driver.current_assignment.route}
                  </span>
                )}
              </div>
              {/* Status */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Status</span>
                {isEditing ? (
                  <select
                    value={editedDriver.current_assignment.status}
                    onChange={(e) =>
                      handleNestedFieldChange(
                        "current_assignment",
                        "status",
                        e.target.value
                      )
                    }
                    className="rounded px-2"
                  >
                    <option value="active">Active</option>
                    <option value="available">Available</option>
                    <option value="on-route">On Route</option>
                    <option value="loading">Loading</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="suspended">Suspended</option>
                    <option value="on-leave">On Leave</option>
                    <option value="off-duty">Off Duty</option>
                  </select>
                ) : (
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(driver.current_assignment.status)}`}
                  >
                    {driver.current_assignment.status.charAt(0).toUpperCase() +
                      driver.current_assignment.status.slice(1)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {/* Address & Contact */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <MapPin className="w-6 h-6 mr-2 text-blue-600" />
              Address & Contact
            </h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Home Address</h4>
                {isEditing ? (
                  <div className="space-y-1">
                    <input
                      type="text"
                      value={editedDriver.address.street}
                      onChange={(e) =>
                        handleNestedFieldChange(
                          "address",
                          "street",
                          e.target.value
                        )
                      }
                      className="rounded px-2 w-full"
                      placeholder="Street"
                    />
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={editedDriver.address.city}
                        onChange={(e) =>
                          handleNestedFieldChange(
                            "address",
                            "city",
                            e.target.value
                          )
                        }
                        className="rounded px-2 w-1/2"
                        placeholder="City"
                      />
                      <input
                        type="text"
                        value={editedDriver.address.state}
                        onChange={(e) =>
                          handleNestedFieldChange(
                            "address",
                            "state",
                            e.target.value
                          )
                        }
                        className="rounded px-2 w-1/4"
                        placeholder="State"
                      />
                      <input
                        type="text"
                        value={editedDriver.address.zip_code}
                        onChange={(e) =>
                          handleNestedFieldChange(
                            "address",
                            "zip_code",
                            e.target.value
                          )
                        }
                        className="rounded px-2 w-1/4"
                        placeholder="Zip Code"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">
                    {driver.address.street}
                    <br />
                    {driver.address.city}, {driver.address.state}{" "}
                    {driver.address.zip_code}
                  </p>
                )}
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Emergency Contact
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  {isEditing ? (
                    <div className="space-y-1">
                      <input
                        type="text"
                        value={editedDriver.emergency_contact.emergency_contact}
                        onChange={(e) =>
                          handleNestedFieldChange(
                            "emergency_contact",
                            "emergency_contact",
                            e.target.value
                          )
                        }
                        className="rounded px-2 w-full"
                        placeholder="Name"
                      />
                      <input
                        type="text"
                        value={editedDriver.emergency_contact.relationship}
                        onChange={(e) =>
                          handleNestedFieldChange(
                            "emergency_contact",
                            "relationship",
                            e.target.value
                          )
                        }
                        className="rounded px-2 w-full"
                        placeholder="Relationship"
                      />
                      <input
                        type="text"
                        value={editedDriver.emergency_contact.phone}
                        onChange={(e) =>
                          handleNestedFieldChange(
                            "emergency_contact",
                            "phone",
                            e.target.value
                          )
                        }
                        className="rounded px-2 w-full"
                        placeholder="Phone"
                      />
                    </div>
                  ) : (
                    <>
                      <p className="font-medium">
                        {driver.emergency_contact.emergency_contact}
                      </p>
                      <p className="text-sm text-gray-600">
                        {driver.emergency_contact.relationship}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <Phone className="w-4 h-4 mr-1" />
                        {driver.emergency_contact.phone}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* License & Certifications */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Award className="w-6 h-6 mr-2 text-blue-600" />
              License & Certifications
            </h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Driver's License
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {/* License Number */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">License Number</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedDriver.license.number}
                        onChange={(e) =>
                          handleNestedFieldChange(
                            "license",
                            "number",
                            e.target.value
                          )
                        }
                        className="rounded px-2 w-full"
                        placeholder="License Number"
                      />
                    ) : (
                      <p className="font-medium">{driver.license.number}</p>
                    )}
                  </div>
                  {/* License Class */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Class</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedDriver.license.license_class}
                        onChange={(e) =>
                          handleNestedFieldChange(
                            "license",
                            "license_class",
                            e.target.value
                          )
                        }
                        className="rounded px-2 w-full"
                        placeholder="Class"
                      />
                    ) : (
                      <p className="font-medium">
                        {driver.license.license_class}
                      </p>
                    )}
                  </div>
                  {/* License Expiration */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Expires</p>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editedDriver.license.license_expiration}
                        onChange={(e) =>
                          handleNestedFieldChange(
                            "license",
                            "license_expiration",
                            e.target.value
                          )
                        }
                        className="rounded px-2 w-full"
                      />
                    ) : (
                      <p className="font-medium">
                        {formatDate(driver.license.license_expiration)}
                      </p>
                    )}
                  </div>
                  {/* License Status */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Status</p>
                    <div className="flex items-center">
                      {isEditing ? (
                        <select
                          value={
                            editedDriver.license.is_valid ? "valid" : "invalid"
                          }
                          onChange={(e) =>
                            handleNestedFieldChange(
                              "license",
                              "is_valid",
                              e.target.value === "valid"
                            )
                          }
                          className="rounded px-2"
                        >
                          <option value="valid">Valid</option>
                          <option value="invalid">Invalid</option>
                        </select>
                      ) : (
                        <>
                          {driver.license.is_valid ? (
                            <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500 mr-1" />
                          )}
                          <span
                            className={`text-sm font-medium ${driver.license.is_valid ? "text-green-600" : "text-red-600"}`}
                          >
                            {driver.license.is_valid ? "Valid" : "Invalid"}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Certifications
                </h4>
                <div className="space-y-3">
                  {/* HAZMAT Endorsement */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">
                      HAZMAT Endorsement
                    </span>
                    <div className="flex items-center">
                      {isEditing ? (
                        <input
                          type="checkbox"
                          checked={
                            !!editedDriver.certifications.hazmat_endorsement
                          }
                          onChange={(e) =>
                            handleNestedFieldChange(
                              "certifications",
                              "hazmat_endorsement",
                              e.target.checked
                            )
                          }
                        />
                      ) : editedDriver.certifications.hazmat_endorsement ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </div>
                  {/* Last Drug Test */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">
                      Last Drug Test
                    </span>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editedDriver.certifications.drug_test_date}
                        onChange={(e) =>
                          handleNestedFieldChange(
                            "certifications",
                            "drug_test_date",
                            e.target.value
                          )
                        }
                        className="rounded px-2"
                      />
                    ) : (
                      <span className="font-medium">
                        {formatDate(driver.certifications.drug_test_date)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm Delete
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <strong>
                {driver.first_name} {driver.last_name}
              </strong>
              ? This action cannot be undone and will remove all associated
              data.
            </p>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteEntity}
                className="px-4 py-2 bg-red-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-red-700 transition-colors"
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

export default DriversDetails;
