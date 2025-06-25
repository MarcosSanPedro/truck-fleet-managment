import { apiService } from '../services/api';
import type { Driver, Job, Maintenance, Truck } from '@/types';
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react';


export const Route = createFileRoute('/')({
  component: Dashboard,
})

export default function Dashboard () {
  const [driversInfo , setDriversInfo] = useState<Driver[]>([])
  const [jobsInfo , setJobsInfo] = useState<Job[]>([])
  const [trucksInfo , setDriverTrucksInfo] = useState<Truck[]>([])
  const [maintenanceInfo , setMaintenanceInfo] = useState<Maintenance[]>([])
  const [loading, setLoading] = useState(true)


  useEffect(()=>{
    loadInfo()
  },[])
  

  const loadInfo = async ()=>{
    try{
    setLoading(true);
    const driverData = await apiService.get<Driver>('/drivers')
    setDriversInfo(driverData)
  } catch(err){
    console.log('drivers are playing Minecraft rn, we could not fetch them', err)
  }
  finally{
    setLoading(false)
  }
  }

 



  

  return (
    <div></div>
  

      
  );
};