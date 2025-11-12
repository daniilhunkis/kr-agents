from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import json

app = FastAPI(default_response_class=Response)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

USERS_DB = {}

class User(BaseModel):
    id: int
    firstName: str
    lastName: Optional[str] = None
    phone: Optional[str] = None

@app.get("/")
async def root():
    return Response(
        content=json.dumps({"message": "Backend работает 🚀"}, ensure_ascii=False),
        media_type="application/json; charset=utf-8"
    )

@app.get("/api/user/{user_id}")
async def get_user(user_id: int):
    """
    Проверяет, зарегистрирован ли пользователь по Telegram ID.
    """
    user = USERS_DB.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/api/register")
async def register_user(user: User):
    """
    Регистрирует нового пользователя или обновляет данные.
    """
    USERS_DB[user.id] = user.dict()
    return {"status": "ok", "user": user}
