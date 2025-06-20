from typing import List
from fastapi import APIRouter, Depends, HTTPException
from db.session import get_db
from models import maintenance as Maintenance
from schemas.maintenance import MaintenanceCreate, MaintenanceOut, MaintenanceUpdate
from sqlalchemy.orm import Session
import crud.maintenance as crud_maintenance

maintenance_router = APIRouter()

@maintenance_router.get("/", response_model=List[MaintenanceOut])
def read_maintenances(db: Session = Depends(get_db)):
    return crud_maintenance.get_maintenances(db)  # Updated CRUD to handle no truck_id

@maintenance_router.get("/{truck_id}", response_model=List[MaintenanceOut])
async def read_truck_maintenance(truck_id: int, limit: int = 100, db: Session = Depends(get_db)):
    maintenances = crud_maintenance.get_maintenances(db, truck_id, limit=limit)
    if not maintenances:
        raise HTTPException(status_code=404, detail="No maintenances found for this truck")
    return maintenances

@maintenance_router.get("/{maintenance_id}", response_model=MaintenanceOut)
def read_maintenance(maintenance_id: int, db: Session = Depends(get_db)):
    maintenance = crud_maintenance.get_maintenance(db, maintenance_id)
    if not maintenance:
        raise HTTPException(status_code=404, detail="Maintenance not found")
    return maintenance

@maintenance_router.post("/", response_model=MaintenanceOut)
def create_maintenance_endpoint(maintenance: MaintenanceCreate, db: Session = Depends(get_db)):
    try:
        return crud_maintenance.create_maintenance(db, maintenance)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@maintenance_router.put("/{truck_id}/maintenances/{maintenance_id}", response_model=MaintenanceOut)
def update_maintenance_endpoint(truck_id: int, id: int, maintenance: MaintenanceUpdate, db: Session = Depends(get_db)):
    db_maintenance = db.query(Maintenance).filter(Maintenance.id == id).first()

    if not db_maintenance or db_maintenance.truck_id != truck_id:
        raise HTTPException(status_code=404, detail="Maintenance not found")
    return crud_maintenance.update_maintenance(db, id, maintenance)

@maintenance_router.delete("/{truck_id}/maintenances/{maintenance_id}", response_model=MaintenanceOut)
def delete_maintenance_endpoint(truck_id: int, maintenance_id: int, db: Session = Depends(get_db)):
    db_maintenance = crud_maintenance.get_maintenance(db, maintenance_id)
    if not db_maintenance or db_maintenance.truck_id != truck_id:
        raise HTTPException(status_code=404, detail="Maintenance not found")
    return crud_maintenance.delete_maintenance(db, maintenance_id)