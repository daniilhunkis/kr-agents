from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional, List
import os
import json
from uuid import uuid4
from datetime import datetime

# -------------------- CONFIG --------------------

MAIN_ADMIN_ID = 776430926  # твой Telegram ID
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(BASE_DIR)

DB_USERS = os.path.join(ROOT_DIR, "users.json")
DB_OBJECTS = os.path.join(ROOT_DIR, "objects.json")

UPLOAD_DIR = os.path.join(ROOT_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# -------------------- INIT FILES --------------------

if not os.path.exists(DB_USERS):
    with open(DB_USERS, "w") as f:
        json.dump({}, f)

if not os.path.exists(DB_OBJECTS):
    with open(DB_OBJECTS, "w") as f:
        json.dump([], f)

# -------------------- HELPERS --------------------

def load_users():
    try:
        with open(DB_USERS, "r") as f:
            return json.load(f)
    except:
        return {}

def save_users(data):
    with open(DB_USERS, "w") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def load_objects():
    try:
        with open(DB_OBJECTS, "r") as f:
            return json.load(f)
    except:
        return []

def save_objects(data):
    with open(DB_OBJECTS, "w") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def save_file_locally(file: UploadFile, folder: str) -> str:
    """
    Сохраняет файл в папку /uploads/{folder}/{uuid}.{ext}
    Возвращает публичный URL для фронта.
    """
    os.makedirs(os.path.join(UPLOAD_DIR, folder), exist_ok=True)

    ext = os.path.splitext(file.filename or "")[1]
    filename = f"{uuid4().hex}{ext}"
    path = os.path.join(UPLOAD_DIR, folder, filename)

    with open(path, "wb") as f:
        f.write(file.file.read())

    return f"/uploads/{folder}/{filename}"


# -------------------- APP --------------------

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://app.krd-agents.ru",
        "https://t.me",
        "https://web.telegram.org",
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# статика для файлов
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# -------------------- MODELS --------------------

class User(BaseModel):
    id: int
    firstName: str
    lastName: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[str] = "user"
    moderatorPassword: Optional[str] = None

class ModeratePayload(BaseModel):
    moderatorId: int
    action: str
    comment: Optional[str] = None

# -------------------- ROUTES --------------------

@app.get("/")
async def root():
    return {"message": "Backend работает локально 🚀"}

# ---- USER ----

@app.post("/api/register")
async def register_user(user: User):
    users = load_users()
    uid = str(user.id)

    if uid in users:
        users[uid].update(user.dict(exclude_none=True))
    else:
        users[uid] = user.dict()

        if user.id == MAIN_ADMIN_ID:
            users[uid]["role"] = "admin"

    save_users(users)
    return {"status": "ok", "user": users[uid]}

@app.get("/api/user/{uid}")
async def get_user(uid: int):
    users = load_users()
    return users.get(str(uid))

@app.patch("/api/users/{uid}/role")
async def update_role(uid: int, request: Request):
    data = await request.json()
    admin_id = data.get("admin_id")
    role = data.get("role")

    if int(admin_id) != MAIN_ADMIN_ID:
        raise HTTPException(403, "Only main admin")

    users = load_users()
    if str(uid) not in users:
        raise HTTPException(404, "User not found")

    users[str(uid)]["role"] = role
    save_users(users)
    return {"status": "ok", "user": users[str(uid)]}

# ---- OBJECTS ----

@app.post("/api/objects")
async def create_object(
    owner_id: int = Form(...),
    district: str = Form(...),
    street: str = Form(...),
    house: str = Form(...),
    floor: str = Form(...),
    area: float = Form(...),
    price: int = Form(...),

    rooms_type: str = Form(...),
    rooms_custom: Optional[str] = Form(None),

    kitchen_area: Optional[float] = Form(None),

    commission_place: str = Form(...),
    commission_value: float = Form(...),
    commission_value_type: str = Form(...),

    photos: List[UploadFile] = File(...),
    plan_photos: Optional[List[UploadFile]] = File(None),
    doc_photos: List[UploadFile] = File(...),
):

    if len(photos) == 0:
        raise HTTPException(400, "Добавьте фото объекта")

    if len(doc_photos) == 0:
        raise HTTPException(400, "Добавьте документы")

    photo_urls = [save_file_locally(f, f"{owner_id}/photos") for f in photos]
    plan_urls = [save_file_locally(f, f"{owner_id}/plans") for f in (plan_photos or [])]
    doc_urls = [save_file_locally(f, f"{owner_id}/docs") for f in doc_photos]

    objects = load_objects()

    obj = {
        "id": uuid4().hex,
        "ownerId": owner_id,
        "district": district,
        "street": street,
        "house": house,
        "floor": floor,

        "roomsType": rooms_type,
        "roomsCustom": rooms_custom,

        "area": area,
        "kitchenArea": kitchen_area,
        "price": price,

        "commissionPlace": commission_place,
        "commissionValue": commission_value,
        "commissionValueType": commission_value_type,

        "photos": photo_urls,
        "planPhotos": plan_urls,
        "docPhotos": doc_urls,

        "status": "waiting",
        "moderatorComment": None,
        "createdAt": datetime.utcnow().isoformat()
    }

    objects.append(obj)
    save_objects(objects)
    return obj


@app.get("/api/objects/my/{uid}")
async def my_objects(uid: int):
    objs = load_objects()
    return [o for o in objs if o["ownerId"] == uid]

@app.get("/api/objects/moderation")
async def moderation_list(moderator_id: int):
    users = load_users()
    u = users.get(str(moderator_id))
    if not u or u.get("role") not in ("admin", "moderator"):
        raise HTTPException(403, "Access denied")

    objs = load_objects()
    return [o for o in objs if o["status"] in ("waiting", "revision")]

@app.post("/api/objects/{obj_id}/moderate")
async def moderate(obj_id: str, payload: ModeratePayload):
    objs = load_objects()
    found = None

    for o in objs:
        if o["id"] == obj_id:
            found = o
            break

    if not found:
        raise HTTPException(404, "Object not found")

    if payload.action == "approve":
        found["status"] = "approved"
    elif payload.action == "reject":
        found["status"] = "rejected"
    elif payload.action == "revision":
        found["status"] = "revision"
    else:
        raise HTTPException(400, "Invalid action")

    found["moderatorComment"] = payload.comment
    save_objects(objs)

    return found
