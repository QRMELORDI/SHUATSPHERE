from fastapi import FastAPI, HTTPException, Depends, status, Header
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from datetime import datetime, timedelta
from typing import Optional, List
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import JWTError, jwt
from dotenv import load_dotenv
import os
import cloudinary
import cloudinary.uploader

import logging

# Setup logging to see errors in Render console
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

logger.info("SHUATSPHERE API is starting up...")

app = FastAPI(title="SHUATSPHERE API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
JWT_SECRET = os.getenv("JWT_SECRET", "shuatsphere-super-secret-key-change-in-production")
JWT_ALGORITHM = "HS256"

client = AsyncIOMotorClient(MONGO_URI)
db = client.shuatsphere

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME", ""),
    api_key=os.getenv("CLOUDINARY_API_KEY", ""),
    api_secret=os.getenv("CLOUDINARY_API_SECRET", "")
)

def serialize_doc(doc):
    if doc is None:
        return None
    doc["id"] = str(doc.pop("_id"))
    return doc

def create_token(data: dict, expires_delta: timedelta = timedelta(days=7)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_token(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="No token provided")
    return authorization.replace("Bearer ", "")

async def get_current_user(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return serialize_doc(user)

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    username: str
    batch: str
    branch: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    username: str
    batch: str
    branch: str
    bio: Optional[str] = None
    avatar: Optional[str] = None
    bannerColor: Optional[str] = None
    auraScore: int = 0
    joinDate: str
    badges: List[str] = []
    joinedSpheres: List[str] = []
    isVerified: bool = False
    tag: Optional[str] = None

class SphereCreate(BaseModel):
    name: str
    slug: str
    description: str
    icon: str
    coverColor: str
    category: str

class SphereResponse(BaseModel):
    id: str
    name: str
    slug: str
    description: str
    icon: str
    coverColor: str
    coverImage: Optional[str] = None
    memberCount: int = 0
    postCount: int = 0
    createdBy: str
    createdAt: str
    isPrivate: bool = False
    category: str
    tags: List[str] = []
    keeper: str

class PostCreate(BaseModel):
    title: str
    content: Optional[str] = None
    imageUrl: Optional[str] = None
    linkUrl: Optional[str] = None
    type: str
    sphereSlug: str
    flair: Optional[str] = None
    isEvent: Optional[bool] = False
    eventDate: Optional[str] = None
    eventVenue: Optional[str] = None

class PostResponse(BaseModel):
    id: str
    title: str
    content: Optional[str] = None
    imageUrl: Optional[str] = None
    linkUrl: Optional[str] = None
    type: str
    authorId: str
    sphereId: str
    sphereSlug: str
    boosts: int = 0
    buries: int = 0
    replyCount: int = 0
    stashCount: int = 0
    createdAt: str
    flair: Optional[str] = None
    isPinned: bool = False
    isEvent: bool = False
    eventDate: Optional[str] = None
    eventVenue: Optional[str] = None

class CommentCreate(BaseModel):
    postId: str
    content: str
    parentId: Optional[str] = None

class CommentResponse(BaseModel):
    id: str
    postId: str
    parentId: Optional[str] = None
    content: str
    authorId: str
    boosts: int = 0
    buries: int = 0
    createdAt: str
    replies: List["CommentResponse"] = []

class WhisperCreate(BaseModel):
    toId: str
    content: str

class WhisperResponse(BaseModel):
    id: str
    fromId: str
    toId: str
    content: str
    createdAt: str
    read: bool = False

@app.get("/")
async def root():
    logger.info("Root endpoint called")
    return {"message": "SHUATSPHERE API v1.0", "status": "running"}

@app.post("/api/auth/register", response_model=UserResponse)
async def register(user: UserCreate):
    if not user.email.endswith("@shiats.edu.in"):
        raise HTTPException(status_code=400, detail="Only @shiats.edu.in emails are allowed")
    
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    existing_username = await db.users.find_one({"username": user.username})
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    hashed_password = pwd_context.hash(user.password)
    new_user = {
        "email": user.email,
        "password": hashed_password,
        "name": user.name,
        "username": user.username,
        "batch": user.batch,
        "branch": user.branch,
        "bio": f"{user.branch} student at SHUATS, batch {user.batch}",
        "avatar": f"https://api.dicebear.com/8.x/avataaars/svg?seed={user.username}&backgroundColor=b6e3f4",
        "bannerColor": "from-violet-600 to-teal-600",
        "auraScore": 100,
        "joinDate": datetime.utcnow().strftime("%Y-%m-%d"),
        "badges": ["verified_student"],
        "joinedSpheres": ["notices"],
        "isVerified": True,
        "tag": f"{user.branch} {user.batch}",
    }
    result = await db.users.insert_one(new_user)
    new_user["_id"] = result.inserted_id
    
    # Create welcome post only on first account creation
    welcome_sphere = await db.spheres.find_one({"slug": "notices"})
    if welcome_sphere:
        welcome_post = {
            "title": f"👋 Welcome {user.name} to SHUATSPHERE!",
            "content": f"Hey everyone! I'm {user.name}, a {user.branch} student (batch {user.batch}). Excited to be here! 🎓\n\nFeel free to reach out to me. Looking forward to connecting with all of you!",
            "imageUrl": None,
            "linkUrl": None,
            "type": "text",
            "authorId": str(result.inserted_id),
            "sphereId": str(welcome_sphere["_id"]),
            "sphereSlug": "notices",
            "boosts": 0,
            "buries": 0,
            "replyCount": 0,
            "stashCount": 0,
            "createdAt": datetime.utcnow().isoformat(),
            "flair": "Introduction",
            "isPinned": False,
            "isEvent": False,
            "eventDate": None,
            "eventVenue": None,
        }
        await db.posts.insert_one(welcome_post)
        await db.spheres.update_one({"_id": welcome_sphere["_id"]}, {"$inc": {"postCount": 1}})
    
    return serialize_doc(new_user)

@app.post("/api/auth/login")
async def login(user: UserLogin):
    db_user = await db.users.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not pwd_context.verify(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token({"sub": str(db_user["_id"])})
    return {"token": token, "user": serialize_doc(db_user)}

@app.get("/api/auth/me", response_model=UserResponse)
async def get_me(token: str = Depends(get_token)):
    user = await get_current_user(token)
    return user

@app.get("/api/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: str):
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return serialize_doc(user)

@app.put("/api/users/me", response_model=UserResponse)
async def update_me(token: str = Depends(get_token), data: dict = None):
    user = await get_current_user(token)
    await db.users.update_one(
        {"_id": ObjectId(user["id"])},
        {"$set": data}
    )
    updated = await db.users.find_one({"_id": ObjectId(user["id"])})
    return serialize_doc(updated)

@app.get("/api/spheres", response_model=List[SphereResponse])
async def get_spheres(category: Optional[str] = None, search: Optional[str] = None):
    query = {}
    if category and category != "All":
        query["category"] = category
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    spheres = await db.spheres.find(query).to_list(100)
    return [serialize_doc(s) for s in spheres]

@app.post("/api/spheres", response_model=SphereResponse)
async def create_sphere(sphere: SphereCreate, token: str = Depends(get_token)):
    user = await get_current_user(token)
    
    existing = await db.spheres.find_one({"slug": sphere.slug})
    if existing:
        raise HTTPException(status_code=400, detail="Sphere with this slug already exists")
    
    new_sphere = {
        "name": sphere.name,
        "slug": sphere.slug,
        "description": sphere.description,
        "icon": sphere.icon,
        "coverColor": sphere.coverColor,
        "coverImage": None,
        "memberCount": 1,
        "postCount": 0,
        "createdBy": user["id"],
        "createdAt": datetime.utcnow().isoformat(),
        "isPrivate": False,
        "category": sphere.category,
        "tags": [sphere.name],
        "keeper": user["id"],
    }
    result = await db.spheres.insert_one(new_sphere)
    new_sphere["_id"] = result.inserted_id
    
    await db.users.update_one(
        {"_id": ObjectId(user["id"])},
        {"$addToSet": {"joinedSpheres": sphere.slug}}
    )
    
    return serialize_doc(new_sphere)

@app.get("/api/spheres/{slug}", response_model=SphereResponse)
async def get_sphere(slug: str):
    sphere = await db.spheres.find_one({"slug": slug})
    if not sphere:
        raise HTTPException(status_code=404, detail="Sphere not found")
    return serialize_doc(sphere)

@app.post("/api/spheres/{slug}/join")
async def join_sphere(slug: str, token: str = Depends(get_token)):
    user = await get_current_user(token)
    sphere = await db.spheres.find_one({"slug": slug})
    if not sphere:
        raise HTTPException(status_code=404, detail="Sphere not found")
    
    await db.users.update_one(
        {"_id": ObjectId(user["id"])},
        {"$addToSet": {"joinedSpheres": slug}}
    )
    await db.spheres.update_one(
        {"_id": sphere["_id"]},
        {"$inc": {"memberCount": 1}}
    )
    return {"success": True}

@app.post("/api/spheres/{slug}/leave")
async def leave_sphere(slug: str, token: str = Depends(get_token)):
    user = await get_current_user(token)
    sphere = await db.spheres.find_one({"slug": slug})
    if not sphere:
        raise HTTPException(status_code=404, detail="Sphere not found")
    
    await db.users.update_one(
        {"_id": ObjectId(user["id"])},
        {"$pull": {"joinedSpheres": slug}}
    )
    await db.spheres.update_one(
        {"_id": sphere["_id"]},
        {"$inc": {"memberCount": -1}}
    )
    return {"success": True}

@app.get("/api/posts", response_model=List[PostResponse])
async def get_posts(sphere: Optional[str] = None, sort: str = "trending", limit: int = 50):
    query = {}
    if sphere:
        query["sphereSlug"] = sphere
    
    posts = await db.posts.find(query).to_list(limit)
    
    if sort == "latest":
        posts.sort(key=lambda x: x.get("createdAt", ""), reverse=True)
    elif sort == "top":
        posts.sort(key=lambda x: x.get("boosts", 0) - x.get("buries", 0), reverse=True)
    else:
        posts.sort(key=lambda x: x.get("boosts", 0) / max(1, (datetime.utcnow() - x.get("createdAt", datetime.utcnow())).total_seconds() / 3600), reverse=True)
    
    return [serialize_doc(p) for p in posts]

@app.post("/api/posts", response_model=PostResponse)
async def create_post(post: PostCreate, token: str = Depends(get_token)):
    user = await get_current_user(token)
    sphere = await db.spheres.find_one({"slug": post.sphereSlug})
    if not sphere:
        raise HTTPException(status_code=404, detail="Sphere not found")
    
    new_post = {
        "title": post.title,
        "content": post.content,
        "imageUrl": post.imageUrl,
        "linkUrl": post.linkUrl,
        "type": post.type,
        "authorId": user["id"],
        "sphereId": str(sphere["_id"]),
        "sphereSlug": post.sphereSlug,
        "boosts": 0,
        "buries": 0,
        "replyCount": 0,
        "stashCount": 0,
        "createdAt": datetime.utcnow().isoformat(),
        "flair": post.flair,
        "isPinned": False,
        "isEvent": post.isEvent or False,
        "eventDate": post.eventDate,
        "eventVenue": post.eventVenue,
    }
    result = await db.posts.insert_one(new_post)
    new_post["_id"] = result.inserted_id
    
    await db.spheres.update_one(
        {"_id": sphere["_id"]},
        {"$inc": {"postCount": 1}}
    )
    
    return serialize_doc(new_post)

@app.get("/api/posts/{post_id}", response_model=PostResponse)
async def get_post(post_id: str):
    post = await db.posts.find_one({"_id": ObjectId(post_id)})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return serialize_doc(post)

@app.delete("/api/posts/{post_id}")
async def delete_post(post_id: str, token: str = Depends(get_token)):
    user = await get_current_user(token)
    post = await db.posts.find_one({"_id": ObjectId(post_id)})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    if post["authorId"] != user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.posts.delete_one({"_id": ObjectId(post_id)})
    return {"success": True}

@app.post("/api/posts/{post_id}/vote")
async def vote_post(post_id: str, vote: str, token: str = Depends(get_token)):
    user = await get_current_user(token)
    post = await db.posts.find_one({"_id": ObjectId(post_id)})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    existing_vote = await db.votes.find_one({
        "userId": user["id"],
        "postId": post_id
    })
    
    if existing_vote:
        if existing_vote["vote"] == vote:
            await db.votes.delete_one({"_id": existing_vote["_id"]})
            update = {"$inc": {f"{vote}s": -1}}
        else:
            await db.votes.update_one(
                {"_id": existing_vote["_id"]},
                {"$set": {"vote": vote}}
            )
            update = {"$inc": {f"{vote}s": 1, f"{'boost' if vote == 'bury' else 'bury'}s": -1}}
    else:
        await db.votes.insert_one({
            "userId": user["id"],
            "postId": post_id,
            "vote": vote,
            "createdAt": datetime.utcnow().isoformat()
        })
        update = {"$inc": {f"{vote}s": 1}}
    
    await db.posts.update_one({"_id": ObjectId(post_id)}, update)
    updated_post = await db.posts.find_one({"_id": ObjectId(post_id)})
    return serialize_doc(updated_post)

@app.post("/api/posts/{post_id}/stash")
async def stash_post(post_id: str, token: str = Depends(get_token)):
    user = await get_current_user(token)
    post = await db.posts.find_one({"_id": ObjectId(post_id)})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    existing = await db.stashes.find_one({
        "userId": user["id"],
        "postId": post_id
    })
    
    if existing:
        await db.stashes.delete_one({"_id": existing["_id"]})
        await db.posts.update_one({"_id": ObjectId(post_id)}, {"$inc": {"stashCount": -1}})
    else:
        await db.stashes.insert_one({
            "userId": user["id"],
            "postId": post_id,
            "createdAt": datetime.utcnow().isoformat()
        })
        await db.posts.update_one({"_id": ObjectId(post_id)}, {"$inc": {"stashCount": 1}})
    
    return {"success": True}

@app.get("/api/posts/{post_id}/comments", response_model=List[CommentResponse])
async def get_comments(post_id: str):
    comments = await db.comments.find({"postId": post_id}).to_list(100)
    return [serialize_doc(c) for c in comments]

@app.post("/api/comments", response_model=CommentResponse)
async def create_comment(comment: CommentCreate, token: str = Depends(get_token)):
    user = await get_current_user(token)
    post = await db.posts.find_one({"_id": ObjectId(comment.postId)})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    new_comment = {
        "postId": comment.postId,
        "parentId": comment.parentId,
        "content": comment.content,
        "authorId": user["id"],
        "boosts": 0,
        "buries": 0,
        "createdAt": datetime.utcnow().isoformat(),
    }
    result = await db.comments.insert_one(new_comment)
    new_comment["_id"] = result.inserted_id
    
    await db.posts.update_one(
        {"_id": ObjectId(comment.postId)},
        {"$inc": {"replyCount": 1}}
    )
    
    return serialize_doc(new_comment)

@app.post("/api/comments/{comment_id}/vote")
async def vote_comment(comment_id: str, vote: str, token: str = Depends(get_token)):
    user = await get_current_user(token)
    comment = await db.comments.find_one({"_id": ObjectId(comment_id)})
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    update = {"$inc": {f"{vote}s": 1}}
    await db.comments.update_one({"_id": ObjectId(comment_id)}, update)
    
    updated = await db.comments.find_one({"_id": ObjectId(comment_id)})
    return serialize_doc(updated)

@app.get("/api/whispers", response_model=List[WhisperResponse])
async def get_whispers(token: str = Depends(get_token)):
    user = await get_current_user(token)
    whispers = await db.whispers.find({
        "$or": [{"toId": user["id"]}, {"fromId": user["id"]}]
    }).sort("createdAt", -1).to_list(50)
    return [serialize_doc(w) for w in whispers]

@app.post("/api/whispers", response_model=WhisperResponse)
async def send_whisper(whisper: WhisperCreate, token: str = Depends(get_token)):
    user = await get_current_user(token)
    
    new_whisper = {
        "fromId": user["id"],
        "toId": whisper.toId,
        "content": whisper.content,
        "createdAt": datetime.utcnow().isoformat(),
        "read": False,
    }
    result = await db.whispers.insert_one(new_whisper)
    new_whisper["_id"] = result.inserted_id
    
    return serialize_doc(new_whisper)

@app.get("/api/notifications", response_model=List[dict])
async def get_notifications(token: str = Depends(get_token)):
    user = await get_current_user(token)
    notifications = await db.notifications.find({"userId": user["id"]}).sort("createdAt", -1).to_list(50)
    return [serialize_doc(n) for n in notifications]

@app.post("/api/notifications/{notif_id}/read")
async def mark_notification_read(notif_id: str, token: str = Depends(get_token)):
    user = await get_current_user(token)
    await db.notifications.update_one(
        {"_id": ObjectId(notif_id), "userId": user["id"]},
        {"$set": {"read": True}}
    )
    return {"success": True}

@app.get("/api/search")
async def search(query: str):
    spheres = await db.spheres.find({
        "$or": [
            {"name": {"$regex": query, "$options": "i"}},
            {"slug": {"$regex": query, "$options": "i"}}
        ]
    }).to_list(10)
    
    posts = await db.posts.find({
        "$or": [
            {"title": {"$regex": query, "$options": "i"}},
            {"content": {"$regex": query, "$options": "i"}}
        ]
    }).to_list(20)
    
    return {
        "spheres": [serialize_doc(s) for s in spheres],
        "posts": [serialize_doc(p) for p in posts]
    }

@app.post("/api/upload")
async def upload_image(file: bytes = None):
    if not file:
        raise HTTPException(status_code=400, detail="No file provided")
    
    try:
        result = cloudinary.uploader.upload(file, folder="shuatsphere")
        return {"url": result["secure_url"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.get("/api/seed")
async def seed_database():
    default_spheres = [
        {"name": "CSE 2025", "slug": "cse-2025", "description": "Community for CSE batch of 2025", "icon": "💻", "coverColor": "from-violet-600 to-purple-800", "category": "Academics"},
        {"name": "CSE 2026", "slug": "cse-2026", "description": "First years CSE!", "icon": "🎓", "coverColor": "from-blue-600 to-cyan-700", "category": "Academics"},
        {"name": "DSA Practice", "slug": "dsa", "description": "Data Structures & Algorithms", "icon": "🧩", "coverColor": "from-green-600 to-emerald-800", "category": "Academics"},
        {"name": "Sports Zone", "slug": "sports", "description": "All sports discussions", "icon": "🏏", "coverColor": "from-orange-500 to-red-600", "category": "Sports"},
        {"name": "Hostel A", "slug": "hostel-a", "description": "Hostel A residents", "icon": "🏠", "coverColor": "from-yellow-500 to-amber-700", "category": "Campus Life"},
        {"name": "Library Corner", "slug": "library", "description": "Book recommendations", "icon": "📚", "coverColor": "from-teal-600 to-cyan-800", "category": "Academics"},
        {"name": "Official Notices", "slug": "notices", "description": "Official announcements", "icon": "📢", "coverColor": "from-red-500 to-rose-700", "category": "Official"},
        {"name": "Events Hub", "slug": "events", "description": "Fests and events", "icon": "🎉", "coverColor": "from-pink-500 to-purple-600", "category": "Events"},
    ]
    
    for sphere in default_spheres:
        existing = await db.spheres.find_one({"slug": sphere["slug"]})
        if not existing:
            sphere["memberCount"] = 100
            sphere["postCount"] = 10
            sphere["createdBy"] = "system"
            sphere["createdAt"] = datetime.utcnow().isoformat()
            sphere["isPrivate"] = False
            sphere["tags"] = [sphere["name"]]
            sphere["keeper"] = "system"
            await db.spheres.insert_one(sphere)
    
    return {"message": "Database seeded successfully"}

@app.get("/api/version")
async def get_version():
    return {
        "version": "1.0.0",
        "minVersion": "1.0.0",
        "updateUrl": "https://play.google.com/store/apps/details?id=com.shuatsphere.app",
        "forceUpdate": False,
        "releaseNotes": "✨ Gen Z animations added\n🎮 New avatar system\n🚀 Performance improvements"
    }

@app.post("/api/admin/give-aura")
async def give_aura_points(user_id: str, points: int, token: str = Depends(get_token)):
    admin = await get_current_user(token)
    if admin.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Only admins can give aura points")
    
    if points < 0:
        raise HTTPException(status_code=400, detail="Points must be positive")
    
    await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$inc": {"auraScore": points}}
    )
    
    updated_user = await db.users.find_one({"_id": ObjectId(user_id)})
    return serialize_doc(updated_user)

@app.get("/api/leaderboard")
async def get_leaderboard(limit: int = 50):
    users = await db.users.find().sort("auraScore", -1).limit(limit).to_list(limit)
    return [serialize_doc(u) for u in users]

@app.post("/api/posts/{post_id}/crosspost")
async def crosspost(post_id: str, target_sphere_slug: str, token: str = Depends(get_token)):
    user = await get_current_user(token)
    original = await db.posts.find_one({"_id": ObjectId(post_id)})
    if not original:
        raise HTTPException(status_code=404, detail="Post not found")
    
    target_sphere = await db.spheres.find_one({"slug": target_sphere_slug})
    if not target_sphere:
        raise HTTPException(status_code=404, detail="Target sphere not found")
    
    crosspost = {
        "title": f"[Cross-post] {original.get('title', '')}",
        "content": original.get("content"),
        "imageUrl": original.get("imageUrl"),
        "linkUrl": original.get("linkUrl"),
        "type": original.get("type", "text"),
        "authorId": user["id"],
        "sphereId": str(target_sphere["_id"]),
        "sphereSlug": target_sphere_slug,
        "boosts": 0,
        "buries": 0,
        "replyCount": 0,
        "stashCount": 0,
        "createdAt": datetime.utcnow().isoformat(),
        "flair": f"Crossposted from s/{original.get('sphereSlug', '')}",
        "isPinned": False,
        "isEvent": False,
        "eventDate": None,
        "eventVenue": None,
        "originalPostId": post_id,
    }
    result = await db.posts.insert_one(crosspost)
    crosspost["_id"] = result.inserted_id
    
    await db.spheres.update_one(
        {"_id": target_sphere["_id"]},
        {"$inc": {"postCount": 1}}
    )
    
    return serialize_doc(crosspost)

@app.post("/api/whispers/{whisper_id}/read")
async def mark_whisper_read(whisper_id: str, token: str = Depends(get_token)):
    user = await get_current_user(token)
    await db.whispers.update_one(
        {"_id": ObjectId(whisper_id), "toId": user["id"]},
        {"$set": {"read": True}}
    )
    return {"success": True}

@app.get("/api/whispers/unread-count")
async def get_unread_whisper_count(token: str = Depends(get_token)):
    user = await get_current_user(token)
    count = await db.whispers.count_documents({"toId": user["id"], "read": False})
    return {"count": count}