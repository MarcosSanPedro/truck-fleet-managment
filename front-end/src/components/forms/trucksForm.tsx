import React, { useState, useEffect } from 'react';
import type { Truck } from '../../types/index';
import { emptyTruck } from '../../lib/data';

interface TruckFormProps {
  truck?: Truck;
  onSubmit: (truck: Partial<Truck>) => void;
  onCancel: () => void;
}

const truckTypeOptions = [
  'Semi-Truck', 'Box Truck', 'Flatbed', 'Refrigerated', 'Tanker', 'Other',
];
const statusOptions = [
  'active', 'maintenance', 'out-of-service', 'available',
];

export const TruckForm: React.FC<TruckFormProps> = ({ truck, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Omit<Truck, 'id'>>>({});
  const [featuresInput, setFeaturesInput] = useState('');

  useEffect(() => {
    if (truck) {
      setFormData({ ...truck });
      setFeaturesInput(truck.features?.join(', ') || '');
    }else{
      setFormData(emptyTruck)
    }
  }, [truck]);

  // Required fields for a valid truck
  const requiredFields = ['make', 'model', 'year', 'plate'];
  const isValid = requiredFields.every(
    (field) => formData[field as keyof typeof formData] !== undefined && formData[field as keyof typeof formData] !== ''
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? undefined : Number(value)) : value,
    }));
  };

  // Features as comma-separated string
  const handleFeaturesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeaturesInput(e.target.value);
    setFormData((prev) => ({
      ...prev,
      features: e.target.value
        .split(',')
        .map((f) => f.trim())
        .filter((f) => f.length > 0),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData); // allow partial data
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto p-6 bg-white rounded-xl shadow border border-gray-200">
      {/* Vehicle Info */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Vehicle Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-1">Make <span className="text-red-500">*</span></label>
            <input type="text" id="make" name="make" value={formData.make || ''} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Volvo" />
          </div>
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">Model <span className="text-red-500">*</span></label>
            <input type="text" id="model" name="model" value={formData.model || ''} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. FH16" />
          </div>
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">Year <span className="text-red-500">*</span></label>
            <input type="number" id="year" name="year" value={formData.year || ''} onChange={handleChange} min="1900" max={new Date().getFullYear() + 1} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 2022" />
          </div>
          <div>
            <label htmlFor="plate" className="block text-sm font-medium text-gray-700 mb-1">License Plate <span className="text-red-500">*</span></label>
            <input type="text" id="plate" name="plate" value={formData.plate || ''} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. ABC-1234" />
          </div>
          <div>
            <label htmlFor="vin" className="block text-sm font-medium text-gray-700 mb-1">VIN</label>
            <input type="text" id="vin" name="vin" value={formData.vin || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Vehicle Identification Number" />
          </div>
          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <input type="text" id="color" name="color" value={formData.color || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. White" />
          </div>
        </div>
      </div>
      <hr />
      {/* Assignment & Status */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Assignment & Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="assign_driver" className="block text-sm font-medium text-gray-700 mb-1">Assigned Driver</label>
            <input type="text" id="assign_driver" name="assign_driver" value={formData.assign_driver || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Driver Name or ID" />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select id="status" name="status" value={formData.status || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select status</option>
              {statusOptions.map((opt) => <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>)}
            </select>
          </div>
        </div>
      </div>
      <hr />
      {/* Truck Type & Features */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Type & Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="truck_type" className="block text-sm font-medium text-gray-700 mb-1">Truck Type</label>
            <select id="truck_type" name="truck_type" value={formData.truck_type || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select type</option>
              {truckTypeOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-1">Features</label>
            <input type="text" id="features" name="features" value={featuresInput} onChange={handleFeaturesChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. GPS, Air Conditioning, Liftgate" />
            <p className="text-xs text-gray-500 mt-1">Comma-separated list</p>
          </div>
        </div>
      </div>
      <hr />
      {/* Capacity & Specs */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Capacity & Specs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="truckweight" className="block text-sm font-medium text-gray-700 mb-1">Weight Capacity (lbs)</label>
            <input type="number" id="truckweight" name="truckweight" value={formData.truckweight ?? ''} onChange={handleChange} min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 20000" />
          </div>
          <div>
            <label htmlFor="volume" className="block text-sm font-medium text-gray-700 mb-1">Volume Capacity (ft³)</label>
            <input type="number" id="volume" name="volume" value={formData.volume ?? ''} onChange={handleChange} min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 1200" />
          </div>
        </div>
      </div>
      <hr />
      {/* Performance */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="mileage" className="block text-sm font-medium text-gray-700 mb-1">Mileage</label>
            <input type="number" id="mileage" name="mileage" value={formData.mileage ?? ''} onChange={handleChange} min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 50000" />
          </div>
          <div>
            <label htmlFor="fuel_level" className="block text-sm font-medium text-gray-700 mb-1">Fuel Level (%)</label>
            <input type="number" id="fuel_level" name="fuel_level" value={formData.fuel_level ?? ''} onChange={handleChange} min="0" max="100" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 75" />
          </div>
          <div>
            <label htmlFor="condition_score" className="block text-sm font-medium text-gray-700 mb-1">Condition Score (0-10)</label>
            <input type="number" id="condition_score" name="condition_score" value={formData.condition_score ?? ''} onChange={handleChange} min="0" max="10" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 8" />
          </div>
          <div>
            <label htmlFor="fuel_efficiency" className="block text-sm font-medium text-gray-700 mb-1">Fuel Efficiency (MPG)</label>
            <input type="number" id="fuel_efficiency" name="fuel_efficiency" value={formData.fuel_efficiency ?? ''} onChange={handleChange} min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 7.5" />
          </div>
          <div>
            <label htmlFor="total_trips" className="block text-sm font-medium text-gray-700 mb-1">Total Trips</label>
            <input type="number" id="total_trips" name="total_trips" value={formData.total_trips ?? ''} onChange={handleChange} min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 120" />
          </div>
        </div>
      </div>
      <hr />
      {/* Compliance & Maintenance */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Compliance & Maintenance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="last_service_date" className="block text-sm font-medium text-gray-700 mb-1">Last Service Date</label>
            <input type="date" id="last_service_date" name="last_service_date" value={formData.last_service_date || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label htmlFor="next_service_due" className="block text-sm font-medium text-gray-700 mb-1">Next Service Due (miles)</label>
            <input type="number" id="next_service_due" name="next_service_due" value={formData.next_service_due ?? ''} onChange={handleChange} min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 60000" />
          </div>
          <div>
            <label htmlFor="maintenance_cost_ytd" className="block text-sm font-medium text-gray-700 mb-1">Maintenance Cost YTD ($)</label>
            <input type="number" id="maintenance_cost_ytd" name="maintenance_cost_ytd" value={formData.maintenance_cost_ytd ?? ''} onChange={handleChange} min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 1200" />
          </div>
          <div>
            <label htmlFor="downtime_hours" className="block text-sm font-medium text-gray-700 mb-1">Downtime Hours</label>
            <input type="number" id="downtime_hours" name="downtime_hours" value={formData.downtime_hours ?? ''} onChange={handleChange} min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 10" />
          </div>
          <div>
            <label htmlFor="insurance_expiry" className="block text-sm font-medium text-gray-700 mb-1">Insurance Expiry</label>
            <input type="date" id="insurance_expiry" name="insurance_expiry" value={formData.insurance_expiry || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label htmlFor="registration_expiry" className="block text-sm font-medium text-gray-700 mb-1">Registration Expiry</label>
            <input type="date" id="registration_expiry" name="registration_expiry" value={formData.registration_expiry || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>
      <hr />
      {/* Location */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Location</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="current_location" className="block text-sm font-medium text-gray-700 mb-1">Current Location</label>
            <input type="text" id="current_location" name="current_location" value={formData.current_location || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Little Rock, AR" />
          </div>
          <div>
            <label htmlFor="last_updated" className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
            <input type="date" id="last_updated" name="last_updated" value={formData.last_updated || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-3 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSaveDraft}
          className="px-4 py-2 border border-blue-300 bg-white rounded-md text-sm font-medium text-blue-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save as Draft
        </button>
        <button
          type="submit"
          disabled={!isValid}
          className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {truck ? 'Update' : 'Create'} Truck
        </button>
      </div>
    </form>
  );
};