"""
AI小红书助手 - 后端服务
一键部署版本
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
import json
from datetime import datetime
from pathlib import Path

app = FastAPI(title="AI小红书助手API")

# 允许所有来源访问（生产环境建议限制具体域名）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========== 数据模型 ==========

class ContentRequest(BaseModel):
    description: str
    category: str

class SaveRequest(BaseModel):
    id: str
    title: str
    content: str
    tags: List[str]
    images: List[str] = []
    coverImage: Optional[str] = None
    status: str = "draft"

class PublishRequest(BaseModel):
    content: dict

# ========== 数据存储 ==========

DATA_DIR = Path("/tmp/data") if os.getenv("RENDER") else Path("./data")
DATA_DIR.mkdir(exist_ok=True)
CONTENTS_FILE = DATA_DIR / "contents.json"

def load_contents():
    """加载所有内容"""
    if CONTENTS_FILE.exists():
        with open(CONTENTS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def save_contents(contents):
    """保存所有内容"""
    with open(CONTENTS_FILE, 'w', encoding='utf-8') as f:
        json.dump(contents, f, ensure_ascii=False, indent=2)

# ========== AI生成 ==========

def generate_with_ai(description: str, category: str) -> dict:
    """调用AI生成内容"""
    
    zhipu_key = os.getenv("ZHIPU_API_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")
    
    # 优先使用智谱AI（国内可用，有免费额度）
    if zhipu_key:
        try:
            from zhipuai import ZhipuAI
            client = ZhipuAI(api_key=zhipu_key)
            
            response = client.chat.completions.create(
                model="glm-4-flash",
                messages=[
                    {
                        "role": "system",
                        "content": """你是小红书爆款内容创作专家。

请根据用户需求，生成一篇小红书风格的笔记。

要求：
1. 标题吸引人，带emoji，20字以内
2. 内容用小红书风格：亲切、真实、有干货
3. 多用小红书常用符号：✨、💡、📌、🌟、❌、✅等
4. 结构清晰，分段明确
5. 结尾引导互动

输出格式必须如下：
标题：[标题]
内容：[正文内容]
标签：[标签1,标签2,标签3,标签4,标签5]"""
                    },
                    {
                        "role": "user",
                        "content": f"内容类别：{category}\n用户需求：{description}"
                    }
                ]
            )
            
            ai_text = response.choices[0].message.content
            return parse_ai_response(ai_text)
            
        except Exception as e:
            print(f"智谱AI调用失败: {e}")
    
    # 备用：OpenAI
    if openai_key:
        try:
            import openai
            openai.api_key = openai_key
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "你是小红书爆款内容创作专家..."},
                    {"role": "user", "content": f"类别：{category}\n需求：{description}"}
                ]
            )
            
            ai_text = response.choices[0].message.content
            return parse_ai_response(ai_text)
            
        except Exception as e:
            print(f"OpenAI调用失败: {e}")
    
    # 如果都失败了，返回模拟数据
    return generate_mock_content(category)

def parse_ai_response(text: str) -> dict:
    """解析AI返回的内容"""
    lines = text.split('\n')
    result = {"title": "", "content": "", "tags": []}
    
    current_section = None
    content_lines = []
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        if line.startswith("标题：") or line.startswith("标题:"):
            result["title"] = line.replace("标题：", "").replace("标题:", "").strip()
        elif line.startswith("内容：") or line.startswith("内容:"):
            current_section = "content"
        elif line.startswith("标签：") or line.startswith("标签:"):
            current_section = "tags"
            tags_str = line.replace("标签：", "").replace("标签:", "").strip()
            result["tags"] = [t.strip() for t in tags_str.replace("，", ",").split(",") if t.strip()]
        elif current_section == "content":
            content_lines.append(line)
    
    result["content"] = '\n'.join(content_lines).strip()
    return result

def generate_mock_content(category: str) -> dict:
    """AI不可用时返回模拟内容"""
    return {
        "title": f"✨{category}必看！这份攻略帮你避坑省钱",
        "content": f"""姐妹们，今天来分享我的{category}心得！

✨首先，一定要做好功课，不要盲目跟风

💡我的建议是：
1. 先了解自己的需求
2. 多看真实测评
3. 从小样开始尝试

🌟亲测好用的几个小技巧：
• 坚持是关键
• 记录变化过程
• 及时调整方法

