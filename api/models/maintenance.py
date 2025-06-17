from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from models.base import Base

class Maintenance(Base):
    __tablename__ = "maintenances"

    maintenance_id = Column(Integer, primary_key=True, index=True)
    truck_id = Column(Integer, ForeignKey("trucks.id"), nullable=False)
    maintenance_mileage = Column(Integer, nullable=False)
    maintenance_description = Column(String, nullable=False)
    maintenance_type = Column(String, nullable=False)
    maintenance_date = Column(DateTime, nullable=False)
    maintenance_next_scheduled = Column(DateTime, nullable=True)

    truck = relationship("Truck", back_populates="maintenances")

    def __repr__(self):
        return f"<Maintenance(id={self.id}, truck_id={self.truck_id}, description='{self.description}', date={self.date})>"

# Import Truck after class definition to avoid circular import
from .trucks import Truck