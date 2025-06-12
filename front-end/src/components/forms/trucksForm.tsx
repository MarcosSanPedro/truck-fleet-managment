import React, { useState, useEffect } from 'react';
import type { Truck } from '../../types/index';

interface TruckFormProps {
  truck?: Truck;
  onSubmit: (truck: Omit<Truck, 'id'>) => void;
  onCancel: () => void;
}

export const TruckForm: React.FC<TruckFormProps> = ({ truck, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Truck, 'id'>>({
    asign_driver: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    mileage: 0,
    vin: '',
    plate: '',
  });

  useEffect(() => {
    if (truck) {
      setFormData({
        asign_driver: truck.asign_driver,
        make: truck.make,
        model: truck.model,
        year: truck.year,
        color: truck.color,
        mileage: truck.mileage,
        vin: truck.vin,
        plate: truck.plate,
      });
    }
  }, [truck]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="asign_driver" className="block text-sm font-medium text-gray-700 mb-1">
          Assigned Driver
        </label>
        <input
          type="text"
          id="asign_driver"
          name="asign_driver"
          value={formData.asign_driver}
          onChange={handleChange}
          placeholder="Driver Name or ID"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-1">
            Make
          </label>
          <input
            type="text"
            id="make"
            name="make"
            value={formData.make}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
            Model
          </label>
          <input
            type="text"
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
            Year
          </label>
          <input
            type="number"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            min="1900"
            max={new Date().getFullYear() + 1}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
            Color
          </label>
          <input
            type="text"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      <div>
        <label htmlFor="mileage" className="block text-sm font-medium text-gray-700 mb-1">
          Mileage
        </label>
        <input
          type="number"
          id="mileage"
          name="mileage"
          value={formData.mileage}
          onChange={handleChange}
          min="0"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label htmlFor="vin" className="block text-sm font-medium text-gray-700 mb-1">
          VIN
        </label>
        <input
          type="text"
          id="vin"
          name="vin"
          value={formData.vin}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label htmlFor="plate" className="block text-sm font-medium text-gray-700 mb-1">
          License Plate
        </label>
        <input
          type="text"
          id="plate"
          name="plate"
          value={formData.plate}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
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
          {truck ? 'Update' : 'Create'} Truck
        </button>
      </div>
    </form>
  );
};