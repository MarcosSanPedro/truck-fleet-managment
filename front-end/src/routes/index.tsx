import { apiService } from '../services/api';
import type { Driver, Job, Maintenance, Metric, Truck } from '../types/index';
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react';
import { 
  Users, 
  Truck as TruckIcon, 
  Briefcase, 
  Wrench, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  MapPin,
  Shield,
  Search,
  Filter,
  Download,
  Calendar,
  TrendingUp,
  AlertCircle,
  Eye,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  Target,
  Activity
} from 'lucide-react';

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


export const Route = createFileRoute('/')({
  component: Dashboard,
})

export default function Dashboard () {  
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);


  // Data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // TODO: Replace with your actual API service calls
        const [driversInfo, trucksInfo, jobsInfo, metricsInfo] = await Promise.all([
          apiService.get<Driver>('/drivers'),
          apiService.get<Truck>('/trucks'),
          apiService.get<Job>('/jobs'),
          apiService.get<Metric>('/metrics')
        ]);

        setDrivers(driversInfo);
        setTrucks(trucksInfo);
        setJobs(jobsInfo);
        setMetrics(metricsInfo);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to get metric value by name
  const getMetricValue = (name: string): number => {
    const metric = metrics.find(m => m.name === name);
    return metric ? metric.value : 0;
  };

  // Computed data for charts
  const jobStatusData = useMemo(() => [
    { name: 'Completed', value: getMetricValue('completed_jobs'), color: '#10B981' },
    { name: 'In Progress', value: getMetricValue('in_progress_jobs'), color: '#3B82F6' },
    { name: 'Pending', value: getMetricValue('pending_jobs'), color: '#F59E0B' },
    { name: 'Cancelled', value: getMetricValue('cancelled_jobs'), color: '#EF4444' }
  ], [metrics]);

  const driverStatusData = useMemo(() => [
    { name: 'Active', value: getMetricValue('active_drivers'), color: '#10B981' },
    { name: 'Inactive', value: getMetricValue('inactive_drivers'), color: '#6B7280' }
  ], [metrics]);

  // Active drivers with current assignments
  const activeDriversWithAssignments = useMemo(() => {
    return drivers.filter(d => d.is_active && d.employment.status === 'active');
  }, [drivers]);

  // Critical alerts
  const criticalAlerts = useMemo(() => {
    const alerts = [];
    
    // License expiring soon
    const expiringLicenses = drivers.filter(d => {
      const expirationDate = new Date(d.license.license_expiration);
      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      return !d.license.is_valid || expirationDate < thirtyDaysFromNow;
    });
    
    if (expiringLicenses.length > 0) {
      alerts.push({
        type: 'license',
        count: expiringLicenses.length,
        message: `${expiringLicenses.length} driver license(s) expiring soon`
      });
    }

    // High mileage trucks
    const highMileageTrucks = trucks.filter(t => t.mileage > 100000);
    if (highMileageTrucks.length > 0) {
      alerts.push({
        type: 'mileage',
        count: highMileageTrucks.length,
        message: `${highMileageTrucks.length} truck(s) with high mileage`
      });
    }

    // Cancelled jobs
    const cancelledJobs = getMetricValue('cancelled_jobs');
    if (cancelledJobs > 0) {
      alerts.push({
        type: 'cancelled',
        count: cancelledJobs,
        message: `${cancelledJobs} cancelled job(s) need attention`
      });
    }

    return alerts;
  }, [drivers, trucks, metrics]);

  function getStatusBadgeClass(status: string): string {
    const classes: Record<string, string> = {
      'on-route': 'bg-blue-100 text-blue-800',
      'loading': 'bg-purple-100 text-purple-800',
      'available': 'bg-green-100 text-green-800',
      'off-duty': 'bg-gray-100 text-gray-800',
      'maintenance': 'bg-red-100 text-red-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  function exportData(): void {
    console.log('Exporting dashboard data...');
    alert('Dashboard data exported successfully!');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Fleet Management Dashboard</h1>
              <p className="text-gray-600">Real-time fleet operations overview</p>
            </div>
            
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
              <button 
                onClick={exportData}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Critical Alerts */}
        {criticalAlerts.length > 0 && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-red-800">Critical Alerts</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {criticalAlerts.map((alert, index) => (
                <div key={index} className="bg-white p-3 rounded-lg border border-red-200">
                  <p className="text-sm text-red-700">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Drivers</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{getMetricValue('drivers_counter')}</p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {getMetricValue('active_drivers')} active
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{getMetricValue('in_progress_jobs')}</p>
                <p className="text-xs text-gray-600 mt-1">of {getMetricValue('jobs_counter')} total</p>
              </div>
              <div className="p-3 rounded-lg bg-green-100">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fleet Size</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{getMetricValue('trucks_counter')}</p>
                <p className="text-xs text-gray-600 mt-1">vehicles</p>
              </div>
              <div className="p-3 rounded-lg bg-orange-100">
                <TruckIcon className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Safety</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{getMetricValue('drivers_safety_rating')}</p>
                <p className="text-xs text-gray-600 mt-1">drivers ≥9.5</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-100">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Job Status Pie Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              Job Status
            </h2>

            <div className="h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={jobStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {jobStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2">
              {jobStatusData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Driver Status Pie Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              Driver Status
            </h2>

            <div className="h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={driverStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {driverStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2">
              {driverStatusData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Drivers */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Active Drivers
            </h2>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {activeDriversWithAssignments.map((driver) => (
                <div key={driver.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900 text-sm">{driver.first_name} {driver.last_name}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(driver.current_assignment.status)}`}>
                      {driver.current_assignment.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <TruckIcon className="w-3 h-3" />
                    <span>{driver.current_assignment.truck_number}</span>
                    <MapPin className="w-3 h-3 ml-2" />
                    <span>{driver.current_assignment.route}</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Safety: {driver.performance.safety_rating}/10 • On-time: {driver.performance.on_time_delivery_rate}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fleet Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <TruckIcon className="w-5 h-5 text-orange-600" />
            Fleet Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trucks.map((truck) => (
              <div key={truck.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{truck.make} {truck.model}</h4>
                    <p className="text-sm text-gray-600">{truck.plate} • {truck.year}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">{truck.mileage.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">miles</p>
                    {truck.mileage > 100000 && (
                      <AlertTriangle className="w-4 h-4 text-yellow-500 ml-auto mt-1" />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span>{truck.assign_driver}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Last updated: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};
 

