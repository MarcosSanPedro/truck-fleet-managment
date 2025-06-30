# crud/generate_metrics.py
import logging
from datetime import datetime
from typing import Dict
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger
from db.session import SessionLocal
from crud.metric import calculate_all_metrics, calculate_driver_metrics_by_property

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def start_metrics_scheduler() -> AsyncIOScheduler:
    """Initialize and start the metrics scheduler"""
    scheduler = AsyncIOScheduler()
    
    # Add default jobs
    add_default_metric_jobs(scheduler)
    
    # Start the scheduler
    scheduler.start()
    logger.info(f"Metrics scheduler started at {datetime.now()}")
    
    return scheduler

def add_default_metric_jobs(scheduler: AsyncIOScheduler):
    """Add default metric calculation jobs"""

    # Job 1: Calculate all metrics every 5 minutes
    scheduler.add_job(
        func=calculate_all_metrics_job,
        trigger=IntervalTrigger(seconds=20),
        id="all_metrics_5min",
        name="Calculate all metrics - 5 minutes",
        max_instances=1,
        coalesce=True,
        kwargs={"entity": None}
    )
    
    # Job 2: Calculate driver metrics every hour
    scheduler.add_job(
        func=calculate_all_metrics_job,
        trigger=CronTrigger(minute=1),  # Every hour at minute 0
        id="driver_metrics_hourly",
        name="Calculate driver metrics - hourly",
        max_instances=1,
        coalesce=True,
        kwargs={"entity": "drivers"}
    )
    
    # Job 3: Calculate truck metrics daily at 2 AM
    scheduler.add_job(
        func=calculate_all_metrics_job,
        trigger=CronTrigger(hour=2, minute=0),  # Daily at 2:00 AM
        id="truck_metrics_daily",
        name="Calculate truck metrics - daily",
        max_instances=1,
        coalesce=True,
        kwargs={"entity": "trucks"}
    )
    
    # Job 4: Calculate job metrics every 30 minutes
    scheduler.add_job(
        func=calculate_all_metrics_job,
        trigger=IntervalTrigger(minutes=30),
        id="job_metrics_30min",
        name="Calculate job metrics - 30 minutes",
        max_instances=1,
        coalesce=True,
        kwargs={"entity": "jobs"}
    )
    
    # Job 5: Calculate maintenance metrics daily at 3 AM
    scheduler.add_job(
        func=calculate_all_metrics_job,
        trigger=CronTrigger(hour=3, minute=0),  # Daily at 3:00 AM
        id="maintenance_metrics_daily",
        name="Calculate maintenance metrics - daily",
        max_instances=1,
        coalesce=True,
        kwargs={"entity": "maintenance"}
    )
    
    logger.info("Default metric calculation jobs added to scheduler")

def calculate_all_metrics_job(entity: str = None):
    """Job function to calculate metrics - must be synchronous for APScheduler"""
    try:
        logger.info(f"Starting metric calculation job for entity: {entity or 'all'}")
        
        # Create database session
        db = SessionLocal()
        try:
            # Calculate metrics
            updated_metrics = calculate_all_metrics(db, entity=entity)
            
            logger.info(
                f"Completed metric calculation for entity: {entity or 'all'}. "
                f"Updated {len(updated_metrics)} metrics"
            )
            
            # Log individual metric updates (debug level)
            for metric in updated_metrics:
                logger.debug(f"Updated metric: {metric.name} = {metric.value}")
                
        finally:
            db.close()
            
    except Exception as e:
        logger.error(f"Error in metric calculation job for entity {entity}: {str(e)}")

def add_custom_metric_job(
    scheduler: AsyncIOScheduler,
    job_id: str,
    entity: str = None,
    cron_expression: str = None,
    interval_minutes: int = None
):
    """Add a custom metric calculation job"""
    
    # Remove existing job if it exists
    if scheduler.get_job(job_id):
        scheduler.remove_job(job_id)
    
    # Determine trigger
    if cron_expression:
        trigger = CronTrigger.from_crontab(cron_expression)
    elif interval_minutes:
        trigger = IntervalTrigger(minutes=interval_minutes)
    else:
        raise ValueError("Either cron_expression or interval_minutes must be provided")
    
    # Add the job
    scheduler.add_job(
        func=calculate_all_metrics_job,
        trigger=trigger,
        id=job_id,
        name=f"Custom metric calculation - {job_id}",
        max_instances=1,
        coalesce=True,
        kwargs={"entity": entity}
    )
    
    logger.info(f"Added custom metric job: {job_id}")

def remove_metric_job(scheduler: AsyncIOScheduler, job_id: str):
    """Remove a metric calculation job"""
    if scheduler.get_job(job_id):
        scheduler.remove_job(job_id)
        logger.info(f"Removed metric job: {job_id}")
    else:
        logger.warning(f"Job {job_id} not found")

def list_metric_jobs(scheduler: AsyncIOScheduler):
    """List all metric calculation jobs"""
    jobs = []
    for job in scheduler.get_jobs():
        jobs.append({
            "id": job.id,
            "name": job.name,
            "next_run": job.next_run_time,
            "trigger": str(job.trigger)
        })

    return jobs