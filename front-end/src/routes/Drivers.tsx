import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, UserCheck, UserX } from "lucide-react";
import type { Driver } from "../types/index";
import { apiService } from "../services/api";
import { DataTable } from "../components/data-table";
import type { GenericColumn } from "../components/data-table-types";
import { Modal } from "../components/Modal";
import { DriverForm } from "../components/forms/driversForms";
import { DataTableConstructor } from "../lib/data-constructor/constructor";

/**
 * Configuración de la ruta para la página de conductores
 */
export const Route = createFileRoute("/Drivers")({
  component: Drivers,
  loader: async () => {
    const response = await apiService.get<Driver[]>("drivers");
    // Si la respuesta es un array de arrays, tomar el primer elemento
    return Array.isArray(response) && Array.isArray(response[0])
      ? response[0]
      : response;
  },
  pendingComponent: () => <EmptyTable />,
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

  // Initialize constructor with custom column configurations
  const [constructor] = useState(() => new DataTableConstructor<Driver>(drivers, {
    autoDetectTypes: true,
    showColumns: [
      "first_name",
      "email",
      "last_name",
      "phone_number",
      "is_active",
    ],
    columns: {
      first_name: {
        label: "First Name",
        enableSorting: true,
        enableFiltering: true,
      },
      last_name: {
        label: "Last Name",
        enableSorting: true,
        enableFiltering: true,
      },
      email: {
        label: "Email",
        type: "email",
        enableSorting: true,
        enableFiltering: true,
      },
      phone_number: {
        label: "Phone",
        type: "phone",
        enableSorting: false, // Phone numbers should not be sortable
        enableFiltering: true,
      },
      "license.number": {
        label: "License #",
        enableSorting: true,
        enableFiltering: true,
        render: (_: any, row: Driver) => row.license?.number ?? "",
      },
      "license.license_expiration": {
        label: "License Exp.",
        type: "date",
        enableSorting: true,
        enableFiltering: true,
        render: (_: any, row: Driver) =>
          row.license?.license_expiration
            ? new Date(row.license.license_expiration).toLocaleDateString()
            : "",
      },
      is_active: {
        label: "Status",
        type: "boolean",
        enableSorting: true,
        enableFiltering: true,
        render: (value: boolean) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {value ? (
              <UserCheck size={12} className="mr-1" />
            ) : (
              <UserX size={12} className="mr-1" />
            )}
            {value ? "Active" : "Inactive"}
          </span>
        ),
      },
    },
  }));

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
   * Update constructor when drivers data changes
   */
  useEffect(() => {
    constructor.data = drivers;
    constructor.autoGenTypes();
  }, [drivers, constructor]);

  // Convert constructor columns to GenericColumn format
  const driverColumns: GenericColumn<Driver>[] = useMemo(() => {
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
    console.log(driver);
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
      await apiService.delete("drivers", driver.id);
      setDrivers((prev) => prev.filter((d) => d.id !== driver.id));
    } catch (error) {
      console.error("Error deleting driver:", error);
      setError(
        "Error al eliminar el conductor. Por favor, inténtelo de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Maneja el envío del formulario de conductor (crear/actualizar)
   * @param {Omit<Driver, "id">} driverData - Los datos del conductor
   */
  const handleSubmit = useCallback(
    async (driverData: Omit<Driver, "id">): Promise<void> => {
      setIsLoading(true);
      setError(null);
      try {
        if (editingDriver && editingDriver.id) {
          // Actualizar conductor existente
          const updatedDriver = await apiService.update<Driver>(
            "drivers",
            editingDriver.id,
            driverData
          );
          setDrivers((prev) =>
            prev.map((driver) =>
              driver.id === editingDriver.id ? updatedDriver : driver
            )
          );
        } else {
          // Crear nuevo conductor
          const newDriver = await apiService.create<Driver>(
            "drivers",
            driverData
          );
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
    },
    [editingDriver]
  );

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

    return fullName.includes(searchLower) || email.includes(searchLower);
  });

  /**
   * Wrapper to adapt form submission to expected type
   */
  const handleFormSubmit = (driverData: Partial<Omit<Driver, "id">>) => {
    // Optionally, validate required fields here before proceeding
    // Only call handleSubmit if required fields are present
    handleSubmit(driverData as Omit<Driver, "id">);
  };

  return (
    <div className="space-y-6 h-full flex-grow flex flex-col">
      {/* Encabezado */}
        <label className="text-2xl font-bold text-gray-900 mx-auto">Manage your fleet drivers</label>

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

      {/* Barra de búsqueda */}
      {/* <div className="max-w-md">
        <input
          type="text"
          placeholder="Search drivers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div> */}

      {/* Tabla de conductores */}
        <DataTable<Driver>
          columns={driverColumns}
          data={filteredDrivers}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={isLoading}
          addRowAction={{
            onClick: handleCreate,
            label: "Add Driver",
          }}
          rowLinkConfig={{ to: "/drivers", paramKey: "driverId" }}
          dataConstructorConfig={constructor.config}
          autoGenerateColumns={false}
          from="/Drivers"
        />

      {/* Modal para agregar/editar conductor */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingDriver ? "Edit Driver" : "Add New Driver"}
      >
        <DriverForm
          driver={editingDriver}
          onSubmit={handleFormSubmit}
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
function EmptyTable() {
  // Simple columns for empty state
  const emptyColumns: GenericColumn<Driver>[] = [
    { key: "first_name", label: "First Name" },
    { key: "last_name", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "phone_number", label: "Phone" },
    { key: "license.number", label: "License #" },
    { key: "license.license_expiration", label: "License Exp." },
    { key: "is_active", label: "Status" },
  ];

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
      <DataTable columns={emptyColumns} data={[]} />
    </div>
  );
}
