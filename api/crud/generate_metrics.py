from fastapi import Depends
from sqlalchemy.orm import Session
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from db.session import get_db, SessionLocal
from crud.metric import update_metric, get_all_metrics
from schemas.metric import MetricOut

import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def generate_metrics(db: Session) -> list[MetricOut]:
    metrics_to_update = [
        ("drivers", "drivers_count"),
        ("trucks", "trucks_count"),
        ("jobs", "jobs_count"),
        ("maintenances", "maintenances_count"),
        ("fleet", "fleet_safety_rating"),
        ("drivers", "active_drivers"),
        ("drivers", "drivers_on_route"),
        ("drivers", "new_drivers_average_rating"),  # New metric
    ]
    
    for entity, name in metrics_to_update:
        try:
            update_metric(db, metric_entity=entity, metric_name=name)
            logger.info(f"Updated metric: {name}")
        except Exception as e:
            logger.error(f"Failed to update metric {name}: {e}")
    
    return get_all_metrics(db)

def start_metrics_scheduler():
    scheduler = AsyncIOScheduler()
    
    async def run_metrics_with_session():
        # Create a new database session for each job execution
        db = SessionLocal()
        try:
            await generate_metrics(db)
            logger.info("Metrics update completed successfully")
        except Exception as e:
            logger.error(f"Scheduled metrics update failed: {e}")
        finally:
            db.close()
    
    scheduler.add_job(
        run_metrics_with_session,
        trigger=IntervalTrigger(seconds=2),
        id='metrics_update_job',
        name='Update metrics every 5 minutes',
        replace_existing=True,
        misfire_grace_time=30
    )
    scheduler.start()
    logger.info("Metrics scheduler started")
    return scheduler