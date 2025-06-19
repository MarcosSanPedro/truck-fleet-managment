import type { Driver } from '@/types'
import { apiService } from '../../services/api'
import { createFileRoute } from '@tanstack/react-router'
import { AlertTriangle, CheckCircle, Clock, Wrench } from 'lucide-react'



export const Route = createFileRoute('/drivers/$driverId')({
  component: DriverDetails,
  loader: async ({ params })=>{
    return apiService.getById<Driver>('/drivers', Number(params.driverId))
  }
})

const getMaintenanceStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'scheduled':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'overdue':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getMaintenanceIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-4 h-4" />;
    case 'scheduled':
      return <Clock className="w-4 h-4" />;
    case 'overdue':
      return <AlertTriangle className="w-4 h-4" />;
    default:
      return <Wrench className="w-4 h-4" />;
  }
};

function DriverDetails() { 
  const details = Route.useLoaderData()


  const handleEdit = (driver: any) => {
    console.log('Edit driver:', driver);
    // TODO: Implement edit functionality
    // Example: navigate to edit form or open edit modal
  };

  const handleDelete = (driverId: string) => {
    console.log('Delete driver:', driverId);
    // TODO: Implement delete functionality
    // Example: call API to delete driver and navigate back
  };

  const handleBack = () => {
    console.log('Navigate back');
    // TODO: Implement navigation back to drivers list
    // Example: router.push('/drivers')
  };

  return (
    <DriverProfile
      driver={driver}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onBack={handleBack}
    />
  );

  
}
