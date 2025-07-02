import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/trucks/$truckId')({
  component: TruckDetail,
});

function TruckDetail() {
  const { truckId } = Route.useParams();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Truck Detail</h1>
      <p>Truck ID: {truckId}</p>
      {/* Add more truck details here later */}
    </div>
  );
} 