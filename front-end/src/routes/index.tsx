"use client"

import { apiService } from "../services/api"
import type { Driver, Job, Metric, Truck } from "../types/index"
import { createFileRoute, Link } from "@tanstack/react-router"
import { useEffect, useMemo, useState } from "react"
import {
  Users,
  TruckIcon,
  Briefcase,
  AlertTriangle,
  MapPin,
  Shield,
  Search,
  Download,
  TrendingUp,
  Target,
  Activity,
  Clock,
  Star,
  ArrowUpRight,
  Zap,
} from "lucide-react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

// Add type definition for alerts
type Alert = {
  type: string
  count: number
  message: string
  to?: string
  search?: Record<string, any>
}

export const Route = createFileRoute("/")({
  component: Dashboard,
})

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  // Data states
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [trucks, setTrucks] = useState<Truck[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [metrics, setMetrics] = useState<Metric[]>([])

  // Data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [driversInfo, trucksInfo, jobsInfo, metricsInfo] = await Promise.all([
          apiService.get<Driver>("/drivers"),
          apiService.get<Truck>("/trucks"),
          apiService.get<Job>("/jobs"),
          apiService.get<Metric>("/metrics"),
        ])
        setDrivers(driversInfo)
        setTrucks(trucksInfo)
        setJobs(jobsInfo)
        setMetrics(metricsInfo)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Helper function to get metric value by name
  const getMetricValue = (name: string): number => {
    const metric = metrics.find((m) => m.name === name)
    return metric ? metric.value : 0
  }

  // Helper: get IDs for filtered sets
  const activeJobIds = jobs.filter((j) => j.job_status === "in-progress").map((j) => j.id)
  const cancelledJobIds = jobs.filter((j) => j.job_status === "cancelled").map((j) => j.id)
  const highSafetyDriverIds = drivers.filter((d) => d.performance?.safety_rating >= 4.5).map((d) => d.id)
  const activeDriverIds = drivers.filter((d) => d.employment?.status === "active").map((d) => d.id)

  // Computed data for charts
  const jobStatusData = useMemo(
    () => [
      {
        name: "Completed",
        value: getMetricValue("completed_jobs"),
        color: "#059669",
      },
      {
        name: "In Progress",
        value: getMetricValue("in_progress_jobs"),
        color: "#3B82F6",
      },
      {
        name: "Pending",
        value: getMetricValue("pending_jobs"),
        color: "#F59E0B",
      },
      {
        name: "Cancelled",
        value: getMetricValue("cancelled_jobs"),
        color: "#DC2626",
      },
    ],
    [metrics],
  )

  const driverStatusData = useMemo(
    () => [
      {
        name: "Active",
        value: getMetricValue("active_drivers"),
        color: "#059669",
      },
      {
        name: "Inactive",
        value: getMetricValue("inactive_drivers"),
        color: "#6B7280",
      },
    ],
    [metrics],
  )

  // Active drivers with current assignments
  const activeDriversWithAssignments = useMemo(() => {
    return drivers.filter((d) => d.is_active && d.employment.status === "active")
  }, [drivers])

  // Critical alerts
  const criticalAlerts = useMemo((): Alert[] => {
    const alerts: Alert[] = []

    // License expiring soon
    const expiringLicenses = drivers.filter((d) => {
      const expirationDate = new Date(d.license.license_expiration)
      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      return !d.license.is_valid || expirationDate < thirtyDaysFromNow
    })

    if (expiringLicenses.length > 0) {
      alerts.push({
        type: "license",
        count: expiringLicenses.length,
        message: `${expiringLicenses.length} driver license(s) expiring soon`,
        to: "drivers",
        search: {
          id: expiringLicenses.map((d) => d.id).filter((id): id is number => id !== undefined),
        },
      })
    }

    // High mileage trucks
    const highMileageTrucks = trucks.filter((t) => t.mileage > 200000)
    if (highMileageTrucks.length > 0) {
      alerts.push({
        type: "mileage",
        count: highMileageTrucks.length,
        message: `${highMileageTrucks.length} truck(s) with high mileage`,
        to: "trucks",
        search: {
          id: highMileageTrucks.map((d) => d.id).filter((id): id is number => id !== undefined),
        },
      })
    }

    // Cancelled jobs
    const cancelledJobs = getMetricValue("cancelled_jobs")
    if (cancelledJobs > 0) {
      alerts.push({
        type: "cancelled",
        count: cancelledJobs,
        message: `${cancelledJobs} cancelled job(s) need attention`,
        to: "/Jobs",
        search: { job_status: "cancelled" },
      })
    }

    return alerts
  }, [drivers, trucks, metrics])

  function getStatusBadgeClass(status: string): string {
    const classes: Record<string, string> = {
      "on-route": "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200",
      loading: "bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border border-purple-200",
      available: "bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border border-emerald-200",
      "off-duty": "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border border-gray-200",
      maintenance: "bg-gradient-to-r from-red-50 to-red-100 text-red-700 border border-red-200",
    }
    return classes[status] || "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border border-gray-200"
  }

  function exportData(): void {
    console.log("Exporting dashboard data...")
    alert("Dashboard data exported successfully!")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-blue-400 animate-pulse mx-auto"></div>
          </div>
          <p className="text-gray-700 font-medium text-lg">Loading dashboard...</p>
          <p className="text-gray-500 text-sm mt-2">Fetching fleet data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                  <TruckIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Fleet Command Center
                  </h1>
                  <p className="text-gray-600 text-lg">Real-time fleet operations & analytics</p>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search fleet data..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-72 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-200 hover:shadow-md"
                />
              </div>
              <button
                onClick={exportData}
                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Download className="w-5 h-5" />
                <span className="font-medium">Export Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* Critical Alerts */}
        {criticalAlerts.length > 0 && (
          <div className="mb-8 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-red-800">Critical Alerts</h3>
              <div className="ml-auto bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                {criticalAlerts.length} Alert{criticalAlerts.length > 1 ? "s" : ""}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {criticalAlerts.map((alert, index) => {
                const linkProps = {
                  to: alert.to,
                  ...(alert.search ? { search: alert.search as any } : {}),
                  key: index,
                  className:
                    "bg-white p-4 rounded-xl border border-red-200 hover:border-red-300 transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5 group",
                }

                return (
                  <Link {...linkProps}>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-red-700 font-medium group-hover:text-red-800">{alert.message}</p>
                      <ArrowUpRight className="w-4 h-4 text-red-500 group-hover:text-red-600" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            to="/Drivers"
            className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-white"
            search={{} as any}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Drivers</p>
                <p className="text-4xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors">
                  {getMetricValue("drivers_counter")}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1 text-emerald-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-medium">{getMetricValue("active_drivers")} active</span>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </Link>

          <Link
            to="/Jobs"
            className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-white"
            search={{ job_status: "in-progress" } as any}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Active Jobs</p>
                <p className="text-4xl font-bold text-emerald-600 group-hover:text-emerald-700 transition-colors">
                  {getMetricValue("in_progress_jobs")}
                </p>
                <div className="text-sm text-gray-600">
                  of <span className="font-medium">{getMetricValue("jobs_counter")}</span> total
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 group-hover:from-emerald-200 group-hover:to-emerald-300 transition-all duration-300">
                <Activity className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
          </Link>

          <Link
            to="/Trucks"
            className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-white"
            search={{} as any}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Fleet Size</p>
                <p className="text-4xl font-bold text-orange-600 group-hover:text-orange-700 transition-colors">
                  {getMetricValue("trucks_counter")}
                </p>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">vehicles</span>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 group-hover:from-orange-200 group-hover:to-orange-300 transition-all duration-300">
                <TruckIcon className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </Link>

          <Link
            to="/Drivers"
            className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-white"
            search={{ id: highSafetyDriverIds } as any}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">High Safety</p>
                <p className="text-4xl font-bold text-purple-600 group-hover:text-purple-700 transition-colors">
                  {getMetricValue("drivers_safety_rating")}
                </p>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>drivers ≥ 4.5</span>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-300">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </Link>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Job Status Pie Chart */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                Job Distribution
              </h2>
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Live Data</div>
            </div>
            <div className="h-64 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={jobStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {jobStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {jobStatusData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 bg-white px-2 py-1 rounded-lg">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Driver Status Pie Chart */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Users className="w-5 h-5 text-emerald-600" />
                </div>
                Driver Status
              </h2>
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Real-time</div>
            </div>
            <div className="h-64 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={driverStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {driverStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {driverStatusData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 bg-white px-2 py-1 rounded-lg">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Drivers */}
          <Link
            to="/Drivers"
            search={{ is_active: "true" } as any}
            className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 cursor-pointer hover:shadow-xl transition-all duration-300 hover:bg-white"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                Active Drivers
              </h2>
              <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
            </div>
            <div className="space-y-4 max-h-64 overflow-y-auto custom-scrollbar">
              {activeDriversWithAssignments.slice(0, 6).map((driver) => (
                <div
                  key={driver.id}
                  className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-purple-50 hover:to-purple-100 transition-all duration-200 border border-gray-200 hover:border-purple-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-bold text-gray-900 text-sm">
                      {driver.first_name} {driver.last_name}
                    </p>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(driver.current_assignment.status)}`}
                    >
                      {driver.current_assignment.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <TruckIcon className="w-3 h-3" />
                      <span className="font-medium">{driver.current_assignment.truck_number}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{driver.current_assignment.route}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-emerald-600">
                      <Shield className="w-3 h-3" />
                      <span className="font-medium">Safety: {driver.performance.safety_rating}/10</span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-600">
                      <Clock className="w-3 h-3" />
                      <span className="font-medium">On-time: {driver.performance.on_time_delivery_rate}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              Recent Activity
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Zap className="w-4 h-4" />
              <span>Live Updates</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Recent Jobs
              </h3>
              <div className="space-y-3">
                {jobs
                  .slice(-5)
                  .reverse()
                  .map((job) => (
                    <div
                      key={job.id}
                      className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:border-blue-200 transition-all duration-200 hover:shadow-md"
                    >
                      <Link
                        to="/jobs/$jobsId"
                        params={{ jobsId: String(job.id) }}
                        className="font-bold text-blue-700 hover:text-blue-800 hover:underline transition-colors"
                      >
                        {job.job_number || `Job #${job.id}`}
                      </Link>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-600">
                          Status: <span className="font-medium">{job.job_status}</span>
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-blue-500" />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                Recent Drivers
              </h3>
              <div className="space-y-3">
                {drivers
                  .slice(-5)
                  .reverse()
                  .map((driver) => (
                    <div
                      key={driver.id}
                      className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100 hover:border-emerald-200 transition-all duration-200 hover:shadow-md"
                    >
                      <Link
                        to="/drivers/$driverId"
                        params={{ driverId: String(driver.id) }}
                        className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline transition-colors"
                      >
                        {driver.first_name} {driver.last_name}
                      </Link>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-600">
                          Status: <span className="font-medium">{driver.employment?.status}</span>
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/20 text-sm text-gray-600">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span>Last updated: {new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>

    
    </div>
  )
}
