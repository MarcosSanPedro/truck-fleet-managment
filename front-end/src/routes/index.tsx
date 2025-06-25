import type { Driver, Job, Maintenance, Truck } from '@/types';
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';


export const Route = createFileRoute('/')({
  component: Dashboard,
})

export default function Dashboard () {
  const [driversInfo , setDriversInfo] = useState<Driver[]>([])
  const [jobsInfo , setJobsInfo] = useState<Job[]>([])
  const [trucksInfo , setDriverTrucksInfo] = useState<Truck[]>([])
  const [maintenanceInfo , setMaintenanceInfo] = useState<Maintenance[]>([])
  



  

  return (
    <div></div>
  

      
  );
};