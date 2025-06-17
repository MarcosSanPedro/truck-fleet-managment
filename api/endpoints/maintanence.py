from typing import List
from fastapi import APIRouter, Depends, HTTPException
from db.session import get_db
from schemas.maintenance import MaintenanceOut
from sqlalchemy.orm import Session
import crud.maintenance as crud_maintenance



maintenance_router = APIRouter()

@maintenance_router.get("/", response_model=List[MaintenanceOut])
def read_maintenances(db: Session = Depends(get_db)):
   return crud_maintenance.get_maintenances(db)

@maintenance_router.get("/{maintenance_id}", response_model= MaintenanceOut)
def read_maintenance( maintenance_id: int, db: Session = Depends(get_db)):
   maintenance = crud_maintenance.get_maintenance(db, maintenance_id)
   if not maintenance:
      raise HTTPException(status_code=404, detail="Maintenance not found")
    return maintenance
   
   


