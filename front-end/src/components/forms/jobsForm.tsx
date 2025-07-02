import React, { useState, useEffect } from 'react';
import type { Job } from '../../types/index';

interface JobFormProps {
  job?: Job;
  onSubmit: (job: Partial<Omit<Job, 'id'>>) => void;
  onCancel: () => void;
}

const jobTypeOptions = [
  'delivery', 'pickup', 'transport', 'maintenance', 'other',
];
const jobStatusOptions = [
  'pending', 'in-progress', 'completed', 'cancelled',
];

export const JobForm: React.FC<JobFormProps> = ({ job, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Omit<Job, 'id'>>>({});
  const [specialReqInput, setSpecialReqInput] = useState('');

  useEffect(() => {
    if (job) {
      setFormData({ ...job });
      setSpecialReqInput(job.specialRequirements?.join(', ') || '');
    }
  }, [job]);

  // Required fields for a valid job
  const requiredFields = [
    'job_number', 'job_date', 'job_type', 'job_status', 'job_description', 'origin', 'destination',
  ];
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

  // specialRequirements as comma-separated string
  const handleSpecialReqChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpecialReqInput(e.target.value);
    setFormData((prev) => ({
      ...prev,
      specialRequirements: e.target.value
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
      {/* Job Info */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Job Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="job_number" className="block text-sm font-medium text-gray-700 mb-1">Job Number <span className="text-red-500">*</span></label>
            <input type="text" id="job_number" name="job_number" value={formData.job_number || ''} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. JOB-2024-001" />
          </div>
          <div>
            <label htmlFor="job_date" className="block text-sm font-medium text-gray-700 mb-1">Job Date <span className="text-red-500">*</span></label>
            <input type="date" id="job_date" name="job_date" value={formData.job_date || ''} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label htmlFor="job_type" className="block text-sm font-medium text-gray-700 mb-1">Job Type <span className="text-red-500">*</span></label>
            <select id="job_type" name="job_type" value={formData.job_type || ''} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select Job Type</option>
              {jobTypeOptions.map(opt => <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="job_status" className="block text-sm font-medium text-gray-700 mb-1">Job Status <span className="text-red-500">*</span></label>
            <select id="job_status" name="job_status" value={formData.job_status || ''} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select Status</option>
              {jobStatusOptions.map(opt => <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1).replace('-', ' ')}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="job_description" className="block text-sm font-medium text-gray-700 mb-1">Job Description <span className="text-red-500">*</span></label>
            <textarea id="job_description" name="job_description" value={formData.job_description || ''} onChange={handleChange} rows={3} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Describe the job..." />
          </div>
        </div>
      </div>
      <hr />
      {/* Assignment & Route */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Assignment & Route</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="driver" className="block text-sm font-medium text-gray-700 mb-1">Driver <span className="text-red-500">*</span></label>
            <input type="text" id="driver" name="driver" value={formData.driver || ''} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Driver Name or ID" />
          </div>
          <div>
            <label htmlFor="vehicle" className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
            <input type="text" id="vehicle" name="vehicle" value={formData.vehicle || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Vehicle Name or ID" />
          </div>
          <div>
            <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">Origin <span className="text-red-500">*</span></label>
            <input type="text" id="origin" name="origin" value={formData.origin || ''} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Little Rock, AR" />
          </div>
          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">Destination <span className="text-red-500">*</span></label>
            <input type="text" id="destination" name="destination" value={formData.destination || ''} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Dallas, TX" />
          </div>
        </div>
      </div>
      <hr />
      {/* Special Requirements */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Special Requirements</h2>
        <input type="text" id="specialRequirements" name="specialRequirements" value={specialReqInput} onChange={handleSpecialReqChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. HAZMAT, Liftgate" />
        <p className="text-xs text-gray-500 mt-1">Comma-separated list</p>
      </div>
      <hr />
      {/* Job Stats */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Job Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="estimatedValue" className="block text-sm font-medium text-gray-700 mb-1">Estimated Value</label>
            <input type="text" id="estimatedValue" name="estimatedValue" value={formData.estimatedValue || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. $12,000" />
          </div>
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
            <input type="text" id="weight" name="weight" value={formData.weight || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 18,000 lbs" />
          </div>
          <div>
            <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-1">Distance</label>
            <input type="text" id="distance" name="distance" value={formData.distance || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 320 mi" />
          </div>
          <div>
            <label htmlFor="estimatedDuration" className="block text-sm font-medium text-gray-700 mb-1">Estimated Duration</label>
            <input type="text" id="estimatedDuration" name="estimatedDuration" value={formData.estimatedDuration || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 6h 30m" />
          </div>
          <div>
            <label htmlFor="progress" className="block text-sm font-medium text-gray-700 mb-1">Progress (%)</label>
            <input type="number" id="progress" name="progress" value={formData.progress ?? ''} onChange={handleChange} min="0" max="100" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 65" />
          </div>
          <div>
            <label htmlFor="nextCheckpoint" className="block text-sm font-medium text-gray-700 mb-1">Next Checkpoint</label>
            <input type="text" id="nextCheckpoint" name="nextCheckpoint" value={formData.nextCheckpoint || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Texarkana, AR" />
          </div>
          <div>
            <label htmlFor="eta" className="block text-sm font-medium text-gray-700 mb-1">ETA</label>
            <input type="text" id="eta" name="eta" value={formData.eta || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 2024-06-10 02:30 PM" />
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
          {job ? 'Update' : 'Create'} Job
        </button>
      </div>
    </form>
  );
};