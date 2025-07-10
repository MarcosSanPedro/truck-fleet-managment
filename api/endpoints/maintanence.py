from typing import List
from fastapi import APIRouter, Depends, HTTPException
from db.session import get_db
from models import maintenance as Maintenance
from schemas.maintenance import MaintenanceCreate, MaintenanceOut, MaintenanceUpdate
from sqlalchemy.orm import Session
import crud.maintenance as crud_maintenance

maintenance_router = APIRouter()

# Get all maintenances
@maintenance_router.get("/", response_model=List[MaintenanceOut])
def read_maintenances(db: Session = Depends(get_db)):
    return crud_maintenance.get_maintenances(db)

# Get all maintenances for a specific truck
@maintenance_router.get("/truck/{truck_id}", response_model=List[MaintenanceOut])
def read_truck_maintenances(truck_id: int, limit: int = 100, db: Session = Depends(get_db)):
    maintenances = crud_maintenance.get_maintenances(db, truck_id, limit=limit)
    if not maintenances:
        raise HTTPException(status_code=404, detail="No maintenances found for this truck")
    return maintenances

# Get a single maintenance by ID
@maintenance_router.get("/{maintenance_id}", response_model=MaintenanceOut)
def read_maintenance(maintenance_id: int, db: Session = Depends(get_db)):
    maintenance = crud_maintenance.get_maintenance(db, maintenance_id)
    if not maintenance:
        raise HTTPException(status_code=404, detail="Maintenance not found")
    return maintenance

# Create a new maintenance
@maintenance_router.post("/", response_model=MaintenanceOut)
def create_maintenance_endpoint(maintenance: MaintenanceCreate, db: Session = Depends(get_db)):
    try:
        return crud_maintenance.create_maintenance(db, maintenance)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# Update a maintenance by ID
@maintenance_router.put("/{maintenance_id}", response_model=MaintenanceOut)
def update_maintenance_endpoint(maintenance_id: int, maintenance: MaintenanceUpdate, db: Session = Depends(get_db)):
    db_maintenance = crud_maintenance.get_maintenance(db, maintenance_id)
    if not db_maintenance:
        raise HTTPException(status_code=404, detail="Maintenance not found")
    return crud_maintenance.update_maintenance(db, maintenance_id, maintenance)

# Delete a maintenance by ID
@maintenance_router.delete("/{maintenance_id}", response_model=MaintenanceOut)
def delete_maintenance_endpoint(maintenance_id: int, db: Session = Depends(get_db)):
    db_maintenance = crud_maintenance.get_maintenance(db, maintenance_id)
    if not db_maintenance:
        raise HTTPException(status_code=404, detail="Maintenance not found")
    return crud_maintenance.delete_maintenance(db, maintenance_id)