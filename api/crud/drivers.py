from sqlalchemy.orm import Session
from models.drivers import Driver
from schemas.drivers import DriverCreate, DriverUpdate

def get_drivers(db: Session):
    return db.query(Driver).all()

def get_driver(db: Session, driver_id: int):
    return db.query(Driver).filter(Driver.id == driver_id).first()

def create_driver(db: Session, driver: DriverCreate):
    db_driver = Driver(**driver.dict())
    db.add(db_driver)
    db.commit()
    db.refresh(db_driver)
    return db_driver

def update_driver(db: Session, driver_id: int, updated: DriverUpdate):
    db_driver = db.query(Driver).filter(Driver.id == driver_id).first()
    if db_driver:
        for key, value in updated.dict().items():
            setattr(db_driver, key, value)
        db.commit()
        db.refresh(db_driver)
    return db_driver

def delete_driver(db: Session, driver_id: int):
    db_driver = db.query(Driver).filter(Driver.id == driver_id).first()
    if db_driver:
        db.delete(db_driver)
        db.commit()
    return db_driver

def disable_driver(db: Session, driver_id: int):
    db_driver = db.query(Driver).filter(Driver.id == driver_id).first()
    if db_driver:
        db_driver.is_active = False
        db.commit()
        return db_driver
    return "no driver found"