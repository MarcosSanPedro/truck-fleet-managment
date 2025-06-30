# endpoints/scheduler.py
from fastapi import APIRouter, HTTPException, Depends
from typing import Optional, List, Dict, Any
from datetime import datetime

# Import your scheduler instance (we'll create this)
from crud.generate_metrics import (
    add_custom_metric_job,
    remove_metric_job,
    list_metric_jobs
)

scheduler_router = APIRouter()

# We'll need to access the scheduler instance from main.py
# This will be set when the app starts
_scheduler_instance = None

def set_scheduler_instance(scheduler):
    """Set the global scheduler instance"""
    global _scheduler_instance
    _scheduler_instance = scheduler

def get_scheduler():
    """Get the scheduler instance"""
    if _scheduler_instance is None:
        raise HTTPException(status_code=503, detail="Scheduler not available")
    return _scheduler_instance

@scheduler_router.post("/jobs")
async def create_scheduled_job(
    job_id: str,
    entity: Optional[str] = None,
    cron_expression: Optional[str] = None,
    interval_minutes: Optional[int] = None
):
    """Create a new scheduled metric calculation job"""
    try:
        scheduler = get_scheduler()
        add_custom_metric_job(
            scheduler=scheduler,
            job_id=job_id,
            entity=entity,
            cron_expression=cron_expression,
            interval_minutes=interval_minutes
        )
        return {"message": f"Job {job_id} created successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@scheduler_router.get("/jobs")
async def list_scheduled_jobs():
    """List all scheduled jobs"""
    try:
        scheduler = get_scheduler()
        return list_metric_jobs(scheduler)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@scheduler_router.delete("/jobs/{job_id}")
async def delete_scheduled_job(job_id: str):
    """Delete a scheduled job"""
    try:
        scheduler = get_scheduler()
        remove_metric_job(scheduler, job_id)
        return {"message": f"Job {job_id} deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@scheduler_router.get("/status")
async def get_scheduler_status():
    """Get scheduler status"""
    try:
        scheduler = get_scheduler()
        return {
            "running": scheduler.running,
            "jobs_count": len(scheduler.get_jobs()),
            "current_time": datetime.now(),
            "state": str(scheduler.state)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))