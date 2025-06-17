

from datetime import timedelta

from fastapi import HTTPException
from api.models.trucks import Truck
from models.maintenance import Maintenance
from schemas.maintenance import MaintenanceCreate
from db.session import Session




def create_maintenance(db: Session, maintenance: MaintenanceCreate, truck_id: int):
    # Validate truck exists
    if not db.query(Truck).filter(Truck.id == truck_id).first():
        raise ValueError("Truck does not exist")
    db_maintenance = Maintenance(**maintenance.model_dump(), truck_id=truck_id)
    db.add(db_maintenance)
    db.commit()
    db.refresh(db_maintenance)
    db_maintenance.next_scheduled = db_maintenance.date + timedelta(days=180)
    db.commit()
    if db_maintenance.maintenance_id is None:
      raise HTTPException(status = 500 , description = "Maintenance could not create")
    return db_maintenance