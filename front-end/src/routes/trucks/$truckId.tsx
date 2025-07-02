import { createFileRoute } from '@tanstack/react-router';
import { apiService } from '../../services/api';
import type { Truck } from '../../types/index';
import useEntityDetails from '../../lib/useEntityDetails';
import {
  ArrowLeft,
  Edit3,
  Trash2,
  AlertTriangle,
  Truck as TruckIcon,
  Fuel,
  MapPin,
  Calendar,
  Settings,
  Shield,
  FileText,
  Activity,
  Gauge,
  Wrench,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Phone,
  MessageSquare,
  Navigation,
  Thermometer,
  Weight,
  Package
} from 'lucide-react';

export const Route = createFileRoute('/trucks/$truckId')({
  component: TruckDetail,
  loader: async ({ params }) => {
    try {
      const truck = await apiService.getById<Truck>('trucks', Number(params.truckId));
      if (!truck) throw new Error('Truck not found');
      return truck;
    } catch (err) {
      throw new Error(`Truck not found: ${err}`);
    }
  },
});

function TruckDetail() {
  const loaderTruck = Route.useLoaderData() as Truck | null;
  const {
    entity: truck,
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
  } = useEntityDetails<Truck>('trucks', loaderTruck);

  const getStatusColor = (status: string) => {
    switch ((status || '').toLowerCase()) {
      case 'active': return 'emerald';
      case 'available': return 'blue';
      case 'maintenance': return 'amber';
      case 'out-of-service': return 'red';
      default: return 'gray';
    }
  };
  const statusColor = getStatusColor(truck?.status || 'active');

  const getFuelLevelColor = (level: number) => {
    if (level >= 50) return 'text-green-600 bg-green-100';
    if (level >= 25) return 'text-amber-600 bg-amber-100';
    return 'text-red-600 bg-red-100';
  };
  const getConditionColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-amber-600';
    return 'text-red-600';
  };
  const isServiceDue = () => {
    return (truck?.mileage ?? 0) >= (truck?.next_service_due ?? 0);
  };
  const isInsuranceExpiring = () => {
    const expiryDate = new Date(truck?.insurance_expiry ?? '');
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiryDate <= thirtyDaysFromNow;
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (!truck) return <div>Error: Truck not found</div>;

  // Helper for select options
  const truckTypeOptions = [
    'Semi-Truck', 'Box Truck', 'Flatbed', 'Refrigerated', 'Tanker'
  ];
  const statusOptions = [
    'active', 'maintenance', 'out-of-service', 'available'
  ];

  // View mode: show advanced UI, but fields are editable inline when isEditing is true
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
                    value={editedEntity?.plate || ''}
                    onChange={e => handleFieldChange('plate', e.target.value)}
                  />
                ) : (
                  <h1 className="text-xl font-bold text-gray-900">{truck.plate}</h1>
                )}
                <p className="text-sm text-gray-500">
                  {isEditing ? (
                    <>
                      <input
                        className="bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500 w-16 mr-1"
                        type="number"
                        value={editedEntity?.year || ''}
                        onChange={e => handleFieldChange('year', Number(e.target.value))}
                      />
                      <input
                        className="bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500 w-24 mr-1"
                        value={editedEntity?.make || ''}
                        onChange={e => handleFieldChange('make', e.target.value)}
                      />
                      <input
                        className="bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500 w-24"
                        value={editedEntity?.model || ''}
                        onChange={e => handleFieldChange('model', e.target.value)}
                      />
                    </>
                  ) : (
                    `${truck.year} ${truck.make} ${truck.model}`
                  )}
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
                    <XCircle className="w-4 h-4 mr-2 inline" />Cancel
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
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center">
                  <TruckIcon className="w-10 h-10" />
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    {isEditing ? (
                      <>
                        <input
                          className="text-2xl font-bold text-black bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500 w-32 mr-2"
                          value={editedEntity?.make || ''}
                          onChange={e => handleFieldChange('make', e.target.value)}
                        />
                        <input
                          className="text-2xl font-bold text-black bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500 w-32"
                          value={editedEntity?.model || ''}
                          onChange={e => handleFieldChange('model', e.target.value)}
                        />
                      </>
                    ) : (
                      <h2 className="text-2xl font-bold">{truck.make} {truck.model}</h2>
                    )}
                    {isEditing ? (
                      <select
                        className="ml-2 px-2 py-1 rounded border border-gray-300 bg-white text-gray-900"
                        value={editedEntity?.status || ''}
                        onChange={e => handleFieldChange('status', e.target.value)}
                      >
                        {statusOptions.map(opt => <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>)}
                      </select>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${statusColor}-100 text-${statusColor}-800 border border-${statusColor}-200`}>
                        {truck.status.charAt(0).toUpperCase() + truck.status.slice(1).replace('-', ' ')}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-blue-100">
                    {isEditing ? (
                      <>
                        <input
                          className="bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500 w-16 mr-1"
                          type="number"
                          value={editedEntity?.year || ''}
                          onChange={e => handleFieldChange('year', Number(e.target.value))}
                        />
                        <input
                          className="bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500 w-16 mr-1"
                          value={editedEntity?.color || ''}
                          onChange={e => handleFieldChange('color', e.target.value)}
                        />
                        <select
                          className="bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500 w-32"
                          value={editedEntity?.truck_type || ''}
                          onChange={e => handleFieldChange('truck_type', e.target.value)}
                        >
                          {truckTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </>
                    ) : (
                      <>
                        <span>{truck.year} • {truck.color}</span>
                        <span>•</span>
                        <span>{truck.truck_type}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                {isEditing ? (
                  <input
                    className="text-3xl font-bold text-black bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500 w-32"
                    type="number"
                    value={editedEntity?.mileage || ''}
                    onChange={e => handleFieldChange('mileage', Number(e.target.value))}
                  />
                ) : (
                  <div className="text-3xl font-bold">{truck.mileage.toLocaleString()}</div>
                )}
                <div className="text-blue-100">Total Miles</div>
              </div>
            </div>
          </div>
          {/* Quick Status Bar */}
          <div className="px-8 py-4 bg-gray-50 grid grid-cols-4 gap-6">
            <div className="text-center">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getFuelLevelColor(isEditing ? editedEntity?.fuel_level ?? 0 : truck.fuel_level)}`}> <Fuel className="w-4 h-4 mr-1" />{isEditing ? (
                <input
                  className="w-12 bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500 text-center"
                  type="number"
                  value={editedEntity?.fuel_level ?? ''}
                  onChange={e => handleFieldChange('fuel_level', Number(e.target.value))}
                />
              ) : (
                truck.fuel_level
              )}%
              </div>
              <div className="text-xs text-gray-500 mt-1">Fuel Level</div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-bold ${getConditionColor(isEditing ? editedEntity?.condition_score ?? 0 : truck.condition_score)}`}>{isEditing ? (
                <input
                  className="w-12 bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500 text-center"
                  type="number"
                  value={editedEntity?.condition_score ?? ''}
                  onChange={e => handleFieldChange('condition_score', Number(e.target.value))}
                />
              ) : (
                truck.condition_score
              )}/10</div>
              <div className="text-xs text-gray-500">Condition</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{isEditing ? (
                <input
                  className="w-16 bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500 text-center"
                  type="number"
                  value={editedEntity?.fuel_efficiency ?? ''}
                  onChange={e => handleFieldChange('fuel_efficiency', Number(e.target.value))}
                />
              ) : (
                truck.fuel_efficiency
              )} MPG</div>
              <div className="text-xs text-gray-500">Efficiency</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{isEditing ? (
                <input
                  className="w-16 bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500 text-center"
                  type="number"
                  value={editedEntity?.total_trips ?? ''}
                  onChange={e => handleFieldChange('total_trips', Number(e.target.value))}
                />
              ) : (
                truck.total_trips
              )}</div>
              <div className="text-xs text-gray-500">Total Trips</div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Vehicle Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Vehicle Information
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div><span className="text-sm text-gray-500">VIN Number</span><div className="font-mono text-sm font-medium text-gray-900 mt-1">{isEditing ? <input className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500" value={editedEntity?.vin || ''} onChange={e => handleFieldChange('vin', e.target.value)} /> : truck.vin}</div></div>
                <div><span className="text-sm text-gray-500">License Plate</span><div className="font-bold text-gray-900 mt-1">{isEditing ? <input className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500" value={editedEntity?.plate || ''} onChange={e => handleFieldChange('plate', e.target.value)} /> : truck.plate}</div></div>
                <div><span className="text-sm text-gray-500">Year</span><div className="font-medium text-gray-900 mt-1">{isEditing ? <input className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500" type="number" value={editedEntity?.year || ''} onChange={e => handleFieldChange('year', Number(e.target.value))} /> : truck.year}</div></div>
                <div><span className="text-sm text-gray-500">Make & Model</span><div className="font-medium text-gray-900 mt-1">{isEditing ? <><input className="w-20 bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500 mr-1" value={editedEntity?.make || ''} onChange={e => handleFieldChange('make', e.target.value)} /><input className="w-20 bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500" value={editedEntity?.model || ''} onChange={e => handleFieldChange('model', e.target.value)} /></> : `${truck.make} ${truck.model}`}</div></div>
                <div><span className="text-sm text-gray-500">Color</span><div className="font-medium text-gray-900 mt-1">{isEditing ? <input className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500" value={editedEntity?.color || ''} onChange={e => handleFieldChange('color', e.target.value)} /> : truck.color}</div></div>
                <div><span className="text-sm text-gray-500">Type</span><div className="font-medium text-gray-900 mt-1">{isEditing ? <select className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500" value={editedEntity?.truck_type || ''} onChange={e => handleFieldChange('truck_type', e.target.value)}>{truckTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select> : truck.truck_type}</div></div>
              </div>
              {/* Capacity Information */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-4">Capacity & Specifications</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <Weight className="w-5 h-5 text-gray-400" />
                    <div>
                      <span className="text-sm text-gray-500">Weight Capacity</span>
                      <div className="font-medium text-gray-900">{isEditing ? <input className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500" type="number" value={editedEntity?.truckweight || ''} onChange={e => handleFieldChange('truckweight', Number(e.target.value))} /> : truck.truckweight.toLocaleString()} lbs</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Package className="w-5 h-5 text-gray-400" />
                    <div>
                      <span className="text-sm text-gray-500">Volume Capacity</span>
                      <div className="font-medium text-gray-900">{isEditing ? <input className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500" type="number" value={editedEntity?.volume || ''} onChange={e => handleFieldChange('volume', Number(e.target.value))} /> : truck.volume.toLocaleString()} ft³</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Features */}
              {truck.features && truck.features.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Features & Equipment</h4>
                  <div className="flex flex-wrap gap-2">
                    {isEditing ? (
                      <input
                        className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500"
                        value={editedEntity?.features?.join(', ') || ''}
                        onChange={e => handleFieldChange('features', e.target.value.split(',').map(f => f.trim()))}
                      />
                    ) : (
                      truck.features.map((feature, index) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{feature}</span>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            {/* Performance Metrics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-green-600" />
                Performance & Analytics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Gauge className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{isEditing ? <input className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500 text-center" type="number" value={editedEntity?.fuel_efficiency ?? ''} onChange={e => handleFieldChange('fuel_efficiency', Number(e.target.value))} /> : truck.fuel_efficiency}</div>
                  <div className="text-sm text-gray-600">MPG Average</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <TruckIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{isEditing ? <input className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500 text-center" type="number" value={editedEntity?.total_trips ?? ''} onChange={e => handleFieldChange('total_trips', Number(e.target.value))} /> : truck.total_trips}</div>
                  <div className="text-sm text-gray-600">Total Trips</div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <DollarSign className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-amber-600">{isEditing ? <input className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500 text-center" type="number" value={editedEntity?.maintenance_cost_ytd ?? ''} onChange={e => handleFieldChange('maintenance_cost_ytd', Number(e.target.value))} /> : formatCurrency(truck.maintenance_cost_ytd)}</div>
                  <div className="text-sm text-gray-600">Maintenance YTD</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <Clock className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-600">{isEditing ? <input className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500 text-center" type="number" value={editedEntity?.downtime_hours ?? ''} onChange={e => handleFieldChange('downtime_hours', Number(e.target.value))} /> : truck.downtime_hours}</div>
                  <div className="text-sm text-gray-600">Downtime Hours</div>
                </div>
              </div>
            </div>
          </div>
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Assigned Driver</span>
                    <span className="text-sm font-medium text-gray-900">{isEditing ? <input className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500" value={editedEntity?.assign_driver || ''} onChange={e => handleFieldChange('assign_driver', e.target.value)} /> : truck.assign_driver}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Current Location</span>
                  </div>
                  <div className="text-sm font-medium text-gray-900">{isEditing ? <input className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500" value={editedEntity?.current_location || ''} onChange={e => handleFieldChange('current_location', e.target.value)} /> : truck.current_location}</div>
                  <div className="text-xs text-gray-500">Updated {formatDate(isEditing ? editedEntity?.last_updated || '' : truck.last_updated)}</div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Fuel Level</span>
                    <span className={`text-sm font-medium ${getFuelLevelColor(isEditing ? editedEntity?.fuel_level ?? 0 : truck.fuel_level).split(' ')[0]}`}>{isEditing ? <input className="w-12 bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500 text-center" type="number" value={editedEntity?.fuel_level ?? ''} onChange={e => handleFieldChange('fuel_level', Number(e.target.value))} /> : truck.fuel_level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all duration-300 ${(isEditing ? editedEntity?.fuel_level ?? 0 : truck.fuel_level) >= 50 ? 'bg-green-500' : (isEditing ? editedEntity?.fuel_level ?? 0 : truck.fuel_level) >= 25 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${isEditing ? editedEntity?.fuel_level ?? 0 : truck.fuel_level}%` }}></div>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <button className="flex-1 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"><Phone className="w-4 h-4 mr-1 inline" />Call Driver</button>
                  <button className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"><Navigation className="w-4 h-4 mr-1 inline" />Track</button>
                </div>
              </div>
            </div>
            {/* Maintenance & Compliance */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><Wrench className="w-5 h-5 mr-2 text-orange-600" />Maintenance & Compliance</h3>
              <div className="space-y-4">
                <div className={`p-3 rounded-lg ${isServiceDue() ? 'bg-red-50' : 'bg-green-50'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">Next Service</span>
                    {isServiceDue() ? (<AlertCircle className="w-4 h-4 text-red-500" />) : (<CheckCircle2 className="w-4 h-4 text-green-500" />)}
                  </div>
                  <div className={`text-sm ${isServiceDue() ? 'text-red-700' : 'text-green-700'}`}>{isServiceDue() ? 'Service Overdue' : `Due at ${isEditing ? (editedEntity?.next_service_due ?? '').toLocaleString() : truck.next_service_due.toLocaleString()} miles`}</div>
                  <div className="text-xs text-gray-500 mt-1">Last service: {isEditing ? <input className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500" type="date" value={editedEntity?.last_service_date || ''} onChange={e => handleFieldChange('last_service_date', e.target.value)} /> : formatDate(truck.last_service_date)}</div>
                </div>
                <div className={`p-3 rounded-lg ${isInsuranceExpiring() ? 'bg-amber-50' : 'bg-green-50'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">Insurance</span>
                    {isInsuranceExpiring() ? (<AlertTriangle className="w-4 h-4 text-amber-500" />) : (<CheckCircle2 className="w-4 h-4 text-green-500" />)}
                  </div>
                  <div className={`text-sm ${isInsuranceExpiring() ? 'text-amber-700' : 'text-green-700'}`}>Expires {isEditing ? <input className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500" type="date" value={editedEntity?.insurance_expiry || ''} onChange={e => handleFieldChange('insurance_expiry', e.target.value)} /> : formatDate(truck.insurance_expiry)}{isInsuranceExpiring() && (<span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">Expiring Soon</span>)}</div>
                </div>
                <div className="p-3 rounded-lg bg-blue-50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">Registration</span>
                    <Shield className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="text-sm text-blue-700">Expires {isEditing ? <input className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500" type="date" value={editedEntity?.registration_expiry || ''} onChange={e => handleFieldChange('registration_expiry', e.target.value)} /> : formatDate(truck.registration_expiry)}</div>
                </div>
              </div>
              <button className="w-full mt-4 px-4 py-2 text-sm font-medium text-orange-700 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"><Settings className="w-4 h-4 mr-2 inline" />Schedule Maintenance</button>
            </div>
            {/* Location */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><MapPin className="w-5 h-5 mr-2 text-purple-600" />Location</h3>
              <div className="space-y-3">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="font-medium text-purple-900">{isEditing ? <input className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500" value={editedEntity?.current_location || ''} onChange={e => handleFieldChange('current_location', e.target.value)} /> : truck.current_location}</div>
                  <div className="text-sm text-purple-700 mt-1">Last updated: {isEditing ? <input className="w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500" type="date" value={editedEntity?.last_updated || ''} onChange={e => handleFieldChange('last_updated', e.target.value)} /> : formatDate(truck.last_updated)}</div>
                </div>
              </div>
              <button className="w-full mt-4 px-4 py-2 text-sm font-medium text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"><MapPin className="w-4 h-4 mr-2 inline" />View on Map</button>
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
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Truck</h3>
            </div>
            <p className="text-gray-600 mb-6">Are you sure you want to delete <strong>{truck.plate}</strong> ({truck.year} {truck.make} {truck.model})? This action cannot be undone.</p>
            <div className="flex space-x-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
              <button onClick={deleteEntity} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">Delete Truck</button>
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