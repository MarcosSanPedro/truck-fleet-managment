from sqlalchemy import JSON, Column, Integer, String
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
    status = Column(String, nullable=False)
    fuel_level = Column(Integer, nullable=False)
    last_service_date = Column(String, nullable=False)
    next_service_due = Column(Integer, nullable=False)
    insurance_expiry = Column(String, nullable=False)
    registration_expiry = Column(String, nullable=False)
    truck_type = Column(String, nullable=False)
    truckweight = Column(Integer, nullable=False)
    volume = Column(Integer, nullable=False)
    current_location = Column(String, nullable=False)
    last_updated = Column(String, nullable=False)
    fuel_efficiency = Column(Integer, nullable=False)
    total_trips = Column(Integer, nullable=False)
    maintenance_cost_ytd = Column(Integer, nullable=False)
    downtime_hours = Column(Integer, nullable=False)
    features = Column(JSON, nullable=False)
    condition_score = Column(Integer, nullable=False)
    maintenances = relationship("Maintenance", back_populates="truck")


# Optional: Import Maintenance after class definition
# from .maintenance import Maintenance  # Comment out to avoid circular import