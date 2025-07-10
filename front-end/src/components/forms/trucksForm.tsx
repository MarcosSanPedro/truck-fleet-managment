"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Truck } from "../../types/index"
import { emptyTruck } from "../../lib/data"
import {
  TruckIcon,
  Calendar,
  MapPin,
  User,
  Settings,
  Gauge,
  Fuel,
  Wrench,
  Shield,
  Star,
  CheckCircle,
  AlertCircle,
  X,
  Plus,
  Hash,
  Palette,
  Package,
  Weight,
  Activity,
  DollarSign,
  Clock,
  Navigation,
} from "lucide-react"

interface TruckFormProps {
  truck?: Truck
  onSubmit: (truck: Partial<Truck>) => void
  onCancel: () => void
}

const truckTypeOptions = ["Semi-Truck", "Box Truck", "Flatbed", "Refrigerated", "Tanker", "Other"]

const statusOptions = ["active", "maintenance", "out-of-service", "available"]

export const TruckForm: React.FC<TruckFormProps> = ({ truck, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Omit<Truck, "id">>>({})
  const [featuresInput, setFeaturesInput] = useState("")

  useEffect(() => {
    if (truck) {
      setFormData({ ...truck })
      setFeaturesInput(truck.features?.join(", ") || "")
    } else {
      setFormData(emptyTruck)
    }
  }, [truck])

  // Required fields for a valid truck
  const requiredFields = ["make", "model", "year", "plate"]

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

  // Features as comma-separated string
  const handleFeaturesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeaturesInput(e.target.value)
    setFormData((prev) => ({
      ...prev,
      features: e.target.value
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100 border-green-200"
      case "available":
        return "text-blue-600 bg-blue-100 border-blue-200"
      case "maintenance":
        return "text-yellow-600 bg-yellow-100 border-yellow-200"
      case "out-of-service":
        return "text-red-600 bg-red-100 border-red-200"
      default:
        return "text-gray-600 bg-gray-100 border-gray-200"
    }
  }

  const getConditionColor = (score: number) => {
    if (score >= 8) return "text-green-600 bg-green-100"
    if (score >= 6) return "text-yellow-600 bg-yellow-100"
    if (score >= 4) return "text-orange-600 bg-orange-100"
    return "text-red-600 bg-red-100"
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
                  <TruckIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {truck ? "Edit Truck" : "Add New Truck"}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {truck ? "Update truck information and specifications" : "Register a new vehicle in the fleet"}
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
          {/* Vehicle Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TruckIcon className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Vehicle Information</h2>
              <div className="ml-auto">
                {formData.make && formData.model && formData.year && formData.plate ? (
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="make" className="block text-sm font-semibold text-gray-700">
                  Make <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="make"
                  name="make"
                  value={formData.make || ""}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                  placeholder="e.g. Volvo"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="model" className="block text-sm font-semibold text-gray-700">
                  Model <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={formData.model || ""}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                  placeholder="e.g. FH16"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="year" className="block text-sm font-semibold text-gray-700">
                  Year <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    id="year"
                    name="year"
                    value={formData.year || ""}
                    onChange={handleChange}
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                    placeholder="e.g. 2022"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="plate" className="block text-sm font-semibold text-gray-700">
                  License Plate <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    id="plate"
                    name="plate"
                    value={formData.plate || ""}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                    placeholder="e.g. ABC-1234"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="vin" className="block text-sm font-semibold text-gray-700">
                  VIN Number
                </label>
                <input
                  type="text"
                  id="vin"
                  name="vin"
                  value={formData.vin || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                  placeholder="Vehicle Identification Number"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="color" className="block text-sm font-semibold text-gray-700">
                  Color
                </label>
                <div className="relative">
                  <Palette className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    id="color"
                    name="color"
                    value={formData.color || ""}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                    placeholder="e.g. White"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Assignment & Status */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <User className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Assignment & Status</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="assign_driver" className="block text-sm font-semibold text-gray-700">
                  Assigned Driver
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    id="assign_driver"
                    name="assign_driver"
                    value={formData.assign_driver || ""}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                    placeholder="Driver Name or ID"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="status" className="block text-sm font-semibold text-gray-700">
                  Current Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                >
                  <option value="">Select status</option>
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1).replace("-", " ")}
                    </option>
                  ))}
                </select>
                {formData.status && (
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(formData.status)}`}
                    >
                      {formData.status.charAt(0).toUpperCase() + formData.status.slice(1).replace("-", " ")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Type & Features */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Settings className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Type & Features</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="truck_type" className="block text-sm font-semibold text-gray-700">
                  Truck Type
                </label>
                <select
                  id="truck_type"
                  name="truck_type"
                  value={formData.truck_type || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                >
                  <option value="">Select type</option>
                  {truckTypeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="features" className="block text-sm font-semibold text-gray-700">
                  Features & Equipment
                </label>
                <input
                  type="text"
                  id="features"
                  name="features"
                  value={featuresInput}
                  onChange={handleFeaturesChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                  placeholder="e.g. GPS, Air Conditioning, Liftgate"
                />
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Enter features separated by commas
                </p>
                {formData.features && formData.features.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Capacity & Specifications */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Package className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Capacity & Specifications</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="truckweight" className="block text-sm font-semibold text-gray-700">
                  Weight Capacity (lbs)
                </label>
                <div className="relative">
                  <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    id="truckweight"
                    name="truckweight"
                    value={formData.truckweight ?? ""}
                    onChange={handleChange}
                    min="0"
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                    placeholder="e.g. 20000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="volume" className="block text-sm font-semibold text-gray-700">
                  Volume Capacity (ft³)
                </label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    id="volume"
                    name="volume"
                    value={formData.volume ?? ""}
                    onChange={handleChange}
                    min="0"
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                    placeholder="e.g. 1200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Performance Metrics</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label htmlFor="mileage" className="block text-sm font-semibold text-gray-700">
                  Current Mileage
                </label>
                <div className="relative">
                  <Gauge className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    id="mileage"
                    name="mileage"
                    value={formData.mileage ?? ""}
                    onChange={handleChange}
                    min="0"
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                    placeholder="e.g. 50000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="fuel_level" className="block text-sm font-semibold text-gray-700">
                  Fuel Level (%)
                </label>
                <div className="relative">
                  <Fuel className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    id="fuel_level"
                    name="fuel_level"
                    value={formData.fuel_level ?? ""}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                    placeholder="e.g. 75"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">%</span>
                </div>
                {formData.fuel_level !== undefined && formData.fuel_level !== null && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, Math.max(0, formData.fuel_level))}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="condition_score" className="block text-sm font-semibold text-gray-700">
                  Condition Score (0-10)
                </label>
                <div className="relative">
                  <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    id="condition_score"
                    name="condition_score"
                    value={formData.condition_score ?? ""}
                    onChange={handleChange}
                    min="0"
                    max="10"
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                    placeholder="e.g. 8"
                  />
                </div>
                {formData.condition_score !== undefined && formData.condition_score !== null && (
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getConditionColor(formData.condition_score)}`}
                    >
                      {formData.condition_score >= 8
                        ? "Excellent"
                        : formData.condition_score >= 6
                          ? "Good"
                          : formData.condition_score >= 4
                            ? "Fair"
                            : "Poor"}{" "}
                      Condition
                    </span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="fuel_efficiency" className="block text-sm font-semibold text-gray-700">
                  Fuel Efficiency (MPG)
                </label>
                <div className="relative">
                  <Fuel className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    id="fuel_efficiency"
                    name="fuel_efficiency"
                    value={formData.fuel_efficiency ?? ""}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                    placeholder="e.g. 7.5"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="total_trips" className="block text-sm font-semibold text-gray-700">
                  Total Trips Completed
                </label>
                <div className="relative">
                  <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    id="total_trips"
                    name="total_trips"
                    value={formData.total_trips ?? ""}
                    onChange={handleChange}
                    min="0"
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                    placeholder="e.g. 120"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Compliance & Maintenance */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Wrench className="w-5 h-5 text-yellow-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Compliance & Maintenance</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label htmlFor="last_service_date" className="block text-sm font-semibold text-gray-700">
                  Last Service Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    id="last_service_date"
                    name="last_service_date"
                    value={formData.last_service_date || ""}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="next_service_due" className="block text-sm font-semibold text-gray-700">
                  Next Service Due (miles)
                </label>
                <div className="relative">
                  <Gauge className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    id="next_service_due"
                    name="next_service_due"
                    value={formData.next_service_due ?? ""}
                    onChange={handleChange}
                    min="0"
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                    placeholder="e.g. 60000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="maintenance_cost_ytd" className="block text-sm font-semibold text-gray-700">
                  Maintenance Cost YTD ($)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    id="maintenance_cost_ytd"
                    name="maintenance_cost_ytd"
                    value={formData.maintenance_cost_ytd ?? ""}
                    onChange={handleChange}
                    min="0"
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                    placeholder="e.g. 1200"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="downtime_hours" className="block text-sm font-semibold text-gray-700">
                  Downtime Hours
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    id="downtime_hours"
                    name="downtime_hours"
                    value={formData.downtime_hours ?? ""}
                    onChange={handleChange}
                    min="0"
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                    placeholder="e.g. 10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="insurance_expiry" className="block text-sm font-semibold text-gray-700">
                  Insurance Expiry
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    id="insurance_expiry"
                    name="insurance_expiry"
                    value={formData.insurance_expiry || ""}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="registration_expiry" className="block text-sm font-semibold text-gray-700">
                  Registration Expiry
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    id="registration_expiry"
                    name="registration_expiry"
                    value={formData.registration_expiry || ""}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location & Tracking */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <MapPin className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Location & Tracking</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="current_location" className="block text-sm font-semibold text-gray-700">
                  Current Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    id="current_location"
                    name="current_location"
                    value={formData.current_location || ""}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                    placeholder="e.g. Little Rock, AR"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="last_updated" className="block text-sm font-semibold text-gray-700">
                  Last Updated
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    id="last_updated"
                    name="last_updated"
                    value={formData.last_updated || ""}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
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
                
                <Plus className="w-4 h-4" />
                {truck ? "Update" : "Create"} Truck
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
