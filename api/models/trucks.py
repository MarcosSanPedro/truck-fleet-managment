from sqlalchemy import Column, Integer, Boolean, String
from models.base import Base

class Truck(Base):
    __tablename__ = "trucks" 
    id = Column(Integer, primary_key=True, index=True)
    asign_driver = Column(String, nullable=False)
    make = Column(String, nullable=False)
    model = Column(String, nullable=False)
    year = Column(Integer, nullable=False)
    color = Column(String, nullable=False)
    mileage = Column(Integer, nullable=False)
    vin = Column(String, nullable=False)
    plate = Column(String, nullable=False)


#! we need to add a relationship to the driver model