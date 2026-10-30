from typing import Generic, TypeVar, Optional, Any
from pydantic import BaseModel, Field

DataT = TypeVar("DataT")

class StandardResponse(BaseModel, Generic[DataT]):
    success: bool = True
    message: str = "Operation completed successfully"
    data: DataT
    metadata: Optional[dict[str, Any]] = None

class ErrorResponse(BaseModel):
    success: bool = False
    error_code: str
    message: str
    details: Optional[Any] = None
