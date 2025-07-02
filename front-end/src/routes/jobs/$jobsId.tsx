import { ArrowLeft, Edit3, Trash2, Package, Route as RouteIcon, CheckCircle2, Play, Calendar, Clock, Weight, Thermometer, Shield, Truck, MessageSquare, MapPin, AlertCircle, Phone } from "lucide-react";
import useEntityDetails from "../../lib/useEntityDetails";
import { apiService } from "../../services/api";
import type { Job } from "../../types/index";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

export const Route = createFileRoute("/jobs/$jobsId")({
  component: JobsDetails,
  loader: async ({ params }) => {
    try {
      const job = await apiService.getById<Job>("jobs", Number(params.jobsId));
      if (!job) throw new Error("Job not found");
      return job;
    } catch (err) {
      throw new Error(`Job not found: ${err}`);
    }
  },
});

function JobsDetails() {
  const loaderJob = Route.useLoaderData() as Job | null;
  const {
    entity: job,
    editedEntity,
    isEditing,
    error,
    showDeleteConfirm,
    setShowDeleteConfirm,
    startEdit,
    cancelEdit,
    saveEdit,
    deleteEntity,
    handleFieldChange,
  } = useEntityDetails<Job>("jobs", loaderJob);

  // --- MOCK/DERIVED DATA (replace with real logic as needed) ---
  const enhancedJobData = useMemo(() => ({
    priority: "High",
    origin: "Little Rock, AR",
    destination: "Dallas, TX",
    estimatedValue: "$12,000",
    distance: "320 mi",
    estimatedDuration: "6h 30m",
    weight: "18,000 lbs",
    temperature: "Refrigerated",
    driver: "John Doe",
    vehicle: "Freightliner Cascadia",
    specialRequirements: ["HAZMAT", "Liftgate"],
    progress: 65,
    nextCheckpoint: "Texarkana, AR",
  }), []);

  const statusColor = useMemo(() => {
    switch (job?.job_status) {
      case "completed": return "green";
      case "in-progress": return "blue";
      case "pending": return "yellow";
      default: return "gray";
    }
  }, [job?.job_status]);

  // Date/time formatting helpers
  const jobDateTime = useMemo(() => ({
    date: job?.job_date || "N/A",
    weekday: "Mon", // Replace with real logic
    time: "08:00 AM", // Replace with real logic
  }), [job]);
  const etaDateTime = useMemo(() => ({
    date: "2024-06-10", // Replace with real logic
    time: "02:30 PM", // Replace with real logic
  }), []);

  if (!job) return <div>Job not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Floating Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{job.job_number}</h1>
                <p className="text-sm text-gray-500">{job.job_type} • {enhancedJobData.priority} Priority</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={startEdit}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Edit3 className="w-4 h-4 mr-2 inline" />
                Edit
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2 inline" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <Package className="w-8 h-8" />
                  <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${statusColor}-100 text-${statusColor}-800 border border-${statusColor}-200`}>
                    {job.job_status.charAt(0).toUpperCase() + job.job_status.slice(1).replace('-', ' ')}
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-1">{enhancedJobData.origin}</h2>
                <div className="flex items-center text-blue-100">
                  <RouteIcon className="w-4 h-4 mr-2" />
                  <span>{enhancedJobData.destination}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{enhancedJobData.estimatedValue}</div>
                <div className="text-blue-100">{enhancedJobData.distance}</div>
              </div>
            </div>
          </div>
          {/* Progress Bar for In-Progress Jobs */}
          {job.job_status === 'in-progress' && (
            <div className="px-8 py-4 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm text-gray-500">{enhancedJobData.progress}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${enhancedJobData.progress}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                <span>Next: {enhancedJobData.nextCheckpoint}</span>
                <span>ETA: {etaDateTime.time}</span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h3>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium">Job Number</label>
                    <input
                      className="border rounded px-2 py-1 w-full"
                      value={editedEntity?.job_number || ''}
                      onChange={e => handleFieldChange("job_number", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Job Date</label>
                    <input
                      className="border rounded px-2 py-1 w-full"
                      type="date"
                      value={editedEntity?.job_date || ''}
                      onChange={e => handleFieldChange("job_date", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Job Type</label>
                    <input
                      className="border rounded px-2 py-1 w-full"
                      value={editedEntity?.job_type || ''}
                      onChange={e => handleFieldChange("job_type", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Description</label>
                    <textarea
                      className="border rounded px-2 py-1 w-full"
                      value={editedEntity?.job_description || ''}
                      onChange={e => handleFieldChange("job_description", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Status</label>
                    <input
                      className="border rounded px-2 py-1 w-full"
                      value={editedEntity?.job_status || ''}
                      onChange={e => handleFieldChange("job_status", e.target.value)}
                    />
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={saveEdit}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-700 leading-relaxed">{job.job_description}</p>
              )}
              {enhancedJobData.specialRequirements.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Special Requirements</h4>
                  <div className="flex flex-wrap gap-2">
                    {enhancedJobData.specialRequirements.map((req, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800"
                      >
                        <Shield className="w-3 h-3 mr-1" />
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Timeline & Status</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Job Created</h4>
                      <span className="text-sm text-gray-500">{jobDateTime.date}</span>
                    </div>
                    <p className="text-sm text-gray-600">{jobDateTime.weekday} at {jobDateTime.time}</p>
                  </div>
                </div>
                {job.job_status === 'in-progress' && (
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Play className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">In Transit</h4>
                        <span className="text-sm text-gray-500">Current</span>
                      </div>
                      <p className="text-sm text-gray-600">Driver en route to destination</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 w-10 h-10 ${job.job_status === 'completed' ? 'bg-green-100' : 'bg-gray-100'} rounded-full flex items-center justify-center`}>
                    <CheckCircle2 className={`w-5 h-5 ${job.job_status === 'completed' ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-medium ${job.job_status === 'completed' ? 'text-gray-900' : 'text-gray-500'}`}>
                        Delivery Complete
                      </h4>
                      <span className="text-sm text-gray-500">
                        {job.job_status === 'completed' ? etaDateTime.date : 'Pending'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {job.job_status === 'completed' ? 'Successfully delivered' : 'Awaiting completion'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Scheduled</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{jobDateTime.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Duration</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{enhancedJobData.estimatedDuration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Weight className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Weight</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{enhancedJobData.weight}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Thermometer className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Temperature</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{enhancedJobData.temperature}</span>
                </div>
              </div>
            </div>
            {/* Assignment */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center mb-2">
                    <Truck className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-gray-900">Driver</span>
                  </div>
                  <div className="ml-6">
                    <div className="font-medium text-gray-900">{enhancedJobData.driver}</div>
                    <div className="text-sm text-gray-500">CDL Class A • 8 years exp.</div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center mb-2">
                    <Package className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-gray-900">Vehicle</span>
                  </div>
                  <div className="ml-6">
                    <div className="font-medium text-gray-900">{enhancedJobData.vehicle}</div>
                    <div className="text-sm text-gray-500">Refrigerated Truck</div>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <button className="flex-1 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <Phone className="w-4 h-4 mr-1 inline" />
                    Call Driver
                  </button>
                  <button className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <MessageSquare className="w-4 h-4 mr-1 inline" />
                    Message
                  </button>
                </div>
              </div>
            </div>
            {/* Location */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Route</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5"></div>
                  <div>
                    <div className="font-medium text-gray-900">Origin</div>
                    <div className="text-sm text-gray-600">{enhancedJobData.origin}</div>
                  </div>
                </div>
                <div className="ml-1.5 border-l-2 border-dashed border-gray-300 h-6"></div>
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full mt-1.5"></div>
                  <div>
                    <div className="font-medium text-gray-900">Destination</div>
                    <div className="text-sm text-gray-600">{enhancedJobData.destination}</div>
                  </div>
                </div>
              </div>
              <button className="w-full mt-4 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <MapPin className="w-4 h-4 mr-2 inline" />
                View on Map
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Job</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{job.job_number}</strong>? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteEntity}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Job
              </button>
            </div>
          </div>
        </div>
      )}
      {error && !showDeleteConfirm && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg max-w-xl mx-auto">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}