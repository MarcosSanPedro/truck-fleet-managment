from sqlalchemy import JSON, Column, Date, Integer, String
from models.base import Base

class Job(Base):
    __tablename__ = "jobs"
    id = Column(Integer, primary_key=True, index=True)
    job_number = Column(String, nullable=False)
    job_date = Column(Date, nullable=False)
    job_type = Column(String, nullable=False)
    job_description = Column(String, nullable=False)
    job_status = Column(String, nullable=False)
    priority =  Column(String, nullable=False) ;
    estimatedValue =  Column(String, nullable=False) ;
    weight =  Column(String, nullable=False) ;
    distance =  Column(String, nullable=False) ;
    estimatedDuration =  Column(String, nullable=False) ;
    origin =  Column(String, nullable=False) ;
    destination =  Column(String, nullable=False) ;
    driver =  Column(String, nullable=False) ;
    vehicle =  Column(String, nullable=False) ;
    specialRequirements =  Column(JSON, nullable=False) ;
    progress =  Column(Integer, nullable=False) ;
    nextCheckpoint =  Column(String, nullable=False) ;
    eta =  Column(String, nullable=False) ;

    #! we need to add a relationship to the driver model