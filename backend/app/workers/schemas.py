from typing import List, Dict, Union

from pydantic import BaseModel, EmailStr, Field

example_permissions = {
    "add_worker": False,
    "get_workers": False,
    "update_worker": False,
    "add_camera": False,
    "calibrate_camera": False
}

class Token(BaseModel):
    access_token: str
    token_type: str

class WorkerBase(BaseModel):
    id: int
    full_name: str = Field(..., examples=["Name Surname"])
    email: EmailStr = Field(..., examples=["example@example.com"])
    role: str = Field(..., examples=["Employee", "Administrator"])
    permissions: Dict[str, Union[bool, List[str]]] = Field(default={}, examples=[example_permissions])
    is_active: bool = Field(default=True, examples=[True, False])

class WorkerCreate(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=1, max_length=255, examples=["Name Surname"])
    role: str = Field(..., min_length=1, max_length=50, examples=["Employee", "Administrator"])
    password: str = Field(..., min_length=8, examples=["password123"])
    permissions: Dict[str, Union[bool, List[str]]] = Field(
        ..., description="Dictionary of permissions for the worker", examples=[example_permissions]
    )

class WorkerUpdate(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=255)
    role: str = Field(..., min_length=1, max_length=50)
    old_password: str = Field(..., min_length=8)
    new_password: str = Field(..., min_length=8)
    is_active: bool
    permissions: Dict[str, Union[bool, List[str]]] = Field(
        ..., examples=[example_permissions]
    )