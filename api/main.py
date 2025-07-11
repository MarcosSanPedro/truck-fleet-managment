# Updated main.py
from contextlib import asynccontextmanager
import logging
import time
from fastapi import FastAPI
from crud.generate_metrics import start_metrics_scheduler
from db.session import engine, SessionLocal, get_db
from models.base import Base
from endpoints.drivers import driver_router
from endpoints.jobs import job_router
from endpoints.metric import router
from endpoints.trucks import truck_router
from endpoints.maintanence import maintenance_router
from endpoints.scheduler import scheduler_router, set_scheduler_instance  # Add this import
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from filelock import FileLock, Timeout

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Scheduler setup
scheduler: AsyncIOScheduler = None
lock = FileLock("scheduler.lock")

@asynccontextmanager
async def lifespan(app: FastAPI):
    global scheduler
    try:
        logger.info('Starting application and initializing scheduler...')
        lock.acquire(timeout=1)
        scheduler = start_metrics_scheduler()
        
        # Set the scheduler instance for the API endpoints
        set_scheduler_instance(scheduler)
        
        logger.info("Application startup completed successfully")
        
    except Timeout:
        logger.info("Scheduler already running in another worker")
    except Exception as e:
        logger.error(f"Error during startup: {str(e)}")

    yield
    
    # Shutdown
    if scheduler:
        scheduler.shutdown()
        lock.release()
        logger.info(f"Metrics scheduler stopped at {time.ctime()}")

# Create FastAPI instance with lifespan
app = FastAPI(
    title="Truck Fleet Management API",
    lifespan=lifespan  # Enable the lifespan
)

# Configure CORS
origins = [
    "https://truckfleet.dev",
    "https://www.truckfleet.dev"
    "http://localhost:3000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables automatically if they don't exist
Base.metadata.create_all(bind=engine)

# Register routers
app.include_router(truck_router, prefix="/trucks", tags=["Trucks"])
app.include_router(driver_router, prefix="/drivers", tags=["Driver"])
app.include_router(job_router, prefix="/jobs", tags=["Jobs"])
app.include_router(maintenance_router, prefix="/maintenance", tags=["Maintenance"])
app.include_router(router, prefix="/metrics", tags=["Metrics"])
app.include_router(scheduler_router, prefix="/scheduler", tags=["Scheduler"])  # Add scheduler endpoints

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    scheduler_status = "unknown"
    jobs_count = 0
    
    try:
        if scheduler:
            scheduler_status = "running" if scheduler.running else "stopped"
            jobs_count = len(scheduler.get_jobs())
    except Exception:
        scheduler_status = "error"
    
    return {
        "status": "healthy",
        "timestamp": time.ctime(),
        "scheduler_status": scheduler_status,
        "scheduled_jobs": jobs_count
    }