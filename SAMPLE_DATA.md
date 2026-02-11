# 示例数据结构

这个文件说明了如何在 Firestore 中创建示例数据，用于测试网站功能。

## Projects（项目）数据结构

在 Firestore 中创建 `projects` 集合，添加以下示例文档：

```json
{
  "title": "Modern Luxury Apartment",
  "description": "A stunning transformation of a 3-bedroom apartment featuring contemporary design with elegant touches. The space combines functionality with sophisticated aesthetics.",
  "category": "residential",
  "featured": true,
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  "date": "2024-01-15T00:00:00Z"
}
```

字段说明：
- `title` (string): 项目标题
- `description` (string): 项目描述
- `category` (string): 类别（residential, commercial, luxury, modern）
- `featured` (boolean): 是否在首页展示
- `images` (array of strings): 图片 URL 数组（从 Firebase Storage 获取）
- `date` (timestamp): 项目日期

## Designers（设计师）数据结构

在 Firestore 中创建 `designers` 集合：

```json
{
  "name": "Sarah Johnson",
  "role": "Senior Interior Designer",
  "bio": "With over 15 years of experience in luxury residential design, Sarah brings a unique perspective to every project. Her work has been featured in leading design magazines.",
  "image": "https://example.com/designer1.jpg",
  "experience": 15,
  "specialties": [
    "Luxury Residential",
    "Modern Minimalism",
    "Sustainable Design"
  ]
}
```

字段说明：
- `name` (string): 设计师姓名
- `role` (string): 职位/角色
- `bio` (string): 个人简介
- `image` (string): 头像图片 URL
- `experience` (number): 工作年限
- `specialties` (array of strings): 专业领域数组

## Reviews（评价）数据结构

在 Firestore 中创建 `reviews` 集合：

```json
{
  "clientName": "John Smith",
  "project": "Modern Luxury Apartment",
  "rating": 5,
  "comment": "Absolutely thrilled with the transformation! The team exceeded our expectations and created a space that perfectly reflects our style. Highly recommend!",
  "approved": true,
  "date": "2024-02-01T00:00:00Z"
}
```

字段说明：
- `clientName` (string): 客户姓名
- `project` (string): 相关项目名称（可选）
- `rating` (number): 评分（1-5）
- `comment` (string): 评价内容
- `approved` (boolean): 是否已批准显示
- `date` (timestamp): 评价日期

## 通过管理后台添加数据

**推荐方式**：使用管理后台（`/admin.html`）添加数据，因为：
1. 自动处理图片上传到 Firebase Storage
2. 自动生成正确的数据结构
3. 自动设置时间戳
4. 更安全（需要认证）

## 手动添加数据（用于测试）

如果需要手动在 Firestore Console 中添加数据：

1. 登录 Firebase Console
2. 转到 Firestore Database
3. 点击 "Start collection"
4. 输入集合名称（projects, designers, 或 reviews）
5. 添加文档 ID（可以自动生成）
6. 添加字段和值
7. 点击 "Save"

**注意**：
- 图片 URL 需要先上传到 Firebase Storage 获取
- 时间戳字段使用 Firestore 的 Timestamp 类型
- 数组字段在 Firestore Console 中需要手动输入为数组格式

## 图片上传说明

### 通过管理后台上传（推荐）
1. 登录管理后台
2. 添加项目或设计师时，选择图片文件
3. 系统自动上传到 Firebase Storage
4. 自动获取 URL 并保存到数据库

### 手动上传到 Storage
1. 在 Firebase Console 转到 Storage
2. 创建文件夹（projects/ 或 designers/）
3. 上传图片文件
4. 点击图片获取下载 URL
5. 在 Firestore 中使用该 URL

## 测试数据建议

创建至少以下测试数据：

**Projects（3-5个）**：
- 1-2 个设置为 featured: true（会在首页显示）
- 不同类别（residential, commercial, luxury, modern）
- 每个项目至少 1-2 张图片

**Designers（2-3个）**：
- 不同的角色和专长
- 每个设计师一张头像

**Reviews（3-5个）**：
- 全部设置为 approved: true
- 不同的评分（4-5星）
- 不同的项目关联

这样可以全面测试网站的所有功能。
