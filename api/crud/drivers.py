from sqlalchemy.orm import Session
from models.drivers import Driver
from schemas.drivers import DriverCreate, DriverUpdate

# GET all trucks
def get_drivers(db: Session):
    return db.query(Driver).all()

# GET one truck by ID
def get_driver(db: Session, driver_id: int):
    return db.query(Driver).filter(Driver.id == driver_id).first()

# POST: Create new truck
def create_driver(db: Session, driver: DriverCreate):
    print('test')
    db_driver = Driver(**driver.model_dump())
    print('test')
    db.add(db_driver)
    db.commit()
    db.refresh(db_driver)
    return db_driver

# PUT: Update truck by ID
def update_driver(db: Session, driver_id: int, updated: DriverUpdate):
    db_driver = db.query(Driver).filter(Driver.id == driver_id).first()
    if db_driver:
        for key, value in updated.model_dump().items():
            setattr(db_driver, key, value)
        db.commit()
        db.refresh(db_driver)
    return db_driver

# DELETE: Remove truck
def delete_driver(db: Session, driver_id: int):
    try:
        db_driver = db.query(Driver).filter(Driver.id == driver_id).first()
    except Exception as err:
        print("[xx] sampiss", err)
    if db_driver:
        db.delete(db_driver)
        db.commit()
    return db_driver
