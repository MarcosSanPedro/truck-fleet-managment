import { apiService } from '@/services/api'
import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import type { Driver } from '../types/index'
import ObjectDebugger from '@/components/custom/ObjectDebugger' // Adjust path as needed
import { DataTableConstructor } from '@/lib/data-constructor/constructor'

export const Route = createFileRoute('/DataTest')({
  component: RouteComponent,
  loader: () => apiService.get<Driver>("drivers")
})

function RouteComponent() {

  const driversData = Route.useLoaderData()

  const constructTableData = new DataTableConstructor(driversData, {
    columns: {
      "is_active": {
        filter: {
          getUniques: true
        }
      }
    }
  })


  return <div>
    <ObjectDebugger driversData={constructTableData.constructorData} />
  </div>
}