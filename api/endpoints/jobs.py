
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from schemas.jobs import JobCreate, JobUpdate, JobOut
import crud.jobs as crud_jobs
from db.session import get_db

job_router = APIRouter()

@job_router.get("/", response_model=List[JobOut])
def read_jobs(db: Session = Depends(get_db)):
    return crud_jobs.get_jobs(db)

@job_router.get("/{job_id}", response_model=JobOut)
def read_job(job_id: int, db: Session = Depends(get_db)):
    job = crud_jobs.get_job(db, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@job_router.post("/", response_model=JobOut)
def create_job(job: JobCreate, db: Session = Depends(get_db)):
    return crud_jobs.create_job(db, job)

@job_router.put("/{job_id}", response_model=JobOut)
def update_job(job_id: int, job: JobUpdate, db: Session = Depends(get_db)):
    updated = crud_jobs.update_job(db, job_id, job)
    if not updated:
        raise HTTPException(status_code=404, detail="Job not found")
    return updated

@job_router.delete("/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db)):
    deleted = crud_jobs.delete_job(db, job_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"detail": "Job deleted successfully"}
