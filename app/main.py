from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import json
import os

app = FastAPI(default_response_class=Response)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://app.krd-agents.ru",
        "https://t.me",
        "https://web.telegram.org",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 📁 путь к локальной базе пользователей
DB_PATH = "users.json"

# 🧑‍💼 ID главного администратора (твой Telegram ID)
ROOT_ADMIN_ID = 776430926  # ← сюда впиши свой реальный Telegram ID

# создаём файл users.json при первом запуске
if not os.path.exists(DB_PATH):
    with open(DB_PATH, "w", encoding="utf-8") as f:
        json.dump({}, f, ensure_ascii=False, indent=2)


# --- служебные функции ---
def load_users():
    try:
        with open(DB_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data if isinstance(data, dict) else {}
    except (json.JSONDecodeError, FileNotFoundError):
        return {}


def save_users(data):
    try:
        with open(DB_PATH, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print("Ошибка сохранения users.json:", e)


# --- Модель пользователя ---
class User(BaseModel):
    id: int
    firstName: str
    lastName: Optional[str] = None
    phone: Optional[str] = None
    username: Optional[str] = None
    role: Optional[str] = "user"  # user / admin


# --- Корневой маршрут ---
@app.get("/")
async def root():
    return Response(
        content=json.dumps({"message": "Backend работает 🚀"}, ensure_ascii=False),
        media_type="application/json; charset=utf-8",
    )


# --- Получить пользователя ---
@app.get("/api/user/{user_id}")
async def get_user(user_id: int):
    users = load_users()
    user = users.get(str(user_id))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return Response(
        content=json.dumps(user, ensure_ascii=False),
        media_type="application/json; charset=utf-8",
    )


# --- Зарегистрировать / обновить пользователя ---
@app.post("/api/register")
async def register_user(user: User):
    users = load_users()

    # 🧠 Определяем роль:
    # если ID = ROOT_ADMIN_ID → admin
    # иначе сохраняем роль как есть (или user по умолчанию)
    role = "admin" if user.id == ROOT_ADMIN_ID else user.role or "user"

    users[str(user.id)] = {
        "id": user.id,
        "firstName": user.firstName,
        "lastName": user.lastName,
        "phone": user.phone,
        "username": user.username,
        "role": role,
    }

    save_users(users)

    return Response(
        content=json.dumps(
            {"status": "ok", "user": users[str(user.id)]}, ensure_ascii=False
        ),
        media_type="application/json; charset=utf-8",
    )


# --- Проверить, админ ли пользователь ---
@app.get("/api/admin/check/{user_id}")
async def check_admin(user_id: int):
    users = load_users()
    user = users.get(str(user_id))

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    is_admin = user.get("role") == "admin" or user_id == ROOT_ADMIN_ID
    return Response(
        content=json.dumps({"is_admin": is_admin}, ensure_ascii=False),
        media_type="application/json; charset=utf-8",
    )
