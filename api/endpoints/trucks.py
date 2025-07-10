from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from schemas.trucks import TruckCreate, TruckUpdate, TruckOut
import crud.trucks as crud_truck
from db.session import get_db

truck_router = APIRouter()



# GET /trucks - Obtener todos los camiones
@truck_router.get("/", response_model=List[TruckOut])
async def read_trucks(db: Session = Depends(get_db)):
    return crud_truck.get_trucks(db)

# GET /trucks/{truck_id} - Obtener un camión por ID
@truck_router.get("/{truck_id}", response_model=TruckOut)
def read_truck(truck_id: int, db: Session = Depends(get_db)):
    truck = crud_truck.get_truck(db, truck_id)
    if not truck:
        raise HTTPException(status_code=404, detail="Truck not found")
    return truck

# POST /trucks - Crear un camión nuevo
@truck_router.post("/", response_model=TruckOut)
def create_truck(truck: TruckCreate, db: Session = Depends(get_db)):
    return crud_truck.create_truck(db, truck)

# PUT /trucks/{truck_id} - Actualizar un camión existente
@truck_router.put("/{truck_id}", response_model=TruckOut)
def update_truck(truck_id: int, truck: TruckUpdate, db: Session = Depends(get_db)):
    updated_truck = crud_truck.update_truck(db, truck_id, truck)
    if not updated_truck:
        raise HTTPException(status_code=404, detail="Truck not found")
    return updated_truck

# DELETE /trucks/{truck_id} - Eliminar un camión
@truck_router.delete("/{truck_id}")
def delete_truck(truck_id: int, db: Session = Depends(get_db)):
    try:
        deleted_truck = crud_truck.delete_truck(db, truck_id)
        if not deleted_truck:
            raise HTTPException(status_code=404, detail="Truck not found")
        return {"detail": "Truck deleted successfully"}
    except Exception as err:
        print('Error deleting truck:', err)
        raise HTTPException(status_code=500, detail=f"Internal server error: {err}")
