from fastapi import FastAPI, HTTPException, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
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

load_dotenv()

app = FastAPI(title="SHUATSPHERE API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/version")
async def get_version():
    return {
        "version": "1.0.0",
        "minVersion": "1.0.0",
        "updateUrl": "https://play.google.com/store/apps/details?id=com.shuatsphere.app",
        "forceUpdate": False
    }

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
JWT_SECRET = os.getenv("JWT_SECRET", "shuatsphere-super-secret-key-change-in-production")
JWT_ALGORITHM = "HS256"

client = AsyncIOMotorClient(MONGO_URI)
db = client.shuatsphere

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

security = HTTPBearer(auto_error=False)

async def get_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return credentials.credentials

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

class PasswordReset(BaseModel):
    email: EmailStr
    username: str
    newPassword: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None
    bannerColor: Optional[str] = None
    tag: Optional[str] = None

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
    role: str = "user"

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
    moderators: List[str] = []

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

class WhisperCreate(BaseModel):
    toId: str
    content: str

class WhisperResponse(BaseModel):
    id: str
    fromId: str
    fromName: Optional[str] = None
    toId: str
    toName: Optional[str] = None
    content: str
    createdAt: str
    read: bool = False

class ModeratorAction(BaseModel):
    userId: str
    auraBonus: int = 0

@app.get("/")
async def root():
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
        "auraScore": 0,
        "joinDate": datetime.utcnow().strftime("%Y-%m-%d"),
        "badges": ["verified_student"],
        "joinedSpheres": [],
        "isVerified": True,
        "tag": f"{user.branch} {user.batch}",
    }
    result = await db.users.insert_one(new_user)
    new_user["_id"] = result.inserted_id
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

@app.post("/api/auth/reset-password")
async def reset_password(data: PasswordReset):
    db_user = await db.users.find_one({"email": data.email, "username": data.username})
    if not db_user:
        raise HTTPException(status_code=404, detail="No matching user found with those credentials")
    
    hashed_password = pwd_context.hash(data.newPassword)
    await db.users.update_one(
        {"_id": db_user["_id"]},
        {"$set": {"password": hashed_password}}
    )
    return {"success": True, "message": "Password reset successfully"}

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

@app.get("/api/users/username/{username}", response_model=UserResponse)
async def get_user_by_username(username: str):
    user = await db.users.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return serialize_doc(user)

