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
        print('whatsup')
        lock.acquire(timeout=1)
        scheduler = start_metrics_scheduler()
    except Timeout:
        logger.info("Scheduler already running in another worker")

    yield
    if scheduler:
        scheduler.shutdown()
        lock.release()
        logger.info(f"Metrics scheduler stopped at {time.ctime()}")

# Crear instancia de la app
app = FastAPI(title="Truck Fleet Management API") #  lifespan=lifespan

# Configure CORS
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear las tablas automáticamente si no existen
Base.metadata.create_all(bind=engine)

# Registrar los routers
app.include_router(truck_router, prefix="/trucks", tags=["Trucks"])
app.include_router(driver_router, prefix="/drivers", tags=["Driver"])
app.include_router(job_router, prefix="/jobs", tags=["Jobs"])
app.include_router(maintenance_router, prefix="/maintenance", tags=["Maintenance"])
app.include_router(router, prefix="/metrics", tags=["Metrics"])
