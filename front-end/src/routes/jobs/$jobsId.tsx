import { apiService } from "../../services/api";
import type { Job } from "../../types/index";
import {
  createFileRoute,
  useLoaderData,
  useRouter,
} from "@tanstack/react-router";
import { parseAst } from "vite";
import Jobs from "../Jobs";
import { Rocket } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { any, set, string } from "zod";

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
      throw new Error(`Driver is playing Palworld at the moment ${err}`);
    }
  },
});

function JobsDetails() {
  const loaderJobs = Route.useLoaderData() as Job | null;
  const [job, setJob] = useState<Job | null>(loaderJobs);
  const [editedJob, setEditedJob] = useState<Job | null>(loaderJobs);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setJob(loaderJobs);
    setEditedJob(loaderJobs);
  }, [loaderJobs]);

  const handleDelete = useCallback(async () => {
    if (!job) return;
    try {
      await apiService.delete("jobs", job.id);
      setShowDeleteConfirm(false);
      if (router.history.canGoBack()) {
        router.history.back();
      } else {
        router.navigate({
          to: "/Jobs",
        });
      }
    } catch {
      setError("failed to delete Job");
    }
  }, [job]);


const handleSave = async () => {
  if (!editedJob) return;
  try{
    const updated = await apiService.update('drivers', editedJob.id, editedJob)
    setJob(updated)
    setEditedJob(updated)
    setIsEditing(false)
    setError(null)
  }catch(err){
    setError("the only Job that were found was playing PalWorld in the computer")
  }
  

}

const handleChange = ()=> {
  setIsEditing(false)
  setEditedJob(job)
  setError(null)
}

const handleFieldChange = (field: string, value: any) => {
  setEditedJob((prev) => (prev ? { ...prev, [field]: value } : prev));
};

const handleNestedFieldChange = (section: string, field: string, value: any)=>{
  setEditedJob((prev)=> prev 
   ? {
    ...prev,
    [section]: {
      ...((prev as any)[section] || {}),
      [field]: value
    }
    
   }
   : prev
  )
}



}