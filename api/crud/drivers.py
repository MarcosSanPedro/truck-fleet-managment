from sqlalchemy.orm import Session
from models.drivers import DriverModel
from schemas import drivers
import uuid

def create_driver(db: Session, driver: drivers.DriverCreate):
    driver_data = {
        "id": str(uuid.uuid4()),
        "first_name": driver.first_name,
        "last_name": driver.last_name,
        "photo": driver.photo,
        "email": driver.email,
        "phone": driver.phone,
        "address": driver.address.dict(),
        "license": driver.license.dict(),
        "employment": driver.employment.dict(),
        "performance": driver.performance.dict(),
        "current_assignment": driver.current_assignment.dict(),
        "certifications": driver.certifications.dict(),
        "emergency_contact": driver.emergency_contact.dict()
    }
    
    db_driver = DriverModel(**driver_data)
    db.add(db_driver)
    db.commit()
    db.refresh(db_driver)
    return db_driver

def get_driver(db: Session, driver_id: str):
    return db.query(DriverModel).filter(DriverModel.id == driver_id).first()

def get_drivers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(DriverModel).offset(skip).limit(limit).all()

def update_driver(db: Session, driver_id: str, driver_update: drivers.DriverUpdate):
    db_driver = db.query(DriverModel).filter(DriverModel.id == driver_id).first()
    if not db_driver:
        return None
    
    update_data = driver_update.dict(exclude_unset=True)
    
    # Convert nested Pydantic models to dict for JSON storage
    for key, value in update_data.items():
        if hasattr(value, 'dict'):  # If it's a Pydantic model
            update_data[key] = value.dict()
    
    for key, value in update_data.items():
        setattr(db_driver, key, value)
    
    db.commit()
    db.refresh(db_driver)
    return db_driver

def delete_driver(db: Session, driver_id: str):
    db_driver = db.query(DriverModel).filter(DriverModel.id == driver_id).first()
    if db_driver:
        db.delete(db_driver)
        db.commit()
        return True
    return False

# Bonus: Search functions using JSON fields
def get_drivers_by_status(db: Session, status: str):
    return db.query(DriverModel).filter(
        DriverModel.employment['status'].astext == status
    ).all()

def get_drivers_with_expired_licenses(db: Session):
    from datetime import date
    return db.query(DriverModel).filter(
        DriverModel.license['is_valid'].astext == 'false'
    ).all()