@app.put("/api/users/me", response_model=UserResponse)
async def update_me(data: UserUpdate, token: str = Depends(get_token)):
    user = await get_current_user(token)
    update_data = {k: v for k, v in data.dict().items() if v is not None}
    if update_data:
        await db.users.update_one(
            {"_id": ObjectId(user["id"])},
            {"$set": update_data}
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
        "moderators": [],
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
    
    if slug not in user.get("joinedSpheres", []):
        await db.users.update_one(
            {"_id": ObjectId(user["id"])},
            {"$addToSet": {"joinedSpheres": slug}}
        )
        await db.spheres.update_one(
            {"_id": sphere["_id"]},
            {"$inc": {"memberCount": 1}}
        )
    
    return {"success": True, "message": f"Joined {sphere['name']}"}

@app.post("/api/spheres/{slug}/leave")
async def leave_sphere(slug: str, token: str = Depends(get_token)):
    user = await get_current_user(token)
    sphere = await db.spheres.find_one({"slug": slug})
    if not sphere:
        raise HTTPException(status_code=404, detail="Sphere not found")
    
    if sphere["keeper"] == user["id"]:
        raise HTTPException(status_code=400, detail="Owner cannot leave their own sphere")
    
    if slug in user.get("joinedSpheres", []):
        await db.users.update_one(
            {"_id": ObjectId(user["id"])},
            {"$pull": {"joinedSpheres": slug}}
        )
        await db.spheres.update_one(
            {"_id": sphere["_id"]},
            {"$inc": {"memberCount": -1}}
        )
        
        if user["id"] in sphere.get("moderators", []):
            await db.spheres.update_one(
                {"_id": sphere["_id"]},
                {"$pull": {"moderators": user["id"]}}
            )
    
    return {"success": True, "message": f"Left {sphere['name']}"}

@app.post("/api/spheres/{slug}/moderators")
async def add_moderator(slug: str, action: ModeratorAction, token: str = Depends(get_token)):
    user = await get_current_user(token)
    sphere = await db.spheres.find_one({"slug": slug})
    if not sphere:
        raise HTTPException(status_code=404, detail="Sphere not found")
    
    is_owner = sphere["keeper"] == user["id"]
    is_moderator = user["id"] in sphere.get("moderators", [])
    
    if not is_owner and not is_moderator:
        raise HTTPException(status_code=403, detail="Only owner or moderators can manage moderators")
    
    target_user = await db.users.find_one({"_id": ObjectId(action.userId)})
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if target_user["id"] == sphere["keeper"]:
        raise HTTPException(status_code=400, detail="Cannot modify owner's moderator status")
    
    moderators = sphere.get("moderators", [])
    
    if action.userId not in moderators:
        await db.spheres.update_one(
            {"_id": sphere["_id"]},
            {"$addToSet": {"moderators": action.userId}}
        )
        if slug not in target_user.get("joinedSpheres", []):
            await db.users.update_one(
                {"_id": ObjectId(action.userId)},
                {"$addToSet": {"joinedSpheres": slug}}
            )
            await db.spheres.update_one(
                {"_id": sphere["_id"]},
                {"$inc": {"memberCount": 1}}
            )
        message = f"Added {target_user['name']} as moderator"
    else:
        await db.spheres.update_one(
            {"_id": sphere["_id"]},
            {"$pull": {"moderators": action.userId}}
        )
        if slug in target_user.get("joinedSpheres", []):
            await db.users.update_one(
                {"_id": ObjectId(action.userId)},
                {"$pull": {"joinedSpheres": slug}}
            )
            await db.spheres.update_one(
                {"_id": sphere["_id"]},
                {"$inc": {"memberCount": -1}}
            )
        message = f"Removed {target_user['name']} from moderators (left sphere)"
    
    if action.auraBonus > 0:
        await db.users.update_one(
            {"_id": ObjectId(action.userId)},
            {"$inc": {"auraScore": action.auraBonus}}
        )
        message += f" with +{action.auraBonus} aura"
    
    updated_sphere = await db.spheres.find_one({"slug": slug})
    return {"success": True, "message": message, "sphere": serialize_doc(updated_sphere)}

@app.get("/api/posts", response_model=List[PostResponse])
async def get_posts(sphere: Optional[str] = None, sort: str = "latest", limit: int = 50):
    query = {}
    if sphere:
        query["sphereSlug"] = sphere
    
    posts = await db.posts.find(query).sort("createdAt", -1).limit(limit).to_list(limit)
    
    if sort == "top":
        posts.sort(key=lambda x: x.get("boosts", 0) - x.get("buries", 0), reverse=True)
    elif sort == "trending":
        posts.sort(key=lambda x: x.get("boosts", 0) / max(1, (datetime.utcnow() - datetime.fromisoformat(x.get("createdAt", datetime.utcnow().isoformat()))).total_seconds() / 3600 + 1), reverse=True)
    
    return [serialize_doc(p) for p in posts]

@app.post("/api/posts", response_model=PostResponse)
async def create_post(post: PostCreate, token: str = Depends(get_token)):
    user = await get_current_user(token)
    sphere = await db.spheres.find_one({"slug": post.sphereSlug})
    if not sphere:
        raise HTTPException(status_code=404, detail="Sphere not found")
    
    if post.sphereSlug not in user.get("joinedSpheres", []):
        raise HTTPException(status_code=403, detail="You must join this sphere before posting")
    
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
    
    sphere = await db.spheres.find_one({"slug": post["sphereSlug"]})
    is_moderator = sphere and (post["authorId"] == user["id"] or user["id"] == sphere.get("keeper") or user["id"] in sphere.get("moderators", []))
    
    if not is_moderator:
        raise HTTPException(status_code=403, detail="Not authorized to delete this post")
    
    await db.posts.delete_one({"_id": ObjectId(post_id)})
    
    await db.spheres.update_one(
        {"_id": sphere["_id"]},
        {"$inc": {"postCount": -1}}
    )
    
    return {"success": True}

@app.post("/api/posts/{post_id}/pin")
async def pin_post(post_id: str, token: str = Depends(get_token)):
    user = await get_current_user(token)
    post = await db.posts.find_one({"_id": ObjectId(post_id)})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    sphere = await db.spheres.find_one({"slug": post["sphereSlug"]})
    if not sphere or (user["id"] != sphere.get("keeper") and user["id"] not in sphere.get("moderators", [])):
        raise HTTPException(status_code=403, detail="Only sphere owner or moderators can pin posts")
    
    await db.posts.update_one(
        {"_id": ObjectId(post_id)},
        {"$set": {"isPinned": not post.get("isPinned", False)}}
    )
    
    updated = await db.posts.find_one({"_id": ObjectId(post_id)})
    return {"success": True, "isPinned": updated.get("isPinned", False)}

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
            await db.users.update_one({"_id": ObjectId(post["authorId"])}, {"$inc": {"auraScore": -1}})
        else:
            await db.votes.update_one(
                {"_id": existing_vote["_id"]},
                {"$set": {"vote": vote}}
            )
            update = {"$inc": {f"{vote}s": 1, f"{'boost' if vote == 'bury' else 'bury'}s": -1}}
            if vote == "boost":
                await db.users.update_one({"_id": ObjectId(post["authorId"])}, {"$inc": {"auraScore": 2}})
            else:
                await db.users.update_one({"_id": ObjectId(post["authorId"])}, {"$inc": {"auraScore": -2}})
    else:
        await db.votes.insert_one({
            "userId": user["id"],
            "postId": post_id,
            "vote": vote,
            "createdAt": datetime.utcnow().isoformat()
        })
        update = {"$inc": {f"{vote}s": 1}}
        if vote == "boost":
            await db.users.update_one({"_id": ObjectId(post["authorId"])}, {"$inc": {"auraScore": 1}})
        else:
            await db.users.update_one({"_id": ObjectId(post["authorId"])}, {"$inc": {"auraScore": -1}})
    
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
        raise HTTPException(status_code=404, detail="Post not found")
    
    update = {"$inc": {f"{vote}s": 1}}
    await db.comments.update_one({"_id": ObjectId(comment_id)}, update)
    
    await db.users.update_one({"_id": ObjectId(comment["authorId"])}, {"$inc": {"auraScore": 1 if vote == "boost" else -1}})
    
    updated = await db.comments.find_one({"_id": ObjectId(comment_id)})
    return serialize_doc(updated)

@app.get("/api/whispers", response_model=List[WhisperResponse])
async def get_whispers(token: str = Depends(get_token)):
    user = await get_current_user(token)
    whispers = await db.whispers.find({
        "$or": [{"toId": user["id"]}, {"fromId": user["id"]}]
    }).sort("createdAt", -1).to_list(50)
    
    result = []
    for w in whispers:
        serialized = serialize_doc(w)
        if w["fromId"] == user["id"]:
            target = await db.users.find_one({"_id": ObjectId(w["toId"])})
            serialized["toName"] = target["name"] if target else "Unknown"
            serialized["fromName"] = user["name"]
        else:
            sender = await db.users.find_one({"_id": ObjectId(w["fromId"])})
            serialized["fromName"] = sender["name"] if sender else "Unknown"
            serialized["toName"] = user["name"]
        result.append(serialized)
    
    return result

@app.post("/api/whispers", response_model=WhisperResponse)
async def send_whisper(whisper: WhisperCreate, token: str = Depends(get_token)):
    user = await get_current_user(token)
    
    target = await db.users.find_one({"_id": ObjectId(whisper.toId)})
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
    
    new_whisper = {
        "fromId": user["id"],
        "toId": whisper.toId,
        "content": whisper.content,
        "createdAt": datetime.utcnow().isoformat(),
        "read": False,
    }
    result = await db.whispers.insert_one(new_whisper)
    new_whisper["_id"] = result.inserted_id
    
    serialized = serialize_doc(new_whisper)
    serialized["fromName"] = user["name"]
    serialized["toName"] = target["name"]
    
    return serialized

@app.post("/api/whispers/{whisper_id}/read")
async def mark_whisper_read(whisper_id: str, token: str = Depends(get_token)):
    user = await get_current_user(token)
    whisper = await db.whispers.find_one({"_id": ObjectId(whisper_id)})
    if not whisper:
        raise HTTPException(status_code=404, detail="Message not found")
    
    if whisper["toId"] != user["id"]:
        raise HTTPException(status_code=403, detail="Cannot mark this message as read")
    
    await db.whispers.update_one(
        {"_id": ObjectId(whisper_id)},
        {"$set": {"read": True}}
    )
    
    return {"success": True}

@app.get("/api/whispers/unread-count")
async def get_unread_count(token: str = Depends(get_token)):
    user = await get_current_user(token)
    count = await db.whispers.count_documents({"toId": user["id"], "read": False})
    return {"count": count}

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

@app.get("/api/search/users")
async def search_users(q: str, token: str = Depends(get_token)):
    users = await db.users.find({
        "$or": [
            {"name": {"$regex": q, "$options": "i"}},
            {"username": {"$regex": q, "$options": "i"}}
        ]
    }).to_list(20)
    return [serialize_doc(u) for u in users]

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
async def upload_image(file: bytes = Body(...)):
    try:
        result = cloudinary.uploader.upload(file, folder="shuatsphere")
        return {"url": result["secure_url"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.post("/api/clear-posts")
async def clear_all_posts(token: str = Depends(get_token)):
    user = await get_current_user(token)
    
    if user.get("email") != "owner@shiats.edu.in":
        raise HTTPException(status_code=403, detail="Only admin can clear posts")
    
    result = await db.posts.delete_many({})
    await db.spheres.update_many({}, {"$set": {"postCount": 0}})
    
    return {"success": True, "deleted": result.deleted_count}

@app.post("/api/clear-seed-data")
async def clear_seed_data(token: str = Depends(get_token)):
    user = await get_current_user(token)
    
    if user.get("email") != "owner@shiats.edu.in":
        raise HTTPException(status_code=403, detail="Only admin can clear data")
    
    await db.spheres.delete_many({})
    await db.posts.delete_many({})
    await db.comments.delete_many({})
    await db.votes.delete_many({})
    await db.stashes.delete_many({})
    await db.whispers.delete_many({})
    await db.notifications.delete_many({})
    
    return {"success": True, "message": "All demo data cleared"}

@app.post("/api/seed-test-users")
async def seed_test_users(token: str = Depends(get_token)):
    user = await get_current_user(token)
    
    if user.get("email") != "25msrsgis001@shiats.edu.in":
        raise HTTPException(status_code=403, detail="Only admin can seed test users")
    
    test_users = [
        {"email": "25msrsgis001@shiats.edu.in", "password": "admin2024", "name": "Admin User", "username": "admin", "batch": "2025", "branch": "CSE", "role": "admin"},
        {"email": "22msrscse001@shiats.edu.in", "password": "mod2024", "name": "Mod Alice", "username": "mod_alice", "batch": "2022", "branch": "CSE", "role": "moderator"},
        {"email": "22msrscse002@shiats.edu.in", "password": "mod2024", "name": "Mod Bob", "username": "mod_bob", "batch": "2022", "branch": "CSE", "role": "moderator"},
        {"email": "22msrscse003@shiats.edu.in", "password": "mod2024", "name": "Mod Charlie", "username": "mod_charlie", "batch": "2022", "branch": "CSE", "role": "moderator"},
        {"email": "22msrscse004@shiats.edu.in", "password": "mod2024", "name": "Mod Diana", "username": "mod_diana", "batch": "2022", "branch": "CSE", "role": "moderator"},
        {"email": "22msrscse005@shiats.edu.in", "password": "mod2024", "name": "Mod Evan", "username": "mod_evan", "batch": "2022", "branch": "CSE", "role": "moderator"},
        {"email": "23msrscse001@shiats.edu.in", "password": "user2024", "name": "User Frank", "username": "user_frank", "batch": "2023", "branch": "CSE", "role": "user"},
        {"email": "23msrscse002@shiats.edu.in", "password": "user2024", "name": "User Grace", "username": "user_grace", "batch": "2023", "branch": "CSE", "role": "user"},
        {"email": "23msrscse003@shiats.edu.in", "password": "user2024", "name": "User Henry", "username": "user_henry", "batch": "2023", "branch": "CSE", "role": "user"},
        {"email": "23msrscse004@shiats.edu.in", "password": "user2024", "name": "User Ivy", "username": "user_ivy", "batch": "2023", "branch": "CSE", "role": "user"},
    ]
    
    created = []
    for u in test_users:
        existing = await db.users.find_one({"email": u["email"]})
        if existing:
            continue
        
        hashed = pwd_context.hash(u["password"])
        new_user = {
            "email": u["email"],
            "password": hashed,
            "name": u["name"],
            "username": u["username"],
            "batch": u["batch"],
            "branch": u["branch"],
            "bio": f"{u['branch']} student at SHUATS, batch {u['batch']}",
            "avatar": f"https://api.dicebear.com/8.x/avataaars/svg?seed={u['username']}&backgroundColor=b6e3f4",
            "bannerColor": "from-violet-600 to-teal-600",
            "auraScore": 100 if u["role"] != "user" else 50,
            "joinDate": datetime.utcnow().strftime("%Y-%m-%d"),
            "badges": ["verified_student"] + (["moderator"] if u["role"] == "moderator" else []),
            "joinedSpheres": [],
            "isVerified": True,
            "tag": f"{u['branch']} {u['batch']}",
            "role": u["role"],
        }
        await db.users.insert_one(new_user)
        created.append({"email": u["email"], "password": u["password"], "role": u["role"]})
    
    return {"success": True, "created": created}

@app.get("/api/test-users")
async def get_test_users(token: str = Depends(get_token)):
    user = await get_current_user(token)
    
    if user.get("email") != "25msrsgis001@shiats.edu.in":
        raise HTTPException(status_code=403, detail="Only admin can view test users")
    
    test_emails = [
        "25msrsgis001@shiats.edu.in",
        "22msrscse001@shiats.edu.in",
        "22msrscse002@shiats.edu.in",
        "22msrscse003@shiats.edu.in",
        "22msrscse004@shiats.edu.in",
        "22msrscse005@shiats.edu.in",
        "23msrscse001@shiats.edu.in",
        "23msrscse002@shiats.edu.in",
        "23msrscse003@shiats.edu.in",
        "23msrscse004@shiats.edu.in",
    ]
    
    test_users = []
    for email in test_emails:
        db_user = await db.users.find_one({"email": email})
        if db_user:
            test_users.append({
                "email": email,
                "name": db_user.get("name"),
                "username": db_user.get("username"),
                "role": db_user.get("role", "user"),
                "auraScore": db_user.get("auraScore", 0),
            })
    
    return {"users": test_users}

@app.get("/api/admin/users")
async def get_all_users(token: str = Depends(get_token)):
    user = await get_current_user(token)
    if user.get("role") not in ["admin", "moderator"]:
        raise HTTPException(status_code=403, detail="Admin only")
    
    users = await db.users.find({}, {"password": 0}).to_list(100)
    return {"users": [serialize_doc(u) for u in users]}

@app.post("/api/admin/aura")
async def give_aura_points(data: dict, token: str = Depends(get_token)):
    user = await get_current_user(token)
    if user.get("role") not in ["admin", "moderator"]:
        raise HTTPException(status_code=403, detail="Admin only")
    
    target_user_id = data.get("userId")
    aura_amount = data.get("aura", 0)
    
    if not target_user_id or aura_amount == 0:
        raise HTTPException(status_code=400, detail="Invalid request")
    
    target = await db.users.find_one({"_id": ObjectId(target_user_id)})
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
    
    new_score = target.get("auraScore", 0) + aura_amount
    await db.users.update_one(
        {"_id": ObjectId(target_user_id)},
        {"$set": {"auraScore": new_score}}
    )
    
    return {"success": True, "message": f"Added {aura_amount} aura to {target['name']}", "newScore": new_score}