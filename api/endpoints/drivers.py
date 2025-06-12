from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from schemas.drivers import DriverCreate, DriverUpdate, DriverOut
import crud.drivers as crud_drivers
from db.session import get_db


driver_router = APIRouter()

@driver_router.get("/", response_model=List[DriverOut])
def read_driver(db: Session = Depends(get_db)):
    return crud_drivers.get_drivers(db)

@driver_router.get("/{driver_id}", response_model=DriverOut)
def read_driver(driver_id: int, db: Session = Depends(get_db)):
    driver = crud_drivers.get_driver(db, driver_id)
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    return driver

@driver_router.post("/", response_model=DriverOut)
def create_driver(driver: DriverCreate, db: Session = Depends(get_db)):
    return crud_drivers.create_driver(db, driver)

@driver_router.put("/{driver_id}", response_model=DriverOut)
def update_driver(driver_id: int, driver: DriverUpdate, db: Session = Depends(get_db)):
    updated = crud_drivers.update_driver(db, driver_id, driver)
    if not updated:
        raise HTTPException(status_code=404, detail="Driver not found")
    return updated

@driver_router.delete("/{driver_id}")
def delete_driver(driver_id: int, db: Session = Depends(get_db)):
    deleted = crud_drivers.delete_driver(db, driver_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Driver not found")
    return {"detail": "Driver deleted successfully"}

@driver_router.put("/disable/{driver_id}", response_model=DriverOut)
def disable_driver(driver_id: int, db: Session = Depends(get_db)):
    updated = crud_drivers.disable_driver(db, driver_id)
    if not updated:
        raise HTTPException(status_code=404, detail="Driver not found")
    return updated