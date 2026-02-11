# 快速设置指南

## 第一步：Firebase 项目设置

1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 点击 "Add project" 创建新项目
3. 输入项目名称（例如：interior-design-studio）
4. 选择是否启用 Google Analytics（可选）
5. 点击 "Create project"

## 第二步：启用 Firebase 服务

### 1. Authentication（认证）
- 在左侧菜单选择 "Authentication"
- 点击 "Get started"
- 选择 "Sign-in method" 标签
- 启用 "Email/Password" 提供者
- 点击 "Save"

### 2. Firestore Database（数据库）
- 在左侧菜单选择 "Firestore Database"
- 点击 "Create database"
- 选择 "Start in production mode"（生产模式）
- 选择数据库位置（选择离你最近的区域）
- 点击 "Enable"

### 3. Storage（存储）
- 在左侧菜单选择 "Storage"
- 点击 "Get started"
- 选择 "Start in production mode"
- 选择与 Firestore 相同的位置
- 点击 "Done"

### 4. Hosting（托管）
- 在左侧菜单选择 "Hosting"
- 点击 "Get started"
- 按照说明完成初始设置（稍后可以部署）

## 第三步：获取 Firebase 配置

1. 在 Firebase Console，点击项目设置（齿轮图标）
2. 滚动到 "Your apps" 部分
3. 点击 Web 图标（</>）添加 Web 应用
4. 输入应用昵称（例如：Interior Design Studio）
5. 点击 "Register app"
6. 复制配置对象（firebaseConfig）

## 第四步：配置项目

1. 打开 `js/firebase-config.js`
2. 将复制的配置粘贴到文件中，替换所有 `YOUR_*` 占位符：

```javascript
const firebaseConfig = {
  apiKey: "AIza...",  // 你的实际 API Key
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

## 第五步：创建管理员账户

1. 在 Firebase Console，转到 "Authentication"
2. 点击 "Users" 标签
3. 点击 "Add user"
4. 输入管理员邮箱和密码
5. 点击 "Add user"
6. 记住这些凭据，用于登录管理后台

## 第六步：设置 Firestore 规则

1. 在 Firebase Console，转到 "Firestore Database"
2. 点击 "Rules" 标签
3. 复制 `firestore.rules` 文件中的内容
4. 粘贴到 Firestore Rules 编辑器
5. 点击 "Publish"

## 第七步：设置 Storage 规则

1. 在 Firebase Console，转到 "Storage"
2. 点击 "Rules" 标签
3. 复制 `storage.rules` 文件中的内容
4. 粘贴到 Storage Rules 编辑器
5. 点击 "Publish"

## 第八步：本地测试

1. 安装 Firebase CLI（如果还没有）：
```bash
npm install -g firebase-tools
```

2. 登录 Firebase：
```bash
firebase login
```

3. 初始化项目（如果还没有）：
```bash
firebase init
```
选择：
- Firestore（使用现有规则文件）
- Hosting（使用当前目录作为 public 目录）
- Storage（使用现有规则文件）

4. 启动本地服务器：
```bash
firebase serve
```

5. 在浏览器中打开 `http://localhost:5000`

## 第九步：测试管理后台

1. 访问 `http://localhost:5000/admin.html`
2. 使用第五步创建的管理员账户登录
3. 尝试添加一个测试项目：
   - 点击 "Add New Project"
   - 填写项目信息
   - 上传一张图片
   - 点击 "Save Project"
4. 检查主页是否显示新添加的项目

## 第十步：部署到 Firebase Hosting

1. 构建/准备项目文件（确保所有文件都在正确位置）
2. 部署：
```bash
firebase deploy --only hosting
```

3. 部署 Firestore 规则：
```bash
firebase deploy --only firestore:rules
```

4. 部署 Storage 规则：
```bash
firebase deploy --only storage
```

5. 访问你的网站：`https://your-project-id.web.app`

## 常见问题

### Q: 图片上传失败
A: 检查 Storage 规则是否正确设置，确保允许已认证用户写入。

### Q: 无法登录管理后台
A: 确保：
- Email/Password 认证已启用
- 管理员账户已创建
- Firebase 配置正确

### Q: 数据不显示
A: 检查：
- Firestore 规则允许公开读取
- 集合名称拼写正确（projects, designers, reviews）
- 浏览器控制台是否有错误

### Q: 部署后样式丢失
A: 确保 `firebase.json` 中的 `public` 目录设置正确，所有 CSS 文件都在该目录下。

## 下一步

- 添加更多项目和设计师
- 自定义颜色和字体（在 `css/style.css` 中修改 CSS 变量）
- 添加联系表单
- 集成 Google Analytics
- 优化图片大小以提高加载速度