希望这篇分享对你们有帮助！记得点赞收藏哦～""",
        "tags": [category, "干货分享", "新手必看", "真实测评"]
    }

# ========== API路由 ==========

@app.get("/")
async def root():
    return {
        "message": "AI小红书助手API服务运行中",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.post("/api/generate")
async def generate_content(request: ContentRequest):
    """生成内容API"""
    try:
        result = generate_with_ai(request.description, request.category)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/contents")
async def get_contents():
    """获取所有内容"""
    return load_contents()

@app.post("/api/contents")
async def save_content(request: SaveRequest):
    """保存内容"""
    contents = load_contents()
    
    # 查找是否已存在
    existing_idx = None
    for i, c in enumerate(contents):
        if c["id"] == request.id:
            existing_idx = i
            break
    
    content_dict = {
        "id": request.id,
        "title": request.title,
        "content": request.content,
        "tags": request.tags,
        "images": request.images,
        "coverImage": request.coverImage,
        "status": request.status,
        "createdAt": datetime.now().isoformat(),
        "stats": {"views": 0, "likes": 0, "collects": 0, "comments": 0}
    }
    
    if existing_idx is not None:
        content_dict["createdAt"] = contents[existing_idx].get("createdAt", content_dict["createdAt"])
        content_dict["stats"] = contents[existing_idx].get("stats", content_dict["stats"])
        contents[existing_idx] = content_dict
    else:
        contents.insert(0, content_dict)
    
    save_contents(contents)
    return {"success": True, "data": content_dict}

@app.delete("/api/contents/{content_id}")
async def delete_content(content_id: str):
    """删除内容"""
    contents = load_contents()
    contents = [c for c in contents if c["id"] != content_id]
    save_contents(contents)
    return {"success": True}

@app.post("/api/contents/{content_id}/publish")
async def publish_content(content_id: str):
    """发布内容（模拟）"""
    contents = load_contents()
    for c in contents:
        if c["id"] == content_id:
            c["status"] = "published"
            c["publishedAt"] = datetime.now().isoformat()
            break
    save_contents(contents)
    return {"success": True, "message": "内容已发布（模拟）"}

# 爆款数据（模拟）
TRENDING_POSTS = [
    {
        "id": "1",
        "title": "夏日防晒必看！这5款防晒霜真的不踩雷",
        "coverImage": "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop",
        "author": "美妆达人小A",
        "authorAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        "likes": 12580,
        "collects": 3420,
        "comments": 568,
        "tags": ["防晒", "护肤", "夏日必备"],
        "highlights": ["真实测评", "性价比超高", "学生党友好"]
    },
    {
        "id": "2",
        "title": "早八人5分钟快速出门妆，被同事夸了一整天",
        "coverImage": "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=400&h=400&fit=crop",
        "author": "职场美妆师",
        "authorAvatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
        "likes": 8930,
        "collects": 2150,
        "comments": 423,
        "tags": ["通勤妆", "快速化妆", "职场妆容"],
        "highlights": ["简单易上手", "新手友好", "持妆一整天"]
    },
    {
        "id": "3",
        "title": "油痘肌护肤Routine，3个月皮肤变好了",
        "coverImage": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=400&fit=crop",
        "author": "护肤分享站",
        "authorAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
        "likes": 15230,
        "collects": 5680,
        "comments": 892,
        "tags": ["油痘肌", "护肤routine", "平价好物"],
        "highlights": ["亲测有效", "成分党必看", "医学护肤"]
    },
    {
        "id": "4",
        "title": "黄皮显白口红合集，这8支真的绝",
        "coverImage": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop",
        "author": "口红控小王",
        "authorAvatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
        "likes": 22150,
        "collects": 8920,
        "comments": 1205,
        "tags": ["口红", "显白", "黄皮友好"],
        "highlights": ["试色真实", "大牌平替", "持久不脱色"]
    },
    {
        "id": "5",
        "title": "熬夜党眼霜推荐，黑眼圈细纹说拜拜",
        "coverImage": "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=400&fit=crop",
        "author": "熬夜修复师",
        "authorAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        "likes": 9870,
        "collects": 3780,
        "comments": 445,
        "tags": ["眼霜", "抗老", "黑眼圈"],
        "highlights": ["熬夜救星", "淡纹有效", "性价比高"]
    },
    {
        "id": "6",
        "title": "学生党护肤全套不过百，平价好物分享",
        "coverImage": "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=400&fit=crop",
        "author": "省钱小能手",
        "authorAvatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
        "likes": 18760,
        "collects": 9230,
        "comments": 678,
        "tags": ["学生党", "平价护肤", "好物分享"],
        "highlights": ["白菜价", "效果惊艳", "无限回购"]
    }
]

@app.get("/api/trends")
async def get_trends():
    """获取爆款列表"""
    return TRENDING_POSTS

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
