from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.session import get_db
from schemas.metric import MetricCreate, MetricOut
from crud import metric as crud_metric


metric_router = APIRouter()

@metric_router.get("/", response_model=MetricOut)
def get_metric(db: Session = Depends(get_db), metric_name: str = "drivers_count"):
    return crud_metric.get_metric(db, metric_name)

@metric_router.post("/", response_model=MetricOut)
def create_metric(metric: MetricCreate, db: Session = Depends(get_db)):
    return crud_metric.add_metric(db, metric)