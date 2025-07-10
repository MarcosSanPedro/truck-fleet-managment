from sqlalchemy.orm import Session
from models.maintenance import Maintenance
from models.trucks import Truck
from schemas.maintenance import MaintenanceCreate, MaintenanceUpdate
from datetime import timedelta

def get_maintenances(db: Session, truck_id: int = None, limit: int = 100):
    if truck_id:
        # Validate truck exists
        if not db.query(Truck).filter(Truck.id == truck_id).first():
            raise ValueError("Truck does not exist")
        return db.query(Maintenance).filter(Maintenance.truck_id == truck_id).limit(limit).all()
    return db.query(Maintenance).limit(limit).all()

def get_maintenance(db: Session, maintenance_id: int):
    return db.query(Maintenance).filter(Maintenance.id == maintenance_id).first()

def create_maintenance(db: Session, maintenance: MaintenanceCreate):
    # Validate truck exists
    if not db.query(Truck).filter(Truck.id == maintenance.truck_id).first():
        raise ValueError("Truck does not exist")
    db_maintenance = Maintenance(**maintenance.model_dump())
    db.add(db_maintenance)
    db.commit()
    db.refresh(db_maintenance)
    # Auto-schedule next maintenance (e.g., 6 months)
    db_maintenance.maintenance_next_scheduled = db_maintenance.date + timedelta(days=180)
    db.commit()
    return db_maintenance

def update_maintenance(db: Session, maintenance_id: int, maintenance: MaintenanceUpdate):
    db_maintenance = db.query(Maintenance).filter(Maintenance.id == maintenance_id).first()
    if db_maintenance:
        for key, value in maintenance.model_dump(exclude_unset=True).items():
            setattr(db_maintenance, key, value)
        db.commit()
        db.refresh(db_maintenance)
    return db_maintenance

def delete_maintenance(db: Session, maintenance_id: int):
    db_maintenance = db.query(Maintenance).filter(Maintenance.id == maintenance_id).first()
    if db_maintenance:
        db.delete(db_maintenance)
        db.commit()
    return db_maintenance

