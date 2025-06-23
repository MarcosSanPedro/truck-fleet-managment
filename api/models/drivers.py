from sqlalchemy import Boolean, Column, DateTime, Integer, String, JSON
from models.base import Base


class Driver(Base):
    __tablename__ = "drivers"
    id = Column(Integer, primary_key=True, index=True)
    first_name =  Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    phone_number = Column(String, nullable=False)
    email= Column(String, nullable=False)
    is_active = Column( Boolean, nullable=False)
    address = Column(JSON, nullable=False)
    license = Column(JSON, nullable=False)
    employment = Column(JSON, nullable=False)
    performance = Column(JSON, nullable=False)
    current_assignment = Column(JSON, nullable=False)
    certifications = Column(JSON, nullable=False)
    emergency_contact = Column(JSON, nullable=False)