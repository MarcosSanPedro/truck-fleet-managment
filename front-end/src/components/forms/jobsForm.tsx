"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Job } from "../../types/index"
import { emptyJob } from "../../lib/data"
import {
  Briefcase,
  Calendar,
  MapPin,
  Truck,
  User,
  Route,
  Star,
  Package,
  Clock,
  DollarSign,
  Weight,
  Navigation,
  Target,
  CheckCircle,
  AlertCircle,
  Save,
  X,
  Plus,
  Flag,
} from "lucide-react"

interface JobFormProps {
  job?: Job
  onSubmit: (job: Partial<Omit<Job, "id">>) => void
  onCancel: () => void
}

const jobTypeOptions = ["delivery", "pickup", "transport", "maintenance", "other"]

const jobStatusOptions = ["pending", "in-progress", "completed", "cancelled"]

const priorityOptions = ["low", "medium", "high", "urgent"]

export const JobForm: React.FC<JobFormProps> = ({ job, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Omit<Job, "id">>>(emptyJob)
  const [specialReqInput, setSpecialReqInput] = useState("")

  useEffect(() => {
    if (job) {
      setFormData({ ...job })
      setSpecialReqInput(job.specialRequirements?.join(", ") || "")
    } else {
      // Reset to empty job template when creating new job
      setFormData(emptyJob)
      setSpecialReqInput("")
    }
  }, [job])

  // Field configuration object - defines which fields are required
  const fieldConfig = {
    job_number: { required: true },
    job_date: { required: true },
    job_type: { required: true },
    job_status: { required: true },
    job_description: { required: true },
    origin: { required: true },
    destination: { required: true },
    // All other fields are optional by default
  } as const

  // Get required fields from configuration
  const requiredFields = Object.entries(fieldConfig)
    .filter(([_, config]) => config.required)
    .map(([field]) => field)

  const isValid = requiredFields.every(
    (field) =>
      formData[field as keyof typeof formData] !== undefined && formData[field as keyof typeof formData] !== "",
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? undefined : Number(value)) : value,
    }))
  }

  // specialRequirements as comma-separated string
  const handleSpecialReqChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpecialReqInput(e.target.value)
    setFormData((prev) => ({
      ...prev,
      specialRequirements: e.target.value
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f.length > 0),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData) // allow partial data
  }

  const completedSections = requiredFields.filter(
    (field) =>
      formData[field as keyof typeof formData] !== undefined && formData[field as keyof typeof formData] !== "",
  ).length

  const progressPercentage = Math.round((completedSections / requiredFields.length) * 100)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-600 bg-red-100"
      case "high":
        return "text-orange-600 bg-orange-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "low":
        return "text-green-600 bg-green-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100"
      case "in-progress":
        return "text-blue-600 bg-blue-100"
      case "pending":
        return "text-yellow-600 bg-yellow-100"
      case "cancelled":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {job ? "Edit Job" : "Create New Job"}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {job ? "Update job information and details" : "Set up a new job assignment"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-2">Form Completion</div>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{progressPercentage}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Job Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Job Information</h2>
              <div className="ml-auto">
                {formData.job_number &&
                formData.job_date &&
                formData.job_type &&
                formData.job_status &&
                formData.job_description ? (
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="job_number" className="block text-sm font-semibold text-gray-700">
                  Job Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="job_number"
                  name="job_number"
                  value={formData.job_number || ""}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                  placeholder="e.g. JOB-2024-001"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="job_date" className="block text-sm font-semibold text-gray-700">
                  Job Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    id="job_date"
                    name="job_date"
                    value={formData.job_date || ""}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="job_type" className="block text-sm font-semibold text-gray-700">
                  Job Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="job_type"
                  name="job_type"
                  value={formData.job_type || ""}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                >
                  <option value="">Select Job Type</option>
                  {jobTypeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="job_status" className="block text-sm font-semibold text-gray-700">
                  Job Status <span className="text-red-500">*</span>
                </label>
                <select
                  id="job_status"
                  name="job_status"
                  value={formData.job_status || ""}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                >
                  <option value="">Select Status</option>
                  {jobStatusOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1).replace("-", " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="priority" className="block text-sm font-semibold text-gray-700">
                  Priority Level
                </label>
                <div className="relative">
                  <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority || ""}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                  >
                    <option value="">Select Priority</option>
                    {priorityOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                {formData.priority && (
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(formData.priority)}`}
                    >
                      {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)} Priority
                    </span>
                  </div>
                )}
              </div>
              <div className="md:col-span-2 space-y-2">
                <label htmlFor="job_description" className="block text-sm font-semibold text-gray-700">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="job_description"
                  name="job_description"
                  value={formData.job_description || ""}
                  onChange={handleChange}
                  rows={4}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50 resize-none"
                  placeholder="Provide detailed description of the job requirements and objectives..."
                />
              </div>
            </div>
          </div>

          {/* Assignment & Route */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Route className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Assignment & Route</h2>
              <div className="ml-auto">
                {formData.origin && formData.destination ? (
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="driver" className="block text-sm font-semibold text-gray-700">
                  Assigned Driver
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    id="driver"
                    name="driver"
                    value={formData.driver || ""}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                    placeholder="Driver Name or ID"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="vehicle" className="block text-sm font-semibold text-gray-700">
                  Assigned Vehicle
                </label>
                <div className="relative">
                  <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    id="vehicle"
                    name="vehicle"
                    value={formData.vehicle || ""}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                    placeholder="Vehicle Name or ID"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="origin" className="block text-sm font-semibold text-gray-700">
                  Origin <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    id="origin"
                    name="origin"
                    value={formData.origin || ""}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                    placeholder="e.g. Little Rock, AR"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="destination" className="block text-sm font-semibold text-gray-700">
                  Destination <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    id="destination"
                    name="destination"
                    value={formData.destination || ""}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                    placeholder="e.g. Dallas, TX"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Special Requirements */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Special Requirements</h2>
            </div>
            <div className="space-y-2">
              <label htmlFor="specialRequirements" className="block text-sm font-semibold text-gray-700">
                Requirements & Certifications
              </label>
              <input
                type="text"
                id="specialRequirements"
                name="specialRequirements"
                value={specialReqInput}
                onChange={handleSpecialReqChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                placeholder="e.g. HAZMAT, Liftgate, Temperature Controlled"
              />
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Enter requirements separated by commas
              </p>
              {formData.specialRequirements && formData.specialRequirements.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.specialRequirements.map((req, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Job Statistics */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Package className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Job Statistics & Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label htmlFor="estimatedValue" className="block text-sm font-semibold text-gray-700">
                  Estimated Value
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    id="estimatedValue"
                    name="estimatedValue"
                    value={formData.estimatedValue || ""}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                    placeholder="e.g. $12,000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="weight" className="block text-sm font-semibold text-gray-700">
                  Cargo Weight
                </label>
                <div className="relative">
                  <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    id="weight"
                    name="weight"
                    value={formData.weight || ""}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                    placeholder="e.g. 18,000 lbs"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="distance" className="block text-sm font-semibold text-gray-700">
                  Total Distance
                </label>
                <div className="relative">
                  <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    id="distance"
                    name="distance"
                    value={formData.distance || ""}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                    placeholder="e.g. 320 mi"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="estimatedDuration" className="block text-sm font-semibold text-gray-700">
                  Estimated Duration
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    id="estimatedDuration"
                    name="estimatedDuration"
                    value={formData.estimatedDuration || ""}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                    placeholder="e.g. 6h 30m"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="progress" className="block text-sm font-semibold text-gray-700">
                  Progress Percentage
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="progress"
                    name="progress"
                    value={formData.progress ?? ""}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                    placeholder="e.g. 65"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">%</span>
                </div>
                {formData.progress !== undefined && formData.progress !== null && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, Math.max(0, formData.progress))}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="nextCheckpoint" className="block text-sm font-semibold text-gray-700">
                  Next Checkpoint
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    id="nextCheckpoint"
                    name="nextCheckpoint"
                    value={formData.nextCheckpoint || ""}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                    placeholder="e.g. Texarkana, AR"
                  />
                </div>
              </div>
              <div className="md:col-span-2 lg:col-span-3 space-y-2">
                <label htmlFor="eta" className="block text-sm font-semibold text-gray-700">
                  Estimated Time of Arrival (ETA)
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    id="eta"
                    name="eta"
                    value={formData.eta || ""}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                    placeholder="e.g. 2024-06-10 02:30 PM"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                className="flex items-center justify-center gap-2 px-6 py-3 border border-blue-300 bg-blue-50 rounded-xl text-sm font-medium text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                <Save className="w-4 h-4" />
                Save as Draft
              </button>
              <button
                type="submit"
                disabled={!isValid}
                className={`flex items-center justify-center gap-2 px-6 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white transition-all duration-200 ${
                  !isValid
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:-translate-y-0.5 hover:shadow-lg"
                }`}
              >
                <Plus className="w-4 h-4" />
                {job ? "Update" : "Create"} Job
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
