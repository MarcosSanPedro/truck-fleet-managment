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

  // Helper for status color
  const statusColor = (() => {
    switch (job?.job_status) {
      case "completed": return "green";
      case "in-progress": return "blue";
      case "pending": return "yellow";
      default: return "gray";
    }
  })();

  // Helper for comma-separated specialRequirements
  const specialReqValue = isEditing
    ? (editedEntity?.specialRequirements?.join(", ") || "")
    : (job?.specialRequirements?.join(", ") || "");

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
                {isEditing ? (
                  <input
                    className="text-xl font-bold text-gray-900 bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500"
                    value={editedEntity?.job_number || ''}
                    onChange={e => handleFieldChange('job_number', e.target.value)}
                  />
                ) : (
                  <h1 className="text-xl font-bold text-gray-900">{job.job_number}</h1>
                )}
                <p className="text-sm text-gray-500">
                  {isEditing ? (
                    <input
                      className="bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500 w-24 mr-1"
                      value={editedEntity?.job_type || ''}
                      onChange={e => handleFieldChange('job_type', e.target.value)}
                    />
                  ) : (
                    job.job_type
                  )}
                  {" • "}
                  {isEditing ? (
                    <input
                      className="bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500 w-20"
                      value={editedEntity?.priority || ''}
                      onChange={e => handleFieldChange('priority', e.target.value)}
                    />
                  ) : (
                    job.priority
                  )} Priority
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <button
                    onClick={saveEdit}
                    className="px-4 py-2 text-sm font-medium text-blue-700 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2 inline" />Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={startEdit}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Edit3 className="w-4 h-4 mr-2 inline" />Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-2 inline" />Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <Package className="w-8 h-8" />
                  <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${statusColor}-100 text-${statusColor}-800 border border-${statusColor}-200`}>
                    {isEditing ? (
                      <input
                        className="bg-white text-black border-b border-gray-300 focus:outline-none focus:border-blue-500 px-2 py-1 rounded"
                        value={editedEntity?.job_status || ''}
                        onChange={e => handleFieldChange('job_status', e.target.value)}
                      />
                    ) : (
                      job.job_status.charAt(0).toUpperCase() + job.job_status.slice(1).replace('-', ' ')
                    )}
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-1">
                  {isEditing ? (
                    <input
                      className="bg-white text-black border-b border-gray-300 focus:outline-none focus:border-blue-500 px-2 py-1 rounded w-48"
                      value={editedEntity?.origin || ''}
                      onChange={e => handleFieldChange('origin', e.target.value)}
                    />
                  ) : (
                    job.origin
                  )}
                </h2>
                <div className="flex items-center text-blue-100">
                  <RouteIcon className="w-4 h-4 mr-2" />
                  {isEditing ? (
                    <input
                      className="bg-white text-black border-b border-gray-300 focus:outline-none focus:border-blue-500 px-2 py-1 rounded w-48"
                      value={editedEntity?.destination || ''}
                      onChange={e => handleFieldChange('destination', e.target.value)}
                    />
                  ) : (
                    job.destination
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">
                  {isEditing ? (
                    <input
                      className="bg-white text-black border-b border-gray-300 focus:outline-none focus:border-blue-500 px-2 py-1 rounded w-32 text-right"
                      value={editedEntity?.estimatedValue || ''}
                      onChange={e => handleFieldChange('estimatedValue', e.target.value)}
                    />
                  ) : (
                    job.estimatedValue
                  )}
                </div>
                <div className="text-blue-100">
                  {isEditing ? (
                    <input
                      className="bg-white text-black border-b border-gray-300 focus:outline-none focus:border-blue-500 px-2 py-1 rounded w-24 text-right"
                      value={editedEntity?.distance || ''}
                      onChange={e => handleFieldChange('distance', e.target.value)}
                    />
                  ) : (
                    job.distance
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Progress Bar for In-Progress Jobs */}
          {job.job_status === 'in-progress' && (
            <div className="px-8 py-4 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm text-gray-500">{isEditing ? (
                  <input
                    className="w-16 bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500 text-center"
                    type="number"
                    value={editedEntity?.progress ?? ''}
                    onChange={e => handleFieldChange('progress', Number(e.target.value))}
                  />
                ) : (
                  job.progress
                )}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${isEditing ? editedEntity?.progress ?? job.progress : job.progress}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                <span>Next: {isEditing ? (
                  <input
                    className="w-32 bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500"
                    value={editedEntity?.nextCheckpoint || ''}
                    onChange={e => handleFieldChange('nextCheckpoint', e.target.value)}
                  />
                ) : (
                  job.nextCheckpoint
                )}</span>
                <span>ETA: {isEditing ? (
                  <input
                    className="w-24 bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500"
                    value={editedEntity?.eta || ''}
                    onChange={e => handleFieldChange('eta', e.target.value)}
                  />
                ) : (
                  job.eta
                )}</span>
              </div>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Description & Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="text-sm text-gray-500">Job Number</span>
                  <div className="font-medium text-gray-900 mt-1">{isEditing ? <input className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500" value={editedEntity?.job_number || ''} onChange={e => handleFieldChange('job_number', e.target.value)} /> : job.job_number}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Job Date</span>
                  <div className="font-medium text-gray-900 mt-1">{isEditing ? <input className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500" type="date" value={editedEntity?.job_date || ''} onChange={e => handleFieldChange('job_date', e.target.value)} /> : job.job_date}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Job Type</span>
                  <div className="font-medium text-gray-900 mt-1">{isEditing ? <input className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500" value={editedEntity?.job_type || ''} onChange={e => handleFieldChange('job_type', e.target.value)} /> : job.job_type}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Priority</span>
                  <div className="font-medium text-gray-900 mt-1">{isEditing ? <input className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500" value={editedEntity?.priority || ''} onChange={e => handleFieldChange('priority', e.target.value)} /> : job.priority}</div>
                </div>
                <div className="md:col-span-2">
                  <span className="text-sm text-gray-500">Description</span>
                  <div className="font-medium text-gray-900 mt-1">{isEditing ? <textarea className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500" value={editedEntity?.job_description || ''} onChange={e => handleFieldChange('job_description', e.target.value)} /> : job.job_description}</div>
                </div>
              </div>
              {/* Special Requirements */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Special Requirements</h4>
                <div className="flex flex-wrap gap-2">
                  {isEditing ? (
                    <input
                      className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500"
                      value={specialReqValue}
                      onChange={e => handleFieldChange('specialRequirements', e.target.value.split(',').map(f => f.trim()))}
                    />
                  ) : (
                    job.specialRequirements.map((req, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">{req}</span>
                    ))
                  )}
                </div>
              </div>
            </div>
            {/* Assignment & Route */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment & Route</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="text-sm text-gray-500">Driver</span>
                  <div className="font-medium text-gray-900 mt-1">{isEditing ? <input className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500" value={editedEntity?.driver || ''} onChange={e => handleFieldChange('driver', e.target.value)} /> : job.driver}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Vehicle</span>
                  <div className="font-medium text-gray-900 mt-1">{isEditing ? <input className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500" value={editedEntity?.vehicle || ''} onChange={e => handleFieldChange('vehicle', e.target.value)} /> : job.vehicle}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Origin</span>
                  <div className="font-medium text-gray-900 mt-1">{isEditing ? <input className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500" value={editedEntity?.origin || ''} onChange={e => handleFieldChange('origin', e.target.value)} /> : job.origin}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Destination</span>
                  <div className="font-medium text-gray-900 mt-1">{isEditing ? <input className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500" value={editedEntity?.destination || ''} onChange={e => handleFieldChange('destination', e.target.value)} /> : job.destination}</div>
                </div>
              </div>
            </div>
            {/* Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Stats</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="text-sm text-gray-500">Estimated Value</span>
                  <div className="font-medium text-gray-900 mt-1">{isEditing ? <input className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500" value={editedEntity?.estimatedValue || ''} onChange={e => handleFieldChange('estimatedValue', e.target.value)} /> : job.estimatedValue}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Weight</span>
                  <div className="font-medium text-gray-900 mt-1">{isEditing ? <input className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500" value={editedEntity?.weight || ''} onChange={e => handleFieldChange('weight', e.target.value)} /> : job.weight}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Distance</span>
                  <div className="font-medium text-gray-900 mt-1">{isEditing ? <input className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500" value={editedEntity?.distance || ''} onChange={e => handleFieldChange('distance', e.target.value)} /> : job.distance}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Estimated Duration</span>
                  <div className="font-medium text-gray-900 mt-1">{isEditing ? <input className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500" value={editedEntity?.estimatedDuration || ''} onChange={e => handleFieldChange('estimatedDuration', e.target.value)} /> : job.estimatedDuration}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Progress (%)</span>
                  <div className="font-medium text-gray-900 mt-1">{isEditing ? <input className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500" type="number" value={editedEntity?.progress ?? ''} onChange={e => handleFieldChange('progress', Number(e.target.value))} /> : job.progress}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Next Checkpoint</span>
                  <div className="font-medium text-gray-900 mt-1">{isEditing ? <input className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500" value={editedEntity?.nextCheckpoint || ''} onChange={e => handleFieldChange('nextCheckpoint', e.target.value)} /> : job.nextCheckpoint}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">ETA</span>
                  <div className="font-medium text-gray-900 mt-1">{isEditing ? <input className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500" value={editedEntity?.eta || ''} onChange={e => handleFieldChange('eta', e.target.value)} /> : job.eta}</div>
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
                  <span className="text-sm font-medium text-gray-900">
                    {isEditing ? (
                      <input
                        className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500"
                        type="date"
                        value={editedEntity?.job_date || ''}
                        onChange={e => handleFieldChange('job_date', e.target.value)}
                      />
                    ) : (
                      job.job_date
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Duration</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {isEditing ? (
                      <input
                        className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500"
                        value={editedEntity?.estimatedDuration || ''}
                        onChange={e => handleFieldChange('estimatedDuration', e.target.value)}
                      />
                    ) : (
                      job.estimatedDuration
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Weight className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Weight</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {isEditing ? (
                      <input
                        className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500"
                        value={editedEntity?.weight || ''}
                        onChange={e => handleFieldChange('weight', e.target.value)}
                      />
                    ) : (
                      job.weight
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Thermometer className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Priority</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {isEditing ? (
                      <input
                        className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500"
                        value={editedEntity?.priority || ''}
                        onChange={e => handleFieldChange('priority', e.target.value)}
                      />
                    ) : (
                      job.priority
                    )}
                  </span>
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
                    {isEditing ? (
                      <input
                        className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500"
                        value={editedEntity?.driver || ''}
                        onChange={e => handleFieldChange('driver', e.target.value)}
                      />
                    ) : (
                      <div className="font-medium text-gray-900">{job.driver}</div>
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex items-center mb-2">
                    <Package className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-gray-900">Vehicle</span>
                  </div>
                  <div className="ml-6">
                    {isEditing ? (
                      <input
                        className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500"
                        value={editedEntity?.vehicle || ''}
                        onChange={e => handleFieldChange('vehicle', e.target.value)}
                      />
                    ) : (
                      <div className="font-medium text-gray-900">{job.vehicle}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Route */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Route</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5"></div>
                  <div>
                    <div className="font-medium text-gray-900">Origin</div>
                    <div className="text-sm text-gray-600">
                      {isEditing ? (
                        <input
                          className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500"
                          value={editedEntity?.origin || ''}
                          onChange={e => handleFieldChange('origin', e.target.value)}
                        />
                      ) : (
                        job.origin
                      )}
                    </div>
                  </div>
                </div>
                <div className="ml-1.5 border-l-2 border-dashed border-gray-300 h-6"></div>
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full mt-1.5"></div>
                  <div>
                    <div className="font-medium text-gray-900">Destination</div>
                    <div className="text-sm text-gray-600">
                      {isEditing ? (
                        <input
                          className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500"
                          value={editedEntity?.destination || ''}
                          onChange={e => handleFieldChange('destination', e.target.value)}
                        />
                      ) : (
                        job.destination
                      )}
                    </div>
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