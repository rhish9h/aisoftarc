from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.endpoints import architecture, code, deploy
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI Software Architecture Generator API"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Modify in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(architecture.router, prefix="/api/v1", tags=["architecture"])
app.include_router(code.router, prefix="/api/v1", tags=["code"])
app.include_router(deploy.router, prefix="/api/v1", tags=["deploy"])

@app.get("/")
async def root():
    return {"message": "Welcome to AI Software Architecture Generator API"}
