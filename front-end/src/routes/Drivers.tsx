import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { Plus, UserCheck, UserX, Star, Truck } from "lucide-react";
import type { Driver } from "../types";
import { apiService } from "../services/api";
import { Table } from "../components/ui/table";
import { Modal } from "../components/ui/Modal";
import { DriverForm } from "../components/forms/driversForms";

/**
 * Interfaz para las propiedades de las columnas de la tabla
 */
interface TableColumn {
  key: string;
  label: string;
  render?: (value: any, row: Driver) => React.ReactNode;
}

/**
 * Propiedades para el componente EmptyTable
 */
interface EmptyTableProps {
  columns: TableColumn[];
}

/**
 * Definición de las columnas de la tabla de conductores
 */
const columns: TableColumn[] = [
  { key: "first_name", label: "First Name" },
  { key: "last_name", label: "Last Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  {
    key: "license",
    label: "License #",
    render: (_, row: Driver) => row.license.number,
  },
  {
    key: "license_expiration",
    label: "License Exp.",
    render: (_, row: Driver) => {
      const expirationDate = new Date(row.license.expiration_date);
      const isExpiringSoon = expirationDate.getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000; // 30 days
      return (
        <span className={isExpiringSoon ? "text-red-600 font-medium" : ""}>
          {expirationDate.toLocaleDateString()}
        </span>
      );
    },
  },
  {
    key: "employment_status",
    label: "Status",
    render: (_, row: Driver) => {
      const status = row.employment.status;
      const statusConfig = {
        active: { bg: "bg-green-100", text: "text-green-800", icon: UserCheck },
        inactive: { bg: "bg-red-100", text: "text-red-800", icon: UserX },
        "on-leave": { bg: "bg-yellow-100", text: "text-yellow-800", icon: UserX },
        suspended: { bg: "bg-red-100", text: "text-red-800", icon: UserX },
      };
      
      const config = statusConfig[status];
      const Icon = config.icon;
      
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
        >
          <Icon size={12} className="mr-1" />
          {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
        </span>
      );
    },
  },
  {
    key: "assignment_status",
    label: "Assignment",
    render: (_, row: Driver) => {
      const status = row.current_assignment.status;
      const statusConfig = {
        available: { bg: "bg-green-100", text: "text-green-800" },
        "on-route": { bg: "bg-blue-100", text: "text-blue-800" },
        loading: { bg: "bg-yellow-100", text: "text-yellow-800" },
        maintenance: { bg: "bg-orange-100", text: "text-orange-800" },
        "off-duty": { bg: "bg-gray-100", text: "text-gray-800" },
      };
      
      const config = statusConfig[status];
      
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
        >
          <Truck size={12} className="mr-1" />
          {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
        </span>
      );
    },
  },
  {
    key: "safety_rating",
    label: "Safety Rating",
    render: (_, row: Driver) => (
      <div className="flex items-center">
        <Star size={12} className="text-yellow-500 mr-1" />
        <span className="text-sm font-medium">
          {row.performance.safety_rating.toFixed(1)}
        </span>
      </div>
    ),
  },
];

/**
 * Configuración de la ruta para la página de conductores
 */
export const Route = createFileRoute("/Drivers")({
  component: Drivers,
  loader: async () => {
    const response = await apiService.get<Driver[]>("drivers");
    // Si la respuesta es un array de arrays, tomar el primer elemento
    return Array.isArray(response) && Array.isArray(response[0]) ? response[0] : response;
  },
  pendingComponent: () => <EmptyTable columns={columns} />,
});

/**
 * Componente principal para la gestión de conductores
 * @returns {JSX.Element} Componente de gestión de conductores
 */
