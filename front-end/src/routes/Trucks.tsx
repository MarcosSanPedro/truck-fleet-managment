import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Truck as TruckIcon } from 'lucide-react';
import type { Truck } from '../types/index';
import { apiService } from '../services/api';
import { DataTable } from '../components/data-table';
import type { GenericColumn } from '../components/data-table-types';
import { Modal } from '../components/Modal';
import { TruckForm } from '../components/forms/trucksForm';
import { DataTableConstructor } from '../lib/data-constructor/constructor';

/**
 * Configuración de la ruta para la página de camiones
 */
export const Route = createFileRoute('/Trucks')({
  component: Trucks,
  loader: async () => {
    const response = await apiService.get<Truck[]>('trucks');
    // Si la respuesta es un array de arrays, tomar el primer elemento
    return Array.isArray(response) && Array.isArray(response[0])
      ? response[0]
      : response;
  },
  pendingComponent: () => <EmptyTable />,
});

/**
 * Componente principal para la gestión de camiones
 * @returns {JSX.Element} Componente de gestión de camiones
 */
export default function Trucks() {
  // Estados del componente
  const initialTrucks = Route.useLoaderData() as Truck[];
  const [trucks, setTrucks] = useState<Truck[]>(initialTrucks || []);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingTruck, setEditingTruck] = useState<Truck | undefined>();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize constructor with custom column configurations
  const [constructor] = useState(() => new DataTableConstructor<Truck>(trucks, {
    autoDetectTypes: true,
    columns: {
      make: {
        label: 'Make/Model',
        enableSorting: true,
        enableFiltering: true,
        render: (_: any, row: Truck) => (
          <div className="flex items-center">
            <TruckIcon size={12} className="mr-2 text-gray-500" />
            <span>{`${row.make} ${row.model}`}</span>
          </div>
        ),
      },
      year: {
        label: 'Year',
        type: 'number',
        enableSorting: true,
        enableFiltering: true,
      },
      color: {
        label: 'Color',
        enableSorting: true,
        enableFiltering: true,
      },
      mileage: {
        label: 'Mileage',
        type: 'number',
        enableSorting: true,
        enableFiltering: true,
        render: (value: number) => `${value.toLocaleString()} mi`,
      },
      plate: {
        label: 'License Plate',
        enableSorting: true,
        enableFiltering: true,
      },
      assign_driver: {
        label: 'Assigned Driver',
        enableSorting: true,
        enableFiltering: true,
        render: (value: string) => (
          <span className={value ? 'text-gray-900' : 'text-gray-400 italic'}>
            {value || 'Unassigned'}
          </span>
        ),
      },
      vin: {
        label: 'VIN',
        enableSorting: true,
        enableFiltering: true,
        render: (value: string) => (
          <span className="font-mono text-sm truncate max-w-xs block" title={value}>
            {value}
          </span>
        ),
      },
    },
  }));

  /**
   * Sincroniza el estado local con los datos del loader cuando cambian
   */
  useEffect(() => {
    if (initialTrucks && Array.isArray(initialTrucks)) {
      // Asegurar que tenemos un array plano de camiones
      const flatTrucks = Array.isArray(initialTrucks[0])
        ? (initialTrucks as unknown as Truck[][]).flat()
        : initialTrucks;
      // Patch: ensure id is a number or undefined
      const patchedTrucks = flatTrucks.map((truck) => ({
        ...truck,
        id: truck.id ?? undefined, // Keep as undefined if no id exists
      }));
      setTrucks(patchedTrucks);
    }
  }, [initialTrucks]);

  /**
   * Update constructor when trucks data changes
   */
  useEffect(() => {
    constructor.data = trucks;
    constructor.autoGenTypes();
  }, [trucks, constructor]);

  // Convert constructor columns to GenericColumn format
  const truckColumns: GenericColumn<Truck>[] = useMemo(() => {
    return constructor.getDataTableColumns().map(col => ({
      key: col.key,
      label: col.label,
      dataType: col.dataType as any,
      enableSorting: col.sortable,
      enableFiltering: col.filterable,
      visible: col.visible,
      minWidth: col.minWidth,
      sticky: col.sticky,
      render: col.render,
    }));
  }, [constructor]);

  /**
   * Maneja la creación de un nuevo camión
   */
  const handleCreate = useCallback((): void => {
    setEditingTruck(undefined);
    setIsModalOpen(true);
    setError(null);
  }, []);

  /**
   * Maneja la edición de un camión existente
   * @param {Truck} truck - El camión a editar
   */
  const handleEdit = useCallback((truck: Truck): void => {
    setEditingTruck(truck);
    setIsModalOpen(true);
    setError(null);
  }, []);

  /**
   * Maneja la eliminación de un camión
   * @param {Truck} truck - El camión a eliminar
   */
  const handleDelete = useCallback(async (truck: Truck): Promise<void> => {
    if (!truck.id) {
      setError('No se puede eliminar un camión sin ID');
      return;
    }

    const confirmDelete = window.confirm(
      `¿Está seguro de que desea eliminar el camión ${truck.make} ${truck.model} (${truck.plate})?`
    );

    if (!confirmDelete) return;

    setIsLoading(true);
    setError(null);

    try {
      await apiService.delete('trucks', truck.id);
      setTrucks((prev) => prev.filter((t) => t.id !== truck.id));
    } catch (error) {
      console.error('Error deleting truck:', error);
      setError('Error al eliminar el camión. Por favor, inténtelo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Maneja el envío del formulario de camión (crear/actualizar)
   * @param {Omit<Truck, 'id'>} truckData - Los datos del camión
   */
  const handleSubmit = useCallback(
    async (truckData: Omit<Truck, 'id'>): Promise<void> => {
      setIsLoading(true);
      setError(null);
      try {
        if (editingTruck && editingTruck.id) {
          // Actualizar camión existente
          const updatedTruck = await apiService.update<Truck>(
            'trucks',
            editingTruck.id,
            truckData
          );
          setTrucks((prev) =>
            prev.map((truck) =>
              truck.id === editingTruck.id ? { ...truck, ...updatedTruck } : truck
            )
          );
        } else {
          // Crear nuevo camión
          const newTruck = await apiService.create<Truck>('trucks', truckData);
          setTrucks((prev) => [...prev, newTruck]);
        }

        // Cerrar modal y limpiar estado
        setIsModalOpen(false);
        setEditingTruck(undefined);
      } catch (error) {
        console.error('Error saving truck:', error);
        setError(
          editingTruck
            ? 'Error al actualizar el camión. Por favor, inténtelo de nuevo.'
            : 'Error al crear el camión. Por favor, inténtelo de nuevo.'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [editingTruck]
  );

  /**
   * Maneja el cierre del modal
   */
  const handleCloseModal = useCallback((): void => {
    setIsModalOpen(false);
    setEditingTruck(undefined);
    setError(null);
  }, []);

  /**
   * Filtra los camiones basándose en el término de búsqueda
   */
  const filteredTrucks = useMemo(() => trucks.filter((truck) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      `${truck.make} ${truck.model}`.toLowerCase().includes(searchLower) ||
      truck.plate.toLowerCase().includes(searchLower) ||
      truck.vin.toLowerCase().includes(searchLower) ||
      (truck.assign_driver?.toLowerCase() || '').includes(searchLower)
    );
  }), [trucks, searchTerm]);

  /**
   * Wrapper to adapt form submission to expected type
   */
  const handleFormSubmit = useCallback((truckData: Partial<Omit<Truck, 'id'>>) => {
    // Validate required fields before proceeding
    if (truckData.make && truckData.model && truckData.year && truckData.plate) {
      handleSubmit(truckData as Omit<Truck, 'id'>);
    } else {
      setError('Por favor, complete todos los campos requeridos.');
    }
  }, [handleSubmit]);

  return (
    <div className="space-y-6 h-full flex-grow flex flex-col">
      {/* Encabezado */}
      <label className="text-2xl font-bold text-gray-900 mx-auto">Manage your fleet vehicles</label>

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Tabla de camiones */}
      <DataTable<Truck>
        columns={truckColumns}
        data={filteredTrucks}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={isLoading}
        addRowAction={{
          onClick: handleCreate,
          label: 'Add Truck',
        }}
        rowLinkConfig={{ to: '/trucks', paramKey: 'truckId' }}
        dataConstructorConfig={constructor.config}
        autoGenerateColumns={false}
        from="/Trucks"
      />

      {/* Modal para agregar/editar camión */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTruck ? 'Edit Truck' : 'Add New Truck'}
      >
        <TruckForm
          truck={editingTruck}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
}

/**
 * Componente que se muestra mientras se cargan los datos
 * @returns {JSX.Element} Componente de tabla vacía
 */
function EmptyTable() {
  // Simple columns for empty state
  const emptyColumns: GenericColumn<Truck>[] = [
    { key: 'make', label: 'Make/Model' },
    { key: 'year', label: 'Year' },
    { key: 'color', label: 'Color' },
    { key: 'mileage', label: 'Mileage' },
    { key: 'plate', label: 'License Plate' },
    { key: 'assign_driver', label: 'Assigned Driver' },
    { key: 'vin', label: 'VIN' },
  ];

  return (
    <div className="space-y-6 h-full flex-grow flex flex-col">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trucks</h1>
          <p className="text-gray-600">Manage your fleet vehicles</p>
        </div>
        <button
          disabled
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 opacity-50 cursor-not-allowed"
        >
          <Plus size={16} className="mr-2" />
          Add Truck
        </button>
      </div>

      {/* Barra de búsqueda deshabilitada */}
      <div className="max-w-md">
        <input
          type="text"
          placeholder="Search trucks..."
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* Tabla en estado de carga */}
      <DataTable columns={emptyColumns} data={[]} loading={true} />
    </div>
  );
}