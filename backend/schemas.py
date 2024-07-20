from typing import List, Optional, Sequence
from pydantic import BaseModel

class UserBase(BaseModel):
  username: str
  email: str
  password: str

class UserDisplay(BaseModel):
  username: str
  email: str
  class Config():
    orm_mode = True

# User inside ArticleDisplay
class User(BaseModel):
  id: int
  username: str
  class Config():
    orm_mode = True

class UserAuth(BaseModel):
  id: int
  username: str
  email: str