export default function Drivers() {
  // Estados del componente
  const initialDrivers = Route.useLoaderData() as Driver[];
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers || []);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingDriver, setEditingDriver] = useState<Driver | undefined>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Sincroniza el estado local con los datos del loader cuando cambian
   */
  useEffect(() => {
    if (initialDrivers && Array.isArray(initialDrivers)) {
      // Asegurar que tenemos un array plano de conductores
      const flatDrivers = Array.isArray(initialDrivers[0]) 
        ? (initialDrivers as unknown as Driver[][]).flat()
        : initialDrivers;
      setDrivers(flatDrivers);
    }
  }, [initialDrivers]);

  /**
   * Maneja la creación de un nuevo conductor
   */
  const handleCreate = useCallback((): void => {
    setEditingDriver(undefined);
    setIsModalOpen(true);
    setError(null);
  }, []);

  /**
   * Maneja la edición de un conductor existente
   * @param {Driver} driver - El conductor a editar
   */
  const handleEdit = useCallback((driver: Driver): void => {
    setEditingDriver(driver);
    setIsModalOpen(true);
    setError(null);
  }, []);

  /**
   * Maneja la eliminación de un conductor
   * @param {Driver} driver - El conductor a eliminar
   */
  const handleDelete = useCallback(async (driver: Driver): Promise<void> => {
    if (!driver.id) {
      setError("No se puede eliminar un conductor sin ID");
      return;
    }

    const confirmDelete = window.confirm(
      `¿Está seguro de que desea eliminar al conductor ${driver.first_name} ${driver.last_name}?`
    );

    if (!confirmDelete) return;

    setIsLoading(true);
    setError(null);

    try {
      await apiService.delete("drivers", Number(driver.id));
      setDrivers((prev) => prev.filter((d) => d.id !== driver.id));
    } catch (error) {
      console.error("Error deleting driver:", error);
      setError("Error al eliminar el conductor. Por favor, inténtelo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Maneja el envío del formulario de conductor (crear/actualizar)
   * @param {Omit<Driver, "id">} driverData - Los datos del conductor
   */
  const handleSubmit = useCallback(async (driverData: Omit<Driver, "id">): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      if (editingDriver && editingDriver.id) {
        // Actualizar conductor existente
        const updatedDriver = await apiService.update<Driver>(
          "drivers",
          Number(editingDriver.id),
          driverData
        );
        setDrivers((prev) =>
          prev.map((driver) => 
            driver.id === editingDriver.id ? updatedDriver : driver
          )
        );
      } else {
        // Crear nuevo conductor
        const newDriver = await apiService.create<Driver>("drivers", driverData);
        setDrivers((prev) => [...prev, newDriver]);
      }

      // Cerrar modal y limpiar estado
      setIsModalOpen(false);
      setEditingDriver(undefined);
    } catch (error) {
      console.error("Error saving driver:", error);
      setError(
        editingDriver 
          ? "Error al actualizar el conductor. Por favor, inténtelo de nuevo."
          : "Error al crear el conductor. Por favor, inténtelo de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  }, [editingDriver]);

  /**
   * Maneja el cierre del modal
   */
  const handleCloseModal = useCallback((): void => {
    setIsModalOpen(false);
    setEditingDriver(undefined);
    setError(null);
  }, []);

  /**
   * Filtra los conductores basándose en el término de búsqueda
   */
  const filteredDrivers = drivers.filter((driver) => {
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${driver.first_name} ${driver.last_name}`.toLowerCase();
    const email = driver.email.toLowerCase();
    const licenseNumber = driver.license.number.toLowerCase();
    const employeeId = driver.employment.employee_id.toLowerCase();
    const truckNumber = driver.current_assignment.truck_number.toLowerCase();
    const city = driver.address.city.toLowerCase();
    const state = driver.address.state.toLowerCase();

    return (
      fullName.includes(searchLower) ||
      email.includes(searchLower) ||
      licenseNumber.includes(searchLower) ||
      employeeId.includes(searchLower) ||
      truckNumber.includes(searchLower) ||
      city.includes(searchLower) ||
      state.includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Drivers</h1>
          <p className="text-gray-600">
            Manage your fleet drivers ({drivers.length} total)
          </p>
        </div>
        <button
          onClick={handleCreate}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={16} className="mr-2" />
          Add Driver
        </button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <UserCheck className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Drivers</p>
              <p className="text-2xl font-bold text-gray-900">
                {drivers.filter(d => d.employment.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Truck className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">On Route</p>
              <p className="text-2xl font-bold text-gray-900">
                {drivers.filter(d => d.current_assignment.status === 'on-route').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Safety Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {drivers.length > 0 
                  ? (drivers.reduce((sum, d) => sum + d.performance.safety_rating, 0) / drivers.length).toFixed(1)
                  : '0.0'
                }
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <UserX className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Expiring Licenses</p>
              <p className="text-2xl font-bold text-gray-900">
                {drivers.filter(d => {
                  const expiry = new Date(d.license.expiration_date);
                  const thirtyDaysFromNow = new Date();
                  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
                  return expiry <= thirtyDaysFromNow;
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

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

      {/* Barra de búsqueda mejorada */}
      <div className="max-w-md">
        <input
          type="text"
          placeholder="Search by name, email, license, employee ID, truck, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchTerm && (
          <p className="mt-1 text-sm text-gray-600">
            Showing {filteredDrivers.length} of {drivers.length} drivers
          </p>
        )}
      </div>

      {/* Tabla de conductores */}
      <Table
        columns={columns}
        data={filteredDrivers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={isLoading}
      />

      {/* Modal para agregar/editar conductor */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingDriver ? "Edit Driver" : "Add New Driver"}
      >
        <DriverForm
          driver={editingDriver}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
}

/**
 * Componente que se muestra mientras se cargan los datos
 * @param {EmptyTableProps} props - Las propiedades del componente
 * @returns {JSX.Element} Componente de tabla vacía
 */
function EmptyTable({ columns }: EmptyTableProps) {
  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Drivers</h1>
          <p className="text-gray-600">Manage your fleet drivers</p>
        </div>
        <button
          disabled
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 opacity-50 cursor-not-allowed"
        >
          <Plus size={16} className="mr-2" />
          Add Driver
        </button>
      </div>

      {/* Estadísticas vacías */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow border animate-pulse">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
              <div className="ml-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-6 bg-gray-200 rounded w-8"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Barra de búsqueda deshabilitada */}
      <div className="max-w-md">
        <input
          type="text"
          placeholder="Search drivers..."
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* Tabla en estado de carga */}
      <Table
        columns={columns}
        data={[]}
        loading={true}
      />
    </div>
  );
}