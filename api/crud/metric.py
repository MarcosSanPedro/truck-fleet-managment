from sqlalchemy import func, text
from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import Any, Dict, List, Optional, Union
import json

from models.base import Base
from schemas.metric import MetricCreate, MetricUpdate, MetricOut
from models.metric import Metric
from models.trucks import Truck
from models.drivers import Driver
from models.jobs import Job
from models.maintenance import Maintenance

# Entity mapping for dynamic queries
ENTITY_MODELS = {
    "trucks": Truck,
    "drivers": Driver,
    "jobs": Job,
    "maintenance": Maintenance,
}

class MetricCalculator:
    """Generic metric calculator that can handle different metric types and entities"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def calculate_metric(self, metric: Metric) -> Union[float, int]:
        """Calculate metric value based on metric configuration"""
        try:
            entity_model = ENTITY_MODELS.get(metric.entity)
            if not entity_model:
                raise ValueError(f"Unknown entity: {metric.entity}")
            
            # Parse calculation config if it exists
            calc_config = {}
            if hasattr(metric, 'calculation_config') and metric.calculation_config:
                if isinstance(metric.calculation_config, str):
                    calc_config = json.loads(metric.calculation_config)
                else:
                    calc_config = metric.calculation_config
            
            return self._calculate_by_type(entity_model, metric.type, calc_config)
            
        except Exception as e:
            raise ValueError(f"Failed to calculate metric {metric.name}: {str(e)}")
    
    def _calculate_by_type(self, entity_model, metric_type: str, config: Dict) -> Union[float, int]:
        """Calculate metric based on type"""
        base_query = self.db.query(entity_model)
        
        # Apply filters if specified
        if config.get('filters'):
            base_query = self._apply_filters(base_query, entity_model, config['filters'])
        
        match metric_type.lower():
            case 'count':
                return base_query.count()
            
            case 'sum':
                field = config.get('field')
                if not field:
                    raise ValueError("Sum metric requires 'field' in calculation_config")
                return self._calculate_sum(base_query, entity_model, field)
            
            case 'avg' | 'average':
                field = config.get('field')
                if not field:
                    raise ValueError("Average metric requires 'field' in calculation_config")
                return self._calculate_average(base_query, entity_model, field)
            
            case 'min':
                field = config.get('field')
                if not field:
                    raise ValueError("Min metric requires 'field' in calculation_config")
                return self._calculate_min(base_query, entity_model, field)
            
            case 'max':
                field = config.get('field')
                if not field:
                    raise ValueError("Max metric requires 'field' in calculation_config")
                return self._calculate_max(base_query, entity_model, field)
            
            case 'distinct_count':
                field = config.get('field')
                if not field:
                    raise ValueError("Distinct count metric requires 'field' in calculation_config")
                return self._calculate_distinct_count(base_query, entity_model, field)
            
            case 'percentage':
                return self._calculate_percentage(base_query, entity_model, config)
            
            case 'custom':
                return self._calculate_custom(entity_model, config)
            
            case _:
                raise ValueError(f"Unsupported metric type: {metric_type}")
    
    def _apply_filters(self, query, entity_model, filters: List[Dict]):
        """Apply filters to the query"""
        for filter_config in filters:
            field = filter_config.get('field')
            operator = filter_config.get('operator', '==')
            value = filter_config.get('value')
            
            if not field:
                continue
                
            # Handle JSON field extraction
            if '.' in field and field.startswith('json:'):
                json_field, json_path = field.replace('json:', '').split('.', 1)
                model_field = getattr(entity_model, json_field)
                expression = func.json_extract(model_field, f'$.{json_path}')
            else:
                expression = getattr(entity_model, field)
            
            match operator.lower():
                case '==' | 'eq':
                    query = query.filter(expression == value)
                case '!=' | 'ne':
                    query = query.filter(expression != value)
                case '>' | 'gt':
                    query = query.filter(expression > value)
                case '>=' | 'gte':
                    query = query.filter(expression >= value)
                case '<' | 'lt':
                    query = query.filter(expression < value)
                case '<=' | 'lte':
                    query = query.filter(expression <= value)
                case 'in':
                    query = query.filter(expression.in_(value))
                case 'not_in':
                    query = query.filter(~expression.in_(value))
                case 'like':
                    query = query.filter(expression.like(f'%{value}%'))
                case 'is_null':
                    query = query.filter(expression.is_(None))
                case 'is_not_null':
                    query = query.filter(expression.isnot(None))
        
        return query
    
    def _get_field_expression(self, entity_model, field: str):
        """Get field expression, handling JSON fields"""
        if '.' in field and field.startswith('json:'):
            json_field, json_path = field.replace('json:', '').split('.', 1)
            model_field = getattr(entity_model, json_field)
            return func.json_extract(model_field, f'$.{json_path}')
        else:
            return getattr(entity_model, field)
    
    def _calculate_sum(self, query, entity_model, field: str) -> float:
        """Calculate sum of a field"""
        expression = self._get_field_expression(entity_model, field)
        result = query.with_entities(func.sum(expression)).scalar()
        return float(result) if result is not None else 0.0
    
    def _calculate_average(self, query, entity_model, field: str) -> float:
        """Calculate average of a field"""
        expression = self._get_field_expression(entity_model, field)
        result = query.with_entities(func.avg(expression)).scalar()
        return float(result) if result is not None else 0.0
    
    def _calculate_min(self, query, entity_model, field: str) -> Union[float, int]:
        """Calculate minimum of a field"""
        expression = self._get_field_expression(entity_model, field)
        result = query.with_entities(func.min(expression)).scalar()
        return result if result is not None else 0
    
    def _calculate_max(self, query, entity_model, field: str) -> Union[float, int]:
        """Calculate maximum of a field"""
        expression = self._get_field_expression(entity_model, field)
        result = query.with_entities(func.max(expression)).scalar()
        return result if result is not None else 0
    
    def _calculate_distinct_count(self, query, entity_model, field: str) -> int:
        """Calculate distinct count of a field"""
        expression = self._get_field_expression(entity_model, field)
        result = query.with_entities(func.count(func.distinct(expression))).scalar()
        return int(result) if result is not None else 0
    
    def _calculate_percentage(self, query, entity_model, config: Dict) -> float:
        """Calculate percentage based on configuration"""
        numerator_filters = config.get('numerator_filters', [])
        denominator_filters = config.get('denominator_filters', [])
        
        # Calculate numerator
        num_query = self._apply_filters(query, entity_model, numerator_filters)
        numerator = num_query.count()
        
        # Calculate denominator
        if denominator_filters:
            den_query = self._apply_filters(query, entity_model, denominator_filters)
            denominator = den_query.count()
        else:
            denominator = query.count()
        
        if denominator == 0:
            return 0.0
        
        return (numerator / denominator) * 100.0
    
    def _calculate_custom(self, entity_model, config: Dict) -> Union[float, int]:

        """Execute custom SQL query"""
        custom_query = config.get('query')
        if not custom_query:
            raise ValueError("Custom metric requires 'query' in calculation_config")
        
        result = self.db.execute(text(custom_query)).scalar()
        return float(result) if result is not None else 0.0



def add_metric(db: Session, metric: MetricCreate) -> Metric:
    """Create a new metric"""
    try:
        # Validate entity exists
        if metric.entity and metric.entity not in ENTITY_MODELS:
            raise HTTPException(status_code=400, detail=f"Invalid entity: {metric.entity}")
        
        record = Metric(**metric.model_dump())
        db.add(record)
        db.commit()
        db.refresh(record)
        return record
    except Exception as err:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Failed to add metric: {err}")
    


def calculate_driver_metrics_by_property(
    db: Session,
    property_name: str,
    property_value: Any,
    metric_type: str,
    metric_name: str,
    calculation_config: Dict = None
) -> List[Metric]:
    """
    Calculate metrics for drivers filtered by a specific property (e.g., is_active=True).
    
    Args:
        db: SQLAlchemy database session
        property_name: The driver property to filter on (e.g., "is_active")
        property_value: The value to filter for (e.g., True)
        metric_type: The type of metric to calculate (e.g., "count", "sum", "avg")
        metric_name: The name of the metric (e.g., "active_drivers_count")
        calculation_config: Optional configuration for the metric calculation (e.g., field for sum/avg)
    
    Returns:
        List of updated Metric objects
    """
    try:
        # Default calculation config if not provided
        if calculation_config is None:
            calculation_config = {}
        
        # Add property filter to calculation_config
        filters = calculation_config.get("filters", [])
        filters.append({
            "field": property_name,
            "operator": "==",
            "value": property_value
        })
        calculation_config["filters"] = filters

        # Check if metric exists, create if not
        existing_metric = db.query(Metric).filter(Metric.name == metric_name).first()
        if not existing_metric:
            metric_data = {
                "name": metric_name,
                "entity": "drivers",
                "type": metric_type,
                "calculation_config": json.dumps(calculation_config)
            }
            existing_metric = Metric(**metric_data)
            db.add(existing_metric)
            db.commit()
            db.refresh(existing_metric)

        # Calculate the metric using MetricCalculator
        calculator = MetricCalculator(db)
        new_value = calculator.calculate_metric(existing_metric)

        # Update the metric value
        existing_metric.value = new_value
        db.commit()
        db.refresh(existing_metric)

        return [existing_metric]

    except Exception as err:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Failed to calculate driver metrics: {str(err)}")


def get_metric(db: Session, metric_id: Optional[int] = None, metric_name: Optional[str] = None) -> Metric:
    """Get a metric by ID or name"""
    if not metric_id and not metric_name:
        raise HTTPException(status_code=400, detail="Either metric_id or metric_name must be provided")
    
    query = db.query(Metric)
    if metric_id:
        query = query.filter(Metric.id == metric_id)
    else:
        query = query.filter(Metric.name == metric_name)
    
    record = query.first()
    if not record:
        identifier = metric_id if metric_id else metric_name
        raise HTTPException(status_code=404, detail=f"Metric {identifier} not found")
    
    return record


def get_all_metrics(
    db: Session, 
    entity: Optional[str] = None, 
    metric_type: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
) -> List[Metric]:
    """Get all metrics with optional filtering"""
    query = db.query(Metric)
    
    if entity:
        query = query.filter(Metric.entity == entity)
    
    if metric_type:
        query = query.filter(Metric.type == metric_type)
    
    return query.offset(skip).limit(limit).all()


def update_metric(
    db: Session, 
    metric_id: Optional[int] = None, 
    metric_name: Optional[str] = None,
    metric_update: Optional[MetricUpdate] = None,
    recalculate: bool = False
) -> Metric:
    """Update a metric"""
    try:
        # Get the metric
        record = get_metric(db, metric_id, metric_name)
        
        # Update fields if provided
        if metric_update:
            update_data = metric_update.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(record, key, value)
        
        # Recalculate value if requested
        if recalculate and record.entity:
            calculator = MetricCalculator(db)
            new_value = calculator.calculate_metric(record)
            record.value = new_value
        
        db.commit()
        db.refresh(record)
        return record
        
    except Exception as err:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Failed to update metric: {err}")


def calculate_metric_value(db: Session, metric_id: Optional[int] = None, metric_name: Optional[str] = None) -> Metric:
    """Calculate and update a metric's value"""
    try:
        record = get_metric(db, metric_id, metric_name)
        
        if not record.entity:
            raise HTTPException(status_code=400, detail="Cannot calculate metric without entity")
        
        calculator = MetricCalculator(db)
        new_value = calculator.calculate_metric(record)
        
        record.value = new_value
        db.commit()
        db.refresh(record)
        
        return record
        
    except Exception as err:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Failed to calculate metric: {err}")


