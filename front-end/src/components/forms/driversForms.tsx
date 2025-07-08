"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Driver } from "../../types/index"
import { emptyDriver } from "../../lib/data"
import { isEmailOrNot } from "../../lib/data-constructor/isEmail"
import { isPhoneNumberOrNot } from "../../lib/data-constructor/isPhone"
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Briefcase,
  TrendingUp,
  Truck,
  Award,
  AlertCircle,
  CheckCircle,
  Save,
  X,
  Plus,
} from "lucide-react"

interface DriverFormProps {
  driver?: Driver
  onSubmit: (driver: Partial<Omit<Driver, "id">>) => void
  onCancel: () => void
}

export const DriverForm: React.FC<DriverFormProps> = ({ driver, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Omit<Driver, "id">>>({})
  const [emailError, setEmailError] = useState<string | null>(null)
  const [phoneError, setPhoneError] = useState<string | null>(null)

  useEffect(() => {
    if (driver) {
      setFormData({ ...emptyDriver, ...driver })
    } else {
      setFormData(emptyDriver)
    }
  }, [driver])

  // Required fields for a valid driver
  const requiredFields = [
    "first_name",
    "last_name",
    "email",
    "phone_number",
    "license.number",
    "license.license_class",
    "license.license_expiration",
  ]

  const isValid = requiredFields.every((field) => {
    if (field.startsWith("license.")) {
      const key = field.split(".")[1]
      return (
        formData.license &&
        formData.license[key as keyof typeof formData.license] !== undefined &&
        formData.license[key as keyof typeof formData.license] !== ""
      )
    }
    return formData[field as keyof typeof formData] !== undefined && formData[field as keyof typeof formData] !== ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked, dataset } = e.target as HTMLInputElement
    const section = dataset.section

    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...((prev[section as keyof typeof prev] as Record<string, any>) || {}),
          [name]: type === "checkbox" ? checked : value,
        },
      }))
      // Validate phone if in address section
      if (section === "address" && name === "phone") {
        setPhoneError(value && !isPhoneNumberOrNot(value) ? "Invalid phone number" : null)
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }))
      if (name === "email") {
        setEmailError(value && !isEmailOrNot(value) ? "Invalid email address" : null)
      }
      if (name === "phone_number") {
        setPhoneError(value && !isPhoneNumberOrNot(value) ? "Invalid phone number" : null)
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData) // allow partial data
  }

  const completedSections = requiredFields.filter((field) => {
    if (field.startsWith("license.")) {
      const key = field.split(".")[1]
      return (
        formData.license &&
        formData.license[key as keyof typeof formData.license] !== undefined &&
        formData.license[key as keyof typeof formData.license] !== ""
      )
    }
    return formData[field as keyof typeof formData] !== undefined && formData[field as keyof typeof formData] !== ""
  }).length

  const progressPercentage = Math.round((completedSections / requiredFields.length) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {driver ? "Edit Driver" : "Add New Driver"}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {driver ? "Update driver information" : "Create a new driver profile"}
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
          {/* Personal Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
              <div className="ml-auto">
                {formData.first_name && formData.last_name ? (
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="first_name" className="block text-sm font-semibold text-gray-700">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name || ""}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                  placeholder="e.g. John"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="last_name" className="block text-sm font-semibold text-gray-700">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name || ""}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                  placeholder="e.g. Doe"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Mail className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
              <div className="ml-auto">
                {formData.email && formData.phone_number && !emailError && !phoneError ? (
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    required
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50 ${
                      emailError ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-blue-500"
                    }`}
                    placeholder="e.g. john.doe@email.com"
                  />
                </div>
                {emailError && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {emailError}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="phone_number" className="block text-sm font-semibold text-gray-700">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number || ""}
                    onChange={handleChange}
                    required
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50 ${
                      phoneError ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-blue-500"
                    }`}
                    placeholder="e.g. (555) 123-4567"
                  />
                </div>
                {phoneError && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {phoneError}
                  </div>
                )}
              </div>
            </div>

            {/* Address Section */}
            {formData.address && (
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Address</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="street" className="block text-sm font-semibold text-gray-700">
                      Street Address
                    </label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      value={formData.address.street || ""}
                      onChange={handleChange}
                      data-section="address"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                      placeholder="e.g. 123 Main St"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="city" className="block text-sm font-semibold text-gray-700">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.address.city || ""}
                      onChange={handleChange}
                      data-section="address"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                      placeholder="e.g. Little Rock"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="state" className="block text-sm font-semibold text-gray-700">
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.address.state || ""}
                      onChange={handleChange}
                      data-section="address"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                      placeholder="e.g. AR"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="zip_code" className="block text-sm font-semibold text-gray-700">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      id="zip_code"
                      name="zip_code"
                      value={formData.address.zip_code || ""}
                      onChange={handleChange}
                      data-section="address"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                      placeholder="e.g. 72201"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* License Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CreditCard className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">License Information</h2>
              <div className="ml-auto">
                {formData.license?.number && formData.license?.license_class && formData.license?.license_expiration ? (
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="space-y-2">
                <label htmlFor="number" className="block text-sm font-semibold text-gray-700">
                  License Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="number"
                  name="number"
                  value={formData.license?.number || ""}
                  onChange={handleChange}
                  data-section="license"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                  placeholder="e.g. D1234567"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="license_class" className="block text-sm font-semibold text-gray-700">
                  License Class <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="license_class"
                  name="license_class"
                  value={formData.license?.license_class || ""}
                  onChange={handleChange}
                  data-section="license"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                  placeholder="e.g. A"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="license_expiration" className="block text-sm font-semibold text-gray-700">
                  Expiration Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="license_expiration"
                  name="license_expiration"
                  value={formData.license?.license_expiration || ""}
                  onChange={handleChange}
                  data-section="license"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <input
                type="checkbox"
                id="is_valid"
                name="is_valid"
                checked={formData.license?.is_valid || false}
                onChange={handleChange}
                data-section="license"
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="is_valid" className="text-sm font-medium text-gray-700">
                License is currently valid
              </label>
            </div>
          </div>

          {/* Employment Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Briefcase className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Employment Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="hire_date" className="block text-sm font-semibold text-gray-700">
                  Hire Date
                </label>
                <input
                  type="date"
                  id="hire_date"
                  name="hire_date"
                  value={formData.employment?.hire_date || ""}
                  onChange={handleChange}
                  data-section="employment"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="years_experience" className="block text-sm font-semibold text-gray-700">
                  Years of Experience
                </label>
                <input
                  type="number"
                  id="years_experience"
                  name="years_experience"
                  value={formData.employment?.years_experience ?? ""}
                  onChange={handleChange}
                  data-section="employment"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                  placeholder="e.g. 8"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="status" className="block text-sm font-semibold text-gray-700">
                  Employment Status
                </label>
                <input
                  type="text"
                  id="status"
                  name="status"
                  value={formData.employment?.status || ""}
                  onChange={handleChange}
                  data-section="employment"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                  placeholder="e.g. active"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="employee_id" className="block text-sm font-semibold text-gray-700">
                  Employee ID
                </label>
                <input
                  type="text"
                  id="employee_id"
                  name="employee_id"
                  value={formData.employment?.employee_id || ""}
                  onChange={handleChange}
                  data-section="employment"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                  placeholder="e.g. EMP123"
                />
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Performance Metrics</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="safety_rating" className="block text-sm font-semibold text-gray-700">
                  Safety Rating (0-10)
                </label>
                <input
                  type="number"
                  id="safety_rating"
                  name="safety_rating"
                  value={formData.performance?.safety_rating ?? ""}
                  onChange={handleChange}
                  data-section="performance"
                  min="0"
                  max="10"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                  placeholder="e.g. 9"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="on_time_delivery_rate" className="block text-sm font-semibold text-gray-700">
                  On-Time Delivery Rate (%)
                </label>
                <input
                  type="number"
                  id="on_time_delivery_rate"
                  name="on_time_delivery_rate"
                  value={formData.performance?.on_time_delivery_rate ?? ""}
                  onChange={handleChange}
                  data-section="performance"
                  min="0"
                  max="100"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                  placeholder="e.g. 98"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="total_miles_driven" className="block text-sm font-semibold text-gray-700">
                  Total Miles Driven
                </label>
                <input
                  type="number"
                  id="total_miles_driven"
                  name="total_miles_driven"
                  value={formData.performance?.total_miles_driven ?? ""}
                  onChange={handleChange}
                  data-section="performance"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                  placeholder="e.g. 120000"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="accidents_free" className="block text-sm font-semibold text-gray-700">
                  Accident-Free Years
                </label>
                <input
                  type="number"
                  id="accidents_free"
                  name="accidents_free"
                  value={formData.performance?.accidents_free ?? ""}
                  onChange={handleChange}
                  data-section="performance"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                  placeholder="e.g. 5"
                />
              </div>
            </div>
          </div>

          {/* Current Assignment */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Truck className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Current Assignment</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label htmlFor="truck_number" className="block text-sm font-semibold text-gray-700">
                  Truck Number
                </label>
                <input
                  type="text"
                  id="truck_number"
                  name="truck_number"
                  value={formData.current_assignment?.truck_number || ""}
                  onChange={handleChange}
                  data-section="current_assignment"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                  placeholder="e.g. TRK-001"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="route" className="block text-sm font-semibold text-gray-700">
                  Route
                </label>
                <input
                  type="text"
                  id="route"
                  name="route"
                  value={formData.current_assignment?.route || ""}
                  onChange={handleChange}
                  data-section="current_assignment"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                  placeholder="e.g. Route 66"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="assignment_status" className="block text-sm font-semibold text-gray-700">
                  Assignment Status
                </label>
                <input
                  type="text"
                  id="assignment_status"
                  name="status"
                  value={formData.current_assignment?.status || ""}
                  onChange={handleChange}
                  data-section="current_assignment"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                  placeholder="e.g. on-route"
                />
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Award className="w-5 h-5 text-yellow-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Certifications</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  id="hazmat_endorsement"
                  name="hazmat_endorsement"
                  checked={formData.certifications?.hazmat_endorsement || false}
                  onChange={handleChange}
                  data-section="certifications"
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="hazmat_endorsement" className="text-sm font-medium text-gray-700">
                  Hazmat Endorsement
                </label>
              </div>
              <div className="space-y-2">
                <label htmlFor="drug_test_date" className="block text-sm font-semibold text-gray-700">
                  Last Drug Test Date
                </label>
                <input
                  type="date"
                  id="drug_test_date"
                  name="drug_test_date"
                  value={formData.certifications?.drug_test_date || ""}
                  onChange={handleChange}
                  data-section="certifications"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Emergency Contact</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label htmlFor="emergency_contact" className="block text-sm font-semibold text-gray-700">
                  Contact Name
                </label>
                <input
                  type="text"
                  id="emergency_contact"
                  name="emergency_contact"
                  value={formData.emergency_contact?.emergency_contact || ""}
                  onChange={handleChange}
                  data-section="emergency_contact"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                  placeholder="e.g. Jane Doe"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="relationship" className="block text-sm font-semibold text-gray-700">
                  Relationship
                </label>
                <input
                  type="text"
                  id="relationship"
                  name="relationship"
                  value={formData.emergency_contact?.relationship || ""}
                  onChange={handleChange}
                  data-section="emergency_contact"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                  placeholder="e.g. Spouse"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="emergency_phone" className="block text-sm font-semibold text-gray-700">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    id="emergency_phone"
                    name="phone"
                    value={formData.emergency_contact?.phone || ""}
                    onChange={handleChange}
                    data-section="emergency_contact"
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white/50"
                    placeholder="e.g. (555) 987-6543"
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
                disabled={!isValid || !!emailError || !!phoneError}
                className={`flex items-center justify-center gap-2 px-6 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white transition-all duration-200 ${
                  !isValid || !!emailError || !!phoneError
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:-translate-y-0.5 hover:shadow-lg"
                }`}
              >
                <Plus className="w-4 h-4" />
                {driver ? "Update" : "Create"} Driver
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
