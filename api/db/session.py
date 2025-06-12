from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# URL de conexión a la base de datos
SQLALCHEMY_DATABASE_URL = "sqlite:///./truckfleet.db"  # o usa .env para mover esto después

# Crear engine
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}  # solo para SQLite
)

# Crear SessionLocal para usar en cada request
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ✅ Esta es la función que preguntas
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
