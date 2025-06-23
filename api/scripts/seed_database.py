import argparse
import random
from datetime import date
from faker import Faker
from sqlalchemy import create_engine, Column, Integer, JSON, String, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Define the base for SQLAlchemy models
Base = declarative_base()

# Driver model based on Pydantic DriverOut/DriverBase
class DriverModel(Base):
    __tablename__ = "drivers"
    id = Column(Integer, primary_key=True, index=True)  # Changed from String to Integer
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    phone_number = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    license_number = Column(String, nullable=False)
    license_expiration = Column(String, nullable=False)  # Stored as ISO date string
    is_active = Column(Integer, nullable=False)  # SQLite doesn't have boolean; use Integer (0/1)
    address = Column(JSON, nullable=False)
    license = Column(JSON, nullable=False)
    employment = Column(JSON, nullable=False)
    performance = Column(JSON, nullable=False)
    current_assignment = Column(JSON, nullable=False)
    certifications = Column(JSON, nullable=False)
    emergency_contact = Column(JSON, nullable=False)

# Truck model
class Truck(Base):
    __tablename__ = "trucks"
    id = Column(Integer, primary_key=True, index=True)
    assign_driver = Column(Integer, nullable=False)  # Changed to Integer to match drivers.id
    make = Column(String, nullable=False)
    model = Column(String, nullable=False)
    year = Column(Integer, nullable=False)
    color = Column(String, nullable=False)
    mileage = Column(Integer, nullable=False)
    vin = Column(String, nullable=False)
    plate = Column(String, nullable=False)
    maintenances = relationship("Maintenance", back_populates="truck")

# Job model
class Job(Base):
    __tablename__ = "jobs"
    id = Column(Integer, primary_key=True, index=True)
    job_number = Column(String, nullable=False)
    job_date = Column(Date, nullable=False)
    job_type = Column(String, nullable=False)
    job_description = Column(String, nullable=False)
    job_status = Column(String, nullable=False)

# Maintenance model
class Maintenance(Base):
    __tablename__ = "maintenances"
    id = Column(Integer, primary_key=True, index=True)
    truck_id = Column(Integer, ForeignKey("trucks.id"), nullable=False)
    mileage = Column(Integer, nullable=False)
    description = Column(String, nullable=False)
    type = Column(String, nullable=False)
    date = Column(DateTime, nullable=False)
    next_scheduled = Column(DateTime, nullable=True)
    truck = relationship("Truck", back_populates="maintenances")

# Initialize Faker and set seeds for reproducibility
faker = Faker()
Faker.seed(0)
random.seed(0)

# Generate a job
def generate_job(id):
    return Job(
        id=id,
        job_number=f"JOB{id:03d}",
        job_date=faker.date_this_year(),
        job_type=random.choice(["Delivery", "Pickup", "Maintenance"]),
        job_description=faker.sentence(nb_words=6),
        job_status=random.choice(["Pending", "In Progress", "Completed", "Delayed"])
    )

