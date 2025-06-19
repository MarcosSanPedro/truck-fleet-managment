import { createFileRoute } from '@tanstack/react-router'
import React, { useState, useEffect } from 'react';
import { Plus, Truck as TruckIcon } from 'lucide-react';
import type { Truck } from '../types/index';
import { apiService } from '../services/api';
import { Table } from '../components/ui/table';
import { Modal } from '../components/ui/Modal';
import { TruckForm } from '../components/forms/trucksForm';

export const Route = createFileRoute('/Trucks')({
  component: Trucks,
})

export default function Trucks() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTruck, setEditingTruck] = useState<Truck | undefined>();
  const [searchTerm, setSearchTerm] = useState('');



  const loadTrucks = async () => {
    try {
      setLoading(true);
      const data = await apiService.get<Truck>("trucks");
      setTrucks(data);
    } catch (error) {
      console.error('Error loading trucks:', error);
      // For demo purposes, use mock data
      setTrucks([
        {
          id: 1,
          assign_driver: 'John Smith',
          make: 'Freightliner',
          model: 'Cascadia',
          year: 2022,
          color: 'White',
          mileage: 45000,
          vin: '1FUJGHDV8NLAA1234',
          plate: 'FL-TRK-001',
        },
        {
          id: 2,
          assign_driver: 'Jane Doe',
          make: 'Peterbilt',
          model: '579',
          year: 2021,
          color: 'Blue',
          mileage: 62000,
          vin: '1XPWD40X1ED123456',
          plate: 'FL-TRK-002',
        },
        {
          id: 3,
          assign_driver: '',
          make: 'Kenworth',
          model: 'T680',
          year: 2023,
          color: 'Red',
          mileage: 15000,
          vin: '1XKWD40X5JJ789012',
          plate: 'FL-TRK-003',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrucks();
  }, []);
  
  const handleCreate = () => {
    setEditingTruck(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (truck: Truck) => {
    setEditingTruck(truck);
    setIsModalOpen(true);
  };

  const handleDelete = async (truck: Truck) => {
    // if (window.confirm('Are you sure you want to delete this truck?')) {
      try {
        console.log(truck.id)
        if (truck.id) {
          await apiService.delete("trucks", truck.id);
          console.log(truck.id)
        }
        setTrucks(prev => prev.filter(t => t.id !== truck.id));
      } catch (error) {
        console.error('Error deleting truck:', error);
      }
    // }
  };

  const handleSubmit = async (truckData: Omit<Truck, 'id'>) => {
    try {
      if (editingTruck && editingTruck.id) {
        const updated = await apiService.update("trucks", editingTruck.id, truckData);
        setTrucks(prev => prev.map(t => t.id === editingTruck.id ? updated : t));
      } else {
        const created = await apiService.create<Truck>('trucks', truckData);
        setTrucks(prev => [...prev, created]);
      }
      setIsModalOpen(false);
      setEditingTruck(undefined);
    } catch (error) {
      console.error('Error saving truck:', error);
      // For demo purposes, simulate success
      const mockTruck = { ...truckData, id: Date.now() };
      if (editingTruck) {
        setTrucks(prev => prev.map(t => t.id === editingTruck.id ? mockTruck : t));
      } else {
        setTrucks(prev => [...prev, mockTruck]);
      }
      setIsModalOpen(false);
      setEditingTruck(undefined);
    }
  };

  const filteredTrucks = trucks.filter(truck =>
    `${truck.make} ${truck.model}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    truck.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    truck.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    truck.assign_driver.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { 
      key: 'make', 
      label: 'Make/Model',
      render: (value: string, row: Truck) => (
        <div className="flex items-center">
          <TruckIcon size={16} className="mr-2 text-gray-500" />
          <span>{`${row.make} ${row.model}`}</span>
        </div>
      )
    },
    { key: 'year', label: 'Year' },
    { key: 'color', label: 'Color' },
    { 
      key: 'mileage', 
      label: 'Mileage',
      render: (value: number) => value.toLocaleString() + ' mi'
    },
    { key: 'plate', label: 'License Plate' },
    { 
      key: 'assign_driver', 
      label: 'Assigned Driver',
      render: (value: string) => (
        <span className={value ? 'text-gray-900' : 'text-gray-400 italic'}>
          {value || 'Unassigned'}
        </span>
      )
    },
    { 
      key: 'vin', 
      label: 'VIN',
      render: (value: string) => (
        <span className="font-mono text-sm truncate max-w-xs block" title={value}>
          {value}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trucks</h1>
          <p className="text-gray-600">Manage your fleet vehicles</p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus size={16} className="mr-2" />
          Add Truck
        </button>
      </div>

      <div className="max-w-md">
        <input
          type="text"
          placeholder="Search trucks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <Table
        columns={columns}
        data={filteredTrucks}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTruck ? 'Edit Truck' : 'Add New Truck'}
      >
        <TruckForm
          truck={editingTruck}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};