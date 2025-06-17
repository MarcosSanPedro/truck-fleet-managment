from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from models import Maintenance, Truck  # Import both to ensure registry is populated

engine = create_engine("sqlite:///truckfleet.db")
with Session(engine) as db:
    print(db.query(Maintenance).all())