from sqlalchemy import Boolean, Column, Date, Integer, String
from models.base import Base

class Driver(Base):
    __tablename__ = "drivers"
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    phone_number = Column(String, nullable=False)
    email = Column(String, nullable=False)
    license_number = Column(String, nullable=False)
    license_expiration = Column(Date, nullable=False)
    is_active = Column(Boolean, nullable=False)

    #! we need to add a relationship to the driver model