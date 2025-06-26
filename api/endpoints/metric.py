# routes/metrics.py
from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime

from db.session import get_db
from schemas.metric import MetricCreate, MetricUpdate, MetricOut
from crud.metric import (
    add_metric,
    get_metric,
    get_all_metrics,
    update_metric,
    delete_metric,
    calculate_metric_value,
    calculate_all_metrics,
    bulk_create_metrics,
    get_metric_statistics
)

router = APIRouter(prefix="/metrics", tags=["metrics"])

@router.post("/", response_model=MetricOut)
async def create_metric(
    metric: MetricCreate,
    db: Session = Depends(get_db)
):
    """Create a new metric"""
    return add_metric(db, metric)

@router.post("/bulk", response_model=List[MetricOut])
async def create_metrics_bulk(
    metrics: List[MetricCreate],
    db: Session = Depends(get_db)
):
    """Create multiple metrics at once"""
    return bulk_create_metrics(db, metrics)

@router.get("/", response_model=List[MetricOut])
async def list_metrics(
    entity: Optional[str] = Query(None, description="Filter by entity"),
    metric_type: Optional[str] = Query(None, description="Filter by metric type"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Number of records to return"),
    db: Session = Depends(get_db)
):
    """Get all metrics with optional filtering"""
    return get_all_metrics(db, entity=entity, metric_type=metric_type, skip=skip, limit=limit)

@router.get("/statistics", response_model=Dict[str, Any])
async def get_metrics_statistics(
    entity: Optional[str] = Query(None, description="Filter by entity"),
    db: Session = Depends(get_db)
):
    """Get metrics statistics"""
    return get_metric_statistics(db, entity=entity)

@router.get("/{metric_identifier}", response_model=MetricOut)
async def get_metric_by_identifier(
    metric_identifier: str,
    db: Session = Depends(get_db)
):
    """Get a metric by ID or name"""
    # Try to parse as integer for ID lookup
    try:
        metric_id = int(metric_identifier)
        return get_metric(db, metric_id=metric_id)
    except ValueError:
        # If not an integer, treat as name
        return get_metric(db, metric_name=metric_identifier)

@router.put("/{metric_identifier}", response_model=MetricOut)
async def update_metric_by_identifier(
    metric_identifier: str,
    metric_update: MetricUpdate,
    recalculate: bool = Query(False, description="Recalculate metric value after update"),
    db: Session = Depends(get_db)
):
    """Update a metric by ID or name"""
    try:
        metric_id = int(metric_identifier)
        return update_metric(db, metric_id=metric_id, metric_update=metric_update, recalculate=recalculate)
    except ValueError:
        return update_metric(db, metric_name=metric_identifier, metric_update=metric_update, recalculate=recalculate)

@router.delete("/{metric_identifier}")
async def delete_metric_by_identifier(
    metric_identifier: str,
    db: Session = Depends(get_db)
):
    """Delete a metric by ID or name"""
    try:
        metric_id = int(metric_identifier)
        delete_metric(db, metric_id=metric_id)
    except ValueError:
        delete_metric(db, metric_name=metric_identifier)
    
    return {"message": f"Metric {metric_identifier} deleted successfully"}

@router.post("/{metric_identifier}/calculate", response_model=MetricOut)
async def calculate_metric_by_identifier(
    metric_identifier: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Calculate and update a specific metric value"""
    try:
        metric_id = int(metric_identifier)
        return calculate_metric_value(db, metric_id=metric_id)
    except ValueError:
        return calculate_metric_value(db, metric_name=metric_identifier)

@router.post("/calculate/all", response_model=List[MetricOut])
async def calculate_all_metrics_endpoint(
    entity: Optional[str] = Query(None, description="Calculate metrics for specific entity only"),
    db: Session = Depends(get_db)
):
    """Calculate all metrics or metrics for a specific entity"""
    return calculate_all_metrics(db, entity=entity)

@router.post("/calculate/batch")
async def calculate_metrics_batch(
    metric_identifiers: List[str],
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Calculate multiple specific metrics"""
    results = []
    errors = []
    
    for identifier in metric_identifiers:
        try:
            try:
                metric_id = int(identifier)
                result = calculate_metric_value(db, metric_id=metric_id)
            except ValueError:
                result = calculate_metric_value(db, metric_name=identifier)
            results.append(result)
        except Exception as e:
            errors.append({"identifier": identifier, "error": str(e)})
    
    return {
        "calculated": len(results),
        "errors": len(errors),
        "results": results,
        "error_details": errors
    }