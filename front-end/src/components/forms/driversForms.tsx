import React, { useState, useEffect } from "react";
import type { Driver } from "../../types/index";
import { emptyDriver } from "../../lib/data";

interface DriverFormProps {
  driver?: Driver;
  onSubmit: (driver: Partial<Omit<Driver, "id">>) => void;
  onCancel: () => void;
}

export const DriverForm: React.FC<DriverFormProps> = ({
  driver,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<Omit<Driver, "id">>>({});

  useEffect(() => {
    if (driver) {
      setFormData({ ...emptyDriver, ...driver });
    } else {
      setFormData(emptyDriver);
    }
  }, [driver]);

  // Required fields for a valid driver
  const requiredFields = [
    "first_name",
    "last_name",
    "email",
    "phone_number",
    "license.number",
    "license.license_class",
    "license.license_expiration",
  ];
  const isValid = requiredFields.every((field) => {
    if (field.startsWith("license.")) {
      const key = field.split(".")[1];
      return (
        formData.license &&
        formData.license[key as keyof typeof formData.license] !== undefined &&
        formData.license[key as keyof typeof formData.license] !== ""
      );
    }
    return (
      formData[field as keyof typeof formData] !== undefined &&
      formData[field as keyof typeof formData] !== ""
    );
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked, dataset } = e.target;
    const section = dataset.section;
    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...((prev[section as keyof typeof prev] as Record<string, any>) || {}),
          [name]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
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
      {/* Personal Info */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">First Name <span className="text-red-500">*</span></label>
            <input type="text" id="first_name" name="first_name" value={formData.first_name || ''} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. John" />
          </div>
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">Last Name <span className="text-red-500">*</span></label>
            <input type="text" id="last_name" name="last_name" value={formData.last_name || ''} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Doe" />
          </div>
        </div>
      </div>
      <hr />
      {/* Contact */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Contact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
            <input type="email" id="email" name="email" value={formData.email || ''} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. john.doe@email.com" />
          </div>
          <div>
            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
            <input type="tel" id="phone_number" name="phone_number" value={formData.phone_number || ''} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. (555) 123-4567" />
          </div>
        </div>
        {formData.address && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">Street</label>
              <input type="text" id="street" name="street" value={formData.address.street || ''} onChange={handleChange} data-section="address" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 123 Main St" />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input type="text" id="city" name="city" value={formData.address.city || ''} onChange={handleChange} data-section="address" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Little Rock" />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input type="text" id="state" name="state" value={formData.address.state || ''} onChange={handleChange} data-section="address" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. AR" />
            </div>
            <div>
              <label htmlFor="zip_code" className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
              <input type="text" id="zip_code" name="zip_code" value={formData.address.zip_code || ''} onChange={handleChange} data-section="address" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 72201" />
            </div>
          </div>
        )}
      </div>
      <hr />
      {/* License */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">License</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">License Number <span className="text-red-500">*</span></label>
            <input type="text" id="number" name="number" value={formData.license?.number || ''} onChange={handleChange} data-section="license" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. D1234567" />
          </div>
          <div>
            <label htmlFor="license_class" className="block text-sm font-medium text-gray-700 mb-1">Class <span className="text-red-500">*</span></label>
            <input type="text" id="license_class" name="license_class" value={formData.license?.license_class || ''} onChange={handleChange} data-section="license" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. A" />
          </div>
          <div>
            <label htmlFor="license_expiration" className="block text-sm font-medium text-gray-700 mb-1">Expiration <span className="text-red-500">*</span></label>
            <input type="date" id="license_expiration" name="license_expiration" value={formData.license?.license_expiration || ''} onChange={handleChange} data-section="license" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="is_valid" className="block text-sm font-medium text-gray-700 mb-1">Is Valid</label>
          <input type="checkbox" id="is_valid" name="is_valid" checked={formData.license?.is_valid || false} onChange={handleChange} data-section="license" className="mr-2" />
        </div>
      </div>
      <hr />
      {/* Employment */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Employment</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="hire_date" className="block text-sm font-medium text-gray-700 mb-1">Hire Date</label>
            <input type="date" id="hire_date" name="hire_date" value={formData.employment?.hire_date || ''} onChange={handleChange} data-section="employment" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label htmlFor="years_experience" className="block text-sm font-medium text-gray-700 mb-1">Years Experience</label>
            <input type="number" id="years_experience" name="years_experience" value={formData.employment?.years_experience ?? ''} onChange={handleChange} data-section="employment" min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 8" />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <input type="text" id="status" name="status" value={formData.employment?.status || ''} onChange={handleChange} data-section="employment" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. active" />
          </div>
          <div>
            <label htmlFor="employee_id" className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
            <input type="text" id="employee_id" name="employee_id" value={formData.employment?.employee_id || ''} onChange={handleChange} data-section="employment" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. EMP123" />
          </div>
        </div>
      </div>
      <hr />
      {/* Performance */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="safety_rating" className="block text-sm font-medium text-gray-700 mb-1">Safety Rating</label>
            <input type="number" id="safety_rating" name="safety_rating" value={formData.performance?.safety_rating ?? ''} onChange={handleChange} data-section="performance" min="0" max="10" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 9" />
          </div>
          <div>
            <label htmlFor="on_time_delivery_rate" className="block text-sm font-medium text-gray-700 mb-1">On-Time Delivery Rate (%)</label>
            <input type="number" id="on_time_delivery_rate" name="on_time_delivery_rate" value={formData.performance?.on_time_delivery_rate ?? ''} onChange={handleChange} data-section="performance" min="0" max="100" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 98" />
          </div>
          <div>
            <label htmlFor="total_miles_driven" className="block text-sm font-medium text-gray-700 mb-1">Total Miles Driven</label>
            <input type="number" id="total_miles_driven" name="total_miles_driven" value={formData.performance?.total_miles_driven ?? ''} onChange={handleChange} data-section="performance" min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 120000" />
          </div>
          <div>
            <label htmlFor="accidents_free" className="block text-sm font-medium text-gray-700 mb-1">Accidents Free</label>
            <input type="number" id="accidents_free" name="accidents_free" value={formData.performance?.accidents_free ?? ''} onChange={handleChange} data-section="performance" min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 5" />
          </div>
        </div>
      </div>
      <hr />
      {/* Assignment */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Current Assignment</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="truck_number" className="block text-sm font-medium text-gray-700 mb-1">Truck Number</label>
            <input type="text" id="truck_number" name="truck_number" value={formData.current_assignment?.truck_number || ''} onChange={handleChange} data-section="current_assignment" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. TRK-001" />
          </div>
          <div>
            <label htmlFor="route" className="block text-sm font-medium text-gray-700 mb-1">Route</label>
            <input type="text" id="route" name="route" value={formData.current_assignment?.route || ''} onChange={handleChange} data-section="current_assignment" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Route 66" />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <input type="text" id="status" name="status" value={formData.current_assignment?.status || ''} onChange={handleChange} data-section="current_assignment" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. on-route" />
          </div>
        </div>
      </div>
      <hr />
      {/* Certifications */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Certifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="hazmat_endorsement" className="block text-sm font-medium text-gray-700 mb-1">Hazmat Endorsement</label>
            <input type="checkbox" id="hazmat_endorsement" name="hazmat_endorsement" checked={formData.certifications?.hazmat_endorsement || false} onChange={handleChange} data-section="certifications" className="mr-2" />
          </div>
          <div>
            <label htmlFor="drug_test_date" className="block text-sm font-medium text-gray-700 mb-1">Drug Test Date</label>
            <input type="date" id="drug_test_date" name="drug_test_date" value={formData.certifications?.drug_test_date || ''} onChange={handleChange} data-section="certifications" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>
      <hr />
      {/* Emergency Contact */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Emergency Contact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="emergency_contact" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" id="emergency_contact" name="emergency_contact" value={formData.emergency_contact?.emergency_contact || ''} onChange={handleChange} data-section="emergency_contact" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Jane Doe" />
          </div>
          <div>
            <label htmlFor="relationship" className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
            <input type="text" id="relationship" name="relationship" value={formData.emergency_contact?.relationship || ''} onChange={handleChange} data-section="emergency_contact" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Spouse" />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="tel" id="phone" name="phone" value={formData.emergency_contact?.phone || ''} onChange={handleChange} data-section="emergency_contact" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. (555) 987-6543" />
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
          {driver ? 'Update' : 'Create'} Driver
        </button>
      </div>
    </form>
  );
};
