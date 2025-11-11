import os
import json
import hmac
import logging
import datetime
import pyfiglet
from dotenv import load_dotenv
from phoenix.otel import register
from fastapi.responses import JSONResponse
from requests import session
from scalar_fastapi import get_scalar_api_reference
from fastapi import FastAPI, HTTPException, Request
from fastapi.exception_handlers import http_exception_handler
from openinference.instrumentation.langchain import LangChainInstrumentor
from app.utils.config import AI_SERVICE_AGENT_ENV, API_KEY, PHOENIX_COLLECTOR_ENDPOINT
from app.core.controllers.exception_handler import generic_exception_handler, value_error_exception_handler
from app.core.controllers import chat_controller, llm_controller, prompt_controller, settings_controller, student_analysis_controller

load_dotenv()

app = FastAPI(title="Student Analysis API", version="0.1")

EXCLUDED_PATHS = json.loads(os.environ['EXCLUDED_PATHS'])

@app.middleware("http")
async def api_key_middleware(request: Request, call_next):        
    if request.url.path in EXCLUDED_PATHS:
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

app.include_router(chat_controller.router)
app.include_router(prompt_controller.router)
app.include_router(settings_controller.router)
app.include_router(student_analysis_controller.router)
app.include_router(llm_controller.router)

@app.get("/scalar", include_in_schema= False)
async def scalar_html():
    return get_scalar_api_reference(
        openapi_url=app.openapi_url,
        title = app.title + " - Scalar API"
    )
    
if(AI_SERVICE_AGENT_ENV == "development"):
    tracer_provider = register(
        project_name="Student Care System",
        endpoint=f"{PHOENIX_COLLECTOR_ENDPOINT}/v1/traces",
        auto_instrument=True
    )
    LangChainInstrumentor(tracer_provider=tracer_provider).instrument(skip_dep_check=True)

if __name__ == "__main__":        
    ascii_banner = pyfiglet.figlet_format("SCS", font="doh")
    logging.info(ascii_banner)
    
    import uvicorn
    uvicorn.run("app.main:app", host="localhost", port=8084, reload=True)
    