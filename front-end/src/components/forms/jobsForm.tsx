import React, { useState, useEffect } from 'react';
import type { Job } from '../../types/index';

interface JobFormProps {
  job?: Job;
  onSubmit: (job: Omit<Job, 'id'>) => void;
  onCancel: () => void;
}

export const JobForm: React.FC<JobFormProps> = ({ job, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Job, 'id'>>({
    job_number: '',
    job_date: '',
    job_type: '',
    job_description: '',
    job_status: 'pending',
  });

  useEffect(() => {
    if (job) {
      setFormData({
        job_number: job.job_number,
        job_date: job.job_date,
        job_type: job.job_type,
        job_description: job.job_description,
        job_status: job.job_status,
      });
    }
  }, [job]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="job_number" className="block text-sm font-medium text-gray-700 mb-1">
          Job Number
        </label>
        <input
          type="text"
          id="job_number"
          name="job_number"
          value={formData.job_number}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label htmlFor="job_date" className="block text-sm font-medium text-gray-700 mb-1">
          Job Date
        </label>
        <input
          type="date"
          id="job_date"
          name="job_date"
          value={formData.job_date}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label htmlFor="job_type" className="block text-sm font-medium text-gray-700 mb-1">
          Job Type
        </label>
        <select
          id="job_type"
          name="job_type"
          value={formData.job_type}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select Job Type</option>
          <option value="delivery">Delivery</option>
          <option value="pickup">Pickup</option>
          <option value="transport">Transport</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>
      <div>
        <label htmlFor="job_description" className="block text-sm font-medium text-gray-700 mb-1">
          Job Description
        </label>
        <textarea
          id="job_description"
          name="job_description"
          value={formData.job_description}
          onChange={handleChange}
          rows={3}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label htmlFor="job_status" className="block text-sm font-medium text-gray-700 mb-1">
          Job Status
        </label>
        <select
        
          id="job_status"
          name="job_status"
          value={formData.job_status}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {job ? 'Update' : 'Create'} Job
        </button>
      </div>
    </form>
  );
};