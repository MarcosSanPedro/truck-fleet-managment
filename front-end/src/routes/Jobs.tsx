import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import type { Job } from '../types/index';
import { apiService } from '../services/api';
import { DataTable } from '../components/data-table';
import type { GenericColumn } from '../components/data-table-types';
import { Modal } from '../components/Modal';
import { JobForm } from '../components/forms/jobsForm';
import { DataTableConstructor } from '../lib/data-constructor/constructor';

/**
 * Configuración de la ruta para la página de trabajos
 */
export const Route = createFileRoute('/Jobs')({
  component: Jobs,
  loader: async () => {
    const response = await apiService.get<Job[]>('jobs');
    // Si la respuesta es un array de arrays, tomar el primer elemento
    return Array.isArray(response) && Array.isArray(response[0])
      ? response[0]
      : response;
  },
  pendingComponent: () => <EmptyTable />,
});

/**
 * Componente principal para la gestión de trabajos
 * @returns {JSX.Element} Componente de gestión de trabajos
 */
export default function Jobs() {
  // Estados del componente
  const initialJobs = Route.useLoaderData() as Job[];
  const [jobs, setJobs] = useState<Job[]>(initialJobs || []);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingJob, setEditingJob] = useState<Job | undefined>();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize constructor with custom column configurations
  const [constructor] = useState(() => new DataTableConstructor<Job>(jobs, {
    autoDetectTypes: true,
    showColumns: [
      "job_number",
      "job_date",
      "job_type",
      "priority",
      "estimatedValue",
      "job_status",
    ],
    columns: {
      job_number: {
        label: 'Job Number',
        enableSorting: true,
        enableFiltering: true,
      },
      job_date: {
        label: 'Date',
        type: 'date',
        enableSorting: true,
        enableFiltering: true,
        render: (value: string) => new Date(value).toLocaleDateString(),
      },
      job_type: {
        label: 'Type',
        enableSorting: true,
        enableFiltering: true,
        render: (value: string) => (
          <span className="capitalize">{value.replace('_', ' ')}</span>
        ),
      },
      job_description: {
        label: 'Description',
        enableSorting: true,
        enableFiltering: true,
        render: (value: string) => (
          <span className="truncate max-w-xs block" title={value}>
            {value}
          </span>
        ),
      },
      job_status: {
        label: 'Status',
        enableSorting: true,
        enableFiltering: true,
        render: (value: string) => (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
            <span className="mr-1">{getStatusIcon(value)}</span>
            {value.replace('_', ' ').toUpperCase()}
          </span>
        ),
      },
    },
  }));

  /**
   * Sincroniza el estado local con los datos del loader cuando cambian
   */
  useEffect(() => {
    if (initialJobs && Array.isArray(initialJobs)) {
      // Asegurar que tenemos un array plano de trabajos
      const flatJobs = Array.isArray(initialJobs[0])
        ? (initialJobs as unknown as Job[][]).flat()
        : initialJobs;
      // Patch: add a unique id if missing
      const patchedJobs = flatJobs.map((job, idx) => ({
        ...job,
        id: job.id ?? job.job_number ?? `job-${idx}`, // Use job_number or fallback to unique string
      }));
      setJobs(patchedJobs);
    }
  }, [initialJobs]);

  /**
   * Update constructor when jobs data changes
   */
  useEffect(() => {
    constructor.data = jobs;
    constructor.autoGenTypes();
  }, [jobs, constructor]);

  // Convert constructor columns to GenericColumn format
  const jobColumns: GenericColumn<Job>[] = useMemo(() => {
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
   * Maneja la creación de un nuevo trabajo
   */
  const handleCreate = useCallback((): void => {
    setEditingJob(undefined);
    setIsModalOpen(true);
    setError(null);
  }, []);

  /**
   * Maneja la edición de un trabajo existente
   * @param {Job} job - El trabajo a editar
   */
  const handleEdit = useCallback((job: Job): void => {
    setEditingJob(job);
    setIsModalOpen(true);
    setError(null);
  }, []);

  /**
   * Maneja la eliminación de un trabajo
   * @param {Job} job - El trabajo a eliminar
   */
  const handleDelete = useCallback(async (job: Job): Promise<void> => {
    if (!job.id) {
      setError('No se puede eliminar un trabajo sin ID');
      return;
    }

    const confirmDelete = window.confirm(
      `¿Está seguro de que desea eliminar el trabajo ${job.job_number}?`
    );

    if (!confirmDelete) return;

    setIsLoading(true);
    setError(null);

    try {
      await apiService.delete('jobs', job.id);
      setJobs((prev) => prev.filter((j) => j.id !== job.id));
    } catch (error) {
      console.error('Error deleting job:', error);
      setError('Error al eliminar el trabajo. Por favor, inténtelo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Maneja el envío del formulario de trabajo (crear/actualizar)
   * @param {Omit<Job, 'id'>} jobData - Los datos del trabajo
   */
  const handleSubmit = useCallback(
    async (jobData: Omit<Job, 'id'>): Promise<void> => {
      setIsLoading(true);
      setError(null);
      try {
        if (editingJob && editingJob.id) {
          // Actualizar trabajo existente
          const updatedJob = await apiService.update<Job>(
            'jobs',
            editingJob.id,
            jobData
          );
          setJobs((prev) =>
            prev.map((job) =>
              job.id === editingJob.id ? { ...job, ...updatedJob } : job
            )
          );
        } else {
          // Crear nuevo trabajo
          const newJob = await apiService.create<Job>('jobs', jobData);
          setJobs((prev) => [...prev, newJob]);
        }

        // Cerrar modal y limpiar estado
        setIsModalOpen(false);
        setEditingJob(undefined);
      } catch (error) {
        console.error('Error saving job:', error);
        setError(
          editingJob
            ? 'Error al actualizar el trabajo. Por favor, inténtelo de nuevo.'
            : 'Error al crear el trabajo. Por favor, inténtelo de nuevo.'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [editingJob]
  );

  /**
   * Maneja el cierre del modal
   */
  const handleCloseModal = useCallback((): void => {
    setIsModalOpen(false);
    setEditingJob(undefined);
    setError(null);
  }, []);

  /**
   * Filtra los trabajos basándose en el término de búsqueda
   */
  const filteredJobs = useMemo(() => jobs.filter((job) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      job.job_number.toLowerCase().includes(searchLower) ||
      job.job_type.toLowerCase().includes(searchLower) ||
      job.job_description.toLowerCase().includes(searchLower)
    );
  }), [jobs, searchTerm]);

  /**
   * Wrapper to adapt form submission to expected type
   */
  const handleFormSubmit = useCallback((jobData: Partial<Omit<Job, 'id'>>) => {
    // Validate required fields before proceeding
    if (
      jobData.job_number &&
      jobData.job_date &&
      jobData.job_type &&
      jobData.job_status &&
      jobData.job_description &&
      jobData.origin &&
      jobData.destination
    ) {
      handleSubmit(jobData as Omit<Job, 'id'>);
    } else {
      setError('Por favor, complete todos los campos requeridos.');
    }
  }, [handleSubmit]);

  /**
   * Obtiene el ícono de estado para el trabajo
   * @param {string} status - El estado del trabajo
   * @returns {JSX.Element} Ícono correspondiente al estado
   */
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={12} className="text-green-600" />;
      case 'in-progress':
        return <Clock size={12} className="text-blue-600" />;
      case 'pending':
        return <Calendar size={12} className="text-yellow-600" />;
      case 'cancelled':
        return <XCircle size={12} className="text-red-600" />;
      default:
        return <Clock size={12} className="text-gray-600" />;
    }
  };

  /**
   * Obtiene el color de fondo y texto para el estado del trabajo
   * @param {string} status - El estado del trabajo
   * @returns {string} Clases de estilo para el estado
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 h-full flex-grow flex flex-col">
      {/* Encabezado */}
      <label className="text-2xl font-bold text-gray-900 mx-auto">Manage fleet jobs and assignments</label>

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

      {/* Tabla de trabajos */}
      <DataTable<Job>
        columns={jobColumns}
        data={filteredJobs}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={isLoading}
        addRowAction={{
          onClick: handleCreate,
          label: 'Add Job',
        }}
        rowLinkConfig={{ to: '/jobs', paramKey: 'jobsId' }}
        dataConstructorConfig={constructor.config}
        autoGenerateColumns={false}
        from="/Jobs"
      />

      {/* Modal para agregar/editar trabajo */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingJob ? 'Edit Job' : 'Add New Job'}
      >
        <JobForm
          job={editingJob}
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
  const emptyColumns: GenericColumn<Job>[] = [
    { key: 'job_number', label: 'Job Number' },
    { key: 'job_date', label: 'Date' },
    { key: 'job_type', label: 'Type' },
    { key: 'job_description', label: 'Description' },
    { key: 'job_status', label: 'Status' },
  ];

  return (
    <div className="space-y-6 h-full flex-grow flex flex-col">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
          <p className="text-gray-600">Manage fleet jobs and assignments</p>
        </div>
        <button
          disabled
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 opacity-50 cursor-not-allowed"
        >
          <Plus size={16} className="mr-2" />
          Add Job
        </button>
      </div>

      {/* Barra de búsqueda deshabilitada */}
      <div className="max-w-md">
        <input
          type="text"
          placeholder="Search jobs..."
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* Tabla en estado de carga */}
      <DataTable columns={emptyColumns} data={[]} loading={true} />
    </div>
  );
}