from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./truckfleet.db"

# Create engine with optimized connection pooling
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    pool_size=10,  # Increase connection pool size
    max_overflow=20,  # Allow more connections when pool is full
    pool_pre_ping=True,  # Verify connections before use
    pool_recycle=3600,  # Recycle connections every hour
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        # Optimize session for read operations
        db.execute("PRAGMA journal_mode=WAL")  # Write-Ahead Logging for better concurrency
        db.execute("PRAGMA synchronous=NORMAL")  # Faster writes
        db.execute("PRAGMA cache_size=10000")  # Increase cache size
        db.execute("PRAGMA temp_store=MEMORY")  # Use memory for temp storage
        yield db
    finally:
        db.close()
