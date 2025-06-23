import React, { useState } from 'react';
import type { Driver } from '../types/index';
import { StatusBadge } from './statusBadge';
import { PerformanceIndicator } from './performanceIndicator';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Truck, 
  Star, 
  Shield, 
  Clock,
  User,
  Award,
  Edit3,
  Trash2,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  FileText,
  Users
} from 'lucide-react';

interface DriverProfileProps {
  driverInfo: Driver;
  onEdit: (driver: Driver) => void;
  onDelete: (driverId: number) => void;
  onBack?: () => void;
}

export const DriverProfile: React.FC<DriverProfileProps> = ({ 
  driverInfo, 
  onEdit, 
  onDelete, 
  onBack 
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isLicenseExpiringSoon = () => {
    const expirationDate = new Date(driverInfo.license.expirationDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expirationDate <= thirtyDaysFromNow;
  };

  

  const handleDelete = () => {
    onDelete(driverInfo.id);
    setShowDeleteConfirm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}

      <div className="bg-white shadow-sm border-b border-gray-200">
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {onBack && (
                  <button
                    onClick={onBack}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </button>
                )}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Driver Profile</h1>
                   <h1 className='text-6xl'>Hello</h1>

                  <p className="mt-1 text-sm text-gray-500">
                    Detailed information and management options
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onEdit(driverInfo)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Driver
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Driver
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Driver Overview Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="p-8">
            <div className="flex items-start gap-6">
              <div className="relative">
                <img
                  src={driverInfo.photo}
                  alt={`${driverInfo.first_name} ${driverInfo.last_name}`}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-3 border-white shadow-md ${
                  driverInfo.employment.status === 'active' ? 'bg-green-500' : 
                  driverInfo.employment.status === 'suspended' ? 'bg-red-500' : 'bg-gray-400'
                }`} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {driverInfo.first_name} {driverInfo.last_name}
                    </h2>
                    <div className="flex items-center mt-2 space-x-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="w-4 h-4 mr-1" />
                        ID: {driverInfo.employment.employeeId}
                      </div>
                      <StatusBadge status={driverInfo.employment.status} type="employment" />
                      <StatusBadge status={driverInfo.currentAssignment.status} type="assignment" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-5 h-5 mr-3 text-gray-400" />
                      <span>{driverInfo.phone}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-5 h-5 mr-3 text-gray-400" />
                      <span>{driverInfo.email}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                      <span>{driverInfo.address.city}, {driverInfo.address.state}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                      <span>{driverInfo.employment.yearsExperience} years experience</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Award className="w-5 h-5 mr-3 text-gray-400" />
                      <span>Hired {formatDate(driverInfo.employment.hireDate)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Truck className="w-5 h-5 mr-3 text-gray-400" />
                      <span>Truck: {driverInfo.currentAssignment.truckNumber}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <Star className="w-5 h-5 mr-3 text-yellow-500" />
                      <span>Safety Rating: {driverInfo.performance.safetyRating}/5</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <CheckCircle className="w-5 h-5 mr-3 text-green-500" />
                      <span>{driverInfo.performance.onTimeDeliveryRate}% On-Time</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Shield className="w-5 h-5 mr-3 text-blue-500" />
                      <span>{driverInfo.performance.accidentsFree} days accident-free</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* License & Certifications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                License & Certifications
              </h3>
              
              <div className="space-y-6">
                {/* CDL License */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">CDL License</h4>
                    <div className="flex items-center space-x-2">
                      {driverInfo.license.isValid ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      )}
                      <span className={`text-sm font-medium ${
                        driverInfo.license.isValid ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {driverInfo.license.isValid ? 'Valid' : 'Invalid'}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">License Number:</span>
                      <div className="font-medium">{driverInfo.license.number}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Class:</span>
                      <div className="font-medium">{driverInfo.license.class}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Expires:</span>
                      <div className={`font-medium ${isLicenseExpiringSoon() ? 'text-amber-600' : ''}`}>
                        {formatDate(driverInfo.license.expirationDate)}
                        {isLicenseExpiringSoon() && (
                          <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                            Expiring Soon
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {driverInfo.license.endorsements.length > 0 && (
                    <div className="mt-4">
                      <span className="text-gray-500 text-sm">Endorsements:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {driverInfo.license.endorsements.map((endorsement: string, index: number) => (
                          <span
                            key={index}
                            className="inline-block px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                          >
                            {endorsement}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

             

                {/* Additional Certifications */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Additional Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">HAZMAT Endorsement:</span>
                      <div className={`font-medium ${
                        driverInfo.certifications.hazmatEndorsement ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {driverInfo.certifications.hazmatEndorsement ? 'Yes' : 'No'}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Last Drug Test:</span>
                      <div className="font-medium">{formatDate(driverInfo.certifications.drugTestDate)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance & Assignment */}
          <div className="space-y-8">
            {/* Performance Metrics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  Performance Metrics
                </h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <PerformanceIndicator
                    label="Safety Rating"
                    value={driverInfo.performance.safetyRating}
                    type="rating"
                  />
                  <PerformanceIndicator
                    label="On-Time Delivery"
                    value={driverInfo.performance.onTimeDeliveryRate}
                    type="percentage"
                  />
                  <PerformanceIndicator
                    label="Total Miles"
                    value={driverInfo.performance.totalMilesDriven}
                    type="number"
                  />
                  <PerformanceIndicator
                    label="Accident-Free Days"
                    value={driverInfo.performance.accidentsFree}
                    type="number"
                  />
                </div>
              </div>
            </div>

            {/* Current Assignment */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-blue-600" />
                  Current Assignment
                </h3>
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Truck Number:</span>
                      <div className="font-semibold text-blue-900">{driverInfo.currentAssignment.truckNumber}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Status:</span>
                      <div className="mt-1">
                        <StatusBadge status={driverInfo.currentAssignment.status} type="assignment" />
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span className="text-sm text-gray-500">Route:</span>
                      <div className="font-semibold text-blue-900">{driverInfo.currentAssignment.route}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-green-600" />
                  Emergency Contact
                </h3>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">Name:</span>
                      <div className="font-semibold text-green-900">{driverInfo.emergencyContact.name}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Relationship:</span>
                      <div className="font-medium text-green-800">{driverInfo.emergencyContact.relationship}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Phone:</span>
                      <div className="font-medium text-green-800">{driverInfo.emergencyContact.phone}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Address Details */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-purple-600" />
              Address Information
            </h3>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-purple-900">
                <div className="font-semibold">{driverInfo.address.street}</div>
                <div>{driverInfo.address.city}, {driverInfo.address.state} {driverInfo.address.zipCode}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{driverInfo.first_name} {driverInfo.last_name}</strong>? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete Driver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};