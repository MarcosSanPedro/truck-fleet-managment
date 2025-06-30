import { apiService } from '../services/api';
import type { Driver, Job, Maintenance, Truck, Metric } from '../types/index';
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react';


export const Route = createFileRoute('/')({
  component: Dashboard,
})

export default function Dashboard () {

  const test = apiService.get<Metric>('/metrics')
  console.log(test)
 


  

 



  

  return (
    <div></div>
  

      
  );
};