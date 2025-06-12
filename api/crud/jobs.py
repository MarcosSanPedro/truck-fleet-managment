from sqlalchemy.orm import Session
from models.jobs import Job
from schemas.jobs import JobCreate, JobUpdate

def get_jobs(db: Session):
    return db.query(Job).all()

def get_job(db: Session, job_id: int):
    return db.query(Job).filter(Job.id == job_id).first()

def create_job(db: Session, job: JobCreate):
    db_job = Job(**job.model_dump())
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

def update_job(db: Session, job_id: int, updated: JobUpdate):
    db_job = db.query(Job).filter(Job.id == job_id).first()
    if db_job:
        for key, value in updated.dict().items():
            setattr(db_job, key, value)
        db.commit()
        db.refresh(db_job)
    return db_job

def delete_job(db: Session, job_id: int):
    db_job = db.query(Job).filter(Job.id == job_id).first()
    if db_job:
        db.delete(db_job)
        db.commit()
    return db_job
