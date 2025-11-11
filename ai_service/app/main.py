import os
import hmac
import json
import datetime
from dotenv import load_dotenv
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from app.utils.config import AI_SERVICE_PORT
from app.core.controllers.mcp_server import router
from scalar_fastapi import get_scalar_api_reference
from fastapi import FastAPI, HTTPException, Request
from app.core.services.model_manager import model_manager
from fastapi.exception_handlers import http_exception_handler
from app.core.controllers import model_controller, progress_criterion_type_controller, student_analysis_controller
from app.core.controllers.exception_handler import generic_exception_handler, value_error_exception_handler

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    model_manager.load_model(model_path="app/models/kmeans_model.pkl", name="kmeans_model")
    model_manager.load_model(model_path="app/models/scaler.pkl", name="scaler")



app = FastAPI(title="Student Analysis API", version="0.1")

API_KEY = os.getenv("API_KEY")
if not API_KEY:
    raise ValueError("API_KEY must be set in .env")

EXCLUDED_PATHS = json.loads(os.environ["EXCLUDED_PATHS"])

@app.middleware("http")
async def api_key_middleware(request: Request, call_next):        
    path = request.scope["path"]
    
    if path in EXCLUDED_PATHS:
        return await call_next(request)
    
    api_key_header = request.headers.get("x-api-key")
    
    if not api_key_header:
        return JSONResponse(
            status_code=401,
            content= {
                "data" : "",
                "message" : "API key is missing",
                "status" : 401,
                "timestamp" : datetime.datetime.now().isoformat()
            }
        )
    
    if not hmac.compare_digest(api_key_header.encode(), API_KEY.encode()):
        return JSONResponse(
            status_code=403,
            content= {
                "data" : "",
                "message" : "Invalid API key",
                "status" : 403,
                "timestamp" : datetime.datetime.now().isoformat()
            }
        )
    
    return await call_next(request)
    
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(ValueError, value_error_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

app.include_router(model_controller.router)
app.include_router(student_analysis_controller.router)
app.include_router(progress_criterion_type_controller.router)
app.include_router(router, prefix="/mcp", tags=["MCP"])

@app.get("/scalar", include_in_schema= False)
async def scalar_html():
    return get_scalar_api_reference(
        openapi_url=app.openapi_url,
        title = app.title + " - Scalar API"
    )
    
if __name__ == "__main__":        
    import uvicorn
    uvicorn.run("app.main:app", host="localhost", port=AI_SERVICE_PORT, reload=True)
    