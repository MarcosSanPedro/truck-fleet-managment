import {
  createFileRoute,
  Link,
  Navigate,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useState, useCallback } from "react";
import {
  ArrowLeft,
  Edit3,
  Trash2,
  AlertTriangle,
  Phone,
  Mail,
  Calendar,
  Shield,
  User,
  MapPin,
  Truck,
  Award,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Star,
  Route as RouteIcon,
  Zap,
} from "lucide-react";
import { apiService } from "../../services/api";
import type { Driver } from "../../types/index";

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
  const driver = Route.useLoaderData() as Driver | null;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = useCallback(async () => {
    if (!driver) return;
    try {
      console.log("hello")
      await apiService.delete("drivers", driver.id);
      setShowDeleteConfirm(false);
      if (router.history.canGoBack()) {
        router.history.back();
      } else {
        router.navigate({
          to: "/Drivers",
        });
      }
    } catch (error) {
      setError("Failed to delete driver");
    }
  }, [driver]);

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

  if (!driver) return <div>Error: Driver not found</div>;

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
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
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
                <h2 className="text-3xl font-bold text-white">
                  {driver.first_name} {driver.last_name}
                </h2>
                <div className="flex items-center mt-2 space-x-4">
                  <span className="text-blue-100">ID: {driver.id}</span>
                  <span className="text-blue-100">
                    Employee ID: {driver.employment.employee_id}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(driver.employment.status)}`}
                >
                  <Shield className="w-4 h-4 mr-1" />
                  {driver.employment.status.charAt(0).toUpperCase() +
                    driver.employment.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">
                    {driver.phone_number || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{driver.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hire Date</p>
                  <p className="font-medium">{driver.employment.hire_date}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="font-medium">
                    {driver.employment.years_experience} years
                  </p>
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
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div
                    className={`text-3xl font-bold ${getPerformanceColor(driver.performance.safety_rating)}`}
                  >
                    {driver.performance.safety_rating.toFixed(1)}
                  </div>
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

                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-3xl font-bold text-green-600">
                    {driver.performance.on_time_delivery_rate}%
                  </div>
                  <p className="text-sm text-gray-600 mt-2">On-Time Delivery</p>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600">
                    {driver.performance.total_miles_driven.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Total Miles</p>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-3xl font-bold text-purple-600">
                    {driver.performance.accidents_free}
                  </div>
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
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Truck Number</span>
                <span className="font-medium">
                  {driver.current_assignment.truck_number}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Route</span>
                <span className="font-medium">
                  {driver.current_assignment.route}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Status</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(driver.current_assignment.status)}`}
                >
                  {driver.current_assignment.status.charAt(0).toUpperCase() +
                    driver.current_assignment.status.slice(1)}
                </span>
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
                <p className="text-gray-600">
                  {driver.address.street}
                  <br />
                  {driver.address.city}, {driver.address.state}{" "}
                  {driver.address.zipCode}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Emergency Contact
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium">
                    {driver.emergency_contact.contact_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {driver.emergency_contact.relationship}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <Phone className="w-4 h-4 mr-1" />
                    {driver.emergency_contact.phone}
                  </p>
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
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">License Number</p>
                    <p className="font-medium">{driver.license.number}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Class</p>
                    <p className="font-medium">{driver.license.class}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Expires</p>
                    <p className="font-medium">
                      {formatDate(driver.license.expiration_date)}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Status</p>
                    <div className="flex items-center">
                      {driver.license.isValid ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      <span
                        className={`text-sm font-medium ${driver.license.isValid ? "text-green-600" : "text-red-600"}`}
                      >
                        {driver.license.isValid ? "Valid" : "Invalid"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Certifications
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">
                      HAZMAT Endorsement
                    </span>
                    <div className="flex items-center">
                      {driver.certifications.hazmat_endorsement ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">
                      Last Drug Test
                    </span>
                    <span className="font-medium">
                      {formatDate(driver.certifications.drug_test_date)}
                    </span>
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
                  onClick={handleDelete}
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
