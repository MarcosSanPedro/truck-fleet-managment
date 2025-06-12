from sqlalchemy import Column, Date, Integer, String
from models.base import Base

class Job(Base):
    __tablename__ = "jobs"
    id = Column(Integer, primary_key=True, index=True)
    job_number = Column(String, nullable=False)
    job_date = Column(Date, nullable=False)
    job_type = Column(String, nullable=False)
    job_description = Column(String, nullable=False)
    job_status = Column(String, nullable=False)

    #! we need to add a relationship to the driver model