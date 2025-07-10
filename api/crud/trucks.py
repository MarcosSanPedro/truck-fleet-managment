from sqlalchemy.orm import Session
from models.trucks import Truck
from schemas.trucks import TruckCreate, TruckUpdate

# GET all trucks
def get_trucks(db: Session):
    return db.query(Truck).all()

# GET one truck by ID
def get_truck(db: Session, truck_id: int):
    return db.query(Truck).filter(Truck.id == truck_id).first()

# POST: Create new truck
def create_truck(db: Session, truck: TruckCreate):
    print('test')
    db_truck = Truck(**truck.model_dump())
    print('test')
    db.add(db_truck)
    db.commit()
    db.refresh(db_truck)
    return db_truck

# PUT: Update truck by ID
def update_truck(db: Session, truck_id: int, updated: TruckUpdate):
    db_truck = db.query(Truck).filter(Truck.id == truck_id).first()
    if db_truck:
        for key, value in updated.model_dump().items():
            setattr(db_truck, key, value)
        db.commit()
        db.refresh(db_truck)
    return db_truck

# DELETE: Remove truck
def delete_truck(db: Session, truck_id: int):
    from models.maintenance import Maintenance  # Import here to avoid circular import
    db_truck = db.query(Truck).filter(Truck.id == truck_id).first()
    if not db_truck:
        return None
    # Delete all related maintenances first
    db.query(Maintenance).filter(Maintenance.truck_id == truck_id).delete()
    try:
        db.delete(db_truck)
        db.commit()
        return db_truck
    except Exception as err:
        print("[xx] sampiss", err)
        raise
