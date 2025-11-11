from ast import TypeVar
import time
from typing import Any, Dict, Generic, Optional

import httpx

T = TypeVar('T')

class ApiRequest(Generic[T]):
    def __init__(self, data: T):
        self.data = data
        self.timestamp = int(time.time())
        
class ApiResponse(Generic[T]):
    def __init__(self, status: int, message: str, data: Optional[T] = None):
        self.status = status
        self.message = message
        self.data = data
        self.timestamp = int(time.time())
        
class HttpClient:
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.client = httpx.Client(base_url=base_url)

    def get(self, endpoint: str, params: Optional[Dict[str, Any]] = None) -> ApiResponse[T]:
        response = self.client.get(endpoint, params=params)
        return self._process_response(response)

    def post(self, endpoint: str, data: T) -> ApiResponse[T]:
        request_data = ApiRequest(data)
        response = self.client.post(endpoint, json=request_data.__dict__)
        return self._process_response(response)

    def put(self, endpoint: str, data: T) -> ApiResponse[T]:
        request_data = ApiRequest(data)
        response = self.client.put(endpoint, json=request_data.__dict__)
        return self._process_response(response)

    def delete(self, endpoint: str, params: Optional[Dict[str, Any]] = None) -> ApiResponse[T]:
        response = self.client.delete(endpoint, params=params)
        return self._process_response(response)

    def _process_response(self, response: httpx.Response) -> ApiResponse[T]:
        try:
            response_data = response.json()
            return ApiResponse(
                status=response.status_code,
                message=response_data.get("message", ""),
                data=response_data.get("data"),
            )
        except Exception as e:
            return ApiResponse(
                status=response.status_code,
                message=f"Failed to process response: {str(e)}",
                data=None,
            )

    def close(self):
        self.client.close()