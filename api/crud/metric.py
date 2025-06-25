from sqlalchemy import func
from sqlalchemy.orm import Session
from fastapi import HTTPException

from models.base import Base
from schemas.metric import MetricCreate, MetricUpdate, MetricOut
from models.metric import Metric
from models.trucks import Truck
from models.drivers import Driver
from models.jobs import Job
from models.maintenance import Maintenance

def add_metric(db: Session, metric: MetricCreate):
    try:
        record = Metric(**metric.model_dump())
        db.add(record)
        db.commit()
        db.refresh(record)
        return record
    except Exception as err:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Failed to add metric: {err}")

def get_metric(db: Session, metric_name: str) -> Metric:
    record = db.query(Metric).filter(Metric.name == metric_name).first()
    if not record:
        raise HTTPException(status_code=404, detail=f"Metric {metric_name} not found")
    return record

def get_all_metrics(db: Session) -> list[Metric]:
    return db.query(Metric).all()

def update_metric(db: Session, metric_entity: str, metric_name: str, metric_update: MetricUpdate = None) -> Metric:
    try:
        record = db.query(Metric).filter(Metric.name == metric_name).first()

        new_value = None
        metric_type = "count"

        if metric_entity == "fleet" and metric_name == "fleet_safety_rating":
            new_value = db.query(func.avg(func.json_extract(Driver.performance, '$.fleet_safety_rating'))).scalar()
            metric_type = "average"
        elif metric_entity == "drivers" and metric_name == "active_drivers":
            new_value = db.query(Driver).filter(Driver.is_active == True).count()
            metric_type = "count"
        elif metric_entity == "drivers" and metric_name == "drivers_on_route":
            new_value = db.query(Driver).filter(func.json_extract(Driver.current_assignment, '$.status') == 'on_route').count()
            metric_type = "count"
        elif metric_entity == "drivers" and metric_name == "new_drivers_average_rating":
            new_value = db.query(func.avg(func.json_extract(Driver.performance, '$.fleet_safety_rating'))).scalar()
            metric_type = "average"
        elif metric_entity == "drivers":
            new_value = db.query(Driver).count()
            metric_type = "count"
        elif metric_entity == "trucks":
            new_value = db.query(Truck).count()
            metric_type = "count"
        elif metric_entity == "jobs":
            new_value = db.query(Job).count()
            metric_type = "count"
        elif metric_entity == "maintenances":
            new_value = db.query(Maintenance).count()
            metric_type = "count"
        else:
            raise ValueError(f"Unknown metric entity: {metric_entity}")

        if record is None:
            new_metric = MetricCreate(
                entity=metric_entity,
                name=metric_name,
                value=new_value if new_value is not None else 0.0,
                type=metric_type
            )
            return add_metric(db, new_metric)

        update_data = {"value": new_value if new_value is not None else record.value, "type": metric_type}
        if metric_update:
            update_data.update(metric_update.model_dump(exclude_unset=True))
        for key, value in update_data.items():
            setattr(record, key, value)
        db.commit()
        db.refresh(record)
        return record
    except Exception as err:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Failed to update metric: {err}")

def delete_metric(db: Session, metric_name: str) -> None:
    try:
        record = db.query(Metric).filter(Metric.name == metric_name).first()
        if not record:
            raise HTTPException(status_code=404, detail=f"Metric {metric_name} not found")
        db.delete(record)
        db.commit()
    except Exception as err:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Failed to delete metric: {err}")