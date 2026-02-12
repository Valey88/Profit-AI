import asyncio
import os
import sys

# Add parent directory to path to import backend modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text
from dotenv import load_dotenv

load_dotenv()

# Get DB URL from env or use default for localhost
# If running locally, we might need to change 'db' to 'localhost'
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    user = os.getenv("POSTGRES_USER", "postgres")
    password = os.getenv("POSTGRES_PASSWORD", "postgres")
    db_name = os.getenv("POSTGRES_DB", "profitflow")
    host = os.getenv("POSTGRES_HOST", "localhost")
    port = os.getenv("POSTGRES_PORT", "5432")
    
    # If host is 'db' (docker service name), change to localhost for local script execution
    if host == 'db':
        host = 'localhost'
        
    DATABASE_URL = f"postgresql+asyncpg://{user}:{password}@{host}:{port}/{db_name}"

async def set_admin(email):
    print(f"Connecting to database at {DATABASE_URL}...")
    engine = create_async_engine(DATABASE_URL)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as session:
        # Check if user exists
        result = await session.execute(text("SELECT id, email, role FROM users WHERE email = :email"), {"email": email})
        user = result.fetchone()

        if not user:
            print(f"User with email {email} not found.")
            return

        print(f"Found user: {user.email}, Current Role: {user.role}")

        if user.role == 'admin':
            print("User is already an admin.")
        else:
            await session.execute(text("UPDATE users SET role = 'admin' WHERE email = :email"), {"email": email})
            await session.commit()
            print(f"Successfully updated role to 'admin' for user {email}")

    await engine.dispose()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        email = sys.argv[1]
    else:
        email = "valeywork200501@gmail.com"
    
    asyncio.run(set_admin(email))
