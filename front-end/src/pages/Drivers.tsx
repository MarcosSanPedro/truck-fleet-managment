import React, { useState, useEffect } from 'react';
import { Plus, UserCheck, UserX } from 'lucide-react';
import type { Driver } from '../types';
import { apiService } from '../services/api';
import { Table } from '../components/ui/table';
import { Modal } from '../components/ui/Modal';
import { DriverForm } from '../components/forms/driversForms';

export const Drivers: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | undefined>();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    try {
      setLoading(true);
      const data = await apiService.getDrivers();
      setDrivers(data);
    } catch (error) {
      console.error('Error loading drivers:', error);
      // For demo purposes, use mock data
      setDrivers([
        
        {
          id: 2,
          first_name: 'Jane',
          last_name: 'Doe',
          phone_number: '555-0456',
          email: 'jane.doe@example.com',
          license_number: 'DL987654321',
          license_expiration: '2024-06-30',
          is_active: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingDriver(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (driver: Driver) => {
    setEditingDriver(driver);
    setIsModalOpen(true);
  };

  const handleDelete = async (driver: Driver) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      try {
        if (driver.id) {
          await apiService.deleteDriver(driver.id);
        }
        setDrivers(prev => prev.filter(d => d.id !== driver.id));
      } catch (error) {
        console.error('Error deleting driver:', error);
      }
    }
  };

  const handleSubmit = async (driverData: Omit<Driver, 'id'>) => {
    try {
      if (editingDriver && editingDriver.id) {
        const updated = await apiService.updateDriver(editingDriver.id, driverData);
        setDrivers(prev => prev.map(d => d.id === editingDriver.id ? updated : d));
      } else {
        const created = await apiService.createDriver(driverData);
        setDrivers(prev => [...prev, created]);
      }
      setIsModalOpen(false);
      setEditingDriver(undefined);
    } catch (error) {
      console.error('Error saving driver:', error);
      // For demo purposes, simulate success
      const mockDriver = { ...driverData, id: Date.now() };
      if (editingDriver) {
        setDrivers(prev => prev.map(d => d.id === editingDriver.id ? mockDriver : d));
      } else {
        setDrivers(prev => [...prev, mockDriver]);
      }
      setIsModalOpen(false);
      setEditingDriver(undefined);
    }
  };

  const filteredDrivers = drivers.filter(driver =>
    `${driver.first_name} ${driver.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.license_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone_number', label: 'Phone' },
    { key: 'license_number', label: 'License #' },
    { 
      key: 'license_expiration', 
      label: 'License Exp.',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'is_active', 
      label: 'Status',
      render: (value: boolean) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value ? <UserCheck size={12} className="mr-1" /> : <UserX size={12} className="mr-1" />}
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Drivers</h1>
          <p className="text-gray-600">Manage your fleet drivers</p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus size={16} className="mr-2" />
          Add Driver
        </button>
      </div>

      <div className="max-w-md">
        <input
          type="text"
          placeholder="Search drivers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <Table
        columns={columns}
        data={filteredDrivers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDriver ? 'Edit Driver' : 'Add New Driver'}
      >
        <DriverForm
          driver={editingDriver}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};