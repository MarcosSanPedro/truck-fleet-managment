from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from models.base import Base

class Truck(Base):
    __tablename__ = "trucks"
    id = Column(Integer, primary_key=True, index=True)
    assign_driver = Column(String, nullable=False)
    make = Column(String, nullable=False)
    model = Column(String, nullable=False)
    year = Column(Integer, nullable=False)
    color = Column(String, nullable=False)
    mileage = Column(Integer, nullable=False)
    vin = Column(String, nullable=False)
    plate = Column(String, nullable=False)

    maintenances = relationship("Maintenance", back_populates="truck")

# Optional: Import Maintenance after class definition
# from .maintenance import Maintenance  # Comment out to avoid circular import