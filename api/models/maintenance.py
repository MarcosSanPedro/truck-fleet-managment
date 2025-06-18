from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from models.base import Base

class Maintenance(Base):
    __tablename__ = "maintenances"
    id = Column( Integer, primary_key = True, index=True)
    truck_id = Column(Integer, ForeignKey("trucks.id"), nullable=False)
    mileage = Column(Integer, nullable=False)
    description = Column(String, nullable=False)
    type = Column(String, nullable=False)
    date = Column(DateTime, nullable=False)
    next_scheduled = Column(DateTime, nullable=True)

    truck = relationship("Truck", back_populates="maintenances")

    def __repr__(self):
        return f"<Maintenance(id={self.id}, truck_id={self.truck_id}, description='{self.description}', date={self.date})>"
