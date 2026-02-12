from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from contextlib import asynccontextmanager
import os
import socketio

from src.database import engine, Base
from src.socket_manager import sio

# Get the directory where main.py is located
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_DIR = os.path.join(BASE_DIR, "static")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables for SQLite dev mode
    print("Profit Flow Backend Starting...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Database tables ready!")
    yield
    # Shutdown: Close connections
    print("Profit Flow Backend Shutting Down...")

# Rename to fastapi_app to avoid confusion
fastapi_app = FastAPI(
    title="Profit Flow AI Platform",
    description="Omnichannel AI-SaaS Platform Backend",
    version="0.1.0",
    lifespan=lifespan
)

# CORS Configuration
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "https://profit-ai.vercel.app" # Example production domain
]

fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from src.modules.ai_engine.router import router as ai_router
from src.modules.chat.router import router as chat_router
from src.modules.agent.router import router as agent_router
from src.modules.users.router import router as user_router
from src.modules.billing.router import router as billing_router
from src.modules.onboarding.router import router as onboarding_router
from src.modules.integrations.telegram.router import router as telegram_router
from src.modules.integrations.vk.router import router as vk_router
from src.modules.admin.router import router as admin_router
from src.modules.auth.router import router as auth_router

fastapi_app.include_router(auth_router)
fastapi_app.include_router(ai_router)
fastapi_app.include_router(chat_router)
fastapi_app.include_router(agent_router)
fastapi_app.include_router(user_router)
fastapi_app.include_router(billing_router)
fastapi_app.include_router(onboarding_router)
fastapi_app.include_router(telegram_router)
fastapi_app.include_router(vk_router)
fastapi_app.include_router(admin_router)

from src.modules.builder.router import router as builder_router
fastapi_app.include_router(builder_router)

# Serve widget.js directly
@fastapi_app.get("/widget.js")
async def get_widget():
    widget_path = os.path.join(STATIC_DIR, "widget.js")
    return FileResponse(widget_path, media_type="application/javascript")

# Test page for widget
@fastapi_app.get("/test-widget")
async def test_widget():
    test_path = os.path.join(STATIC_DIR, "test-widget.html")
    return FileResponse(test_path, media_type="text/html")

@fastapi_app.get("/health")
async def health_check():
    return {"status": "ok", "service": "Profit Flow Backend"}

@fastapi_app.get("/")
async def root():
    return {"message": "Welcome to Profit Flow AI Platform API"}

# Wrap FastAPI with Socket.IO
# Export 'app' so uvicorn src.main:app works
app = socketio.ASGIApp(sio, fastapi_app)


