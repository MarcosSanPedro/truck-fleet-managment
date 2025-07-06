import { createFileRoute } from "@tanstack/react-router"
import { apiService } from "@/services/api";
import type { Driver } from "../types/index";
import ObjectDebugger from "@/components/custom/ObjectDebugger"; // Adjust path as needed
import { DataTableConstructor } from "@/lib/data-constructor/constructor";
import { DebugConstructor } from "@/components/debug-constructor";
import { DataTableWithConstructor } from "@/components/data-table-example";

export const Route = createFileRoute("/DataTest")({
  component: RouteComponent,
  loader: () => apiService.get<Driver>("drivers"),
});

function RouteComponent() {
  const driversData = Route.useLoaderData();

  const constructTableData = new DataTableConstructor(driversData, {
    columns: {
      is_active: {
        filterConfig: {
          getUniques: true,
        },
      },
    },
  });

  return (
    <div>
      <ObjectDebugger driversData={constructTableData.constructorData} />
      <DebugConstructor />
      <DataTableWithConstructor />
    </div>
  );
}
