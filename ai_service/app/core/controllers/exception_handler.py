import datetime
from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException

async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content= {
            "data" : "",
            "message" : exc.detail,
            "status" : exc.status_code,
            "timestamp" : datetime.datetime.now().isoformat()
        }
    )
    
async def value_error_exception_handler(request: Request, exc: ValueError):
    return JSONResponse(
        status_code=400,
        content= {
            "data" : "",
            "message" : str(exc),
            "status" : 400,
            "timestamp" : datetime.datetime.now().isoformat()
        }
    )

async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content= {
            "data" : "",
            "message" : str(exc),
            "status" : 500,
            "timestamp" : datetime.datetime.now().isoformat()
        }
    )