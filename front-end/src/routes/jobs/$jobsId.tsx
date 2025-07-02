import { apiService } from "../../services/api";
import type { Job } from "../../types/index";
import {
  createFileRoute,
} from "@tanstack/react-router";
import useEntityDetails from "../../lib/useEntityDetails";

export const Route = createFileRoute("/jobs/$jobsId")({
  component: JobsDetails,
  loader: async ({ params }) => {
    try {
      const job = await apiService.getById<Job>("jobs", Number(params.jobsId));
      if (!job) {
        throw new Error("Job not found");
      }
      return job;
    } catch (err) {
      throw new Error(`Job not found: ${err}`);
    }
  },
});

function JobsDetails() {
  const loaderJob = Route.useLoaderData() as Job | null;
  const {
    entity: job,
    editedEntity: editedJob,
    isEditing,
    error,
    showDeleteConfirm,
    setShowDeleteConfirm,
    startEdit,
    cancelEdit,
    saveEdit,
    deleteEntity,
    handleFieldChange,
  } = useEntityDetails<Job>("jobs", loaderJob);

  if (!job || !editedJob) return <div>Error: Job not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Job Details</h1>
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Job Number</label>
            <input
              className="border rounded px-2 py-1 w-full"
              value={editedJob.job_number}
              onChange={e => handleFieldChange("job_number", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Job Date</label>
            <input
              className="border rounded px-2 py-1 w-full"
              type="date"
              value={editedJob.job_date}
              onChange={e => handleFieldChange("job_date", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Job Type</label>
            <input
              className="border rounded px-2 py-1 w-full"
              value={editedJob.job_type}
              onChange={e => handleFieldChange("job_type", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              className="border rounded px-2 py-1 w-full"
              value={editedJob.job_description}
              onChange={e => handleFieldChange("job_description", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Status</label>
            <input
              className="border rounded px-2 py-1 w-full"
              value={editedJob.job_status}
              onChange={e => handleFieldChange("job_status", e.target.value)}
            />
          </div>
          <div className="flex space-x-2 mt-4">
            <button
              onClick={saveEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={cancelEdit}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div>
            <span className="font-semibold">Job Number:</span> {job.job_number}
          </div>
          <div>
            <span className="font-semibold">Job Date:</span> {job.job_date}
          </div>
          <div>
            <span className="font-semibold">Job Type:</span> {job.job_type}
          </div>
          <div>
            <span className="font-semibold">Description:</span> {job.job_description}
          </div>
          <div>
            <span className="font-semibold">Status:</span> {job.job_status}
          </div>
          <div className="flex space-x-2 mt-4">
            <button
              onClick={startEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      )}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this job? This action cannot be undone.
            </p>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteEntity}
                className="px-4 py-2 bg-red-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-red-700 transition-colors"
              >
                Delete Job
              </button>
            </div>
          </div>
        </div>
      )}
      {error && !showDeleteConfirm && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}