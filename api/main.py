from fastapi import FastAPI
from db.session import engine, SessionLocal
from models.base import Base
from endpoints.drivers import driver_router
from endpoints.jobs import job_router
from endpoints.trucks import truck_router

# Crear instancia de la app
app = FastAPI(title="Truck Fleet Management API")

# Crear las tablas automáticamente si no existen
Base.metadata.create_all(bind=engine)

# Registrar los routers
app.include_router(truck_router, prefix="/trucks", tags=["Trucks"])
app.include_router(driver_router, prefix="/drivers", tags=["Drivers"])
app.include_router(job_router, prefix="/jobs", tags=["Jobs"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()