# Generate a driver based on Pydantic models
def generate_driver(id, truck_plates):
    first_name = faker.first_name()
    last_name = faker.last_name()
    email = f"{first_name.lower()}.{last_name.lower()}@example.com"
    phone_number = faker.phone_number()[:12]  # Limit length to avoid issues
    license_number = faker.bothify(text="D#######")
    license_expiration = faker.date_between(start_date="today", end_date="+5y").isoformat()
    is_active = random.choice([1, 0])
    address = {
        "street": faker.street_address(),
        "city": faker.city(),
        "state": faker.state_abbr(),
        "zip_code": faker.zipcode()
    }
    license = {
        "number": license_number,
        "license_class": random.choice(["A", "B", "C"]),
        "endorsements": random.sample(["H", "N", "T", "P"], k=random.randint(0, 3)),
        "is_valid": random.choice([True, False])
    }
    employment = {
        "hire_date": faker.date_between(start_date="-10y", end_date="today").isoformat(),
        "years_experience": random.randint(1, 20),
        "status": random.choice(["active", "inactive", "on-leave", "suspended"]),
        "employee_id": faker.bothify(text="EMP#####")
    }
    performance = {
        "safety_rating": round(random.uniform(1.0, 5.0), 2),
        "on_time_delivery_rate": round(random.uniform(0.7, 1.0), 2),
        "total_miles_driven": random.randint(10000, 1000000),
        "accidents_free": random.randint(0, 5)
    }
    current_assignment = {
        "truck_number": random.choice(truck_plates) if truck_plates else "UNASSIGNED",
        "route": faker.city() + " to " + faker.city(),
        "status": random.choice(["available", "on-route", "loading", "maintenance", "off-duty"])
    }
    dot_medical_cert = {
        "expiration_date": faker.date_between(start_date="today", end_date="+2y").isoformat(),
        "is_valid": random.choice([True, False])
    }
    certifications = {
        "dot_medical_cert": dot_medical_cert,
        "hazmat_endorsement": random.choice([True, False]),
        "drug_test_date": faker.date_between(start_date="-1y", end_date="today").isoformat()
    }
    emergency_contact = {
        "name": faker.name(),
        "relationship": random.choice(["Spouse", "Parent", "Sibling", "Friend"]),
        "phone": faker.phone_number()[:12]
    }
    return DriverModel(
        id=id,
        first_name=first_name,
        last_name=last_name,
        phone_number=phone_number,
        email=email,
        license_number=license_number,
        license_expiration=license_expiration,
        is_active=is_active,
        address=address,
        license=license,
        employment=employment,
        performance=performance,
        current_assignment=current_assignment,
        certifications=certifications,
        emergency_contact=emergency_contact
    )

# Generate a truck
def generate_truck(id, driver_ids):
    make = random.choice(["Volvo", "Freightliner", "Kenworth"])
    model = random.choice(["VNL", "Cascadia", "T680"])
    year = random.randint(2015, 2023)
    color = random.choice(["Red", "Blue", "White", "Black"])
    mileage = random.randint(50000, 200000)
    vin = faker.vin()
    plate = faker.bothify(text="??###")
    assign_driver = random.choice(driver_ids)
    return Truck(
        id=id,
        assign_driver=assign_driver,
        make=make,
        model=model,
        year=year,
        color=color,
        mileage=mileage,
        vin=vin,
        plate=plate
    )

# Generate a maintenance record
def generate_maintenance(id, truck_ids):
    truck_id = random.choice(truck_ids)
    mileage = random.randint(50000, 200000)
    description = random.choice(["Oil change", "Tire rotation", "Brake inspection", "Engine tune-up", "Fluid check", "Battery replacement"])
    type = random.choice(["Routine", "Safety", "Performance", "Repair"])
    date = faker.date_time_between(start_date="-2y", end_date="now")
    next_scheduled = faker.date_time_between(start_date="now", end_date="+1y") if random.random() < 0.5 else None
    return Maintenance(
        id=id,
        truck_id=truck_id,
        mileage=mileage,
        description=description,
        type=type,
        date=date,
        next_scheduled=next_scheduled
    )

# Parse command-line arguments
parser = argparse.ArgumentParser(description="Seed an SQLite database with mock data using Faker.")
parser.add_argument("--database", default="database.db", help="SQLite database file")
parser.add_argument("--drivers", type=int, default=10, help="Number of drivers")
parser.add_argument("--trucks", type=int, default=5, help="Number of trucks")
parser.add_argument("--jobs", type=int, default=20, help="Number of jobs")
parser.add_argument("--maintenances", type=int, default=15, help="Number of maintenances")
args = parser.parse_args()

# Set up the database engine and session
engine = create_engine(f"sqlite:///{args.database}")
Session = sessionmaker(bind=engine)
session = Session()

# Create the tables
Base.metadata.create_all(engine)

# Generate data
trucks = [generate_truck(i+1, [j+1 for j in range(args.drivers)]) for i in range(args.trucks)]
truck_plates = [truck.plate for truck in trucks]
truck_ids = [truck.id for truck in trucks]

jobs = [generate_job(i+1) for i in range(args.jobs)]

drivers = [generate_driver(i+1, truck_plates) for i in range(args.drivers)]

maintenances = [generate_maintenance(i+1, truck_ids) for i in range(args.maintenances)]

# Add all records to the database and commit
session.add_all(trucks + jobs + drivers + maintenances)
session.commit()

print(f"Database '{args.database}' created and seeded with {args.drivers} drivers, {args.trucks} trucks, {args.jobs} jobs, and {args.maintenances} maintenances.")