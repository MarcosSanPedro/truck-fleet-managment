


from sqlalchemy import Column, Float, Integer, String
from models.base import Base


class Metric(Base):
    __tablename__ = 'metric'
    id = Column(Integer, primary_key=True)  # Added for MetricOut.id
    entity = Column(String, index=True)
    name = Column(String, index=True, unique=True)
    value = Column(Float)  # Changed to Float for averages
    type = Column(String)