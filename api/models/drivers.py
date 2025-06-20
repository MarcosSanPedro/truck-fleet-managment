from sqlalchemy import Column, String, JSON
from models.base import Base


class DriverModel(Base):
    __tablename__ = "drivers"
    
    id = Column(String, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    photo = Column(String)
    email = Column(String, unique=True, nullable=False, index=True)
    phone = Column(String, nullable=False)
    address = Column(JSON, nullable=False)
    license = Column(JSON, nullable=False)
    employment = Column(JSON, nullable=False)
    performance = Column(JSON, nullable=False)
    current_assignment = Column(JSON, nullable=False)
    certifications = Column(JSON, nullable=False)
    emergency_contact = Column(JSON, nullable=False)