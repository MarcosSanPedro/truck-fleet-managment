import { useState, useCallback, useEffect } from "react";
import { apiService } from "../services/api";
import { useRouter } from "@tanstack/react-router";

interface UseEntityDetailsConfig {
  // Optionally extend for more complex nested field handling in the future
}

function useEntityDetails<T extends { id?: number }>(
  entityName: string,
  loaderData: T | null,
  config?: UseEntityDetailsConfig
) {
  const [entity, setEntity] = useState<T | null>(loaderData);
  const [editedEntity, setEditedEntity] = useState<T | null>(loaderData);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setEntity(loaderData);
    setEditedEntity(loaderData);
  }, [loaderData]);

  const startEdit = () => setIsEditing(true);
  const cancelEdit = () => {
    setIsEditing(false);
    setEditedEntity(entity);
    setError(null);
  };

  const saveEdit = async () => {
    if (!editedEntity || editedEntity.id == null) return;
    try {
      const updated = await apiService.update<T>(entityName, editedEntity.id, editedEntity);
      setEntity(updated);
      setEditedEntity(updated);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError("Failed to update " + entityName.slice(0, -1));
    }
  };

  const deleteEntity = useCallback(async () => {
    if (!entity || entity.id == null) return;
    try {
      await apiService.delete(entityName, entity.id);
      setShowDeleteConfirm(false);
      if (router.history.canGoBack()) {
        router.history.back();
      } else {
        router.navigate({ to: `/${entityName.charAt(0).toUpperCase() + entityName.slice(1)}` });
      }
    } catch {
      setError(`Failed to delete ${entityName.slice(0, -1)}`);
    }
  }, [entity, entityName, router]);

  const handleFieldChange = (field: string, value: any) => {
    setEditedEntity((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  // For nested fields: handleNestedFieldChange('address', 'city', 'Little Rock')
  const handleNestedFieldChange = (section: string, field: string, value: any) => {
    setEditedEntity((prev) =>
      prev
        ? {
            ...prev,
            [section]: {
              ...(prev as any)[section],
              [field]: value,
            },
          }
        : prev
    );
  };

  return {
    entity,
    editedEntity,
    setEditedEntity,
    isEditing,
    setIsEditing,
    error,
    setError,
    showDeleteConfirm,
    setShowDeleteConfirm,
    startEdit,
    cancelEdit,
    saveEdit,
    deleteEntity,
    handleFieldChange,
    handleNestedFieldChange,
  };
}

export default useEntityDetails; 