def calculate_all_metrics(db: Session, entity: Optional[str] = None) -> List[Metric]:
    """Calculate all metrics or metrics for a specific entity"""
    try:
        query = db.query(Metric).filter(Metric.entity.isnot(None))
        
        if entity:
            query = query.filter(Metric.entity == entity)
        
        metrics = query.all()
        calculator = MetricCalculator(db)
        
        updated_metrics = []
        for metric in metrics:
            try:
                new_value = calculator.calculate_metric(metric)
                metric.value = new_value
                updated_metrics.append(metric)
            except Exception as e:
                print(f"Failed to calculate metric {metric.name}: {e}")
                continue
        
        db.commit()
        return updated_metrics
        
    except Exception as err:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Failed to calculate metrics: {err}")


def delete_metric(db: Session, metric_id: Optional[int] = None, metric_name: Optional[str] = None) -> None:
    """Delete a metric"""
    try:
        record = get_metric(db, metric_id, metric_name)
        db.delete(record)
        db.commit()
    except Exception as err:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Failed to delete metric: {err}")


def bulk_create_metrics(db: Session, metrics: List[MetricCreate]) -> List[Metric]:
    """Create multiple metrics at once"""
    try:
        created_metrics = []
        for metric_data in metrics:
            # Validate entity
            if metric_data.entity and metric_data.entity not in ENTITY_MODELS:
                raise HTTPException(status_code=400, detail=f"Invalid entity: {metric_data.entity}")
            
            record = Metric(**metric_data.model_dump())
            db.add(record)
            created_metrics.append(record)
        
        db.commit()
        
        # Refresh all records
        for record in created_metrics:
            db.refresh(record)
        
        return created_metrics
        
    except Exception as err:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Failed to create metrics: {err}")


def get_metric_statistics(db: Session, entity: Optional[str] = None) -> Dict[str, Any]:
    """Get statistics about metrics"""
    query = db.query(Metric)
    
    if entity:
        query = query.filter(Metric.entity == entity)
    
    total_metrics = query.count()
    
    # Group by type
    type_stats = (
        db.query(Metric.type, func.count(Metric.id))
        .group_by(Metric.type)
        .all()
    )
    
    # Group by entity
    entity_stats = (
        db.query(Metric.entity, func.count(Metric.id))
        .group_by(Metric.entity)
        .all()
    )
    
    return {
        "total_metrics": total_metrics,
        "by_type": {metric_type: count for metric_type, count in type_stats},
        "by_entity": {entity_name: count for entity_name, count in entity_stats}
    }