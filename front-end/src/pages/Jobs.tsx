import React, { useState, useEffect } from 'react';
import { Plus, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import type { Job } from '../types/index';
import { apiService } from '../services/api';
import { Table } from '../components/ui/table';
import { Modal } from '../components/ui/Modal';
import { JobForm } from '../components/forms/jobsForm';

export const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | undefined>();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await apiService.get<Job>("jobs");
      setJobs(data);
    } catch (error) {
      console.error('Error loading jobs:', error);
      // For demo purposes, use mock data
      setJobs([
        {
          id: 1,
          job_number: 'JOB-001',
          job_date: '2024-01-15',
          job_type: 'delivery',
          job_description: 'Deliver construction materials to downtown site',
          job_status: 'completed',
        },
        {
          id: 2,
          job_number: 'JOB-002',
          job_date: '2024-01-16',
          job_type: 'pickup',
          job_description: 'Pick up equipment from warehouse',
          job_status: 'in_progress',
        },
        {
          id: 3,
          job_number: 'JOB-003',
          job_date: '2024-01-17',
          job_type: 'transport',
          job_description: 'Transport goods to distribution center',
          job_status: 'pending',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingJob(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const handleDelete = async (job: Job) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        if (job.id) {
          await apiService.delete("jobs", job.id);
        }
        setJobs(prev => prev.filter(j => j.id !== job.id));
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
  };

  const handleSubmit = async (jobData: Omit<Job, 'id'>) => {
    try {
      if (editingJob && editingJob.id) {
        const updated = await apiService.update("jobs", editingJob.id, jobData);

        setJobs(prev => prev.map(j => j.id === editingJob.id ? updated : j));
      } else {
        const created = await apiService.create<Job>("jobs", jobData);
        setJobs(prev => [...prev, created]);
      }
      setIsModalOpen(false);
      setEditingJob(undefined);
    } catch (error) {
      console.error('Error saving job:', error);
      // For demo purposes, simulate success
      const mockJob = { ...jobData, id: Date.now() };
      if (editingJob) {
        setJobs(prev => prev.map(j => j.id === editingJob.id ? mockJob : j));
      } else {
        setJobs(prev => [...prev, mockJob]);
      }
      setIsModalOpen(false);
      setEditingJob(undefined);
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.job_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.job_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.job_description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'in_progress':
        return <Clock size={16} className="text-blue-600" />;
      case 'pending':
        return <Calendar size={16} className="text-yellow-600" />;
      case 'cancelled':
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    { key: 'job_number', label: 'Job Number' },
    { 
      key: 'job_date', 
      label: 'Date',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'job_type', 
      label: 'Type',
      render: (value: string) => (
        <span className="capitalize">{value.replace('_', ' ')}</span>
      )
    },
    { 
      key: 'job_description', 
      label: 'Description',
      render: (value: string) => (
        <span className="truncate max-w-xs block" title={value}>
          {value}
        </span>
      )
    },
    { 
      key: 'job_status', 
      label: 'Status',
      render: (value: string) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
          <span className="mr-1">{getStatusIcon(value)}</span>
          {value.replace('_', ' ').toUpperCase()}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
          <p className="text-gray-600">Manage fleet jobs and assignments</p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus size={16} className="mr-2" />
          Add Job
        </button>
      </div>

      <div className="max-w-md">
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <Table
        columns={columns}
        data={filteredJobs}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingJob ? 'Edit Job' : 'Add New Job'}
      >
        <JobForm
          job={editingJob}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};